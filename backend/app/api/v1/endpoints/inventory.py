import uuid
from datetime import datetime, timezone
from typing import List, Any, Optional, Dict
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.core.database import get_db
from app.models import (
    Ingredient, InventoryTransaction, PurchaseOrder, PurchaseOrderItem, Supplier, User
)
from app.schemas.inventory import (
    InventoryHealthItem, InventoryTransactionCreate, InventoryTransactionResponse,
    PurchaseOrderCreate, PurchaseOrderUpdate, PurchaseOrderResponse
)
from app.api.deps import require_roles, get_current_active_user, log_audit_event

router = APIRouter()


@router.get("/health", response_model=List[InventoryHealthItem])
def get_inventory_health(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["super_admin", "owner", "manager", "chef", "staff"]))
) -> Any:
    """List ingredients with real-time health statuses: HEALTHY, LOW, CRITICAL, EXPIRED."""
    rest_id = current_user.restaurant_id or 1
    ingredients = db.query(Ingredient).filter(Ingredient.restaurant_id == rest_id).all()

    now = datetime.now(timezone.utc)
    health_items = []

    for ing in ingredients:
        # Check expiry
        days_to_expiry = None
        is_expired = False
        if ing.expiry_date:
            exp = ing.expiry_date
            if exp.tzinfo is None:
                exp = exp.replace(tzinfo=timezone.utc)
            days_to_expiry = (exp - now).days
            if days_to_expiry < 0:
                is_expired = True

        if is_expired:
            status = "EXPIRED"
        elif ing.current_stock <= 0:
            status = "CRITICAL"
        elif ing.current_stock <= ing.minimum_stock:
            status = "LOW"
        else:
            status = "HEALTHY"

        rec_qty = max(0.0, round(ing.maximum_stock - ing.current_stock, 1)) if ing.current_stock <= ing.minimum_stock else 0.0

        health_items.append(InventoryHealthItem(
            id=ing.id,
            name=ing.name,
            unit=ing.unit,
            current_stock=ing.current_stock,
            minimum_stock=ing.minimum_stock,
            maximum_stock=ing.maximum_stock,
            cost_per_unit=ing.cost_per_unit,
            status=status,
            days_until_expiry=days_to_expiry,
            recommended_order_qty=rec_qty
        ))

    return health_items


@router.post("/transactions", response_model=InventoryTransactionResponse)
def record_stock_adjustment(
    txn_in: InventoryTransactionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["super_admin", "owner", "manager", "chef"]))
) -> Any:
    """Manually add, consume, or adjust stock levels and record transaction."""
    ing = db.query(Ingredient).filter(Ingredient.id == txn_in.ingredient_id).first()
    if not ing:
        raise HTTPException(status_code=404, detail="Ingredient not found")

    new_stock = max(0.0, round(ing.current_stock + txn_in.quantity, 2))
    ing.current_stock = new_stock

    txn = InventoryTransaction(
        ingredient_id=ing.id,
        branch_id=txn_in.branch_id or current_user.branch_id,
        transaction_type=txn_in.transaction_type.upper(),
        quantity=txn_in.quantity,
        unit_cost=txn_in.unit_cost or ing.cost_per_unit,
        reference_id=txn_in.reference_id or f"MANUAL-{uuid.uuid4().hex[:6].upper()}",
        notes=txn_in.notes
    )
    db.add(txn)
    db.commit()
    db.refresh(txn)

    log_audit_event(db, current_user.id, "STOCK_ADJUSTMENT", "Ingredient", str(ing.id), f"{txn_in.transaction_type} {txn_in.quantity} {ing.unit}")
    return txn


@router.get("/transactions", response_model=List[InventoryTransactionResponse])
def list_transactions(
    ingredient_id: Optional[int] = None,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """List recent inventory ledger transactions."""
    query = db.query(InventoryTransaction)
    if ingredient_id:
        query = query.filter(InventoryTransaction.ingredient_id == ingredient_id)
    return query.order_by(desc(InventoryTransaction.created_at)).limit(limit).all()


# Purchase Orders
@router.get("/purchase-orders", response_model=List[PurchaseOrderResponse])
def list_purchase_orders(
    branch_id: Optional[int] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """List purchase orders with item details."""
    query = db.query(PurchaseOrder)
    target_branch = branch_id or current_user.branch_id
    if target_branch:
        query = query.filter(PurchaseOrder.branch_id == target_branch)
    if status:
        query = query.filter(PurchaseOrder.status == status.upper())
    return query.order_by(desc(PurchaseOrder.created_at)).all()


@router.post("/purchase-orders", response_model=PurchaseOrderResponse)
def create_purchase_order(
    po_in: PurchaseOrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["super_admin", "owner", "manager", "chef"]))
) -> Any:
    """Create a new purchase order for supplier replenishment."""
    po_num = f"PO-{datetime.now().strftime('%y%m%d')}-{uuid.uuid4().hex[:4].upper()}"
    total_amt = sum(item.quantity_ordered * item.unit_price for item in po_in.items)

    po = PurchaseOrder(
        branch_id=po_in.branch_id,
        supplier_id=po_in.supplier_id,
        order_number=po_num,
        status="ORDERED",
        total_amount=round(total_amt, 2),
        expected_delivery_date=po_in.expected_delivery_date,
        notes=po_in.notes
    )
    db.add(po)
    db.flush()

    for it in po_in.items:
        poi = PurchaseOrderItem(
            purchase_order_id=po.id,
            ingredient_id=it.ingredient_id,
            quantity_ordered=it.quantity_ordered,
            unit_price=it.unit_price
        )
        db.add(poi)

    db.commit()
    db.refresh(po)
    log_audit_event(db, current_user.id, "CREATE_PURCHASE_ORDER", "PurchaseOrder", str(po.id), f"PO {po_num} for ${total_amt}")
    return po


@router.patch("/purchase-orders/{po_id}/receive", response_model=PurchaseOrderResponse)
def receive_purchase_order(
    po_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["super_admin", "owner", "manager", "chef"]))
) -> Any:
    """Mark purchase order received, automatically updating ingredient stock levels."""
    po = db.query(PurchaseOrder).filter(PurchaseOrder.id == po_id).first()
    if not po:
        raise HTTPException(status_code=404, detail="Purchase order not found")

    po.status = "RECEIVED"
    po.received_date = datetime.now(timezone.utc)

    # Increment stock
    for item in po.items:
        item.quantity_received = item.quantity_ordered
        ing = item.ingredient
        if ing:
            ing.current_stock = round(ing.current_stock + item.quantity_received, 2)
            txn = InventoryTransaction(
                ingredient_id=ing.id,
                branch_id=po.branch_id,
                transaction_type="PURCHASE",
                quantity=item.quantity_received,
                unit_cost=item.unit_price,
                reference_id=po.order_number,
                notes=f"Stock received via Purchase Order {po.order_number}"
            )
            db.add(txn)

    db.commit()
    db.refresh(po)
    log_audit_event(db, current_user.id, "RECEIVE_PURCHASE_ORDER", "PurchaseOrder", str(po.id))
    return po
