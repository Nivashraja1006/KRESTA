from typing import List, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models import Ingredient, MenuItemIngredient, Supplier
from app.ml.forecasting import forecaster


class InventoryOptimizer:
    """Calculates scientifically grounded inventory replenishment quantities."""

    def compute_recommendations(self, db: Session, restaurant_id: int, branch_id: int) -> List[Dict[str, Any]]:
        ingredients = (
            db.query(Ingredient)
            .filter(Ingredient.restaurant_id == restaurant_id)
            .all()
        )

        recommendations = []
        for ing in ingredients:
            current_stock = ing.current_stock
            min_stock = ing.minimum_stock
            unit = ing.unit
            cost = ing.cost_per_unit
            supplier = ing.supplier
            lead_time = supplier.lead_time_days if supplier else 2

            # Compute ingredient requirement from linked menu items
            # Aggregate required quantity per portion across all recipes using this ingredient
            recipe_links = ing.recipe_links
            total_predicted_usage = 0.0

            for link in recipe_links:
                # Estimate 3-day demand for this dish
                dish_id = link.menu_item_id
                # Forecast 3 days
                forecast_res = forecaster.train_and_forecast(db, dish_id, branch_id)
                three_day_dish_demand = sum(p["predicted_demand"] for p in forecast_res["predictions"][:3])
                usage = three_day_dish_demand * link.quantity_required
                total_predicted_usage += usage

            # Safety Stock: min stock or 20% of predicted demand
            safety_stock = max(min_stock, total_predicted_usage * 0.25)
            
            # Target stock covers lead time + usage window
            target_stock = total_predicted_usage + safety_stock
            
            # Recommendation
            raw_rec = target_stock - current_stock
            recommended_purchase = max(0.0, round(raw_rec, 1))

            # Status classification
            if current_stock <= 0:
                status = "CRITICAL"
            elif current_stock <= min_stock:
                status = "LOW"
            else:
                status = "HEALTHY"

            explanation = (
                f"Current stock is {current_stock} {unit}. "
                f"Projected {lead_time + 3}-day requirement is {round(total_predicted_usage, 1)} {unit} "
                f"with a safety stock buffer of {round(safety_stock, 1)} {unit}."
            )

            recommendations.append({
                "ingredient_id": ing.id,
                "ingredient_name": ing.name,
                "unit": unit,
                "current_stock": current_stock,
                "minimum_stock": min_stock,
                "safety_stock": round(safety_stock, 1),
                "predicted_usage": round(total_predicted_usage, 1),
                "recommended_order_quantity": recommended_purchase,
                "estimated_purchase_cost": round(recommended_purchase * cost, 2),
                "supplier_name": supplier.name if supplier else "Default Supplier",
                "lead_time_days": lead_time,
                "status": status,
                "explanation": explanation
            })

        return recommendations


inventory_optimizer = InventoryOptimizer()
