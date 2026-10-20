from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel


class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None
    icon: str = "Utensils"
    display_order: int = 0
    is_active: bool = True


class CategoryCreate(CategoryBase):
    restaurant_id: Optional[int] = None


class CategoryResponse(CategoryBase):
    id: int
    restaurant_id: int

    class Config:
        from_attributes = True


class IngredientBase(BaseModel):
    name: str
    unit: str  # kg, g, liters, ml, units
    current_stock: float = 0.0
    minimum_stock: float = 5.0
    maximum_stock: float = 100.0
    cost_per_unit: float = 0.0
    supplier_id: Optional[int] = None
    expiry_date: Optional[datetime] = None


class IngredientCreate(IngredientBase):
    restaurant_id: Optional[int] = None


class IngredientResponse(IngredientBase):
    id: int
    restaurant_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class RecipeItemSchema(BaseModel):
    ingredient_id: int
    quantity_required: float
    unit: str


class MenuItemIngredientResponse(BaseModel):
    id: int
    ingredient_id: int
    quantity_required: float
    unit: str
    ingredient: Optional[IngredientResponse] = None

    class Config:
        from_attributes = True


class MenuItemBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    cost_price: float = 0.0
    preparation_time_minutes: int = 15
    image_url: Optional[str] = None
    is_available: bool = True
    is_vegetarian: bool = False
    calories: Optional[int] = None


class MenuItemCreate(MenuItemBase):
    category_id: int
    recipes: List[RecipeItemSchema] = []


class MenuItemUpdate(BaseModel):
    name: Optional[str] = None
    category_id: Optional[int] = None
    description: Optional[str] = None
    price: Optional[float] = None
    cost_price: Optional[float] = None
    preparation_time_minutes: Optional[int] = None
    image_url: Optional[str] = None
    is_available: Optional[bool] = None
    is_vegetarian: Optional[bool] = None
    calories: Optional[int] = None
    recipes: Optional[List[RecipeItemSchema]] = None


class MenuItemResponse(MenuItemBase):
    id: int
    category_id: int
    category: Optional[CategoryResponse] = None
    recipes: List[MenuItemIngredientResponse] = []
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
