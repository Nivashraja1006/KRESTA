from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from backend.app.core.database import Base


class Restaurant(Base):
    __tablename__ = "restaurants"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    description = Column(String(500), nullable=True)
    address = Column(String(255), nullable=True)
    phone = Column(String(50), nullable=True)
    email = Column(String(100), nullable=True)
    currency = Column(String(10), default="$")
    tax_rate = Column(Float, default=5.0)  # Percentage e.g. 5.0%
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    branches = relationship("Branch", back_populates="restaurant", cascade="all, delete-orphan")
    users = relationship("User", back_populates="restaurant")
    categories = relationship("Category", back_populates="restaurant", cascade="all, delete-orphan")
    ingredients = relationship("Ingredient", back_populates="restaurant", cascade="all, delete-orphan")
    suppliers = relationship("Supplier", back_populates="restaurant", cascade="all, delete-orphan")
    customers = relationship("Customer", back_populates="restaurant", cascade="all, delete-orphan")


class Branch(Base):
    __tablename__ = "branches"

    id = Column(Integer, primary_key=True, index=True)
    restaurant_id = Column(Integer, ForeignKey("restaurants.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(150), nullable=False)
    code = Column(String(50), unique=True, index=True, nullable=False)
    address = Column(String(255), nullable=True)
    city = Column(String(100), nullable=True)
    state = Column(String(100), nullable=True)
    postal_code = Column(String(20), nullable=True)
    phone = Column(String(50), nullable=True)
    opening_time = Column(String(20), default="09:00")
    closing_time = Column(String(20), default="23:00")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    restaurant = relationship("Restaurant", back_populates="branches")
    users = relationship("User", back_populates="branch")
    tables = relationship("RestaurantTable", back_populates="branch", cascade="all, delete-orphan")
    orders = relationship("Order", back_populates="branch", cascade="all, delete-orphan")
    waste_records = relationship("WasteRecord", back_populates="branch", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="branch", cascade="all, delete-orphan")
    anomalies = relationship("AnomalyRecord", back_populates="branch", cascade="all, delete-orphan")
    demand_predictions = relationship("DemandPrediction", back_populates="branch", cascade="all, delete-orphan")


class RestaurantTable(Base):
    __tablename__ = "restaurant_tables"

    id = Column(Integer, primary_key=True, index=True)
    branch_id = Column(Integer, ForeignKey("branches.id", ondelete="CASCADE"), nullable=False)
    table_number = Column(String(20), nullable=False)
    capacity = Column(Integer, default=4)
    status = Column(String(30), default="AVAILABLE")  # AVAILABLE, OCCUPIED, RESERVED, DIRTY
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    branch = relationship("Branch", back_populates="tables")
    orders = relationship("Order", back_populates="table")
