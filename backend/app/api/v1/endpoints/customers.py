from typing import List, Any, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc

from backend.app.core.database import get_db
from backend.app.models import Customer, CustomerSegment, User
from backend.app.schemas.order import CustomerCreate, CustomerResponse
from backend.app.schemas.analytics_ai import CustomerSegmentResponse
from backend.app.api.deps import get_current_active_user, require_roles
from backend.app.ml.segmentation import customer_segmenter

router = APIRouter()


@router.get("/", response_model=List[CustomerResponse])
def get_customers(
    search: Optional[str] = None,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """List customer profiles with total spend and visit metrics."""
    rest_id = current_user.restaurant_id or 1
    query = db.query(Customer).filter(Customer.restaurant_id == rest_id)
    if search:
        query = query.filter((Customer.name.ilike(f"%{search}%")) | (Customer.email.ilike(f"%{search}%")))

    customers = query.order_by(desc(Customer.total_spent)).limit(limit).all()
    res = []
    for c in customers:
        item = CustomerResponse.from_orm(c)
        item.segment_name = c.segment.segment_name if c.segment else "Unassigned"
        res.append(item)
    return res


@router.get("/{customer_id}", response_model=CustomerResponse)
def get_customer_profile(
    customer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """Get single customer profile."""
    cust = db.query(Customer).filter(Customer.id == customer_id).first()
    if not cust:
        raise HTTPException(status_code=404, detail="Customer not found")
    res = CustomerResponse.from_orm(cust)
    res.segment_name = cust.segment.segment_name if cust.segment else "Unassigned"
    return res


@router.post("/", response_model=CustomerResponse)
def create_customer(
    cust_in: CustomerCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """Register a new customer profile."""
    cust = Customer(
        restaurant_id=current_user.restaurant_id or cust_in.restaurant_id or 1,
        name=cust_in.name,
        email=cust_in.email,
        phone=cust_in.phone
    )
    db.add(cust)
    db.commit()
    db.refresh(cust)
    return cust


@router.post("/segmentation/run")
def trigger_customer_segmentation(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["super_admin", "owner", "manager"]))
) -> Any:
    """Run ML K-Means clustering across all customers and update RFM segments."""
    rest_id = current_user.restaurant_id or 1
    segments = customer_segmenter.run_segmentation(db, rest_id)
    return {
        "message": f"Successfully clustered {len(segments)} customer profiles into RFM segments.",
        "segments": segments
    }


@router.get("/segments/summary")
def get_segments_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """Get count and monetary breakdown of customer segments."""
    segments = db.query(CustomerSegment).all()
    summary: dict = {}
    for s in segments:
        name = s.segment_name
        if name not in summary:
            summary[name] = {"count": 0, "total_spend": 0.0, "avg_frequency": 0.0}
        summary[name]["count"] += 1
        summary[name]["total_spend"] += s.rfm_monetary
        summary[name]["avg_frequency"] += s.rfm_frequency

    output = []
    for k, v in summary.items():
        output.append({
            "segment_name": k,
            "count": v["count"],
            "total_spend": round(v["total_spend"], 2),
            "avg_orders": round(v["avg_frequency"] / max(1, v["count"]), 1)
        })

    return output
