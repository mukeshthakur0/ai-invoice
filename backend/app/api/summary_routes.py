from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user

from app.models.summary import Summary
from app.models.document import Document

from app.schema.summary import SummaryRequest

from app.services.summary_service import generate_summary

router = APIRouter()


@router.post("/generate")
def create_summary(
    summary_request: SummaryRequest,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    document = db.query(Document).filter(
        Document.id == summary_request.document_id,
       
        Document.user_id == current_user.id,
    ).first()

    
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    summary_text = generate_summary(
        document.content,
        summary_request.summary_length,
    )

    summary = Summary(
        user_id=current_user.id,
        document_id=document.id,
        title=document.title,
        content=summary_text,
    )

    db.add(summary)
    db.commit()
    db.refresh(summary)

    return summary


@router.get("/")
def get_summaries(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    summaries = db.query(Summary).filter(
        Summary.user_id == current_user.id
    ).order_by(Summary.created_at.desc()).all()

    return summaries


@router.get("/document/{document_id}")
def get_summary_by_document(
    document_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get the summary for a specific document.
    This retrieves the auto-generated summary created when the PDF was uploaded.
    """
    # Verify document belongs to user
    document = db.query(Document).filter(
        Document.id == document_id,
        Document.user_id == current_user.id,
    ).first()

    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    summary = db.query(Summary).filter(
        Summary.document_id == document_id,
        Summary.user_id == current_user.id,
    ).first()

    if not summary:
        raise HTTPException(
            status_code=404,
            detail="Summary not found for this document"
        )

    return {
        "id": summary.id,
        "document_id": summary.document_id,
        "document_title": document.title,
        "title": summary.title,
        "content": summary.content,
        "created_at": summary.created_at
    }


@router.post("/regenerate/{document_id}")
def regenerate_summary(
    document_id: int,
    length: str = "medium",
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Regenerate a summary for a document with a specific length.
    Options: 'short' (100 words), 'medium' (300 words), 'long' (600 words).
    
    This will replace the existing summary.
    """
    if length not in ["short", "medium", "long"]:
        raise HTTPException(
            status_code=400,
            detail="Length must be 'short', 'medium', or 'long'"
        )

    document = db.query(Document).filter(
        Document.id == document_id,
        Document.user_id == current_user.id,
    ).first()

    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    # Generate new summary
    summary_text = generate_summary(document.content, length)

    # Get existing summary or create new one
    summary = db.query(Summary).filter(
        Summary.document_id == document_id,
        Summary.user_id == current_user.id,
    ).first()

    if summary:
        # Update existing summary
        summary.content = summary_text
        summary.title = f"Summary of {document.title} ({length})"
    else:
        # Create new summary
        summary = Summary(
            user_id=current_user.id,
            document_id=document_id,
            title=f"Summary of {document.title} ({length})",
            content=summary_text,
        )
        db.add(summary)

    db.commit()
    db.refresh(summary)

    return {
        "id": summary.id,
        "document_id": summary.document_id,
        "title": summary.title,
        "content": summary.content,
        "length": length,
        "created_at": summary.created_at,
        "message": "Summary regenerated successfully"
    }