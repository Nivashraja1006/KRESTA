from typing import List, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from backend.app.core.database import get_db
from backend.app.models import Category, MenuItem, Ingredient, MenuItemIngredient, User
from backend.app.schemas.menu import (
    CategoryCreate, CategoryResponse,
    MenuItemCreate, MenuItemUpdate, MenuItemResponse,
    IngredientCreate, IngredientResponse
)
from backend.app.api.deps import require_roles, get_current_active_user, get_optional_current_user, log_audit_event

router = APIRouter()


# ================= Categories =================
@router.get("/categories", response_model=List[CategoryResponse])
def get_categories(
    restaurant_id: Optional[int] = 1,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
) -> Any:
    """List menu categories for guests and authenticated users."""
    rest_id = (current_user.restaurant_id if current_user and current_user.restaurant_id else None) or restaurant_id or 1
    return db.query(Category).filter(Category.restaurant_id == rest_id).order_by(Category.display_order).all()


@router.post("/categories", response_model=CategoryResponse)
def create_category(
    cat_in: CategoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["super_admin", "owner", "manager"]))
) -> Any:
    """Create a new menu category."""
    cat = Category(
        restaurant_id=current_user.restaurant_id or cat_in.restaurant_id or 1,
        name=cat_in.name,
        description=cat_in.description,
        icon=cat_in.icon,
        display_order=cat_in.display_order,
        is_active=cat_in.is_active
    )
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat


# ================= Menu Items =================
@router.get("/items", response_model=List[MenuItemResponse])
def get_menu_items(
    category_id: Optional[int] = None,
    category_name: Optional[str] = None,
    available_only: Optional[bool] = False,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
) -> Any:
    """List menu items with category and search filters for guests and authenticated users."""
    query = db.query(MenuItem).join(Category)
    
    rest_id = (current_user.restaurant_id if current_user and current_user.restaurant_id else None) or 1
    query = query.filter(Category.restaurant_id == rest_id)

    if category_id:
        query = query.filter(MenuItem.category_id == category_id)
    if category_name and category_name.strip().lower() != "all":
        query = query.filter(Category.name.ilike(f"%{category_name.strip()}%"))
    if available_only:
        query = query.filter(MenuItem.is_available == True)
    if search:
        query = query.filter(MenuItem.name.ilike(f"%{search}%") | MenuItem.description.ilike(f"%{search}%"))

    return query.all()


@router.get("/items/{item_id}", response_model=MenuItemResponse)
def get_menu_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
) -> Any:
    """Get single menu item with recipe ingredients."""
    item = db.query(MenuItem).filter(MenuItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    return item


@router.post("/items", response_model=MenuItemResponse)
def create_menu_item(
    item_in: MenuItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["super_admin", "owner", "manager", "chef"]))
) -> Any:
    """Create new menu item along with recipe ingredient mappings."""
    item = MenuItem(
        category_id=item_in.category_id,
        name=item_in.name,
        description=item_in.description,
        price=item_in.price,
        cost_price=item_in.cost_price,
        preparation_time_minutes=item_in.preparation_time_minutes,
        image_url=item_in.image_url,
        is_available=item_in.is_available,
        is_vegetarian=item_in.is_vegetarian,
        calories=item_in.calories
    )
    db.add(item)
    db.commit()
    db.refresh(item)

    # Add recipes
    for recipe in item_in.recipes:
        rec = MenuItemIngredient(
            menu_item_id=item.id,
            ingredient_id=recipe.ingredient_id,
            quantity_required=recipe.quantity_required,
            unit=recipe.unit
        )
        db.add(rec)
    db.commit()
    db.refresh(item)

    log_audit_event(db, current_user.id, "CREATE_MENU_ITEM", "MenuItem", str(item.id), f"Created {item.name}")
    return item


@router.put("/items/{item_id}", response_model=MenuItemResponse)
def update_menu_item(
    item_id: int,
    item_in: MenuItemUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["super_admin", "owner", "manager", "chef"]))
) -> Any:
    """Update menu item details or toggle availability."""
    item = db.query(MenuItem).filter(MenuItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Menu item not found")

    for field, value in item_in.dict(exclude_unset=True).items():
        if field != "recipes":
            setattr(item, field, value)

    if item_in.recipes is not None:
        db.query(MenuItemIngredient).filter(MenuItemIngredient.menu_item_id == item.id).delete()
        for recipe in item_in.recipes:
            rec = MenuItemIngredient(
                menu_item_id=item.id,
                ingredient_id=recipe.ingredient_id,
                quantity_required=recipe.quantity_required,
                unit=recipe.unit
            )
            db.add(rec)

    db.commit()
    db.refresh(item)
    log_audit_event(db, current_user.id, "UPDATE_MENU_ITEM", "MenuItem", str(item.id))
    return item


@router.patch("/items/{item_id}/toggle-availability", response_model=MenuItemResponse)
def toggle_availability(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["super_admin", "owner", "manager", "chef"]))
) -> Any:
    """Quick toggle dish availability on/off for kitchen or floor."""
    item = db.query(MenuItem).filter(MenuItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Menu item not found")

    item.is_available = not item.is_available
    db.commit()
    db.refresh(item)
    return item


@router.delete("/items/{item_id}")
def delete_menu_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["super_admin", "owner", "manager"]))
) -> Any:
    """Delete a menu item."""
    item = db.query(MenuItem).filter(MenuItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    db.delete(item)
    db.commit()
    log_audit_event(db, current_user.id, "DELETE_MENU_ITEM", "MenuItem", str(item_id))
    return {"message": "Menu item deleted successfully"}


# ================= Ingredients =================
@router.get("/ingredients", response_model=List[IngredientResponse])
def get_ingredients(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """List ingredients with stock levels."""
    rest_id = current_user.restaurant_id or 1
    return db.query(Ingredient).filter(Ingredient.restaurant_id == rest_id).all()


@router.post("/ingredients", response_model=IngredientResponse)
def create_ingredient(
    ing_in: IngredientCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["super_admin", "owner", "manager", "chef"]))
) -> Any:
    """Register a new raw ingredient."""
    ing = Ingredient(
        restaurant_id=current_user.restaurant_id or ing_in.restaurant_id or 1,
        name=ing_in.name,
        unit=ing_in.unit,
        current_stock=ing_in.current_stock,
        minimum_stock=ing_in.minimum_stock,
        maximum_stock=ing_in.maximum_stock,
        cost_per_unit=ing_in.cost_per_unit,
        supplier_id=ing_in.supplier_id,
        expiry_date=ing_in.expiry_date
    )
    db.add(ing)
    db.commit()
    db.refresh(ing)
    return ing
