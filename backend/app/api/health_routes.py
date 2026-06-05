from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.database import get_db, check_db_connection

router = APIRouter(tags=["health"])


@router.get("/health")
async def health_check():
    """
    Health check endpoint for deployment monitoring
    """
    return {
        "status": "ok",
        "service": "Student AI Platform API",
        "version": "1.0.0"
    }


@router.get("/health/db")
async def health_check_db(db: Session = Depends(get_db)):
    """
    Database health check endpoint
    Verifies database connection is working
    """
    try:
        # Test database connection
        db.execute(text("SELECT 1"))
        return {
            "status": "healthy",
            "database": "connected"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e)
        }


@router.get("/health/ready")
async def readiness_check(db: Session = Depends(get_db)):
    """
    Readiness check for Kubernetes/container orchestration
    """
    try:
        db.execute("SELECT 1")
        return {
            "ready": True,
            "service": "Student AI Platform API"
        }
    except Exception:
        return {
            "ready": False,
            "service": "Student AI Platform API"
        }
