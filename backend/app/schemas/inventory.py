from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr
from backend.app.schemas.menu import IngredientResponse


class SupplierBase(BaseModel):
    name: str
    contact_person: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    lead_time_days: int = 2
    rating: float = 4.5


class SupplierCreate(SupplierBase):
    restaurant_id: Optional[int] = None


class SupplierResponse(SupplierBase):
    id: int
    restaurant_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class InventoryTransactionCreate(BaseModel):
    ingredient_id: int
    branch_id: Optional[int] = None
    transaction_type: str  # 'PURCHASE', 'USAGE', 'WASTE', 'ADJUSTMENT'
    quantity: float
    unit_cost: float = 0.0
    reference_id: Optional[str] = None
    notes: Optional[str] = None


class InventoryTransactionResponse(BaseModel):
    id: int
    ingredient_id: int
    branch_id: Optional[int] = None
    transaction_type: str
    quantity: float
    unit_cost: float
    reference_id: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime
    ingredient: Optional[IngredientResponse] = None

    class Config:
        from_attributes = True


class PurchaseOrderItemSchema(BaseModel):
    ingredient_id: int
    quantity_ordered: float
    unit_price: float


class PurchaseOrderItemResponse(BaseModel):
    id: int
    purchase_order_id: int
    ingredient_id: int
    quantity_ordered: float
    quantity_received: float
    unit_price: float
    ingredient: Optional[IngredientResponse] = None

    class Config:
        from_attributes = True


class PurchaseOrderCreate(BaseModel):
    branch_id: int
    supplier_id: int
    expected_delivery_date: Optional[datetime] = None
    notes: Optional[str] = None
    items: List[PurchaseOrderItemSchema]


class PurchaseOrderUpdate(BaseModel):
    status: Optional[str] = None  # DRAFT, ORDERED, RECEIVED, CANCELLED
    received_date: Optional[datetime] = None
    notes: Optional[str] = None


class PurchaseOrderResponse(BaseModel):
    id: int
    branch_id: int
    supplier_id: int
    order_number: str
    status: str
    total_amount: float
    expected_delivery_date: Optional[datetime] = None
    received_date: Optional[datetime] = None
    notes: Optional[str] = None
    created_at: datetime
    supplier: Optional[SupplierResponse] = None
    items: List[PurchaseOrderItemResponse] = []

    class Config:
        from_attributes = True


class InventoryHealthItem(BaseModel):
    id: int
    name: str
    unit: str
    current_stock: float
    minimum_stock: float
    maximum_stock: float
    cost_per_unit: float
    status: str  # HEALTHY, LOW, CRITICAL, EXPIRED
    days_until_expiry: Optional[int] = None
    recommended_order_qty: float = 0.0
