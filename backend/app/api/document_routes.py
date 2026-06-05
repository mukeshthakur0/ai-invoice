
from fastapi import APIRouter, UploadFile, File
from fastapi import Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.document import Document
from app.models.summary import Summary
from app.services.pdf_service import extract_pdf_text
from app.services.summary_service import generate_summary

import os

router = APIRouter()

# ==========================
# Create upload folder
# ==========================

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# ==========================
# Upload Document
# ==========================

@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    try:

        # Allow PDF only
        if not file.filename.endswith(".pdf"):
            raise HTTPException(
                status_code=400,
                detail="Only PDF files allowed"
            )

        content = await file.read()

        file_name = file.filename.replace(
            " ",
            "_"
        )

        file_location = os.path.join(
            UPLOAD_DIR,
            file_name
        )

        # Save PDF
        with open(
            file_location,
            "wb"
        ) as f:

            f.write(content)

        # Extract text
        pdf_text = extract_pdf_text(content)

        # Save in DB
        doc = Document(
            user_id=current_user.id,
            filename=file_name,
            title=file_name,
            file_path=file_location,
            content=pdf_text,
            size=len(content)
        )

        db.add(doc)
        db.commit()
        db.refresh(doc)

        # ===== AUTO-GENERATE SUMMARY WITH GROQ =====
        try:
            summary_text = generate_summary(pdf_text, length="medium")
            
            summary = Summary(
                user_id=current_user.id,
                document_id=doc.id,
                title=f"Summary of {doc.title}",
                content=summary_text,
            )
            
            db.add(summary)
            db.commit()
            db.refresh(summary)
            
            summary_created = True
        except Exception as e:
            print(f"Error generating summary: {e}")
            summary_created = False

        return {
            "message": "Upload successful",
            "document": {
                "id": doc.id,
                "filename": doc.filename,
                "title": doc.title,
                "size": doc.size,
                "pdf_url": f"/api/documents/open/{doc.id}",
                "summary_created": summary_created
            }
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# ==========================
# Get User Documents
# ==========================

@router.get("/")
def get_documents(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    docs = db.query(
        Document
    ).filter(
        Document.user_id == current_user.id
    ).all()

    return [
        {
            "id": doc.id,
            "filename": doc.filename,
            "title": doc.title,
            "size": doc.size,
            "pdf_url": f"/api/documents/open/{doc.id}"
        }
        for doc in docs
    ]


# ==========================
# Open PDF
# ==========================

@router.get("/open/{doc_id}")
def open_pdf(
    doc_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    document = db.query(Document).filter(
        Document.id == doc_id,
        Document.user_id == current_user.id
    ).first()

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    if not os.path.exists(document.file_path):
        raise HTTPException(
            status_code=404,
            detail="File missing"
        )

    return FileResponse(
        document.file_path,
        media_type="application/pdf",
        headers={
            "Content-Disposition": "inline"
        }
    )

@router.delete("/{doc_id}")
def delete_document(
    doc_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    document = db.query(Document).filter(
        Document.id == doc_id,
        Document.user_id == current_user.id
    ).first()

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    # Delete physical PDF
    if document.file_path and os.path.exists(document.file_path):
        os.remove(document.file_path)

    # Delete DB record
    db.delete(document)
    db.commit()

    return {
        "message": "Document deleted successfully"
    }


# ==========================
# Get Document Summary
# ==========================

@router.get("/{doc_id}/summary")
def get_document_summary(
    doc_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retrieve the auto-generated summary for a document.
    The summary is created automatically when the PDF is uploaded.
    """
    document = db.query(Document).filter(
        Document.id == doc_id,
        Document.user_id == current_user.id
    ).first()

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    summary = db.query(Summary).filter(
        Summary.document_id == doc_id,
        Summary.user_id == current_user.id
    ).first()

    if not summary:
        raise HTTPException(
            status_code=404,
            detail="Summary not found. Try reuploading the document."
        )

    return {
        "id": summary.id,
        "document_id": summary.document_id,
        "title": summary.title,
        "content": summary.content,
        "created_at": summary.created_at
    }
