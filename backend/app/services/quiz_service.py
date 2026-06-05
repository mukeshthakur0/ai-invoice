import json
import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# BUG FIX: Original returned placeholder "Question 1", "A", "B", "C", "D".
# Now generates real questions via AI with difficulty support.

DIFFICULTY_INSTRUCTIONS = {
    "easy": "Use simple language and test basic recall.",
    "medium": "Test understanding and application of concepts.",
    "hard": "Test deep analysis, synthesis, and critical thinking.",
}


def generate_quiz_questions(
    content: str,
    num_questions: int = 10,
    difficulty: str = "medium",
) -> str:
    if not content or len(content.strip()) == 0:
        return json.dumps([])
    
    instruction = DIFFICULTY_INSTRUCTIONS.get(difficulty, DIFFICULTY_INSTRUCTIONS["medium"])

    prompt = f"""
Generate exactly {num_questions} multiple choice questions from the study material.
Difficulty: {difficulty.upper()} — {instruction}

Return ONLY a valid JSON array, no markdown, no explanation, no code blocks.

Format:
[
  {{
    "id": 0,
    "question": "...",
    "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
    "correct_answer": 0
  }}
]

The "correct_answer" field must be the 0-based index (0, 1, 2, or 3) of the correct option.
Each question MUST have exactly 4 options.

Study Material:
{content[:12000]}
"""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.4,
        )

        raw = response.choices[0].message.content.strip()

        # Remove markdown code blocks if present
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
            raw = raw.strip()

        # Validate JSON before returning
        questions = json.loads(raw)
        
        # Ensure it's a list
        if not isinstance(questions, list):
            return json.dumps([])
        
        # Validate and fix each question
        valid_questions = []
        for i, q in enumerate(questions):
            if isinstance(q, dict) and "question" in q and "options" in q and "correct_answer" in q:
                # Ensure correct_answer is an integer between 0-3
                try:
                    correct_answer = int(q["correct_answer"])
                    if 0 <= correct_answer < len(q["options"]):
                        q["id"] = i
                        valid_questions.append(q)
                except (ValueError, TypeError):
                    pass
        
        return json.dumps(valid_questions) if valid_questions else json.dumps([])
    
    except json.JSONDecodeError:
        return json.dumps([])
    except Exception as e:
        print(f"Error generating quiz questions: {e}")
        return json.dumps([])