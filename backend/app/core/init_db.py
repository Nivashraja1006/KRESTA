import logging
from sqlalchemy.orm import Session
from backend.app.core.database import Base, engine
from backend.app.models import Role, Permission, User
from backend.app.core.security import get_password_hash

logger = logging.getLogger(__name__)


def init_db(db: Session) -> None:
    """Create all tables and seed default roles and permissions if not present."""
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables verified/created successfully.")

    # 1. Seed Roles
    default_roles = [
        {"name": "super_admin", "description": "Platform Super Administrator"},
        {"name": "owner", "description": "Restaurant Owner with full administrative control"},
        {"name": "manager", "description": "Branch Operations & Floor Manager"},
        {"name": "chef", "description": "Kitchen Executive & Inventory Specialist"},
        {"name": "staff", "description": "Front-of-house Service & Cashier Staff"},
    ]

    for role_data in default_roles:
        role = db.query(Role).filter(Role.name == role_data["name"]).first()
        if not role:
            role = Role(**role_data)
            db.add(role)
    db.commit()
    logger.info("Default roles ensured.")
