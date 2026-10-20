import pytest
import secrets
from fastapi.testclient import TestClient
from app.main import app
from app.core.database import SessionLocal
from app.core.init_db import init_db
from app.core.security import get_password_hash
from app.core.seed import seed_database
from app.models import User

from app.core.config import settings

TEST_DEMO_PASSWORD = secrets.token_urlsafe(32)
settings.DEMO_USER_PASSWORD = TEST_DEMO_PASSWORD


@pytest.fixture(scope="session")
def client():
    # Ensure database is initialized and seeded
    db = SessionLocal()
    init_db(db)
    seed_database(db, force=False)
    db.close()
    with TestClient(app) as c:
        yield c


def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "HEALTHY"
    assert data["service"] == "RestaurantIQ"


def test_owner_login_and_me(client):
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"email": "owner@restaurantiq.com", "password": TEST_DEMO_PASSWORD}
    )
    assert login_resp.status_code == 200
    tokens = login_resp.json()
    assert "access_token" in tokens
    assert tokens["user"]["email"] == "owner@restaurantiq.com"

    token = tokens["access_token"]
    me_resp = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert me_resp.status_code == 200
    assert me_resp.json()["email"] == "owner@restaurantiq.com"


@pytest.mark.parametrize(
    ("email", "password", "role_name"),
    [
        ("owner@restaurantiq.com", TEST_DEMO_PASSWORD, "owner"),
        ("manager@restaurantiq.com", TEST_DEMO_PASSWORD, "manager"),
        ("chef@restaurantiq.com", TEST_DEMO_PASSWORD, "chef"),
        ("staff@restaurantiq.com", TEST_DEMO_PASSWORD, "staff"),
        ("admin@restaurantiq.com", TEST_DEMO_PASSWORD, "super_admin"),
    ],
)
def test_demo_role_credentials(client, email, password, role_name):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": email, "password": password},
    )

    assert response.status_code == 200
    assert response.json()["user"]["role"]["name"] == role_name


def test_login_email_is_case_insensitive(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "MANAGER@RESTAURANTIQ.COM", "password": TEST_DEMO_PASSWORD},
    )

    assert response.status_code == 200
    assert response.json()["user"]["email"] == "manager@restaurantiq.com"


def test_seed_repairs_password_for_existing_demo_user(client):
    db = SessionLocal()
    user = db.query(User).filter(User.email == "manager@restaurantiq.com").one()
    original_hash = user.hashed_password

    try:
        user.hashed_password = get_password_hash(TEST_DEMO_PASSWORD)
        db.commit()
        seed_database(db, force=False)

        response = client.post(
            "/api/v1/auth/login",
            json={"email": "manager@restaurantiq.com", "password": TEST_DEMO_PASSWORD},
        )
        assert response.status_code == 200
        assert response.json()["user"]["role"]["name"] == "manager"
    finally:
        user.hashed_password = original_hash
        db.commit()
        db.close()


@pytest.mark.parametrize("password", [secrets.token_urlsafe(32), secrets.token_urlsafe(32)])
def test_login_rejects_wrong_password_without_trimming_or_legacy_bypass(client, password):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "manager@restaurantiq.com", "password": password},
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect email or password"


def test_forgot_password_endpoint_still_responds(client):
    response = client.post(
        "/api/v1/auth/forgot-password",
        json={"email": "manager@restaurantiq.com"},
    )

    assert response.status_code == 200
    assert "password reset instructions" in response.json()["message"]


def test_rbac_unauthorized_access(client):
    # Staff cannot delete users or access admin routes
    staff_login = client.post(
        "/api/v1/auth/login",
        json={"email": "staff@restaurantiq.com", "password": TEST_DEMO_PASSWORD}
    )
    assert staff_login.status_code == 200
    staff_token = staff_login.json()["access_token"]

    # Try to delete user #1
    del_resp = client.delete(
        "/api/v1/users/1",
        headers={"Authorization": f"Bearer {staff_token}"}
    )
    assert del_resp.status_code == 403  # Forbidden by RBAC


def test_menu_and_categories(client):
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"email": "owner@restaurantiq.com", "password": TEST_DEMO_PASSWORD}
    )
    token = login_resp.json()["access_token"]

    cat_resp = client.get(
        "/api/v1/menu/categories",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert cat_resp.status_code == 200
    assert len(cat_resp.json()) >= 4

    menu_resp = client.get(
        "/api/v1/menu/items",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert menu_resp.status_code == 200
    items = menu_resp.json()
    assert len(items) >= 10


def test_kitchen_queue(client):
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"email": "chef@restaurantiq.com", "password": TEST_DEMO_PASSWORD}
    )
    token = login_resp.json()["access_token"]

    queue_resp = client.get(
        "/api/v1/kitchen/queue?branch_id=1",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert queue_resp.status_code == 200
    data = queue_resp.json()
    assert "new_orders" in data
    assert "preparing_orders" in data
    assert "workload_metrics" in data


def test_inventory_health_and_recommendations(client):
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"email": "manager@restaurantiq.com", "password": TEST_DEMO_PASSWORD}
    )
    token = login_resp.json()["access_token"]

    inv_resp = client.get(
        "/api/v1/inventory/health",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert inv_resp.status_code == 200
    assert len(inv_resp.json()) >= 5

    rec_resp = client.get(
        "/api/v1/recommendations/inventory?branch_id=1",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert rec_resp.status_code == 200
    recs = rec_resp.json()
    assert len(recs) >= 5
    assert "recommended_order_quantity" in recs[0]


def test_ai_demand_forecasting(client):
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"email": "owner@restaurantiq.com", "password": TEST_DEMO_PASSWORD}
    )
    token = login_resp.json()["access_token"]

    # Forecast for menu item #1 (Dum Biryani)
    fc_resp = client.get(
        "/api/v1/forecast/item/1?branch_id=1",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert fc_resp.status_code == 200
    fc = fc_resp.json()
    assert fc["menu_item_id"] == 1
    assert "predictions" in fc
    assert len(fc["predictions"]) == 7
    assert fc["predictions"][0]["predicted_demand"] >= 0


def test_ai_business_assistant(client):
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"email": "owner@restaurantiq.com", "password": TEST_DEMO_PASSWORD}
    )
    token = login_resp.json()["access_token"]

    queries = [
        "What are my best-selling dishes?",
        "What ingredients should I purchase?",
        "How is our food waste looking?",
        "What is tomorrow's predicted demand for Biryani?"
    ]

    for q in queries:
        resp = client.post(
            "/api/v1/ai/assistant",
            json={"question": q, "branch_id": 1},
            headers={"Authorization": f"Bearer {token}"}
        )
        assert resp.status_code == 200
        ans = resp.json()
        assert len(ans["answer"]) > 20
        assert ans["intent"] != ""


def test_public_menu_browsing(client):
    # Public customers should be able to view categories and items without an auth header
    cat_resp = client.get("/api/v1/menu/categories")
    assert cat_resp.status_code == 200
    categories = cat_resp.json()
    assert len(categories) >= 8

    # Check required categories exist
    category_names = [c["name"] for c in categories]
    for required in ["Starters", "Main Course", "Biryani", "Pizza", "Burgers", "Desserts", "Beverages"]:
        assert required in category_names

    item_resp = client.get("/api/v1/menu/items")
    assert item_resp.status_code == 200
    items = item_resp.json()
    assert len(items) >= 20


def test_customer_registration_and_login(client):
    import uuid
    unique_email = f"new_customer_{uuid.uuid4().hex[:6]}@example.com"
    # Registration
    reg_resp = client.post(
        "/api/v1/auth/customer/register",
        json={
            "full_name": "Test Customer",
            "email": unique_email,
            "password": TEST_DEMO_PASSWORD,
            "phone": "+1 (555) 019-2831"
        }
    )
    assert reg_resp.status_code == 200
    reg_data = reg_resp.json()
    assert "access_token" in reg_data
    assert reg_data["user"]["role"]["name"] == "customer"

    # Login
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"email": unique_email, "password": TEST_DEMO_PASSWORD}
    )
    assert login_resp.status_code == 200
    login_data = login_resp.json()
    assert login_data["user"]["role"]["name"] == "customer"


def test_customer_demo_account(client):
    resp = client.post(
        "/api/v1/auth/login",
        json={"email": "customer@restaurantiq.com", "password": TEST_DEMO_PASSWORD}
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["user"]["role"]["name"] == "customer"
    assert data["user"]["full_name"] == "Elena Rostova"


def test_customer_validate_cart(client):
    # Fetch menu items to find valid IDs
    item_resp = client.get("/api/v1/menu/items")
    assert item_resp.status_code == 200
    items = item_resp.json()
    assert len(items) >= 2
    item1 = items[0]
    item2 = items[1]

    # Validate cart with coupon
    cart_payload = {
        "items": [
            {"menu_item_id": item1["id"], "quantity": 2, "customization_notes": "Extra spicy"},
            {"menu_item_id": item2["id"], "quantity": 1}
        ],
        "coupon_code": "KRESTA10",
        "fulfillment_type": "DELIVERY"
    }
    val_resp = client.post("/api/v1/orders/customer/validate-cart", json=cart_payload)
    assert val_resp.status_code == 200
    val_data = val_resp.json()
    assert val_data["is_valid"] is True
    expected_subtotal = round(item1["price"] * 2 + item2["price"] * 1, 2)
    assert abs(val_data["subtotal"] - expected_subtotal) < 0.05
    assert val_data["discount"] > 0
    assert val_data["tax"] > 0
    assert val_data["total"] > 0


def test_customer_checkout_and_tracking(client):
    # Fetch available menu item
    item_resp = client.get("/api/v1/menu/items")
    item = item_resp.json()[0]

    order_payload = {
        "customer_name": "Alexander Hayes",
        "customer_email": "alex.hayes@example.com",
        "customer_phone": "+1 555-0144",
        "delivery_address": "742 Evergreen Terrace, Sector 4",
        "fulfillment_type": "DELIVERY",
        "order_notes": "Ring the bell upon arrival",
        "payment_method": "CARD",
        "coupon_code": "WELCOME50",
        "items": [
            {
                "menu_item_id": item["id"],
                "quantity": 2,
                "customization_notes": "Medium spice"
            }
        ]
    }

    # Place order
    checkout_resp = client.post("/api/v1/orders/customer/checkout", json=order_payload)
    assert checkout_resp.status_code == 200
    order_data = checkout_resp.json()
    assert "order_number" in order_data
    assert order_data["status"] == "NEW"
    assert len(order_data["items"]) == 1
    assert order_data["items"][0]["quantity"] == 2

    order_ref = order_data["order_number"]

    # Track order
    track_resp = client.get(f"/api/v1/orders/customer/track/{order_ref}")
    assert track_resp.status_code == 200
    track_data = track_resp.json()
    assert track_data["order"]["order_number"] == order_ref
    assert len(track_data["timeline"]) >= 4

    # My Orders list
    my_orders_resp = client.get(f"/api/v1/orders/customer/my-orders?email=alex.hayes@example.com")
    assert my_orders_resp.status_code == 200
    my_orders = my_orders_resp.json()
    assert len(my_orders) >= 1
    assert any(o["order_number"] == order_ref for o in my_orders)


def test_customer_cannot_access_staff_endpoints(client):
    # Customer login
    login_resp = client.post(
        "/api/v1/auth/login",
        json={"email": "customer@restaurantiq.com", "password": TEST_DEMO_PASSWORD}
    )
    assert login_resp.status_code == 200
    cust_token = login_resp.json()["access_token"]
    cust_headers = {"Authorization": f"Bearer {cust_token}"}

    # Attempt to access kitchen queue
    k_resp = client.get("/api/v1/kitchen/queue?branch_id=1", headers=cust_headers)
    assert k_resp.status_code == 403

    # Attempt to access user management
    u_resp = client.get("/api/v1/users", headers=cust_headers)
    assert u_resp.status_code == 403
