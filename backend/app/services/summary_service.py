import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# BUG FIX: Original just sliced the raw text — not a real summary.
# Now uses AI to generate a proper summary.

WORD_TARGETS = {
    "short": 100,
    "medium": 300,
    "long": 600,
}


def generate_summary(content: str, length: str = "medium") -> str:
    word_count = WORD_TARGETS.get(length, 300)

    prompt = f"""
Summarize the following study material in approximately {word_count} words.

Rules:
- Write in clear, student-friendly language.
- Capture the key concepts and important details.
- Do not add any preamble — output the summary directly.

Study Material:
{content[:12000]}
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
    )

    return response.choices[0].message.content.strip()