from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc

from backend.app.core.database import get_db
from backend.app.models import Order, OrderItem, User
from backend.app.api.deps import require_roles, get_current_active_user
from backend.app.core.websocket_manager import ws_manager

router = APIRouter()


@router.get("/queue")
def get_kitchen_queue(
    branch_id: Optional[int] = 1,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["super_admin", "owner", "manager", "chef", "staff"]))
) -> Dict[str, Any]:
    """Retrieve active kitchen orders segregated into NEW, PREPARING, and READY with timers and delay flags."""
    target_branch = current_user.branch_id or branch_id or 1
    
    active_orders = (
        db.query(Order)
        .filter(
            Order.branch_id == target_branch,
            Order.status.in_(["NEW", "CONFIRMED", "PREPARING", "READY"])
        )
        .order_by(Order.created_at)
        .all()
    )

    now = datetime.now(timezone.utc)
    queue = {
        "new_orders": [],
        "preparing_orders": [],
        "ready_orders": [],
        "workload_metrics": {
            "total_active_orders": len(active_orders),
            "items_in_prep": 0,
            "delayed_orders_count": 0
        }
    }

    for ord in active_orders:
        created = ord.created_at
        if created.tzinfo is None:
            created = created.replace(tzinfo=timezone.utc)
        elapsed_mins = int((now - created).total_seconds() / 60.0)

        # Estimate average prep time for order based on dishes
        max_prep_time = max([item.menu_item.preparation_time_minutes for item in ord.items] or [15])
        is_delayed = elapsed_mins > max_prep_time and ord.status in ["NEW", "CONFIRMED", "PREPARING"]

        if is_delayed:
            queue["workload_metrics"]["delayed_orders_count"] += 1

        items_data = [
            {
                "id": it.id,
                "dish_name": it.menu_item.name if it.menu_item else "Unknown Dish",
                "quantity": it.quantity,
                "special_instructions": it.special_instructions,
                "status": it.status
            }
            for it in ord.items
        ]

        order_card = {
            "id": ord.id,
            "order_number": ord.order_number,
            "order_type": ord.order_type,
            "status": ord.status,
            "table_number": ord.table.table_number if ord.table else "Takeaway",
            "elapsed_minutes": elapsed_mins,
            "target_prep_time": max_prep_time,
            "is_delayed": is_delayed,
            "items": items_data,
            "notes": ord.notes,
            "created_at": ord.created_at.strftime("%H:%M:%S")
        }

        if ord.status in ["NEW", "CONFIRMED"]:
            queue["new_orders"].append(order_card)
        elif ord.status == "PREPARING":
            queue["preparing_orders"].append(order_card)
            queue["workload_metrics"]["items_in_prep"] += sum(i["quantity"] for i in items_data)
        elif ord.status == "READY":
            queue["ready_orders"].append(order_card)

    return queue


@router.post("/orders/{order_id}/progress")
async def progress_kitchen_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["super_admin", "owner", "manager", "chef", "staff"]))
) -> Dict[str, Any]:
    """1-click transition for kitchen displays: NEW -> PREPARING -> READY -> SERVED."""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    status_map = {
        "NEW": "PREPARING",
        "CONFIRMED": "PREPARING",
        "PREPARING": "READY",
        "READY": "SERVED",
        "SERVED": "COMPLETED"
    }

    next_status = status_map.get(order.status, order.status)
    order.status = next_status
    if next_status == "COMPLETED":
        order.completed_at = datetime.now(timezone.utc)

    db.commit()

    await ws_manager.broadcast_to_room("kitchen", {
        "event": "KITCHEN_ORDER_PROGRESSED",
        "order_id": order.id,
        "new_status": next_status
    })

    return {"message": f"Order {order.order_number} progressed to {next_status}", "new_status": next_status}
