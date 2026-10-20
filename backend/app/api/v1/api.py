from fastapi import APIRouter
from backend.app.api.v1.endpoints import (
    auth, users, restaurants, menu, orders, kitchen,
    inventory, suppliers, customers, reviews, waste,
    analytics, forecast, recommendations, anomalies,
    ai, notifications, reports
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users & RBAC"])
api_router.include_router(restaurants.router, prefix="/restaurants", tags=["Restaurants & Branches"])
api_router.include_router(menu.router, prefix="/menu", tags=["Menu & Ingredients"])
api_router.include_router(orders.router, prefix="/orders", tags=["Orders & POS"])
api_router.include_router(kitchen.router, prefix="/kitchen", tags=["Kitchen Display System"])
api_router.include_router(inventory.router, prefix="/inventory", tags=["Inventory & Purchase Orders"])
api_router.include_router(suppliers.router, prefix="/suppliers", tags=["Suppliers"])
api_router.include_router(customers.router, prefix="/customers", tags=["Customers & Segmentation"])
api_router.include_router(reviews.router, prefix="/reviews", tags=["Reviews & NLP Sentiment"])
api_router.include_router(waste.router, prefix="/waste", tags=["Food Waste Intelligence"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["Business Analytics"])
api_router.include_router(forecast.router, prefix="/forecast", tags=["AI Demand Forecasting"])
api_router.include_router(recommendations.router, prefix="/recommendations", tags=["AI Inventory Recommendations"])
api_router.include_router(anomalies.router, prefix="/anomalies", tags=["Anomaly Detection"])
api_router.include_router(ai.router, prefix="/ai", tags=["AI Business Assistant"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["Notifications"])
api_router.include_router(reports.router, prefix="/reports", tags=["Reports & Audit Logs"])
