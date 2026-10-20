import re
import json
from typing import Dict, Any, List

# Lexicon of sentiment keywords with aspect anchors
POSITIVE_WORDS = {
    "delicious", "amazing", "great", "excellent", "fresh", "tasty", "friendly",
    "quick", "fast", "clean", "wonderful", "perfect", "loved", "superb", "flavorful",
    "crispy", "attentive", "reasonable", "affordable", "cozy", "best", "recommend"
}
NEGATIVE_WORDS = {
    "bad", "terrible", "awful", "horrible", "cold", "bland", "rude", "slow", "delayed",
    "dirty", "overpriced", "expensive", "stale", "worst", "unpleasant", "salty", "oily",
    "disappointing", "poor", "undercooked", "burnt", "waste", "noisy"
}

ASPECT_KEYWORDS = {
    "food": ["taste", "flavor", "delicious", "dish", "curry", "rice", "bread", "chicken", "biryani", "paneer", "fresh", "salty", "spicy", "cooked", "bland", "cold", "food", "meal", "menu"],
    "service": ["waiter", "staff", "server", "service", "attentive", "friendly", "polite", "rude", "hospitality", "manager", "greet"],
    "price": ["price", "cost", "expensive", "affordable", "cheap", "overpriced", "value", "bill", "worth"],
    "ambience": ["ambience", "atmosphere", "music", "vibe", "seating", "clean", "decor", "interior", "lighting", "noisy"],
    "delivery": ["delivery", "packaging", "courier", "delayed", "warm", "spilled", "time", "driver", "parcel"]
}


class SentimentAnalyzer:
    """NLP sentiment analyzer and aspect extractor for customer reviews."""

    def clean_text(self, text: str) -> str:
        """Sanitize review text."""
        text = text.lower()
        text = re.sub(r"[^a-zA-Z0-9\s]", " ", text)
        return " ".join(text.split())

    def analyze(self, text: str, star_rating: int = 5) -> Dict[str, Any]:
        """Analyze text polarity, categorical classification, and aspect scores."""
        cleaned = self.clean_text(text)
        words = cleaned.split()

        pos_count = sum(1 for w in words if w in POSITIVE_WORDS)
        neg_count = sum(1 for w in words if w in NEGATIVE_WORDS)

        # Baseline text polarity between -1.0 and 1.0
        total_matched = pos_count + neg_count
        if total_matched > 0:
            text_polarity = (pos_count - neg_count) / total_matched
        else:
            text_polarity = 0.0

        # Incorporate star rating (1-5 scaled to -1.0 to 1.0)
        star_polarity = (star_rating - 3) / 2.0
        composite_score = round(0.6 * text_polarity + 0.4 * star_polarity, 2)

        if composite_score >= 0.2:
            label = "POSITIVE"
        elif composite_score <= -0.2:
            label = "NEGATIVE"
        else:
            label = "NEUTRAL"

        # Aspect extraction
        aspect_scores = {}
        for aspect, keywords in ASPECT_KEYWORDS.items():
            aspect_matches = [w for w in words if w in keywords]
            if aspect_matches:
                # If aspect is mentioned, compute local context or fallback to composite score
                aspect_scores[f"aspect_{aspect}"] = composite_score
            else:
                aspect_scores[f"aspect_{aspect}"] = None

        # Extract highlighted keywords
        matched_keywords = list(set([w for w in words if w in POSITIVE_WORDS or w in NEGATIVE_WORDS]))

        return {
            "sentiment_label": label,
            "polarity_score": composite_score,
            "aspect_food": aspect_scores.get("aspect_food"),
            "aspect_service": aspect_scores.get("aspect_service"),
            "aspect_price": aspect_scores.get("aspect_price"),
            "aspect_ambience": aspect_scores.get("aspect_ambience"),
            "aspect_delivery": aspect_scores.get("aspect_delivery"),
            "keywords_json": json.dumps(matched_keywords)
        }


sentiment_analyzer = SentimentAnalyzer()
