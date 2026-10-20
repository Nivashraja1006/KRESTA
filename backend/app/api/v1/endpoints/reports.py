import csv
import io
from typing import Any, Optional
from fastapi import APIRouter, Depends, Query, Response
from sqlalchemy.orm import Session
from sqlalchemy import func, desc

from app.core.database import get_db
from app.models import Order, Ingredient, WasteRecord, AuditLog, User
from app.schemas.user import AuditLogResponse
from app.api.deps import require_roles, get_current_active_user
from typing import List

router = APIRouter()


@router.get("/sales/csv")
def export_sales_csv(
    branch_id: Optional[int] = 1,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["super_admin", "owner", "manager"]))
) -> Any:
    """Export detailed sales orders to downloadable CSV."""
    target_branch = branch_id or current_user.branch_id or 1
    orders = db.query(Order).filter(Order.branch_id == target_branch).order_by(desc(Order.created_at)).all()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Order Number", "Date", "Type", "Status", "Subtotal", "Tax", "Discount", "Total Amount"])

    for o in orders:
        writer.writerow([
            o.order_number,
            o.created_at.strftime("%Y-%m-%d %H:%M"),
            o.order_type,
            o.status,
            f"{o.subtotal:.2f}",
            f"{o.tax:.2f}",
            f"{o.discount:.2f}",
            f"{o.total_amount:.2f}"
        ])

    csv_content = output.getvalue()
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=RestaurantIQ_Sales_{datetime_now_str()}.csv"}
    )


@router.get("/inventory/csv")
def export_inventory_csv(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["super_admin", "owner", "manager", "chef"]))
) -> Any:
    """Export current inventory valuation and stock levels to CSV."""
    rest_id = current_user.restaurant_id or 1
    ingredients = db.query(Ingredient).filter(Ingredient.restaurant_id == rest_id).all()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Ingredient Name", "Current Stock", "Unit", "Min Stock", "Cost per Unit", "Total Valuation", "Supplier"])

    for ing in ingredients:
        val = ing.current_stock * ing.cost_per_unit
        sup_name = ing.supplier.name if ing.supplier else "N/A"
        writer.writerow([
            ing.name,
            f"{ing.current_stock:.2f}",
            ing.unit,
            f"{ing.minimum_stock:.2f}",
            f"{ing.cost_per_unit:.2f}",
            f"{val:.2f}",
            sup_name
        ])

    csv_content = output.getvalue()
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=RestaurantIQ_Inventory_{datetime_now_str()}.csv"}
    )


@router.get("/audit-logs", response_model=List[AuditLogResponse])
def get_audit_logs(
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["super_admin", "owner"]))
) -> Any:
    """Retrieve immutable system audit logs for administrative security reviews."""
    return db.query(AuditLog).order_by(desc(AuditLog.created_at)).limit(limit).all()


def datetime_now_str() -> str:
    from datetime import datetime
    return datetime.now().strftime("%Y%m%d_%H%M")
