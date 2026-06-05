import io
import PyPDF2


def extract_pdf_text(pdf_content: bytes) -> str:
    """
    Extract all text from a PDF byte string.
    BUG FIX: Added error handling per page so a corrupt page
    doesn't crash the entire extraction.
    """
    pdf_reader = PyPDF2.PdfReader(io.BytesIO(pdf_content))

    pages = []
    for i, page in enumerate(pdf_reader.pages):
        try:
            text = page.extract_text()
            if text:
                pages.append(text)
        except Exception:
            # Skip unreadable pages gracefully
            continue

    return "\n".join(pages)