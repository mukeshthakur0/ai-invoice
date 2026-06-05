from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user

from app.models.document import Document
from app.models.chat import ChatMessage

from app.schema.chat import ChatRequest
from app.services.ai_service import ask_groq

router = APIRouter()


@router.post("/")
def chat(
    data: ChatRequest,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    print("CHAT DATA =", data)

    documents = (
        db.query(Document)
        .filter(Document.user_id == current_user.id)
        .all()
    )

    context = ""

    for doc in documents:
        if doc.content:
            context += "\n\n" + doc.content[:5000]

    answer = ask_groq(
        question=data.message,
        context=context
    )

    chat = ChatMessage(
        user_id=current_user.id,
        question=data.message,
        answer=answer
    )

    db.add(chat)
    db.commit()

    return {
        "answer": answer
    }