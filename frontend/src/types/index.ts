export type RoleName = 'super_admin' | 'owner' | 'manager' | 'chef' | 'staff' | 'customer';

export interface User {
  id: number;
  email: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  is_active: boolean;
  is_superuser: boolean;
  role_id: number;
  role?: {
    id: number;
    name: RoleName;
    description?: string;
  };
  restaurant_id?: number;
  branch_id?: number;
  created_at: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

export interface Branch {
  id: number;
  restaurant_id: number;
  name: string;
  code: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  phone?: string;
  opening_time: string;
  closing_time: string;
  is_active: boolean;
  created_at: string;
}

export interface Restaurant {
  id: number;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  currency: string;
  tax_rate: number;
  branches: Branch[];
}

export interface Category {
  id: number;
  restaurant_id: number;
  name: string;
  description?: string;
  icon: string;
  display_order: number;
  is_active: boolean;
}

export interface Ingredient {
  id: number;
  restaurant_id: number;
  name: string;
  unit: string;
  current_stock: number;
  minimum_stock: number;
  maximum_stock: number;
  cost_per_unit: number;
  supplier_id?: number;
  expiry_date?: string;
}

export interface MenuItemIngredient {
  id: number;
  ingredient_id: number;
  quantity_required: number;
  unit: string;
  ingredient?: Ingredient;
}

export interface MenuItem {
  id: number;
  category_id: number;
  name: string;
  description?: string;
  price: number;
  cost_price: number;
  preparation_time_minutes: number;
  image_url?: string;
  is_available: boolean;
  is_vegetarian: boolean;
  calories?: number;
  category?: Category;
  recipes: MenuItemIngredient[];
}

export type OrderStatus = 'NEW' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'SERVED' | 'COMPLETED' | 'CANCELLED';

export interface OrderItem {
  id: number;
  order_id: number;
  menu_item_id: number;
  quantity: number;
  unit_price: number;
  subtotal: number;
  special_instructions?: string;
  status: string;
  menu_item?: MenuItem;
}

export interface Order {
  id: number;
  branch_id: number;
  customer_id?: number;
  table_id?: number;
  order_number: string;
  order_type: 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY';
  status: OrderStatus;
  subtotal: number;
  tax: number;
  discount: number;
  total_amount: number;
  notes?: string;
  created_at: string;
  items: OrderItem[];
  customer?: Customer;
  payment?: {
    id: number;
    payment_method: string;
    amount: number;
    status: string;
    transaction_id?: string;
  };
}

export interface Customer {
  id: number;
  restaurant_id: number;
  name: string;
  email?: string;
  phone?: string;
  total_spent: number;
  total_orders: number;
  last_visit_date?: string;
  loyalty_points: number;
  created_at: string;
  segment_name?: string;
}

export interface ReviewSentiment {
  id: number;
  sentiment_label: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  polarity_score: number;
  aspect_food?: number;
  aspect_service?: number;
  aspect_price?: number;
  aspect_ambience?: number;
  aspect_delivery?: number;
  keywords_json?: string;
}

export interface Review {
  id: number;
  branch_id: number;
  customer_id?: number;
  rating: number;
  comment: string;
  source: string;
  review_date: string;
  sentiment?: ReviewSentiment;
}

export interface WasteRecord {
  id: number;
  branch_id: number;
  menu_item_id?: number;
  ingredient_id?: number;
  waste_type: 'INGREDIENT' | 'PREPARED_DISH';
  quantity: number;
  unit: string;
  estimated_cost: number;
  reason: string;
  waste_date: string;
  notes?: string;
  menu_item?: MenuItem;
  ingredient?: Ingredient;
}

export interface InventoryHealthItem {
  id: number;
  name: string;
  unit: string;
  current_stock: number;
  minimum_stock: number;
  maximum_stock: number;
  cost_per_unit: number;
  status: 'HEALTHY' | 'LOW' | 'CRITICAL' | 'EXPIRED';
  days_until_expiry?: number;
  recommended_order_qty: number;
}

export interface Supplier {
  id: number;
  restaurant_id: number;
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  lead_time_days: number;
  rating: number;
}

export interface ForecastItemData {
  date: string;
  historical_actual?: number;
  predicted_demand: number;
  confidence_lower: number;
  confidence_upper: number;
}

export interface ForecastResponse {
  menu_item_id: number;
  menu_item_name: string;
  model_info: string;
  mae: number;
  rmse: number;
  predictions: ForecastItemData[];
}

export interface InventoryRecommendation {
  ingredient_id: number;
  ingredient_name: string;
  unit: string;
  current_stock: number;
  minimum_stock: number;
  safety_stock: number;
  predicted_usage: number;
  recommended_order_quantity: number;
  estimated_purchase_cost: number;
  supplier_name: string;
  lead_time_days: number;
  status: string;
  explanation: string;
}

export interface AnomalyRecord {
  id: number;
  branch_id: number;
  metric_name: string;
  anomaly_date: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  anomaly_score: number;
  expected_value?: number;
  actual_value?: number;
  explanation: string;
  is_resolved: boolean;
  created_at: string;
}

export interface AIInsight {
  id: number;
  branch_id?: number;
  category: string;
  title: string;
  insight_text: string;
  recommended_action?: string;
  impact_level: 'INFO' | 'WARNING' | 'ACTION_REQUIRED';
  created_at: string;
}

export interface Notification {
  id: number;
  user_id?: number;
  branch_id?: number;
  title: string;
  message: string;
  notification_type: string;
  is_read: boolean;
  created_at: string;
}

export interface DashboardOverview {
  total_revenue: number;
  total_orders: number;
  average_order_value: number;
  total_customers: number;
  total_food_waste_cost: number;
  revenue_growth_pct: number;
  orders_growth_pct: number;
  top_selling_items: Array<{
    id: number;
    name: string;
    price: number;
    sold_qty: number;
    gross_sales: number;
  }>;
  low_stock_items: Array<{
    id: number;
    name: string;
    current_stock: number;
    minimum_stock: number;
    unit: string;
  }>;
  revenue_trends: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
  recent_orders: Array<{
    id: number;
    order_number: string;
    order_type: string;
    status: OrderStatus;
    total_amount: number;
    table_number: string;
    time: string;
  }>;
  ai_insights: AIInsight[];
  active_anomalies_count: number;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  spiceLevel?: string;
  specialInstructions?: string;
}

export interface CustomerOrderPayload {
  branch_id: number;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  order_type: 'DELIVERY' | 'TAKEAWAY' | 'DINE_IN';
  delivery_address?: string;
  table_number?: string;
  items: Array<{
    menu_item_id: number;
    quantity: number;
    special_instructions?: string;
    spice_level?: string;
  }>;
  coupon_code?: string;
  notes?: string;
  payment_method: 'CARD' | 'CASH' | 'UPI' | 'ONLINE';
  idempotency_key?: string;
}

export interface OrderTimelineStep {
  key: string;
  label: string;
  timestamp?: string;
  status: 'COMPLETED' | 'CURRENT' | 'UPCOMING';
}

export interface OrderTrackingData {
  order: Order;
  timeline: OrderTimelineStep[];
  estimated_time_minutes: number;
  fulfillment_label: string;
  can_cancel: boolean;
}

export interface CartValidation {
  is_valid: boolean;
  subtotal: number;
  tax: number;
  delivery_fee: number;
  discount: number;
  total: number;
  coupon_applied?: string;
  coupon_message?: string;
  errors: string[];
}

