from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user

from app.models.document import Document
from app.models.quiz import Quiz
from app.models.flashcard import Flashcard
from app.models.study_session import StudySession
from app.models.chat import ChatMessage

from app.schema.dashboard import DashboardStats, DashboardOverview
from app.schema.document import DocumentResponse
from app.schema.chat import ChatMessageResponse

router = APIRouter()


@router.get("/overview", response_model=DashboardOverview)
def get_dashboard_overview(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    notes_count = db.query(Document).filter(
        Document.user_id == current_user.id
    ).count()

    quizzes_count = db.query(Quiz).filter(
        Quiz.user_id == current_user.id
    ).count()

    # BUG FIX: flashcards_count was never defined — caused NameError at runtime
    flashcards_count = db.query(Flashcard).filter(
        Flashcard.user_id == current_user.id
    ).count()

    sessions = db.query(StudySession).filter(
        StudySession.user_id == current_user.id
    ).all()

    study_hours = round(
        sum(s.duration_minutes for s in sessions) / 60, 2
    )

    # BUG FIX: Added .limit(5) so we don't return every record as "recent"
    recent_notes = db.query(Document).filter(
        Document.user_id == current_user.id
    ).order_by(Document.created_at.desc()).limit(5).all()

    recent_chats = db.query(ChatMessage).filter(
        ChatMessage.user_id == current_user.id
    ).order_by(ChatMessage.created_at.desc()).limit(5).all()

    stats = DashboardStats(
        notes=notes_count,
        quizzes=quizzes_count,
        flashcards=flashcards_count,
        study_hours=study_hours,
    )

    return DashboardOverview(
        stats=stats,
        recentNotes=[DocumentResponse.model_validate(n) for n in recent_notes],
        recentChats=[ChatMessageResponse.model_validate(c) for c in recent_chats],
    )