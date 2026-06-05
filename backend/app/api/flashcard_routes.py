from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user

from app.models.document import Document
from app.models.flashcard import Flashcard

from app.services.flashcard_service import generate_flashcards

router = APIRouter()


def split_text(text: str, chunk_size: int = 4000) -> list[str]:
    return [text[i: i + chunk_size] for i in range(0, len(text), chunk_size)]


@router.post("/{document_id}")
def create_flashcards(
    document_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    document = db.query(Document).filter(
        Document.id == document_id,
        Document.user_id == current_user.id,
    ).first()

    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    # Return cached flashcards if they already exist
    existing = db.query(Flashcard).filter(
        Flashcard.document_id == document.id
    ).all()

    if existing:
        return {
            "flashcards": [
                {"id": c.id, "question": c.question, "answer": c.answer}
                for c in existing
            ]
        }

    chunks = split_text(document.content)
    all_cards: list[dict] = []

    for chunk in chunks:
        # BUG FIX: generate_flashcards now returns list[dict], not a raw string
        cards = generate_flashcards(chunk)
        all_cards.extend(cards)

    for card in all_cards:
        # BUG FIX: card["question"] / card["answer"] only works when card IS a dict
        if not isinstance(card, dict):
            continue
        flashcard = Flashcard(
            user_id=current_user.id,
            document_id=document.id,
            question=card.get("question", ""),
            answer=card.get("answer", ""),
        )
        db.add(flashcard)

    db.commit()

    saved = db.query(Flashcard).filter(
        Flashcard.document_id == document.id
    ).all()

    return {
        "flashcards": [
            {"id": c.id, "question": c.question, "answer": c.answer}
            for c in saved
        ]
    }


@router.get("/{document_id}")
def get_flashcards(
    document_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    document = db.query(Document).filter(
        Document.id == document_id,
        Document.user_id == current_user.id,
    ).first()

    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    cards = db.query(Flashcard).filter(
        Flashcard.document_id == document.id
    ).all()

    return {
        "flashcards": [
            {"id": c.id, "question": c.question, "answer": c.answer}
            for c in cards
        ]
    }