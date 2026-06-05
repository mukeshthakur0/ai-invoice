from pydantic import BaseModel


class QuizRequest(BaseModel):

    document_id: int

    num_questions: int = 5

    difficulty: str = "medium"