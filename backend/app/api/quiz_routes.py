import json
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import Literal

from app.core.database import get_db
from app.core.deps import get_current_user

from app.models.document import Document
from app.models.quiz import Quiz

from app.services.quiz_service import generate_quiz_questions

router = APIRouter()


class QuizRequest(BaseModel):
    num_questions: int = 10
    difficulty: Literal["easy", "medium", "hard"] = "medium"


@router.post("/{doc_id}")
def create_quiz(
    doc_id: int,
    request: QuizRequest = QuizRequest(),
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    document = db.query(Document).filter(
        Document.id == doc_id,
        Document.user_id == current_user.id,
    ).first()

    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    # BUG FIX: Original used ai_service.generate_quiz (returns raw string, no params).
    # Now uses quiz_service.generate_quiz_questions with difficulty + num_questions.
    questions_json = generate_quiz_questions(
        content=document.content,
        num_questions=request.num_questions,
        difficulty=request.difficulty,
    )

    # Persist the quiz
    quiz = Quiz(
        user_id=current_user.id,
        document_id=doc_id,
        questions_json=questions_json,
    )
    db.add(quiz)
    db.commit()
    db.refresh(quiz)

    return {
        "quiz_id": quiz.id,
        "quiz": json.loads(questions_json),
    }


@router.get("/{doc_id}")
def get_quizzes(
    doc_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    quizzes = db.query(Quiz).filter(
        Quiz.document_id == doc_id,
        Quiz.user_id == current_user.id,
    ).all()

    return [
        {"quiz_id": q.id, "quiz": json.loads(q.questions_json), "created_at": q.created_at}
        for q in quizzes
    ]