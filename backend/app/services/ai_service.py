import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def generate_quiz(content: str) -> str:
    prompt = f"""
Generate 10 multiple choice questions from the study material below.

Rules:
- Educational questions only
- Return ONLY a valid JSON array, no markdown, no explanation
- Each question must have exactly these keys:
    "question": string
    "options": array of 4 strings
    "answer": string (must match one of the options exactly)

Study Material:
{content[:12000]}
"""
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.4,
    )
    return response.choices[0].message.content


def generate_flashcards(content: str) -> str:
    prompt = f"""
Generate 20 flashcards from the study material.

Return ONLY a valid JSON array, no markdown, no explanation.

Format:
[
  {{
    "question": "...",
    "answer": "..."
  }}
]

Study Material:
{content[:12000]}
"""
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
    )
    return response.choices[0].message.content


def ask_groq(question: str, context: str = "") -> str:
    prompt = f"""
You are an AI Study Assistant.

Rules:
1. Answer educational questions only.
2. Use the PDF content below whenever relevant.
3. If the answer is not found in the PDF, answer using your own educational knowledge.
4. Refuse non-educational questions politely.
5. Explain concepts clearly for students.

PDF CONTENT:
{context}

QUESTION:
{question}
"""
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
    )
    return response.choices[0].message.content