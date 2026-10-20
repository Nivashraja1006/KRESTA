from app.schemas.common import MessageResponse, PaginatedResponse
from app.schemas.user import (
    UserCreate, UserUpdate, UserResponse, RoleResponse, LoginRequest, Token, TokenPayload,
    PasswordResetRequest, AuditLogResponse
)
from app.schemas.restaurant import (
    RestaurantCreate, RestaurantResponse, BranchCreate, BranchResponse,
    RestaurantTableCreate, RestaurantTableResponse
)
from app.schemas.menu import (
    CategoryCreate, CategoryResponse, IngredientCreate, IngredientResponse,
    MenuItemCreate, MenuItemUpdate, MenuItemResponse, RecipeItemSchema
)
from app.schemas.inventory import (
    SupplierCreate, SupplierResponse, InventoryTransactionCreate, InventoryTransactionResponse,
    PurchaseOrderCreate, PurchaseOrderUpdate, PurchaseOrderResponse, PurchaseOrderItemSchema, InventoryHealthItem
)
from app.schemas.order import (
    CustomerCreate, CustomerResponse, OrderCreate, OrderStatusUpdate, OrderResponse,
    OrderItemCreate, OrderItemResponse, PaymentCreate, PaymentResponse
)
from app.schemas.feedback_waste import (
    ReviewCreate, ReviewResponse, ReviewSentimentResponse, WasteRecordCreate, WasteRecordResponse
)
from app.schemas.analytics_ai import (
    DemandPredictionResponse, ForecastItemData, ForecastResponse, CustomerSegmentResponse,
    AnomalyResponse, AIInsightResponse, NotificationResponse, AIAssistantRequest, AIAssistantResponse,
    DashboardOverviewResponse
)
