from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models import Restaurant, Branch, RestaurantTable, User
from app.schemas.restaurant import (
    RestaurantCreate, RestaurantResponse, BranchCreate, BranchResponse,
    RestaurantTableCreate, RestaurantTableResponse
)
from app.api.deps import require_roles, get_current_active_user, log_audit_event

router = APIRouter()


@router.get("/", response_model=List[RestaurantResponse])
def get_restaurants(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """Get restaurants list."""
    if current_user.is_superuser:
        return db.query(Restaurant).all()
    return db.query(Restaurant).filter(Restaurant.id == current_user.restaurant_id).all()


@router.get("/{restaurant_id}", response_model=RestaurantResponse)
def get_restaurant(
    restaurant_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """Get single restaurant details."""
    res = db.query(Restaurant).filter(Restaurant.id == restaurant_id).first()
    if not res:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    return res


@router.put("/{restaurant_id}", response_model=RestaurantResponse)
def update_restaurant(
    restaurant_id: int,
    res_in: RestaurantCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["super_admin", "owner"]))
) -> Any:
    """Update restaurant information."""
    res = db.query(Restaurant).filter(Restaurant.id == restaurant_id).first()
    if not res:
        raise HTTPException(status_code=404, detail="Restaurant not found")

    res.name = res_in.name
    res.description = res_in.description
    res.address = res_in.address
    res.phone = res_in.phone
    res.email = res_in.email
    res.currency = res_in.currency
    res.tax_rate = res_in.tax_rate

    db.commit()
    db.refresh(res)
    log_audit_event(db, current_user.id, "UPDATE_RESTAURANT", "Restaurant", str(res.id))
    return res


# Branches
@router.get("/public/branches", response_model=List[BranchResponse])
def get_public_branches(
    restaurant_id: int = 1,
    db: Session = Depends(get_db)
) -> Any:
    """Get active branches for public customer view."""
    return db.query(Branch).filter(Branch.restaurant_id == restaurant_id, Branch.is_active == True).all()


@router.get("/{restaurant_id}/branches", response_model=List[BranchResponse])
def get_branches(
    restaurant_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """Get all branches for a restaurant."""
    return db.query(Branch).filter(Branch.restaurant_id == restaurant_id).all()


@router.post("/{restaurant_id}/branches", response_model=BranchResponse)
def create_branch(
    restaurant_id: int,
    branch_in: BranchCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["super_admin", "owner"]))
) -> Any:
    """Create a new branch."""
    new_branch = Branch(
        restaurant_id=restaurant_id,
        name=branch_in.name,
        code=branch_in.code,
        address=branch_in.address,
        city=branch_in.city,
        state=branch_in.state,
        postal_code=branch_in.postal_code,
        phone=branch_in.phone,
        opening_time=branch_in.opening_time,
        closing_time=branch_in.closing_time,
        is_active=branch_in.is_active
    )
    db.add(new_branch)
    db.commit()
    db.refresh(new_branch)
    log_audit_event(db, current_user.id, "CREATE_BRANCH", "Branch", str(new_branch.id))
    return new_branch


# Tables
@router.get("/branches/{branch_id}/tables", response_model=List[RestaurantTableResponse])
def get_branch_tables(
    branch_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """Get all dining tables for a branch."""
    return db.query(RestaurantTable).filter(RestaurantTable.branch_id == branch_id).all()


@router.post("/branches/{branch_id}/tables", response_model=RestaurantTableResponse)
def create_table(
    branch_id: int,
    table_in: RestaurantTableCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["super_admin", "owner", "manager"]))
) -> Any:
    """Add a new dining table to branch."""
    tbl = RestaurantTable(
        branch_id=branch_id,
        table_number=table_in.table_number,
        capacity=table_in.capacity,
        status=table_in.status
    )
    db.add(tbl)
    db.commit()
    db.refresh(tbl)
    return tbl
