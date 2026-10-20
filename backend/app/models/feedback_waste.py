from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Text
from sqlalchemy.orm import relationship
from backend.app.core.database import Base


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    branch_id = Column(Integer, ForeignKey("branches.id", ondelete="CASCADE"), nullable=False)
    customer_id = Column(Integer, ForeignKey("customers.id", ondelete="SET NULL"), nullable=True)
    rating = Column(Integer, nullable=False)  # 1 to 5
    comment = Column(Text, nullable=False)
    source = Column(String(50), default="Google")  # Google, Yelp, In-House, Zomato, TripAdvisor
    review_date = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    branch = relationship("Branch", back_populates="reviews")
    customer = relationship("Customer", back_populates="reviews")
    sentiment = relationship("ReviewSentiment", back_populates="review", uselist=False, cascade="all, delete-orphan")


class ReviewSentiment(Base):
    __tablename__ = "review_sentiments"

    id = Column(Integer, primary_key=True, index=True)
    review_id = Column(Integer, ForeignKey("reviews.id", ondelete="CASCADE"), nullable=False, unique=True)
    sentiment_label = Column(String(20), nullable=False)  # 'POSITIVE', 'NEUTRAL', 'NEGATIVE'
    polarity_score = Column(Float, nullable=False)  # -1.0 to 1.0
    aspect_food = Column(Float, nullable=True)  # aspect sentiment scores -1 to 1
    aspect_service = Column(Float, nullable=True)
    aspect_price = Column(Float, nullable=True)
    aspect_ambience = Column(Float, nullable=True)
    aspect_delivery = Column(Float, nullable=True)
    keywords_json = Column(Text, nullable=True)  # JSON string of extracted key phrases
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    review = relationship("Review", back_populates="sentiment")


class WasteRecord(Base):
    __tablename__ = "waste_records"

    id = Column(Integer, primary_key=True, index=True)
    branch_id = Column(Integer, ForeignKey("branches.id", ondelete="CASCADE"), nullable=False)
    menu_item_id = Column(Integer, ForeignKey("menu_items.id", ondelete="SET NULL"), nullable=True)
    ingredient_id = Column(Integer, ForeignKey("ingredients.id", ondelete="SET NULL"), nullable=True)
    waste_type = Column(String(30), default="PREPARED_DISH")  # 'INGREDIENT' or 'PREPARED_DISH'
    quantity = Column(Float, nullable=False)
    unit = Column(String(20), default="portions")
    estimated_cost = Column(Float, default=0.0)
    reason = Column(String(50), nullable=False)  # 'SPOILAGE', 'OVERCOOKED', 'PLATE_WASTE', 'EXPIRED', 'OVER_PREPARATION'
    recorded_by_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    waste_date = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    branch = relationship("Branch", back_populates="waste_records")
    menu_item = relationship("MenuItem", back_populates="waste_records")
    ingredient = relationship("Ingredient", back_populates="waste_records")
