"""
schemas/dashboard.py
"""
from pydantic import BaseModel
from typing import List
from app.schema.document import DocumentResponse
from app.schema.chat import ChatMessageResponse


class DashboardStats(BaseModel):
    notes: int
    quizzes: int
    flashcards: int
    study_hours: float


class DashboardOverview(BaseModel):
    stats: DashboardStats
    recentNotes: List[DocumentResponse]
    recentChats: List[ChatMessageResponse]