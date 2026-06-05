"""
schemas/document.py
"""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class DocumentResponse(BaseModel):
    id: int
    filename: str
    title: str
    size: Optional[int]
    created_at: datetime
    pdf_url: Optional[str] = None

    class Config:
        from_attributes = True