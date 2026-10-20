from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.core.database import get_db
from backend.app.models import User
from backend.app.services.inventory_optimizer import inventory_optimizer
from backend.app.api.deps import get_current_active_user

router = APIRouter()


@router.get("/inventory")
def get_inventory_recommendations(
    branch_id: Optional[int] = 1,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> List[Dict[str, Any]]:
    """Compute AI-driven replenishment recommendations based on current stock, lead time, and forecast."""
    rest_id = current_user.restaurant_id or 1
    target_branch = branch_id or current_user.branch_id or 1
    return inventory_optimizer.compute_recommendations(db, rest_id, target_branch)
