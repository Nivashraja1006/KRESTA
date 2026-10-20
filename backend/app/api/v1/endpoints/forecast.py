from datetime import datetime
from typing import Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models import MenuItem, DemandPrediction, User
from app.schemas.analytics_ai import ForecastResponse
from app.api.deps import get_current_active_user, require_roles
from app.ml.forecasting import forecaster

router = APIRouter()


@router.get("/item/{menu_item_id}", response_model=ForecastResponse)
def get_item_forecast(
    menu_item_id: int,
    branch_id: Optional[int] = 1,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """Execute Gradient Boosting ML demand forecast pipeline for a specific menu item."""
    item = db.query(MenuItem).filter(MenuItem.id == menu_item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Menu item not found")

    target_branch = branch_id or current_user.branch_id or 1
    result = forecaster.train_and_forecast(db, menu_item_id, target_branch)
    return result


@router.post("/train-all")
def train_and_persist_all_forecasts(
    branch_id: Optional[int] = 1,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["super_admin", "owner", "manager"]))
) -> Dict[str, Any]:
    """Train forecast models for all active dishes and persist 7-day predictions into database."""
    target_branch = branch_id or current_user.branch_id or 1
    items = db.query(MenuItem).filter(MenuItem.is_available == True).all()

    # Clear old predictions for branch
    db.query(DemandPrediction).filter(DemandPrediction.branch_id == target_branch).delete()

    trained_count = 0
    for item in items:
        fc = forecaster.train_and_forecast(db, item.id, target_branch)
        for pred in fc["predictions"]:
            f_date = datetime.strptime(pred["date"], "%Y-%m-%d")
            dp = DemandPrediction(
                branch_id=target_branch,
                menu_item_id=item.id,
                forecast_date=f_date,
                predicted_quantity=pred["predicted_demand"],
                confidence_lower=pred["confidence_lower"],
                confidence_upper=pred["confidence_upper"],
                model_name=fc["model_info"],
                mae_score=fc["mae"]
            )
            db.add(dp)
        trained_count += 1

    db.commit()
    return {
        "message": f"Successfully generated ML demand forecasts for {trained_count} menu items.",
        "branch_id": target_branch
    }
