from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Float, Text
from sqlalchemy.orm import relationship
from app.core.database import Base


class DemandPrediction(Base):
    __tablename__ = "demand_predictions"

    id = Column(Integer, primary_key=True, index=True)
    branch_id = Column(Integer, ForeignKey("branches.id", ondelete="CASCADE"), nullable=False)
    menu_item_id = Column(Integer, ForeignKey("menu_items.id", ondelete="CASCADE"), nullable=False)
    forecast_date = Column(DateTime, nullable=False, index=True)
    predicted_quantity = Column(Float, nullable=False)
    confidence_lower = Column(Float, nullable=False)
    confidence_upper = Column(Float, nullable=False)
    model_name = Column(String(50), default="GradientBoosting")
    mae_score = Column(Float, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    branch = relationship("Branch", back_populates="demand_predictions")
    menu_item = relationship("MenuItem", back_populates="demand_predictions")


class CustomerSegment(Base):
    __tablename__ = "customer_segments"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id", ondelete="CASCADE"), nullable=False, unique=True)
    segment_name = Column(String(50), nullable=False)  # 'VIP / High Value', 'Loyal Regular', 'Promising Newcomer', 'At Risk / Occasional', 'Inactive'
    cluster_id = Column(Integer, nullable=False)
    rfm_recency = Column(Float, nullable=False)  # Days since last order
    rfm_frequency = Column(Float, nullable=False)  # Total orders count
    rfm_monetary = Column(Float, nullable=False)  # Total spend
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    customer = relationship("Customer", back_populates="segment")


class AnomalyRecord(Base):
    __tablename__ = "anomalies"

    id = Column(Integer, primary_key=True, index=True)
    branch_id = Column(Integer, ForeignKey("branches.id", ondelete="CASCADE"), nullable=False)
    metric_name = Column(String(50), nullable=False)  # 'REVENUE', 'ORDER_VOLUME', 'DISCOUNT_RATE', 'INVENTORY_CONSUMPTION', 'WASTE_VOLUME'
    anomaly_date = Column(DateTime, nullable=False, index=True)
    severity = Column(String(20), default="MEDIUM")  # 'LOW', 'MEDIUM', 'HIGH'
    anomaly_score = Column(Float, nullable=False)  # Isolation Forest decision score
    expected_value = Column(Float, nullable=True)
    actual_value = Column(Float, nullable=True)
    explanation = Column(Text, nullable=False)
    is_resolved = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    branch = relationship("Branch", back_populates="anomalies")


class AIInsight(Base):
    __tablename__ = "ai_insights"

    id = Column(Integer, primary_key=True, index=True)
    branch_id = Column(Integer, ForeignKey("branches.id", ondelete="CASCADE"), nullable=True)
    category = Column(String(50), nullable=False)  # 'DEMAND', 'INVENTORY', 'WASTE', 'REVENUE', 'OPERATIONS'
    title = Column(String(200), nullable=False)
    insight_text = Column(Text, nullable=False)
    recommended_action = Column(Text, nullable=True)
    impact_level = Column(String(30), default="INFO")  # 'INFO', 'WARNING', 'ACTION_REQUIRED'
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    branch_id = Column(Integer, ForeignKey("branches.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(150), nullable=False)
    message = Column(Text, nullable=False)
    notification_type = Column(String(50), default="INFO")  # LOW_INVENTORY, EXPIRING_INGREDIENT, HIGH_WASTE, DEMAND_SPIKE, ANOMALY, ORDER_DELAY
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)

    user = relationship("User", back_populates="notifications")
