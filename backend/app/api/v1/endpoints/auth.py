from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import func
from sqlalchemy.orm import Session

from backend.app.core.config import settings
from backend.app.core.database import get_db
from backend.app.core.security import verify_password, get_password_hash, create_access_token, create_refresh_token, decode_token
from backend.app.models import User, Role, Customer
from backend.app.schemas.user import UserCreate, UserResponse, Token, LoginRequest, PasswordResetRequest, UserUpdate
from backend.app.api.deps import get_current_active_user, log_audit_event

router = APIRouter()


@router.post("/register", response_model=UserResponse)
def register(user_in: UserCreate, db: Session = Depends(get_db)) -> Any:
    """Register a new user account."""
    email = user_in.email.strip().lower()
    existing = db.query(User).filter(func.lower(User.email) == email).first()
    if existing:
        raise HTTPException(
            status_code=400,
            detail="A user with this email address already exists."
        )

    # Determine role (default to owner if first user or not specified, else staff)
    role_id = user_in.role_id
    if not role_id:
        owner_role = db.query(Role).filter(Role.name == "owner").first()
        role_id = owner_role.id if owner_role else 2

    new_user = User(
        email=email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        phone=user_in.phone,
        role_id=role_id,
        restaurant_id=user_in.restaurant_id or 1,
        branch_id=user_in.branch_id or 1,
        is_active=True,
        is_superuser=False
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    log_audit_event(db, new_user.id, "REGISTER", "User", str(new_user.id), f"User registered: {new_user.email}")
    return new_user


@router.post("/login", response_model=Token)
def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db)
) -> Any:
    """JSON login endpoint returning JWT access and refresh tokens."""
    email = login_data.email.strip().lower()
    user = db.query(User).filter(func.lower(User.email) == email).first()
    is_valid = user and verify_password(login_data.password, user.hashed_password)

    if not user or not is_valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(status_code=400, detail="User account is deactivated.")

    role_name = user.role.name if user.role else "staff"
    access_token = create_access_token(user.id, role=role_name)
    refresh_token = create_refresh_token(user.id, role=role_name)

    log_audit_event(db, user.id, "LOGIN", "Auth", str(user.id), f"Successful login for {user.email}")

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": user
    }


@router.post("/login/oauth", response_model=Token)
def login_oauth(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
) -> Any:
    """OAuth2 compatible form-data login endpoint for Swagger UI testing."""
    email = form_data.username.strip().lower()
    user = db.query(User).filter(func.lower(User.email) == email).first()
    is_valid = user and verify_password(form_data.password, user.hashed_password)

    if not user or not is_valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(status_code=400, detail="User account is deactivated.")

    role_name = user.role.name if user.role else "staff"
    access_token = create_access_token(user.id, role=role_name)
    refresh_token = create_refresh_token(user.id, role=role_name)

    log_audit_event(db, user.id, "LOGIN", "Auth", str(user.id), f"Successful login for {user.email}")

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": user
    }


@router.post("/refresh", response_model=Token)
def refresh_token_endpoint(refresh_token: str, db: Session = Depends(get_db)) -> Any:
    """Obtain new access token using valid refresh token."""
    payload = decode_token(refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    user_id = payload.get("sub")
    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="User no longer active")

    role_name = user.role.name if user.role else "staff"
    new_access = create_access_token(user.id, role=role_name)
    new_refresh = create_refresh_token(user.id, role=role_name)

    return {
        "access_token": new_access,
        "refresh_token": new_refresh,
        "token_type": "bearer",
        "user": user
    }


@router.get("/me", response_model=UserResponse)
def get_current_user_profile(
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """Return currently authenticated user details."""
    return current_user


@router.put("/profile", response_model=UserResponse)
def update_profile(
    profile_in: UserUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
) -> Any:
    """Update profile of currently logged-in user."""
    if profile_in.full_name is not None:
        current_user.full_name = profile_in.full_name
    if profile_in.phone is not None:
        current_user.phone = profile_in.phone
    if profile_in.avatar_url is not None:
        current_user.avatar_url = profile_in.avatar_url
    if profile_in.password:
        current_user.hashed_password = get_password_hash(profile_in.password)

    db.commit()
    db.refresh(current_user)
    log_audit_event(db, current_user.id, "PROFILE_UPDATE", "User", str(current_user.id))
    return current_user


@router.post("/forgot-password")
def forgot_password(request: PasswordResetRequest, db: Session = Depends(get_db)) -> Any:
    """Simulate secure password reset token generation."""
    user = db.query(User).filter(User.email == request.email).first()
    # Always return success message to prevent user enumeration
    return {"message": f"If an account exists for {request.email}, password reset instructions have been dispatched."}


@router.post("/customer/register", response_model=Token)
def register_customer(user_in: UserCreate, db: Session = Depends(get_db)) -> Any:
    """Register a new customer account, creating both User auth and Customer CRM record."""
    email = user_in.email.strip().lower()
    existing = db.query(User).filter(func.lower(User.email) == email).first()
    if existing:
        raise HTTPException(
            status_code=400,
            detail="An account with this email address already exists. Please log in."
        )

    # Ensure customer role exists
    customer_role = db.query(Role).filter(Role.name == "customer").first()
    if not customer_role:
        customer_role = Role(name="customer", description="Registered Restaurant Customer")
        db.add(customer_role)
        db.flush()

    new_user = User(
        email=email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        phone=user_in.phone,
        role_id=customer_role.id,
        restaurant_id=1,
        branch_id=1,
        is_active=True,
        is_superuser=False
    )
    db.add(new_user)
    db.flush()

    # Link/create Customer in CRM
    customer = db.query(Customer).filter(Customer.email == email).first()
    if not customer:
        customer = Customer(
            restaurant_id=1,
            name=user_in.full_name,
            email=email,
            phone=user_in.phone,
            total_spent=0.0,
            total_orders=0,
            loyalty_points=50  # 50 welcome loyalty bonus
        )
        db.add(customer)

    db.commit()
    db.refresh(new_user)

    access_token = create_access_token(new_user.id, role="customer")
    refresh_token = create_refresh_token(new_user.id, role="customer")

    log_audit_event(db, new_user.id, "CUSTOMER_REGISTER", "User", str(new_user.id), f"Customer registered: {email}")

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": new_user
    }

