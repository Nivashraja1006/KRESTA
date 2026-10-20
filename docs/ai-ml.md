# Artificial Intelligence & Machine Learning Architecture

RestaurantIQ incorporates production-grade machine learning pipelines and natural language processing algorithms designed to solve core culinary business problems: minimizing food waste, preventing stockouts, detecting revenue fraud/leakage, and understanding customer sentiment.

---

## 1. Machine Learning Demand Forecasting

### Pipeline Overview
```
Historical Order Items (90+ Days)
            │
            ▼
    Daily Aggregation (Date, Dish, Quantity)
            │
            ▼
    Feature Engineering (Lags, Rolling Averages, Calendar Features)
            │
            ▼
    Train / Test Split (80% Train, 20% Evaluation)
            │
            ▼
    Gradient Boosting Regressor (Scikit-Learn)
            │
            ▼
    Metric Evaluation (MAE, RMSE, R² Score)
            │
            ▼
    Multi-Step Forward Forecasting (7-Day Horizon with 95% Confidence Bounds)
```

### Engineered Features
For each dish and operating date $t$:
- `day_of_week`: Categorical integer (0 = Monday, ..., 6 = Sunday) capturing cyclic dining habits.
- `is_weekend`: Binary flag $\{0, 1\}$ for Friday, Saturday, and Sunday dinner surges.
- `month`, `day`: Temporal seasonal anchors.
- `lag_1`: Quantity ordered on day $t-1$ (short-term momentum).
- `lag_7`: Quantity ordered on day $t-7$ (same day of previous week).
- `rolling_mean_7`: 7-day trailing average volume:
  $$\mu_7 = \frac{1}{7} \sum_{i=1}^7 y_{t-i}$$
- `rolling_std_7`: 7-day trailing standard deviation capturing localized demand volatility.
- `rolling_mean_14`: 14-day baseline smoothing.

### Algorithm Specifications
- **Model**: `sklearn.ensemble.GradientBoostingRegressor`
- **Parameters**: `n_estimators=100`, `learning_rate=0.08`, `max_depth=4`, `random_state=42`.
- **Loss Function**: Squared error loss penalized for large deviations.
- **Confidence Interval**:
  $$\text{Interval}_{95\%} = \hat{y} \pm 1.96 \times \text{MAE}$$

---

## 2. AI Inventory Replenishment Optimization

The inventory optimizer determines purchase recommendations by evaluating recipe requirements against vendor delivery constraints:

$$\text{Target Stock} = \text{Forecasted Usage} + \text{Safety Buffer}$$
$$\text{Recommended Order} = \max\left(0, \text{Target Stock} - \text{Current Stock}\right)$$

Where:
- **Forecasted Usage**: Evaluates all dishes requiring ingredient $i$:
  $$\text{Usage}_i = \sum_{d \in \text{Dishes}} \left( \hat{Y}_d \times \text{RecipeQty}_{d, i} \right)$$
- **Safety Buffer**: Determined dynamically:
  $$\text{Safety Buffer} = \max\left(\text{MinStock}, 0.25 \times \text{Usage}_i\right)$$
- **Lead Time Adjustment**: Accounts for supplier delivery days to ensure stock does not deplete while the purchase order is in transit.

---

## 3. Customer RFM Segmentation (K-Means Clustering)

Customers are clustered based on three core behavioral dimensions:
1. **Recency ($R$)**: Days since the guest's last recorded dining ticket.
2. **Frequency ($F$)**: Total lifetime completed orders.
3. **Monetary Value ($M$)**: Total gross spending.

### Normalization & Clustering
- Features are scaled using `sklearn.preprocessing.StandardScaler` to zero mean and unit variance.
- `sklearn.cluster.KMeans(n_clusters=4, random_state=42)` partitions customers into 4 distinct segments:
  - **VIP / High Value**: High monetary spend, high order frequency.
  - **Loyal Regulars**: Low recency (recent visits), consistent frequency.
  - **Promising Newcomers**: Low recency, lower total order count (recent first-time diners).
  - **At-Risk / Occasional**: High recency (long time since last visit), low lifetime value.

---

## 4. NLP Review Sentiment & Aspect Extraction

The sentiment analysis module parses customer review text and star ratings into nuanced operational feedback:

### Pipeline
1. **Text Preprocessing**: Lowercasing, punctuation stripping, stopword filtering.
2. **Polarity Scoring**: Keyword match scoring between positive culinary lexicon ($P$) and negative service lexicon ($N$):
   $$\text{Text Polarity} = \frac{|P| - |N|}{|P| + |N| + \epsilon}$$
3. **Composite Polarity**: Combines normalized star rating ($S \in [-1, 1]$) with text polarity:
   $$\text{Score} = 0.6 \times \text{Text Polarity} + 0.4 \times S$$
4. **Aspect Categorization**:
   - **Food**: Keywords (`taste`, `flavor`, `delicious`, `dish`, `rice`, `chicken`, `spicy`, `curry`, `salty`, `cold`).
   - **Service**: Keywords (`waiter`, `staff`, `server`, `friendly`, `polite`, `slow`, `delayed`, `manager`).
   - **Price**: Keywords (`expensive`, `affordable`, `cheap`, `value`, `bill`, `overpriced`).
   - **Ambience**: Keywords (`atmosphere`, `music`, `decor`, `interior`, `lighting`, `clean`).
   - **Delivery**: Keywords (`packaging`, `courier`, `warm`, `spilled`, `time`).

---

## 5. Isolation Forest Anomaly Detection

To detect potential operational fraud, unrecorded scrap, or abnormal revenue swings, RestaurantIQ employs `sklearn.ensemble.IsolationForest`.

- **Input Metrics**: Daily revenue totals, daily ticket counts, discount volume, and food scrap write-offs.
- **Principle**: Outliers require fewer recursive tree splits to isolate compared to standard data points.
- **Contamination Rate**: $0.08$ (top 8% most divergent operational days flagged).
- **Severity Mapping**:
  - `HIGH`: Deviation exceeding $2.5 \times$ standard deviation from historical baseline.
  - `MEDIUM`: Deviation between $1.8 \times$ and $2.5 \times$.
  - `LOW`: Mild variance.
- **Operational Explanations**: Generated neutrally (e.g. *"Unusual revenue drop detected: 34% below 14-day running average"*).

---

## 6. Grounded AI Business Assistant

The AI Business Assistant enforces factual reliability:
1. **Intent Classification**: Identifies question intent (`REVENUE_ANALYSIS`, `TOP_MENU_ITEMS`, `FOOD_WASTE_INSIGHTS`, `INVENTORY_PURCHASE`, `DEMAND_FORECAST`).
2. **Direct Metric Extraction**: Queries live PostgreSQL tables and Scikit-Learn prediction models.
3. **Synthesis**: Formats answers with:
   - Natural executive explanation.
   - Ground-truth data table verifying figures.
   - Recommended operational actions.
4. **Provider Abstraction**: Extensible interface supporting local deterministic synthesis (zero-cost offline mode) or cloud LLM generation (OpenAI/Anthropic/Gemini) configured via environment variables.
