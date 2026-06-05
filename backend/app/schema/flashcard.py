from pydantic import BaseModel


class FlashcardRequest(BaseModel):

    document_id: int

    num_cards: int = 10