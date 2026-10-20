from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from app.schemas.menu import MenuItemResponse
from app.schemas.order import CustomerResponse


class DemandPredictionResponse(BaseModel):
    id: int
    branch_id: int
    menu_item_id: int
    forecast_date: datetime
    predicted_quantity: float
    confidence_lower: float
    confidence_upper: float
    model_name: str
    mae_score: Optional[float] = None
    menu_item: Optional[MenuItemResponse] = None

    class Config:
        from_attributes = True


class ForecastItemData(BaseModel):
    date: str
    historical_actual: Optional[float] = None
    predicted_demand: float
    confidence_lower: float
    confidence_upper: float


class ForecastResponse(BaseModel):
    menu_item_id: int
    menu_item_name: str
    model_info: str
    mae: float
    rmse: float
    predictions: List[ForecastItemData]


class CustomerSegmentResponse(BaseModel):
    id: int
    customer_id: int
    segment_name: str
    cluster_id: int
    rfm_recency: float
    rfm_frequency: float
    rfm_monetary: float
    updated_at: datetime
    customer: Optional[CustomerResponse] = None

    class Config:
        from_attributes = True


class AnomalyResponse(BaseModel):
    id: int
    branch_id: int
    metric_name: str
    anomaly_date: datetime
    severity: str
    anomaly_score: float
    expected_value: Optional[float] = None
    actual_value: Optional[float] = None
    explanation: str
    is_resolved: bool
    created_at: datetime

    class Config:
        from_attributes = True


class AIInsightResponse(BaseModel):
    id: int
    branch_id: Optional[int] = None
    category: str
    title: str
    insight_text: str
    recommended_action: Optional[str] = None
    impact_level: str
    created_at: datetime

    class Config:
        from_attributes = True


class NotificationResponse(BaseModel):
    id: int
    user_id: Optional[int] = None
    branch_id: Optional[int] = None
    title: str
    message: str
    notification_type: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True


class AIAssistantRequest(BaseModel):
    question: str
    branch_id: Optional[int] = None


class AIAssistantResponse(BaseModel):
    answer: str
    intent: str
    metrics: Dict[str, Any] = {}
    data_table: Optional[List[Dict[str, Any]]] = None
    suggested_actions: List[str] = []


class DashboardOverviewResponse(BaseModel):
    total_revenue: float
    total_orders: int
    average_order_value: float
    total_customers: int
    total_food_waste_cost: float
    revenue_growth_pct: float
    orders_growth_pct: float
    top_selling_items: List[Dict[str, Any]]
    low_stock_items: List[Dict[str, Any]]
    revenue_trends: List[Dict[str, Any]]
    recent_orders: List[Dict[str, Any]]
    ai_insights: List[AIInsightResponse]
    active_anomalies_count: int
