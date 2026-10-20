from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.core.database import get_db
from backend.app.models import Supplier, User
from backend.app.schemas.inventory import SupplierCreate, SupplierResponse
from backend.app.api.deps import require_roles, get_current_active_user, log_audit_event

router = APIRouter()


@router.get("/", response_model=List[SupplierResponse])
def get_suppliers(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """List all registered suppliers."""
    rest_id = current_user.restaurant_id or 1
    return db.query(Supplier).filter(Supplier.restaurant_id == rest_id).all()


@router.post("/", response_model=SupplierResponse)
def create_supplier(
    sup_in: SupplierCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["super_admin", "owner", "manager"]))
) -> Any:
    """Register a new supplier vendor."""
    sup = Supplier(
        restaurant_id=current_user.restaurant_id or sup_in.restaurant_id or 1,
        name=sup_in.name,
        contact_person=sup_in.contact_person,
        email=sup_in.email,
        phone=sup_in.phone,
        address=sup_in.address,
        lead_time_days=sup_in.lead_time_days,
        rating=sup_in.rating
    )
    db.add(sup)
    db.commit()
    db.refresh(sup)
    log_audit_event(db, current_user.id, "CREATE_SUPPLIER", "Supplier", str(sup.id), f"Supplier {sup.name}")
    return sup


@router.put("/{supplier_id}", response_model=SupplierResponse)
def update_supplier(
    supplier_id: int,
    sup_in: SupplierCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["super_admin", "owner", "manager"]))
) -> Any:
    """Update supplier details."""
    sup = db.query(Supplier).filter(Supplier.id == supplier_id).first()
    if not sup:
        raise HTTPException(status_code=404, detail="Supplier not found")

    sup.name = sup_in.name
    sup.contact_person = sup_in.contact_person
    sup.email = sup_in.email
    sup.phone = sup_in.phone
    sup.address = sup_in.address
    sup.lead_time_days = sup_in.lead_time_days
    sup.rating = sup_in.rating

    db.commit()
    db.refresh(sup)
    return sup


@router.delete("/{supplier_id}")
def delete_supplier(
    supplier_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["super_admin", "owner"]))
) -> Any:
    """Remove a supplier vendor."""
    sup = db.query(Supplier).filter(Supplier.id == supplier_id).first()
    if not sup:
        raise HTTPException(status_code=404, detail="Supplier not found")
    db.delete(sup)
    db.commit()
    return {"message": "Supplier deleted successfully"}
