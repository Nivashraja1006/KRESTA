import random
import uuid
import sys
import os
from datetime import datetime, timedelta, timezone

sys.path.insert(0, os.path.abspath("."))

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import SessionLocal
from app.core.security import get_password_hash, verify_password
from app.models import (
    Role, User, Restaurant, Branch, RestaurantTable, Category,
    Ingredient, MenuItem, MenuItemIngredient, Supplier, Customer,
    Order, OrderItem, Payment, Review, ReviewSentiment, WasteRecord,
    AIInsight, Notification
)
from app.ml.sentiment import sentiment_analyzer
from app.ml.segmentation import customer_segmenter
from app.ml.anomaly import anomaly_detector


DEMO_USERS = [
    ('admin@restaurantiq.com', 'Alexander Vance', 'super_admin', True),
    ('owner@restaurantiq.com', 'Chef Marco Rossi', 'owner', False),
    ('manager@restaurantiq.com', 'Sarah Jenkins', 'manager', False),
    ('chef@restaurantiq.com', 'Gordon Laurent', 'chef', False),
    ('staff@restaurantiq.com', 'David Kim', 'staff', False),
    ('customer@restaurantiq.com', 'Elena Rostova', 'customer', False),
]


def _default_menu_image_url(name: str, category_name: str) -> str:
    dish_name = name.lower()
    category = category_name.lower()
    if any(word in dish_name for word in ("chai", "tea", "coffee", "latte", "lassi")):
        image_category = "beverages"
    elif any(word in dish_name for word in ("dessert", "sweet", "gulab", "jamun")):
        image_category = "desserts"
    elif any(word in dish_name for word in ("naan", "roti", "bread")):
        image_category = "breads"
    elif any(word in dish_name for word in ("biryani", "curry", "rogan josh")):
        image_category = "mains"
    elif any(word in dish_name for word in ("starter", "appetizer", "bites", "skewer")):
        image_category = "starters"
    elif any(word in category for word in ("beverage", "drink")):
        image_category = "beverages"
    elif any(word in category for word in ("dessert", "sweet")):
        image_category = "desserts"
    elif "bread" in category:
        image_category = "breads"
    elif any(word in category for word in ("starter", "appetizer")):
        image_category = "starters"
    else:
        image_category = "mains"

    return f"/static/menu-fallbacks/{image_category}.svg"


def _ensure_demo_users(db: Session, restaurant_id: int | None, branch_id: int | None) -> None:
    if not settings.DEMO_USER_PASSWORD:
        print("Skipping demo-user seeding because DEMO_USER_PASSWORD is not configured.")
        return

    role_descriptions = {
        "super_admin": "Platform Super Administrator",
        "owner": "Restaurant Owner with full administrative control",
        "manager": "Branch Operations & Floor Manager",
        "chef": "Kitchen Executive & Inventory Specialist",
        "staff": "Front-of-house Service & Cashier Staff",
        "customer": "Registered Restaurant Customer & Loyalty Patron",
    }
    roles = {}
    for name, description in role_descriptions.items():
        role = db.query(Role).filter(Role.name == name).first()
        if not role:
            role = Role(name=name, description=description)
            db.add(role)
            db.flush()
        roles[name] = role

    for email, full_name, role_name, is_superuser in DEMO_USERS:
        user = db.query(User).filter(func.lower(User.email) == email).first()
        if not user:
            user = User(email=email)
            db.add(user)

        user.email = email
        user.full_name = full_name
        user.role_id = roles[role_name].id
        user.restaurant_id = None if is_superuser else restaurant_id
        user.branch_id = None if is_superuser else branch_id
        user.is_active = True
        user.is_superuser = is_superuser
        if not user.hashed_password or not verify_password(settings.DEMO_USER_PASSWORD, user.hashed_password):
            user.hashed_password = get_password_hash(settings.DEMO_USER_PASSWORD)

    db.flush()


def seed_database(db: Session = None, force: bool = False) -> None:
    """Generate deterministic, realistic development seed data (1,000+ orders, recipes, inventory)."""
    close_at_end = False
    if db is None:
        db = SessionLocal()
        close_at_end = True

    try:
        # Check if already seeded
        existing_restaurant = db.query(Restaurant).first()
        if existing_restaurant and not force:
            existing_branch = (
                db.query(Branch)
                .filter(Branch.restaurant_id == existing_restaurant.id)
                .first()
            )
            _ensure_demo_users(
                db,
                existing_restaurant.id,
                existing_branch.id if existing_branch else None,
            )
            db.commit()
            print("Database already contains data. Skipping seed.")
            return

        print("Starting comprehensive RestaurantIQ database seeding...")
        random.seed(42)

        # 2. Demo Restaurant & Branches
        restaurant = Restaurant(
            name="The Royal Saffron Gourmet",
            description="Award-winning contemporary dining & culinary intelligence showcase.",
            address="450 Grand Avenue, Suite 100",
            phone="+1 (555) 839-2041",
            email="contact@royalsaffron.com",
            currency="$",
            tax_rate=8.5
        )
        db.add(restaurant)
        db.flush()

        branches = [
            Branch(
                restaurant_id=restaurant.id,
                name="Downtown Flagship",
                code="BR-DOWNTOWN",
                address="450 Grand Avenue",
                city="San Francisco",
                state="CA",
                postal_code="94102",
                phone="+1 (555) 839-2041",
                opening_time="10:00",
                closing_time="23:30",
                is_active=True
            ),
            Branch(
                restaurant_id=restaurant.id,
                name="Uptown Bistro",
                code="BR-UPTOWN",
                address="1200 Pacific Heights Blvd",
                city="San Francisco",
                state="CA",
                postal_code="94115",
                phone="+1 (555) 912-3849",
                opening_time="11:00",
                closing_time="22:30",
                is_active=True
            ),
            Branch(
                restaurant_id=restaurant.id,
                name="Airport Express",
                code="BR-AIRPORT",
                address="Terminal 2 Concourse C",
                city="San Francisco",
                state="CA",
                postal_code="94128",
                phone="+1 (555) 743-1120",
                opening_time="06:00",
                closing_time="23:00",
                is_active=True
            )
        ]
        db.add_all(branches)
        db.flush()

        # Create Tables for Downtown Flagship
        for i in range(1, 16):
            tbl = RestaurantTable(
                branch_id=branches[0].id,
                table_number=f"T-{i:02d}",
                capacity=2 if i <= 4 else (4 if i <= 12 else 8),
                status="AVAILABLE"
            )
            db.add(tbl)
        db.flush()

        # 3. Create or repair users for all demo roles
        _ensure_demo_users(db, restaurant.id, branches[0].id)

        # 4. Suppliers
        suppliers = [
            Supplier(restaurant_id=restaurant.id, name="Golden Grain Mills", contact_person="Arthur Pendelton", email="orders@goldengrain.com", phone="555-101-2001", lead_time_days=2, rating=4.8),
            Supplier(restaurant_id=restaurant.id, name="Fresh Valley Produce", contact_person="Elena Ramos", email="sales@freshvalley.com", phone="555-102-3002", lead_time_days=1, rating=4.9),
            Supplier(restaurant_id=restaurant.id, name="Highland Meat & Poultry", contact_person="Robert Burns", email="deliveries@highlandmeat.com", phone="555-103-4003", lead_time_days=2, rating=4.7),
            Supplier(restaurant_id=restaurant.id, name="Spice Coast Imports", contact_person="Rajesh Pillai", email="info@spicecoast.com", phone="555-104-5004", lead_time_days=4, rating=4.6),
            Supplier(restaurant_id=restaurant.id, name="Artisan Dairy Collective", contact_person="Marie Dupont", email="dispatch@artisandairy.com", phone="555-105-6005", lead_time_days=1, rating=4.9),
        ]
        db.add_all(suppliers)
        db.flush()

        # 5. Raw Ingredients
        now_dt = datetime.now(timezone.utc)
        ingredients_data = [
            ("Basmati Rice (Aged)", "kg", 85.0, 30.0, 200.0, 3.20, suppliers[0].id, now_dt + timedelta(days=120)),
            ("Chicken Breast (Boneless)", "kg", 42.0, 25.0, 100.0, 7.50, suppliers[2].id, now_dt + timedelta(days=5)),
            ("Paneer (Fresh Cottage Cheese)", "kg", 18.0, 15.0, 60.0, 6.80, suppliers[4].id, now_dt + timedelta(days=6)),
            ("Fresh Cream (Heavy 36%)", "liters", 8.0, 12.0, 40.0, 4.20, suppliers[4].id, now_dt + timedelta(days=8)),  # Low stock
            ("Yellow Onions", "kg", 60.0, 20.0, 120.0, 1.40, suppliers[1].id, now_dt + timedelta(days=30)),
            ("Vine-Ripened Tomatoes", "kg", 35.0, 20.0, 80.0, 2.10, suppliers[1].id, now_dt + timedelta(days=10)),
            ("Saffron Threads (Super Negin)", "g", 45.0, 20.0, 100.0, 8.50, suppliers[3].id, now_dt + timedelta(days=365)),
            ("Garam Masala Blend", "kg", 12.0, 5.0, 30.0, 14.00, suppliers[3].id, now_dt + timedelta(days=180)),
            ("Garlic & Ginger Puree", "kg", 14.0, 10.0, 40.0, 4.50, suppliers[1].id, now_dt + timedelta(days=20)),
            ("Tiger Prawns (Jumbo)", "kg", 15.0, 12.0, 50.0, 18.50, suppliers[2].id, now_dt + timedelta(days=4)),
            ("Baby Spinach Leaves", "kg", 6.0, 10.0, 30.0, 3.80, suppliers[1].id, now_dt + timedelta(days=4)),  # Low stock
            ("Clarified Butter (Ghee)", "kg", 25.0, 15.0, 60.0, 9.20, suppliers[4].id, now_dt + timedelta(days=90)),
            ("Natural Yogurt (Curd)", "kg", 20.0, 15.0, 50.0, 2.80, suppliers[4].id, now_dt + timedelta(days=10)),
            ("Alfonso Mango Pulp", "liters", 24.0, 10.0, 50.0, 5.00, suppliers[3].id, now_dt + timedelta(days=90)),
            ("Cardamom & Cinnamon Pods", "kg", 4.0, 3.0, 15.0, 22.00, suppliers[3].id, now_dt + timedelta(days=240)),
        ]

        ingredients = []
        for name, unit, curr, min_s, max_s, cost, sup_id, exp in ingredients_data:
            ing = Ingredient(
                restaurant_id=restaurant.id,
                name=name,
                unit=unit,
                current_stock=curr,
                minimum_stock=min_s,
                maximum_stock=max_s,
                cost_per_unit=cost,
                supplier_id=sup_id,
                expiry_date=exp
            )
            ingredients.append(ing)
        db.add_all(ingredients)
        db.flush()

        # 6. Categories
        categories = [
            Category(restaurant_id=restaurant.id, name="Starters", description="Small plates and crisp appetizers", icon="Soup", display_order=1),
            Category(restaurant_id=restaurant.id, name="Main Course", description="Rich gravies and traditional braises", icon="Utensils", display_order=2),
            Category(restaurant_id=restaurant.id, name="Biryani", description="Slow-cooked dum basmati delicacies", icon="Flame", display_order=3),
            Category(restaurant_id=restaurant.id, name="Pizza", description="Handcrafted wood-fired artisan pizzas", icon="Pizza", display_order=4),
            Category(restaurant_id=restaurant.id, name="Burgers", description="Gourmet brioche burgers and artisan sliders", icon="Sandwich", display_order=5),
            Category(restaurant_id=restaurant.id, name="Artisan Breads", description="Clay oven tandoor flatbreads", icon="Croissant", display_order=6),
            Category(restaurant_id=restaurant.id, name="Desserts", description="Sweet confections & royal delicacies", icon="Cake", display_order=7),
            Category(restaurant_id=restaurant.id, name="Beverages", description="Handcrafted coolers, artisan lassis, and cold brews", icon="GlassWater", display_order=8),
        ]
        db.add_all(categories)
        db.flush()
        category_names = {category.id: category.name for category in categories}

        # 7. Menu Items & Recipes Mapping
        menu_items_data = [
            # Biryanis
            ("Royal Dum Dum Chicken Biryani", categories[1].id, "Fragrant long-grain basmati layered with tender spiced chicken, caramelized onions, and Kashmiri saffron.", 24.95, 7.20, 25, True, False, 750, [
                (ingredients[0].id, 0.25, "kg"),  # 250g rice
                (ingredients[1].id, 0.28, "kg"),  # 280g chicken
                (ingredients[4].id, 0.12, "kg"),  # onions
                (ingredients[6].id, 0.5, "g"),    # saffron
                (ingredients[11].id, 0.04, "kg"), # ghee
            ]),
            ("Shahi Paneer Tikka Biryani", categories[1].id, "Charcoal-roasted cottage cheese cubes infused with aromatic whole spices and saffron dum rice.", 21.95, 6.10, 20, True, True, 680, [
                (ingredients[0].id, 0.25, "kg"),
                (ingredients[2].id, 0.22, "kg"),
                (ingredients[4].id, 0.10, "kg"),
                (ingredients[6].id, 0.4, "g"),
                (ingredients[11].id, 0.04, "kg"),
            ]),
            ("Seafood Tiger Prawn Biryani", categories[1].id, "Succulent jumbo prawns sautéed in coastal spices layered with fragrant cardamom basmati.", 28.95, 10.50, 22, True, False, 620, [
                (ingredients[0].id, 0.25, "kg"),
                (ingredients[9].id, 0.22, "kg"),
                (ingredients[6].id, 0.4, "g"),
            ]),
            # Curries
            ("Velvet Butter Chicken", categories[2].id, "Tender roasted chicken simmered in a silky tomato, cashew cream, and fenugreek reduction.", 22.95, 6.80, 18, True, False, 710, [
                (ingredients[1].id, 0.25, "kg"),
                (ingredients[3].id, 0.08, "liters"),
                (ingredients[5].id, 0.20, "kg"),
                (ingredients[11].id, 0.03, "kg"),
            ]),
            ("Palak Paneer Supreme", categories[2].id, "Pureed baby spinach tempered with garlic, roasted cumin, and velvety cubes of dairy paneer.", 19.95, 5.20, 15, True, True, 520, [
                (ingredients[2].id, 0.20, "kg"),
                (ingredients[10].id, 0.18, "kg"),
                (ingredients[8].id, 0.03, "kg"),
                (ingredients[3].id, 0.04, "liters"),
            ]),
            ("Kashmiri Rogan Josh", categories[2].id, "Slow-braised tender meat with ratan jot, crushed fennel, and rich Kashmiri chili jus.", 25.95, 8.90, 25, True, False, 690, [
                (ingredients[4].id, 0.15, "kg"),
                (ingredients[7].id, 0.02, "kg"),
                (ingredients[12].id, 0.10, "kg"),
            ]),
            # Starters
            ("Crispy Saffron Paneer Bites", categories[0].id, "Crisp batter-fried spiced paneer cubes served with mint-coriander emulsion.", 14.95, 3.80, 12, True, True, 440, [
                (ingredients[2].id, 0.15, "kg"),
                (ingredients[12].id, 0.05, "kg"),
            ]),
            ("Tandoori Chicken Skewers", categories[0].id, "Smoky roasted chicken skewers marinated in hung curd, Kashmiri chili, and garam masala.", 16.95, 4.90, 16, True, False, 490, [
                (ingredients[1].id, 0.22, "kg"),
                (ingredients[12].id, 0.06, "kg"),
                (ingredients[7].id, 0.015, "kg"),
            ]),
            ("Golden Garlic Jumbo Prawns", categories[0].id, "Pan-seared jumbo tiger prawns in roasted garlic butter and fresh cilantro.", 19.95, 8.10, 14, True, False, 380, [
                (ingredients[9].id, 0.20, "kg"),
                (ingredients[11].id, 0.03, "kg"),
            ]),
            # Breads
            ("Garlic & Cilantro Butter Naan", categories[3].id, "Clay-tandoor leavened flatbread brushed with garlic butter and fresh herbs.", 5.95, 0.90, 6, True, True, 260, []),
            ("Artisan Truffle Naan", categories[3].id, "Hand-stretched naan infused with black truffle oil and sea salt flakes.", 8.95, 1.80, 8, True, True, 290, []),
            ("Tandoori Roti", categories[3].id, "Whole wheat traditional hearth bread baked over blazing charcoal.", 4.50, 0.60, 5, True, True, 180, []),
            # Desserts & Drinks
            ("Kesar Mango Lassi", categories[4].id, "Chilled whipped yogurt blended with luscious Alfonso mango pulp and green cardamom.", 7.95, 1.60, 4, True, True, 280, [
                (ingredients[12].id, 0.15, "kg"),
                (ingredients[13].id, 0.10, "liters"),
            ]),
            ("Saffron Scented Gulab Jamun", categories[4].id, "Warm milk solid dumplings soaked in rose and saffron infused floral syrup.", 9.95, 2.20, 6, True, True, 340, [
                (ingredients[6].id, 0.1, "g"),
            ]),
            ("Masala Chai Latte", categories[4].id, "Slow-brewed Assam tea infused with fresh ginger, crushed cinnamon, and steamed milk.", 5.50, 0.80, 5, True, True, 140, [])
        ]

        created_menu_items = []
        for name, cat_id, desc, pr, c_pr, prep, avail, veg, cals, recipes in menu_items_data:
            mi = MenuItem(
                category_id=cat_id,
                name=name,
                description=desc,
                price=pr,
                cost_price=c_pr,
                preparation_time_minutes=prep,
                image_url=_default_menu_image_url(name, category_names[cat_id]),
                is_available=avail,
                is_vegetarian=veg,
                calories=cals
            )
            db.add(mi)
            db.flush()
            created_menu_items.append(mi)

            for ing_id, req_qty, u in recipes:
                rec = MenuItemIngredient(
                    menu_item_id=mi.id,
                    ingredient_id=ing_id,
                    quantity_required=req_qty,
                    unit=u
                )
                db.add(rec)
        db.flush()

        # 8. Customer Profiles (60 realistic customers)
        first_names = ["James", "Emma", "Liam", "Olivia", "Noah", "Ava", "William", "Sophia", "Mason", "Isabella", "Ethan", "Mia", "Aarav", "Priya", "Rohan", "Ananya", "Vikram", "Sneha", "Kunal", "Meera", "Carlos", "Fatima", "Chen", "Chloe"]
        last_names = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Patel", "Sharma", "Gupta", "Singh", "Shah", "Rodriguez", "Hernandez", "Wang", "Zhang", "Lee", "Kim"]

        customers = []
        for i in range(50):
            fn = random.choice(first_names)
            ln = random.choice(last_names)
            c = Customer(
                restaurant_id=restaurant.id,
                name=f"{fn} {ln}",
                email=f"{fn.lower()}.{ln.lower()}{i+1}@example.com",
                phone=f"+1 555-0{random.randint(10,99)}-{random.randint(1000,9999)}",
                total_spent=0.0,
                total_orders=0,
                last_visit_date=now_dt - timedelta(days=random.randint(1, 45)),
                loyalty_points=0
            )
            customers.append(c)
        db.add_all(customers)
        db.flush()

        # 9. Realistic Historical Orders (1,200 orders across past 90 days for robust ML training)
        print("Generating 1,200+ historical orders with realistic day-of-week seasonality...")
        order_types = ["DINE_IN", "DINE_IN", "TAKEAWAY", "DELIVERY"]
        start_date = now_dt - timedelta(days=90)
        
        total_seeded_orders = 0
        order_seq = 10000
        current_date = start_date

        while current_date <= now_dt:
            dow = current_date.weekday()
            # Weekend surge: Friday (4), Saturday (5), Sunday (6) have 1.5x - 2x orders
            if dow in [4, 5]:
                daily_order_count = random.randint(18, 26)
            elif dow == 6:
                daily_order_count = random.randint(14, 20)
            else:
                daily_order_count = random.randint(8, 14)

            for ord_idx in range(daily_order_count):
                # Pick customer (70% repeat customer, 30% guest/walk-in)
                cust = random.choice(customers) if random.random() < 0.75 else None
                br = random.choice(branches[:2])  # mostly downtown and uptown

                # Randomize hour between 11:30 and 22:30
                order_hour = random.choice([12, 13, 13, 14, 18, 19, 19, 20, 20, 21])
                order_minute = random.randint(0, 59)
                order_timestamp = current_date.replace(hour=order_hour, minute=order_minute, second=0)

                order_seq += 1
                order_num = f"ORD-{order_timestamp.strftime('%m%d')}-{order_seq}"
                o_type = random.choice(order_types)

                order = Order(
                    branch_id=br.id,
                    customer_id=cust.id if cust else None,
                    table_id=random.randint(1, 15) if o_type == "DINE_IN" else None,
                    order_number=order_num,
                    order_type=o_type,
                    status="COMPLETED",
                    subtotal=0.0,
                    tax=0.0,
                    discount=round(random.choice([0.0, 0.0, 0.0, 5.0, 10.0]), 2),
                    total_amount=0.0,
                    created_at=order_timestamp,
                    completed_at=order_timestamp + timedelta(minutes=random.randint(25, 60))
                )
                db.add(order)
                db.flush()

                # Add 2 to 5 random items to order
                chosen_items = random.sample(created_menu_items, k=random.randint(2, 4))
                subtot = 0.0
                for item in chosen_items:
                    qty = random.choices([1, 2, 3], weights=[0.7, 0.25, 0.05])[0]
                    line_tot = round(item.price * qty, 2)
                    subtot += line_tot

                    oi = OrderItem(
                        order_id=order.id,
                        menu_item_id=item.id,
                        quantity=qty,
                        unit_price=item.price,
                        subtotal=line_tot,
                        status="SERVED"
                    )
                    db.add(oi)

                tax_val = round(subtot * 0.085, 2)
                tot = max(0.0, round(subtot + tax_val - order.discount, 2))
                order.subtotal = round(subtot, 2)
                order.tax = tax_val
                order.total_amount = tot

                # Payment record
                payment = Payment(
                    order_id=order.id,
                    payment_method=random.choice(["CARD", "CARD", "UPI", "CASH"]),
                    amount=tot,
                    status="COMPLETED",
                    transaction_id=f"TXN-{uuid.uuid4().hex[:8].upper()}",
                    created_at=order_timestamp
                )
                db.add(payment)

                # Update customer spend
                if cust:
                    cust.total_spent = round(cust.total_spent + tot, 2)
                    cust.total_orders += 1
                    cust.last_visit_date = max(cust.last_visit_date, order_timestamp)
                    cust.loyalty_points += int(tot)

                total_seeded_orders += 1

            current_date += timedelta(days=1)

        print(f"Created {total_seeded_orders} historical orders across 90 operating days.")

        # 10. Reviews & Sentiments
        print("Seeding customer reviews and NLP sentiment scoring...")
        sample_reviews = [
            (5, "The Royal Dum Biryani is hands down the best in the city. Saffron flavor is subtle and wonderful! Staff was very attentive.", "Google"),
            (5, "Exquisite dining experience. The garlic butter naan was piping hot and the butter chicken was rich without being greasy.", "Yelp"),
            (4, "Great food and vibrant atmosphere. Slight delay on the starter but the waiter kept us updated politely.", "Google"),
            (2, "Food was delicious but the service was remarkably slow. Waited 40 minutes for our main curry.", "Zomato"),
            (5, "Loved the ambience and the Kesar Mango Lassi is to die for. Perfect spot for family dinners.", "Google"),
            (3, "Decent food but a bit overpriced for the portions. Clean interior and polite staff.", "TripAdvisor"),
            (1, "Very disappointed. Rice was cold and the biryani meat was undercooked. Manager refunded the bill.", "Yelp"),
            (5, "Top notch service and amazing food quality. The seafood prawn biryani was fresh and flavorful!", "In-House"),
            (4, "Crispy saffron paneer is an absolute must-try! Prompt delivery for takeaway too.", "Google"),
            (2, "Delivery order was cold on arrival and the curry had spilled inside the bag. Please improve packaging.", "Zomato")
        ]

        for i in range(25):
            rating, text, src = random.choice(sample_reviews)
            rev_date = now_dt - timedelta(days=random.randint(1, 60))
            cust = random.choice(customers)

            rev = Review(
                branch_id=branches[0].id,
                customer_id=cust.id,
                rating=rating,
                comment=text,
                source=src,
                review_date=rev_date
            )
            db.add(rev)
            db.flush()

            nlp_res = sentiment_analyzer.analyze(text, rating)
            sent = ReviewSentiment(
                review_id=rev.id,
                sentiment_label=nlp_res["sentiment_label"],
                polarity_score=nlp_res["polarity_score"],
                aspect_food=nlp_res["aspect_food"],
                aspect_service=nlp_res["aspect_service"],
                aspect_price=nlp_res["aspect_price"],
                aspect_ambience=nlp_res["aspect_ambience"],
                aspect_delivery=nlp_res["aspect_delivery"],
                keywords_json=nlp_res["keywords_json"]
            )
            db.add(sent)

        # 11. Food Waste Records
        print("Seeding food waste logs...")
        waste_reasons = ["OVER_PREPARATION", "SPOILAGE", "PLATE_WASTE", "OVERCOOKED", "EXPIRED"]
        for i in range(35):
            w_date = now_dt - timedelta(days=random.randint(1, 45))
            m_item = random.choice(created_menu_items[:6])
            qty = round(random.uniform(1.0, 5.5), 1)
            cost = round(qty * m_item.cost_price, 2)
            wr = WasteRecord(
                branch_id=branches[0].id,
                menu_item_id=m_item.id,
                waste_type="PREPARED_DISH",
                quantity=qty,
                unit="portions",
                estimated_cost=cost,
                reason=random.choice(waste_reasons),
                waste_date=w_date,
                notes="Recorded during end-of-shift kitchen audit."
            )
            db.add(wr)

        # 12. Notifications & Initial AI Insights
        db.add_all([
            Notification(
                branch_id=branches[0].id,
                title="Low Stock Alert: Fresh Cream",
                message="Fresh Cream inventory has dipped to 8.0 Liters (threshold: 12.0 L).",
                notification_type="LOW_INVENTORY",
                is_read=False
            ),
            Notification(
                branch_id=branches[0].id,
                title="Weekend Demand Spike Projected",
                message="AI Demand Forecaster projects a 18% surge in Dum Biryani orders for Friday dinner.",
                notification_type="DEMAND_SPIKE",
                is_read=False
            ),
            AIInsight(
                branch_id=branches[0].id,
                category="DEMAND",
                title="Weekend Dum Biryani Volume Spike",
                insight_text="Demand for Royal Dum Biryani is forecasted at 142 portions tomorrow (+14% above weekly baseline).",
                recommended_action="Pre-marinate 40kg chicken breast and prepare aged basmati batches before 16:00.",
                impact_level="ACTION_REQUIRED"
            ),
            AIInsight(
                branch_id=branches[0].id,
                category="WASTE",
                title="Excess Monday Plate Waste Identified",
                insight_text="Plate waste for Palak Paneer showed an atypical 22% spike on Monday evenings.",
                recommended_action="Consider offering a lighter lunch-portion variant during weekday evenings.",
                impact_level="WARNING"
            ),
            AIInsight(
                branch_id=branches[0].id,
                category="INVENTORY",
                title="Procurement Reorder Recommended",
                insight_text="Fresh Cream and Baby Spinach are currently under safety buffer targets.",
                recommended_action="Authorize replenishment order with Artisan Dairy Collective and Fresh Valley.",
                impact_level="ACTION_REQUIRED"
            )
        ])

        db.commit()
        print("Database commit successful.")

        # 13. Run Initial ML Pipelines (KMeans Customer Segmentation & Isolation Forest Anomaly Scan)
        print("Running initial ML segmentation & anomaly detection algorithms...")
        customer_segmenter.run_segmentation(db, restaurant.id)
        anomaly_detector.scan_branch_anomalies(db, branches[0].id)

        print("RestaurantIQ database successfully initialized and seeded with enterprise dataset!")

    except Exception as e:
        db.rollback()
        print(f"Error during seeding: {e}")
        raise e
    finally:
        if close_at_end:
            db.close()


if __name__ == "__main__":
    seed_database(force=True)
