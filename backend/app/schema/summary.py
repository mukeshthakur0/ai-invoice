"""
schemas/summary.py
"""
from pydantic import BaseModel
from typing import Literal


class SummaryRequest(BaseModel):
    document_id: int
    summary_length: Literal["short", "medium", "long"] = "medium"


class SummaryResponse(BaseModel):
    id: int
    title: str | None
    content: str

    class Config:
        from_attributes = True