from typing import List, Any, Optional, Dict
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.core.database import get_db
from app.models import AnomalyRecord, User
from app.schemas.analytics_ai import AnomalyResponse
from app.api.deps import get_current_active_user, require_roles
from app.ml.anomaly import anomaly_detector

router = APIRouter()


@router.get("/", response_model=List[AnomalyResponse])
def get_anomalies(
    branch_id: Optional[int] = None,
    unresolved_only: bool = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """List operational and revenue anomalies detected by Isolation Forest."""
    query = db.query(AnomalyRecord)
    target_branch = branch_id or current_user.branch_id
    if target_branch:
        query = query.filter(AnomalyRecord.branch_id == target_branch)
    if unresolved_only:
        query = query.filter(AnomalyRecord.is_resolved == False)

    return query.order_by(desc(AnomalyRecord.anomaly_date)).all()


@router.post("/scan")
def scan_for_anomalies(
    branch_id: Optional[int] = 1,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["super_admin", "owner", "manager"]))
) -> Dict[str, Any]:
    """Execute Isolation Forest anomaly detection algorithm across branch time-series metrics."""
    target_branch = branch_id or current_user.branch_id or 1
    new_findings = anomaly_detector.scan_branch_anomalies(db, target_branch)
    return {
        "message": f"Anomaly detection scan complete. Identified {len(new_findings)} operational anomalies.",
        "findings": new_findings
    }


@router.patch("/{anomaly_id}/resolve", response_model=AnomalyResponse)
def resolve_anomaly(
    anomaly_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["super_admin", "owner", "manager"]))
) -> Any:
    """Acknowledge and mark an anomaly as resolved."""
    anomaly = db.query(AnomalyRecord).filter(AnomalyRecord.id == anomaly_id).first()
    if not anomaly:
        raise HTTPException(status_code=404, detail="Anomaly record not found")

    anomaly.is_resolved = True
    db.commit()
    db.refresh(anomaly)
    return anomaly
