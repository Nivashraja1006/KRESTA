from datetime import datetime
from typing import Optional, Dict, Any, List
from pydantic import BaseModel
from app.schemas.menu import MenuItemResponse, IngredientResponse


class ReviewCreate(BaseModel):
    branch_id: int
    customer_id: Optional[int] = None
    rating: int  # 1 to 5
    comment: str
    source: str = "Google"


class ReviewSentimentResponse(BaseModel):
    id: int
    sentiment_label: str  # POSITIVE, NEUTRAL, NEGATIVE
    polarity_score: float
    aspect_food: Optional[float] = None
    aspect_service: Optional[float] = None
    aspect_price: Optional[float] = None
    aspect_ambience: Optional[float] = None
    aspect_delivery: Optional[float] = None
    keywords_json: Optional[str] = None

    class Config:
        from_attributes = True


class ReviewResponse(BaseModel):
    id: int
    branch_id: int
    customer_id: Optional[int] = None
    rating: int
    comment: str
    source: str
    review_date: datetime
    created_at: datetime
    sentiment: Optional[ReviewSentimentResponse] = None

    class Config:
        from_attributes = True


class WasteRecordCreate(BaseModel):
    branch_id: int
    menu_item_id: Optional[int] = None
    ingredient_id: Optional[int] = None
    waste_type: str = "PREPARED_DISH"  # 'INGREDIENT' or 'PREPARED_DISH'
    quantity: float
    unit: str = "portions"
    estimated_cost: float
    reason: str  # 'SPOILAGE', 'OVERCOOKED', 'PLATE_WASTE', 'EXPIRED', 'OVER_PREPARATION'
    notes: Optional[str] = None


class WasteRecordResponse(BaseModel):
    id: int
    branch_id: int
    menu_item_id: Optional[int] = None
    ingredient_id: Optional[int] = None
    waste_type: str
    quantity: float
    unit: str
    estimated_cost: float
    reason: str
    waste_date: datetime
    notes: Optional[str] = None
    menu_item: Optional[MenuItemResponse] = None
    ingredient: Optional[IngredientResponse] = None

    class Config:
        from_attributes = True
