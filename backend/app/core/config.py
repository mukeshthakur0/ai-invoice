import os
from typing import Optional

# Get DATABASE_URL from environment, with fallback to local SQLite for development
DATABASE_URL: str = os.getenv(
    "DATABASE_URL",
    "sqlite:///./student_platform.db"  # Local dev fallback
)


if DATABASE_URL.startswith("postgresql://"):
    # For compatibility with older PostgreSQL URI format
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg2://", 1)
elif DATABASE_URL.startswith("postgres://"):
   
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+psycopg2://", 1)


SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM: str = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES: int = 30


CORS_ORIGINS: list = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5173,http://localhost:3000"
).split(",")


ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"