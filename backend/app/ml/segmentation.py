import logging
from datetime import datetime, timezone
from typing import List, Dict, Any
import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sqlalchemy.orm import Session

from backend.app.models import Customer, CustomerSegment

logger = logging.getLogger(__name__)


class CustomerSegmenter:
    """RFM (Recency, Frequency, Monetary) Customer Segmentation via K-Means."""

    def run_segmentation(self, db: Session, restaurant_id: int) -> List[Dict[str, Any]]:
        customers = db.query(Customer).filter(Customer.restaurant_id == restaurant_id).all()
        if not customers or len(customers) < 4:
            logger.info("Not enough customers for K-Means clustering; skipping.")
            return []

        now = datetime.now(timezone.utc)
        data = []
        for c in customers:
            if c.last_visit_date:
                # Make timezone-naive or aware matching
                lv = c.last_visit_date
                if lv.tzinfo is None:
                    lv = lv.replace(tzinfo=timezone.utc)
                recency_days = max(0, (now - lv).days)
            else:
                recency_days = 90

            frequency = float(c.total_orders or 1)
            monetary = float(c.total_spent or 10.0)

            data.append({
                "customer_id": c.id,
                "customer_name": c.name,
                "recency": recency_days,
                "frequency": frequency,
                "monetary": monetary
            })

        df = pd.DataFrame(data)
        X = df[["recency", "frequency", "monetary"]].values

        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)

        n_clusters = min(4, len(df))
        kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
        df["cluster"] = kmeans.fit_predict(X_scaled)

        # Label clusters logically based on centroids:
        # High monetary + high frequency = VIP
        # Low recency + high frequency = Loyal Regular
        # Low recency + low frequency = Promising Newcomer
        # High recency = Inactive / At Risk
        cluster_summaries = df.groupby("cluster").agg({
            "recency": "mean",
            "frequency": "mean",
            "monetary": "mean"
        }).reset_index()

        cluster_labels = {}
        for _, row in cluster_summaries.iterrows():
            c_id = int(row["cluster"])
            if row["monetary"] >= cluster_summaries["monetary"].median() and row["frequency"] >= cluster_summaries["frequency"].median():
                cluster_labels[c_id] = "VIP / High Value"
            elif row["recency"] <= cluster_summaries["recency"].median() and row["frequency"] >= cluster_summaries["frequency"].median():
                cluster_labels[c_id] = "Loyal Regular"
            elif row["recency"] <= cluster_summaries["recency"].median():
                cluster_labels[c_id] = "Promising Newcomer"
            else:
                cluster_labels[c_id] = "At Risk / Occasional"

        df["segment_name"] = df["cluster"].map(cluster_labels)

        # Update customer_segments table in database
        results = []
        for _, row in df.iterrows():
            cust_id = int(row["customer_id"])
            segment_name = str(row["segment_name"])
            cluster_id = int(row["cluster"])

            seg = db.query(CustomerSegment).filter(CustomerSegment.customer_id == cust_id).first()
            if not seg:
                seg = CustomerSegment(
                    customer_id=cust_id,
                    segment_name=segment_name,
                    cluster_id=cluster_id,
                    rfm_recency=float(row["recency"]),
                    rfm_frequency=float(row["frequency"]),
                    rfm_monetary=float(row["monetary"])
                )
                db.add(seg)
            else:
                seg.segment_name = segment_name
                seg.cluster_id = cluster_id
                seg.rfm_recency = float(row["recency"])
                seg.rfm_frequency = float(row["frequency"])
                seg.rfm_monetary = float(row["monetary"])

            results.append({
                "customer_id": cust_id,
                "customer_name": row["customer_name"],
                "segment_name": segment_name,
                "cluster_id": cluster_id,
                "rfm_recency": float(row["recency"]),
                "rfm_frequency": float(row["frequency"]),
                "rfm_monetary": float(row["monetary"])
            })

        db.commit()
        return results


customer_segmenter = CustomerSegmenter()
