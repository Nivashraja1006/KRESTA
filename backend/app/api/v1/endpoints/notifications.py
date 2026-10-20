from typing import List, Any, Dict
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.core.database import get_db
from app.models import Notification, User
from app.schemas.analytics_ai import NotificationResponse
from app.api.deps import get_current_active_user

router = APIRouter()


@router.get("/", response_model=List[NotificationResponse])
def get_notifications(
    limit: int = 30,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """List operational and AI alerts for user and branch."""
    notifications = (
        db.query(Notification)
        .filter(
            (Notification.user_id == current_user.id) |
            (Notification.branch_id == current_user.branch_id) |
            (Notification.branch_id == None)
        )
        .order_by(desc(Notification.created_at))
        .limit(limit)
        .all()
    )
    return notifications


@router.patch("/{notification_id}/read", response_model=NotificationResponse)
def mark_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """Mark a notification as read."""
    notif = db.query(Notification).filter(Notification.id == notification_id).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    notif.is_read = True
    db.commit()
    db.refresh(notif)
    return notif


@router.post("/read-all")
def mark_all_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Dict[str, Any]:
    """Mark all active notifications as read."""
    db.query(Notification).filter(
        (Notification.user_id == current_user.id) |
        (Notification.branch_id == current_user.branch_id) |
        (Notification.branch_id == None)
    ).update({Notification.is_read: True})
    db.commit()
    return {"message": "All notifications marked as read"}
