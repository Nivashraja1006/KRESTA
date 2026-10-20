import uuid
from datetime import datetime, timezone
from typing import List, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.core.database import get_db
from app.core.websocket_manager import ws_manager
from app.models import (
    Order, OrderItem, MenuItem, Payment, Customer, Ingredient,
    InventoryTransaction, Restaurant, Branch, User, RestaurantTable
)
from app.schemas.order import (
    OrderCreate, OrderStatusUpdate, OrderResponse, PaymentCreate,
    CustomerOrderCreate, CartValidationRequest, CartValidationResponse,
    OrderTrackingResponse, OrderTimelineStep
)
from app.api.deps import get_current_active_user, require_roles, log_audit_event

router = APIRouter()


@router.get("/", response_model=List[OrderResponse])
def get_orders(
    branch_id: Optional[int] = None,
    status: Optional[str] = None,
    order_type: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """List orders with filtering and pagination."""
    query = db.query(Order)
    target_branch = branch_id or current_user.branch_id
    if target_branch:
        query = query.filter(Order.branch_id == target_branch)
    if status:
        query = query.filter(Order.status == status.upper())
    if order_type:
        query = query.filter(Order.order_type == order_type.upper())
    if search:
        query = query.filter(Order.order_number.ilike(f"%{search}%"))

    return query.order_by(desc(Order.created_at)).offset(offset).limit(limit).all()


@router.get("/{order_id}", response_model=OrderResponse)
def get_order_by_id(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """Get full details of a specific order."""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.post("/", response_model=OrderResponse)
async def create_order(
    order_in: OrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """Create a new order from POS / Floor, calculate pricing, deduct inventory, and notify kitchen."""
    branch = db.query(Branch).filter(Branch.id == order_in.branch_id).first()
    if not branch:
        raise HTTPException(status_code=404, detail="Branch not found")

    restaurant = db.query(Restaurant).filter(Restaurant.id == branch.restaurant_id).first()
    tax_rate = restaurant.tax_rate if restaurant else 5.0

    # Calculate item totals and check items
    subtotal = 0.0
    order_items_to_create = []

    for item_data in order_in.items:
        menu_item = db.query(MenuItem).filter(MenuItem.id == item_data.menu_item_id).first()
        if not menu_item:
            raise HTTPException(status_code=404, detail=f"Menu item {item_data.menu_item_id} not found")
        if not menu_item.is_available:
            raise HTTPException(status_code=400, detail=f"Menu item '{menu_item.name}' is currently unavailable")

        item_subtotal = round(menu_item.price * item_data.quantity, 2)
        subtotal += item_subtotal

        order_items_to_create.append({
            "menu_item": menu_item,
            "quantity": item_data.quantity,
            "unit_price": menu_item.price,
            "subtotal": item_subtotal,
            "special_instructions": item_data.special_instructions
        })

    tax_amount = round(subtotal * (tax_rate / 100.0), 2)
    discount_amount = max(0.0, order_in.discount)
    total_amount = max(0.0, round(subtotal + tax_amount - discount_amount, 2))

    # Generate unique order number (e.g. ORD-2026-XXXX)
    order_num = f"ORD-{datetime.now().strftime('%m%d')}-{uuid.uuid4().hex[:5].upper()}"

    new_order = Order(
        branch_id=order_in.branch_id,
        customer_id=order_in.customer_id,
        table_id=order_in.table_id,
        order_number=order_num,
        order_type=order_in.order_type.upper(),
        status="NEW",
        subtotal=round(subtotal, 2),
        tax=tax_amount,
        discount=discount_amount,
        total_amount=total_amount,
        notes=order_in.notes
    )
    db.add(new_order)
    db.flush()  # assign id

    # Create OrderItems & Deduct recipe ingredients from inventory
    for item_info in order_items_to_create:
        menu_item = item_info["menu_item"]
        qty = item_info["quantity"]

        oi = OrderItem(
            order_id=new_order.id,
            menu_item_id=menu_item.id,
            quantity=qty,
            unit_price=item_info["unit_price"],
            subtotal=item_info["subtotal"],
            special_instructions=item_info["special_instructions"],
            status="PENDING"
        )
        db.add(oi)

        # Automated Inventory Deduction via recipe links
        for recipe in menu_item.recipes:
            needed_qty = recipe.quantity_required * qty
            ing = db.query(Ingredient).filter(Ingredient.id == recipe.ingredient_id).first()
            if ing:
                ing.current_stock = max(0.0, round(ing.current_stock - needed_qty, 2))
                txn = InventoryTransaction(
                    ingredient_id=ing.id,
                    branch_id=order_in.branch_id,
                    transaction_type="USAGE",
                    quantity=-needed_qty,
                    unit_cost=ing.cost_per_unit,
                    reference_id=order_num,
                    notes=f"Auto-deducted for order {order_num} ({qty}x {menu_item.name})"
                )
                db.add(txn)

    # If table assigned, mark table OCCUPIED
    if order_in.table_id:
        tbl = db.query(RestaurantTable).filter(RestaurantTable.id == order_in.table_id).first()
        if tbl:
            tbl.status = "OCCUPIED"

    # If customer assigned, update customer stats
    if order_in.customer_id:
        cust = db.query(Customer).filter(Customer.id == order_in.customer_id).first()
        if cust:
            cust.total_spent = round((cust.total_spent or 0.0) + total_amount, 2)
            cust.total_orders = (cust.total_orders or 0) + 1
            cust.last_visit_date = datetime.now(timezone.utc)
            cust.loyalty_points = (cust.loyalty_points or 0) + int(total_amount)

    # If payment provided
    if order_in.payment_method:
        payment = Payment(
            order_id=new_order.id,
            payment_method=order_in.payment_method.upper(),
            amount=total_amount,
            status="COMPLETED",
            transaction_id=f"TXN-{uuid.uuid4().hex[:8].upper()}"
        )
        db.add(payment)

    db.commit()
    db.refresh(new_order)

    # Real-time WebSocket broadcast to Kitchen and Floor
    await ws_manager.broadcast_to_room("kitchen", {
        "event": "NEW_ORDER",
        "order_id": new_order.id,
        "order_number": new_order.order_number,
        "table_id": new_order.table_id,
        "items_count": len(new_order.items),
        "created_at": str(new_order.created_at)
    })

    log_audit_event(db, current_user.id, "CREATE_ORDER", "Order", str(new_order.id), f"Created {order_num} for ${total_amount}")
    return new_order


@router.patch("/{order_id}/status", response_model=OrderResponse)
async def update_order_status(
    order_id: int,
    status_update: OrderStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """Advance order lifecycle status: NEW -> CONFIRMED -> PREPARING -> READY -> SERVED -> COMPLETED / CANCELLED."""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    new_status = status_update.status.upper()
    valid_statuses = ["NEW", "CONFIRMED", "PREPARING", "READY", "SERVED", "COMPLETED", "CANCELLED"]
    if new_status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}")

    order.status = new_status
    if new_status == "COMPLETED":
        order.completed_at = datetime.now(timezone.utc)
        # Free table
        if order.table_id:
            tbl = db.query(RestaurantTable).filter(RestaurantTable.id == order.table_id).first()
            if tbl:
                tbl.status = "DIRTY"  # Mark for bussing/cleaning

    db.commit()
    db.refresh(order)

    # Notify kitchen and waiters via WebSocket
    await ws_manager.broadcast_to_room("kitchen", {
        "event": "ORDER_STATUS_CHANGED",
        "order_id": order.id,
        "order_number": order.order_number,
        "new_status": new_status
    })

    return order


# ================= Customer Facing Ordering APIs =================

VALID_COUPONS = {
    "KRESTA10": {"discount_percent": 10.0, "min_subtotal": 0.0, "max_discount": 15.0, "desc": "10% off your entire order"},
    "KRESTA20": {"discount_percent": 20.0, "min_subtotal": 40.0, "max_discount": 25.0, "desc": "20% off orders over $40"},
    "WELCOME50": {"fixed_discount": 5.0, "min_subtotal": 25.0, "max_discount": 5.0, "desc": "$5 off welcome discount"},
}


@router.post("/customer/validate-cart", response_model=CartValidationResponse)
def validate_customer_cart(
    req: CartValidationRequest,
    db: Session = Depends(get_db)
) -> Any:
    """Preview and validate cart items, prices from database, taxes, and coupon discounts."""
    subtotal = 0.0
    errors: List[str] = []

    for item_data in req.items:
        menu_item = db.query(MenuItem).filter(MenuItem.id == item_data.menu_item_id).first()
        if not menu_item:
            errors.append(f"Dish #{item_data.menu_item_id} does not exist.")
            continue
        if not menu_item.is_available:
            errors.append(f"'{menu_item.name}' is currently sold out.")
            continue
        subtotal += round(menu_item.price * max(1, item_data.quantity), 2)

    subtotal = round(subtotal, 2)
    branch = db.query(Branch).filter(Branch.id == req.branch_id).first()
    restaurant = db.query(Restaurant).filter(Restaurant.id == (branch.restaurant_id if branch else 1)).first()
    tax_rate = restaurant.tax_rate if restaurant else 5.0
    tax_amount = round(subtotal * (tax_rate / 100.0), 2)

    # Delivery fee logic: $3.99 for DELIVERY, free if subtotal >= 50.0; $0 for TAKEAWAY / DINE_IN
    delivery_fee = 0.0
    if req.order_type.upper() == "DELIVERY":
        delivery_fee = 0.0 if subtotal >= 50.0 else 3.99

    # Coupon logic
    discount = 0.0
    coupon_applied = None
    coupon_msg = None

    if req.coupon_code:
        code = req.coupon_code.strip().upper()
        if code in VALID_COUPONS:
            rule = VALID_COUPONS[code]
            if subtotal >= rule.get("min_subtotal", 0.0):
                if "discount_percent" in rule:
                    discount = min(rule["max_discount"], round(subtotal * (rule["discount_percent"] / 100.0), 2))
                elif "fixed_discount" in rule:
                    discount = min(subtotal, rule["fixed_discount"])
                coupon_applied = code
                coupon_msg = rule["desc"]
            else:
                errors.append(f"Coupon {code} requires a minimum order of ${rule.get('min_subtotal', 0.0):.2f}.")
        else:
            errors.append(f"Coupon code '{req.coupon_code}' is invalid or expired.")

    total = max(0.0, round(subtotal + tax_amount + delivery_fee - discount, 2))

    return {
        "is_valid": len(errors) == 0 and subtotal > 0,
        "subtotal": subtotal,
        "tax": tax_amount,
        "delivery_fee": delivery_fee,
        "discount": discount,
        "total": total,
        "coupon_applied": coupon_applied,
        "coupon_message": coupon_msg,
        "errors": errors
    }


@router.post("/customer/checkout", response_model=OrderResponse)
async def create_customer_order(
    order_in: CustomerOrderCreate,
    db: Session = Depends(get_db)
) -> Any:
    """Customer-facing order submission with full database price verification, inventory deductions, and KDS broadcast."""
    if not order_in.items:
        raise HTTPException(status_code=400, detail="Cart is empty. Please select menu items.")

    branch = db.query(Branch).filter(Branch.id == order_in.branch_id).first()
    if not branch:
        raise HTTPException(status_code=404, detail="Selected restaurant branch not found.")

    restaurant = db.query(Restaurant).filter(Restaurant.id == branch.restaurant_id).first()
    tax_rate = restaurant.tax_rate if restaurant else 5.0

    # Calculate item totals directly from verified database prices
    subtotal = 0.0
    order_items_to_create = []

    for item_data in order_in.items:
        menu_item = db.query(MenuItem).filter(MenuItem.id == item_data.menu_item_id).first()
        if not menu_item:
            raise HTTPException(status_code=404, detail=f"Menu item #{item_data.menu_item_id} not found.")
        if not menu_item.is_available:
            raise HTTPException(status_code=400, detail=f"'{menu_item.name}' is currently unavailable.")

        qty = max(1, item_data.quantity)
        item_subtotal = round(menu_item.price * qty, 2)
        subtotal += item_subtotal

        # Special instructions including spice level
        instructions = []
        if item_data.spice_level:
            instructions.append(f"Spice: {item_data.spice_level}")
        if item_data.special_instructions:
            instructions.append(item_data.special_instructions)
        special_text = " | ".join(instructions) if instructions else None

        order_items_to_create.append({
            "menu_item": menu_item,
            "quantity": qty,
            "unit_price": menu_item.price,
            "subtotal": item_subtotal,
            "special_instructions": special_text
        })

    subtotal = round(subtotal, 2)
    tax_amount = round(subtotal * (tax_rate / 100.0), 2)

    # Delivery fee
    delivery_fee = 0.0
    if order_in.order_type.upper() == "DELIVERY":
        delivery_fee = 0.0 if subtotal >= 50.0 else 3.99

    # Validate and calculate coupon discount
    discount_amount = 0.0
    if order_in.coupon_code:
        code = order_in.coupon_code.strip().upper()
        if code in VALID_COUPONS:
            rule = VALID_COUPONS[code]
            if subtotal >= rule.get("min_subtotal", 0.0):
                if "discount_percent" in rule:
                    discount_amount = min(rule["max_discount"], round(subtotal * (rule["discount_percent"] / 100.0), 2))
                elif "fixed_discount" in rule:
                    discount_amount = min(subtotal, rule["fixed_discount"])

    total_amount = max(0.0, round(subtotal + tax_amount + delivery_fee - discount_amount, 2))

    # Anti-duplicate submission check (same customer, same amount within last 15 seconds)
    cust_email = str(order_in.customer_email).strip().lower() if order_in.customer_email else None
    cust_phone = order_in.customer_phone.strip() if order_in.customer_phone else None

    # Link or register customer in CRM
    customer = None
    if cust_email or cust_phone:
        query = db.query(Customer).filter(Customer.restaurant_id == restaurant.id)
        if cust_email:
            customer = query.filter(Customer.email == cust_email).first()
        elif cust_phone:
            customer = query.filter(Customer.phone == cust_phone).first()

    if not customer:
        customer = Customer(
            restaurant_id=restaurant.id,
            name=order_in.customer_name.strip() or "Valued Guest",
            email=cust_email,
            phone=cust_phone,
            total_spent=total_amount,
            total_orders=1,
            last_visit_date=datetime.now(timezone.utc),
            loyalty_points=int(total_amount)
        )
        db.add(customer)
        db.flush()
    else:
        customer.name = order_in.customer_name.strip() or customer.name
        customer.total_spent = round((customer.total_spent or 0.0) + total_amount, 2)
        customer.total_orders = (customer.total_orders or 0) + 1
        customer.last_visit_date = datetime.now(timezone.utc)
        customer.loyalty_points = (customer.loyalty_points or 0) + int(total_amount)

    # Find table if DINE_IN
    table_id = None
    if order_in.order_type.upper() == "DINE_IN" and order_in.table_number:
        tbl = db.query(RestaurantTable).filter(
            RestaurantTable.branch_id == branch.id,
            RestaurantTable.table_number.ilike(order_in.table_number.strip())
        ).first()
        if tbl:
            table_id = tbl.id
            tbl.status = "OCCUPIED"

    # Assemble Order Number and Notes
    order_num = f"ORD-{datetime.now().strftime('%m%d')}-{uuid.uuid4().hex[:5].upper()}"
    notes_parts = []
    if order_in.notes:
        notes_parts.append(f"Notes: {order_in.notes}")
    if order_in.delivery_address and order_in.order_type.upper() == "DELIVERY":
        notes_parts.append(f"Deliver to: {order_in.delivery_address}")
    if order_in.table_number and order_in.order_type.upper() == "DINE_IN":
        notes_parts.append(f"Table: {order_in.table_number}")
    combined_notes = " | ".join(notes_parts) if notes_parts else None

    new_order = Order(
        branch_id=order_in.branch_id,
        customer_id=customer.id if customer else None,
        table_id=table_id,
        order_number=order_num,
        order_type=order_in.order_type.upper(),
        status="NEW",
        subtotal=subtotal,
        tax=tax_amount,
        discount=discount_amount,
        total_amount=total_amount,
        notes=combined_notes
    )
    db.add(new_order)
    db.flush()

    # Create OrderItems and deduct recipe ingredients
    for item_info in order_items_to_create:
        menu_item = item_info["menu_item"]
        qty = item_info["quantity"]

        oi = OrderItem(
            order_id=new_order.id,
            menu_item_id=menu_item.id,
            quantity=qty,
            unit_price=item_info["unit_price"],
            subtotal=item_info["subtotal"],
            special_instructions=item_info["special_instructions"],
            status="PENDING"
        )
        db.add(oi)

        # Deduct ingredients
        for recipe in menu_item.recipes:
            needed_qty = recipe.quantity_required * qty
            ing = db.query(Ingredient).filter(Ingredient.id == recipe.ingredient_id).first()
            if ing:
                ing.current_stock = max(0.0, round(ing.current_stock - needed_qty, 2))
                txn = InventoryTransaction(
                    ingredient_id=ing.id,
                    branch_id=order_in.branch_id,
                    transaction_type="USAGE",
                    quantity=-needed_qty,
                    unit_cost=ing.cost_per_unit,
                    reference_id=order_num,
                    notes=f"Auto-deducted for Customer Order {order_num} ({qty}x {menu_item.name})"
                )
                db.add(txn)

    # Create Payment record
    payment_method = (order_in.payment_method or "CARD").upper()
    payment = Payment(
        order_id=new_order.id,
        payment_method=payment_method,
        amount=total_amount,
        status="COMPLETED",
        transaction_id=f"TXN-KRESTA-{uuid.uuid4().hex[:8].upper()}"
    )
    db.add(payment)

    db.commit()
    db.refresh(new_order)

    # Real-time WebSocket broadcast to Kitchen Display System & POS
    await ws_manager.broadcast_to_room("kitchen", {
        "event": "NEW_ORDER",
        "order_id": new_order.id,
        "order_number": new_order.order_number,
        "table_id": new_order.table_id,
        "order_type": new_order.order_type,
        "items_count": len(new_order.items),
        "created_at": str(new_order.created_at)
    })
    await ws_manager.broadcast_to_room("orders", {
        "event": "NEW_ORDER",
        "order_id": new_order.id,
        "order_number": new_order.order_number,
        "total_amount": new_order.total_amount
    })

    return new_order


@router.get("/customer/track/{order_ref}", response_model=OrderTrackingResponse)
def get_customer_order_tracking(
    order_ref: str,
    db: Session = Depends(get_db)
) -> Any:
    """Retrieve public live order status and animated timeline for customers."""
    order = None
    if order_ref.isdigit():
        order = db.query(Order).filter(Order.id == int(order_ref)).first()
    if not order:
        order = db.query(Order).filter(Order.order_number.ilike(order_ref.strip())).first()

    if not order:
        raise HTTPException(status_code=404, detail=f"Order '{order_ref}' not found.")

    st = order.status.upper()
    order_type = (order.order_type or "DELIVERY").upper()

    # Timeline construction
    now = datetime.now(timezone.utc)
    created = order.created_at
    if created.tzinfo is None:
        created = created.replace(tzinfo=timezone.utc)
    elapsed_minutes = int((now - created).total_seconds() / 60.0)

    # Calculate estimated remaining prep/delivery time
    max_prep = max([item.menu_item.preparation_time_minutes for item in order.items if item.menu_item] or [20])
    total_estimated = max_prep + (15 if order_type == "DELIVERY" else 5)
    remaining_minutes = max(0, total_estimated - elapsed_minutes)
    if st in ["COMPLETED", "SERVED"] and order_type != "DELIVERY":
        remaining_minutes = 0

    timeline: List[OrderTimelineStep] = []

    if order_type == "DELIVERY":
        stages = [
            ("ORDER_PLACED", "Order Placed & Confirmed", ["NEW", "CONFIRMED", "PREPARING", "READY", "SERVED", "COMPLETED"]),
            ("KITCHEN_PREP", "Chef Cooking in Kitchen", ["PREPARING", "READY", "SERVED", "COMPLETED"]),
            ("PACKED", "Quality Checked & Packed", ["READY", "SERVED", "COMPLETED"]),
            ("ON_THE_WAY", "Out for Delivery with Courier", ["SERVED", "COMPLETED"]),
            ("DELIVERED", "Delivered — Enjoy Your Feast", ["COMPLETED"])
        ]
        active_key = "ORDER_PLACED"
        if st in ["NEW", "CONFIRMED"]:
            active_key = "ORDER_PLACED"
        elif st == "PREPARING":
            active_key = "KITCHEN_PREP"
        elif st == "READY":
            active_key = "PACKED"
        elif st == "SERVED":
            active_key = "ON_THE_WAY"
        elif st == "COMPLETED":
            active_key = "DELIVERED"

        for key, label, completed_when in stages:
            if st in completed_when and key != active_key:
                status_val = "COMPLETED"
            elif key == active_key:
                status_val = "CURRENT" if st != "COMPLETED" else "COMPLETED"
            else:
                status_val = "UPCOMING"
            timeline.append(OrderTimelineStep(key=key, label=label, status=status_val))

    elif order_type == "TAKEAWAY":
        stages = [
            ("ORDER_PLACED", "Order Received", ["NEW", "CONFIRMED", "PREPARING", "READY", "COMPLETED"]),
            ("KITCHEN_PREP", "Preparing in Kitchen", ["PREPARING", "READY", "COMPLETED"]),
            ("READY_FOR_PICKUP", "Ready for Pickup at Counter", ["READY", "COMPLETED"]),
            ("PICKED_UP", "Picked Up & Completed", ["COMPLETED"])
        ]
        active_key = "ORDER_PLACED"
        if st in ["NEW", "CONFIRMED"]:
            active_key = "ORDER_PLACED"
        elif st == "PREPARING":
            active_key = "KITCHEN_PREP"
        elif st in ["READY", "SERVED"]:
            active_key = "READY_FOR_PICKUP"
        elif st == "COMPLETED":
            active_key = "PICKED_UP"

        for key, label, completed_when in stages:
            if st in completed_when and key != active_key:
                status_val = "COMPLETED"
            elif key == active_key:
                status_val = "CURRENT" if st != "COMPLETED" else "COMPLETED"
            else:
                status_val = "UPCOMING"
            timeline.append(OrderTimelineStep(key=key, label=label, status=status_val))

    else:  # DINE_IN
        stages = [
            ("ORDER_PLACED", "Order Placed at Table", ["NEW", "CONFIRMED", "PREPARING", "READY", "SERVED", "COMPLETED"]),
            ("KITCHEN_PREP", "Chef Cooking in Kitchen", ["PREPARING", "READY", "SERVED", "COMPLETED"]),
            ("READY", "Plated & Ready to Serve", ["READY", "SERVED", "COMPLETED"]),
            ("SERVED", "Served to Your Table", ["SERVED", "COMPLETED"]),
            ("COMPLETED", "Bill Settled & Completed", ["COMPLETED"])
        ]
        active_key = "ORDER_PLACED"
        if st in ["NEW", "CONFIRMED"]:
            active_key = "ORDER_PLACED"
        elif st == "PREPARING":
            active_key = "KITCHEN_PREP"
        elif st == "READY":
            active_key = "READY"
        elif st == "SERVED":
            active_key = "SERVED"
        elif st == "COMPLETED":
            active_key = "COMPLETED"

        for key, label, completed_when in stages:
            if st in completed_when and key != active_key:
                status_val = "COMPLETED"
            elif key == active_key:
                status_val = "CURRENT" if st != "COMPLETED" else "COMPLETED"
            else:
                status_val = "UPCOMING"
            timeline.append(OrderTimelineStep(key=key, label=label, status=status_val))

    fulfillment_label = "Doorstep Delivery" if order_type == "DELIVERY" else ("Takeaway Pickup" if order_type == "TAKEAWAY" else "Dine-in Table Service")

    return {
        "order": order,
        "timeline": timeline,
        "estimated_time_minutes": remaining_minutes,
        "fulfillment_label": fulfillment_label,
        "can_cancel": st in ["NEW"]
    }


@router.get("/customer/my-orders", response_model=List[OrderResponse])
def get_customer_orders_history(
    email: Optional[str] = None,
    phone: Optional[str] = None,
    limit: int = 15,
    db: Session = Depends(get_db)
) -> Any:
    """Retrieve order history for customer by email or phone without requiring staff login."""
    if not email and not phone:
        return []

    query = db.query(Order).join(Customer)
    if email:
        query = query.filter(Customer.email.ilike(email.strip()))
    elif phone:
        query = query.filter(Customer.phone.ilike(f"%{phone.strip()}%"))

    return query.order_by(desc(Order.created_at)).limit(limit).all()

