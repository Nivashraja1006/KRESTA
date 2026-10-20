from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.core.database import get_db
from backend.app.core.security import get_password_hash
from backend.app.models import User, Role
from backend.app.schemas.user import UserCreate, UserUpdate, UserResponse, RoleResponse
from backend.app.api.deps import require_roles, require_superuser, get_current_active_user, log_audit_event

router = APIRouter()


@router.get("/roles", response_model=List[RoleResponse])
def get_all_roles(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """List available system roles."""
    return db.query(Role).all()


@router.get("/", response_model=List[UserResponse])
def list_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["super_admin", "owner", "manager"]))
) -> Any:
    """List users belonging to restaurant or all users for superadmin."""
    if current_user.is_superuser or (current_user.role and current_user.role.name == "super_admin"):
        return db.query(User).all()
    return db.query(User).filter(User.restaurant_id == current_user.restaurant_id).all()


@router.post("/", response_model=UserResponse)
def create_staff_user(
    user_in: UserCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["super_admin", "owner", "manager"]))
) -> Any:
    """Create a new staff member or manager."""
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="User with this email already exists")

    new_user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        phone=user_in.phone,
        role_id=user_in.role_id or 5,  # default staff
        restaurant_id=current_user.restaurant_id,
        branch_id=user_in.branch_id or current_user.branch_id,
        is_active=True
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    log_audit_event(db, current_user.id, "CREATE_USER", "User", str(new_user.id), f"Created user {new_user.email}")
    return new_user


@router.put("/{user_id}", response_model=UserResponse)
def update_user(
    user_id: int,
    user_in: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["super_admin", "owner"]))
) -> Any:
    """Update user role, branch, or active status."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user_in.full_name is not None:
        user.full_name = user_in.full_name
    if user_in.email is not None:
        user.email = user_in.email
    if user_in.role_id is not None:
        user.role_id = user_in.role_id
    if user_in.branch_id is not None:
        user.branch_id = user_in.branch_id
    if user_in.is_active is not None:
        user.is_active = user_in.is_active
    if user_in.password:
        user.hashed_password = get_password_hash(user_in.password)

    db.commit()
    db.refresh(user)
    log_audit_event(db, current_user.id, "UPDATE_USER", "User", str(user.id))
    return user


@router.delete("/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["super_admin", "owner"]))
) -> Any:
    """Deactivate or remove user."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot delete your own account")

    user.is_active = False
    db.commit()
    log_audit_event(db, current_user.id, "DEACTIVATE_USER", "User", str(user.id))
    return {"message": "User deactivated successfully"}
