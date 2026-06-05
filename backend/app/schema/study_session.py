from pydantic import BaseModel
from datetime import datetime


class StudySessionResponse(BaseModel):

    id: int

    duration_minutes: int

    created_at: datetime

    class Config:

        from_attributes = True