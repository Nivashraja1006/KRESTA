import os
from typing import List, Union
from pydantic import AnyHttpUrl, validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "RestaurantIQ"
    API_V1_STR: str = "/api/v1"
    VERSION: str = "1.0.0"
    
    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours for seamless demo & SaaS usage
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Database
    # Default to SQLite for zero-setup instant local run; in production / docker set:
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "sqlite:///./restaurantiq.db"
    )
    
    # CORS Origins
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:3000",
        "http://localhost:4173",
        "http://127.0.0.1:4173",
    ]
    
    # AI / LLM Configuration (Optional external provider key; offline grounded fallback is built-in)
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "grounded_analytics")  # "grounded_analytics" | "openai"
    
    # Demo Seed Mode
    AUTO_SEED: bool = os.getenv("AUTO_SEED", "True").lower() in ("true", "1", "yes")
    DEMO_USER_PASSWORD: str = os.getenv("DEMO_USER_PASSWORD", "")

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="allow"
    )


settings = Settings()
