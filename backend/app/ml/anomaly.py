import logging
from datetime import datetime, timedelta
from typing import List, Dict, Any
import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from sqlalchemy.orm import Session
from sqlalchemy import func

from backend.app.models import Order, WasteRecord, AnomalyRecord

logger = logging.getLogger(__name__)


class AnomalyDetector:
    """Detects operational, revenue, and waste anomalies using Isolation Forest."""

    def __init__(self, contamination: float = 0.08):
        self.contamination = contamination

    def scan_branch_anomalies(self, db: Session, branch_id: int) -> List[Dict[str, Any]]:
        """Scan daily metrics for anomalies and record findings."""
        # 1. Daily Revenue & Order Volume
        daily_sales = (
            db.query(
                func.date(Order.created_at).label("day"),
                func.sum(Order.total_amount).label("revenue"),
                func.count(Order.id).label("orders"),
                func.sum(Order.discount).label("discount")
            )
            .filter(
                Order.branch_id == branch_id,
                Order.status.in_(["CONFIRMED", "PREPARING", "READY", "SERVED", "COMPLETED"])
            )
            .group_by(func.date(Order.created_at))
            .order_by(func.date(Order.created_at))
            .all()
        )

        detected_anomalies = []
        if len(daily_sales) >= 10:
            df = pd.DataFrame(daily_sales, columns=["day", "revenue", "orders", "discount"])
            df["day"] = pd.to_datetime(df["day"])
            df["revenue"] = df["revenue"].astype(float)
            df["orders"] = df["orders"].astype(float)
            df["discount"] = df["discount"].astype(float)

            # Fit Isolation Forest on revenue & orders
            X = df[["revenue", "orders"]].values
            clf = IsolationForest(contamination=self.contamination, random_state=42)
            df["is_outlier"] = clf.fit_predict(X)  # -1 = anomaly, 1 = normal
            df["score"] = clf.decision_function(X)

            mean_rev = df["revenue"].mean()
            std_rev = df["revenue"].std() if df["revenue"].std() > 0 else 1.0

            for _, row in df[df["is_outlier"] == -1].iterrows():
                day_val = row["day"].to_pydatetime()
                # Check if already logged for this date and metric
                existing = db.query(AnomalyRecord).filter(
                    AnomalyRecord.branch_id == branch_id,
                    AnomalyRecord.metric_name == "REVENUE",
                    func.date(AnomalyRecord.anomaly_date) == day_val.date()
                ).first()

                if not existing:
                    diff_pct = round(((row["revenue"] - mean_rev) / mean_rev) * 100, 1)
                    if row["revenue"] < mean_rev:
                        severity = "HIGH" if row["revenue"] < mean_rev - 2 * std_rev else "MEDIUM"
                        explanation = f"Unusual revenue drop detected: {abs(diff_pct)}% below average daily revenue baseline."
                    else:
                        severity = "LOW"
                        explanation = f"Unusual revenue surge detected: +{diff_pct}% above average daily revenue baseline."

                    anomaly = AnomalyRecord(
                        branch_id=branch_id,
                        metric_name="REVENUE",
                        anomaly_date=day_val,
                        severity=severity,
                        anomaly_score=round(float(row["score"]), 3),
                        expected_value=round(mean_rev, 2),
                        actual_value=round(row["revenue"], 2),
                        explanation=explanation,
                        is_resolved=False
                    )
                    db.add(anomaly)
                    detected_anomalies.append({
                        "metric_name": "REVENUE",
                        "date": day_val.strftime("%Y-%m-%d"),
                        "severity": severity,
                        "explanation": explanation
                    })

        # 2. Daily Food Waste Spikes
        daily_waste = (
            db.query(
                func.date(WasteRecord.waste_date).label("day"),
                func.sum(WasteRecord.estimated_cost).label("waste_cost")
            )
            .filter(WasteRecord.branch_id == branch_id)
            .group_by(func.date(WasteRecord.waste_date))
            .all()
        )

        if len(daily_waste) >= 7:
            w_df = pd.DataFrame(daily_waste, columns=["day", "waste_cost"])
            w_df["day"] = pd.to_datetime(w_df["day"])
            w_df["waste_cost"] = w_df["waste_cost"].astype(float)
            w_mean = w_df["waste_cost"].mean()
            w_std = w_df["waste_cost"].std() if w_df["waste_cost"].std() > 0 else 1.0

            for _, row in w_df[w_df["waste_cost"] > w_mean + 1.8 * w_std].iterrows():
                day_val = row["day"].to_pydatetime()
                existing = db.query(AnomalyRecord).filter(
                    AnomalyRecord.branch_id == branch_id,
                    AnomalyRecord.metric_name == "WASTE_VOLUME",
                    func.date(AnomalyRecord.anomaly_date) == day_val.date()
                ).first()

                if not existing:
                    explanation = f"Significant food waste spike recorded (${round(row['waste_cost'], 2)} vs normal avg ${round(w_mean, 2)})."
                    anomaly = AnomalyRecord(
                        branch_id=branch_id,
                        metric_name="WASTE_VOLUME",
                        anomaly_date=day_val,
                        severity="HIGH" if row["waste_cost"] > w_mean + 2.5 * w_std else "MEDIUM",
                        anomaly_score=-0.25,
                        expected_value=round(w_mean, 2),
                        actual_value=round(row["waste_cost"], 2),
                        explanation=explanation,
                        is_resolved=False
                    )
                    db.add(anomaly)
                    detected_anomalies.append({
                        "metric_name": "WASTE_VOLUME",
                        "date": day_val.strftime("%Y-%m-%d"),
                        "severity": "HIGH",
                        "explanation": explanation
                    })

        db.commit()
        return detected_anomalies


anomaly_detector = AnomalyDetector()
