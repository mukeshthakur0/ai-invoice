from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from app.api.auth_routes import router as auth_router
from app.api.dashboard_routes import router as dashboard_router
from app.api.document_routes import router as document_router
from app.api.quiz_routes import router as quiz_router
from app.api.flashcard_routes import router as flashcard_router
from app.api.summary_routes import router as summary_router
from app.api.chat_routes import router as chat_router
from app.api.resource_routes import router as resource_router
from app.api.health_routes import router as health_router

from app.core.database import Base, engine
from app.core.config import CORS_ORIGINS
from fastapi.staticfiles import StaticFiles

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Student AI Platform",
    version="1.0.0",
    description="AI-powered learning platform with quiz generation, flashcards, and more"
)

# Mount uploads directory
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Configure CORS
origins = CORS_ORIGINS if isinstance(CORS_ORIGINS, list) else CORS_ORIGINS.split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
import os
from dotenv import load_dotenv

load_dotenv()


import sys


# Include routers
app.include_router(health_router, prefix="/api/health", tags=["health"])
app.include_router(auth_router)
app.include_router(dashboard_router, prefix="/api/dashboard",tags=["dashboard"])
app.include_router(document_router, prefix="/api/notes",tags=["notes"])
app.include_router(quiz_router, prefix="/api/quizzes",tags=["quizzes"])
app.include_router(flashcard_router, prefix="/api/flashcards",tags=["flashcards"])
app.include_router(summary_router, prefix="/api/summary",tags=["summary"])
app.include_router(resource_router, prefix="/api/resources",tags=["resources"])
app.include_router(
    chat_router,
    prefix="/api/chat",
)



@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Student AI Platform API",
        "version": "1.0.0",
        "docs": "/docs"
    }


