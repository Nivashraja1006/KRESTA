from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr
from backend.app.schemas.menu import MenuItemResponse


class CustomerBase(BaseModel):
    name: str
    email: Optional[EmailStr] = None
    phone: Optional[str] = None


class CustomerCreate(CustomerBase):
    restaurant_id: Optional[int] = None


class CustomerResponse(CustomerBase):
    id: int
    restaurant_id: int
    total_spent: float
    total_orders: int
    last_visit_date: Optional[datetime] = None
    loyalty_points: int
    created_at: datetime
    segment_name: Optional[str] = None

    class Config:
        from_attributes = True


class OrderItemCreate(BaseModel):
    menu_item_id: int
    quantity: int = 1
    special_instructions: Optional[str] = None


class OrderItemResponse(BaseModel):
    id: int
    order_id: int
    menu_item_id: int
    quantity: int
    unit_price: float
    subtotal: float
    special_instructions: Optional[str] = None
    status: str
    menu_item: Optional[MenuItemResponse] = None

    class Config:
        from_attributes = True


class PaymentCreate(BaseModel):
    payment_method: str = "CARD"  # CASH, CARD, UPI, ONLINE
    amount: float
    transaction_id: Optional[str] = None


class PaymentResponse(BaseModel):
    id: int
    order_id: int
    payment_method: str
    amount: float
    status: str
    transaction_id: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class OrderCreate(BaseModel):
    branch_id: int
    customer_id: Optional[int] = None
    table_id: Optional[int] = None
    order_type: str = "DINE_IN"  # DINE_IN, TAKEAWAY, DELIVERY
    items: List[OrderItemCreate]
    discount: float = 0.0
    notes: Optional[str] = None
    payment_method: Optional[str] = None  # If paid immediately at counter


class OrderStatusUpdate(BaseModel):
    status: str  # NEW, CONFIRMED, PREPARING, READY, SERVED, COMPLETED, CANCELLED


class OrderResponse(BaseModel):
    id: int
    branch_id: int
    customer_id: Optional[int] = None
    table_id: Optional[int] = None
    order_number: str
    order_type: str
    status: str
    subtotal: float
    tax: float
    discount: float
    total_amount: float
    notes: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    customer: Optional[CustomerResponse] = None
    items: List[OrderItemResponse] = []
    payment: Optional[PaymentResponse] = None

    class Config:
        from_attributes = True


class CustomerOrderItem(BaseModel):
    menu_item_id: int
    quantity: int = 1
    special_instructions: Optional[str] = None
    spice_level: Optional[str] = None


class CustomerOrderCreate(BaseModel):
    branch_id: int = 1
    customer_name: str
    customer_email: Optional[EmailStr] = None
    customer_phone: Optional[str] = None
    order_type: str = "DELIVERY"  # DELIVERY, TAKEAWAY, DINE_IN
    delivery_address: Optional[str] = None
    table_number: Optional[str] = None
    items: List[CustomerOrderItem]
    coupon_code: Optional[str] = None
    notes: Optional[str] = None
    payment_method: str = "CARD"  # CARD, CASH, UPI, ONLINE
    idempotency_key: Optional[str] = None


class CartValidationRequest(BaseModel):
    branch_id: int = 1
    order_type: str = "DELIVERY"
    items: List[CustomerOrderItem]
    coupon_code: Optional[str] = None


class CartValidationResponse(BaseModel):
    is_valid: bool
    subtotal: float
    tax: float
    delivery_fee: float
    discount: float
    total: float
    coupon_applied: Optional[str] = None
    coupon_message: Optional[str] = None
    errors: List[str] = []


class OrderTimelineStep(BaseModel):
    key: str
    label: str
    timestamp: Optional[str] = None
    status: str  # COMPLETED, CURRENT, UPCOMING


class OrderTrackingResponse(BaseModel):
    order: OrderResponse
    timeline: List[OrderTimelineStep]
    estimated_time_minutes: int
    fulfillment_label: str
    can_cancel: bool

