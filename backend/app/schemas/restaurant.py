from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr


class BranchBase(BaseModel):
    name: str
    code: str
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    postal_code: Optional[str] = None
    phone: Optional[str] = None
    opening_time: str = "09:00"
    closing_time: str = "23:00"
    is_active: bool = True


class BranchCreate(BranchBase):
    restaurant_id: Optional[int] = None


class BranchResponse(BranchBase):
    id: int
    restaurant_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class RestaurantTableBase(BaseModel):
    table_number: str
    capacity: int = 4
    status: str = "AVAILABLE"


class RestaurantTableCreate(RestaurantTableBase):
    branch_id: int


class RestaurantTableResponse(RestaurantTableBase):
    id: int
    branch_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class RestaurantBase(BaseModel):
    name: str
    description: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    currency: str = "$"
    tax_rate: float = 5.0


class RestaurantCreate(RestaurantBase):
    pass


class RestaurantResponse(RestaurantBase):
    id: int
    created_at: datetime
    branches: List[BranchResponse] = []

    class Config:
        from_attributes = True
