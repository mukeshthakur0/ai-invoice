import json
import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def generate_flashcards(content: str) -> list[dict]:
    """
    Returns a list of dicts: [{"question": ..., "answer": ...}]
    BUG FIX: Previously returned raw string — callers in flashcard_routes.py
    called .extend() and accessed card["question"], so this must return a list.
    """
    if not content or len(content.strip()) == 0:
        return []
    
    prompt = f"""
Generate 20 flashcards from the study material.

Return ONLY a valid JSON array, no markdown, no explanation, no code blocks.

Format:
[
  {{
    "question": "...",
    "answer": "..."
  }}
]

Study Material:
{content[:5000]}
"""
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
        )

        raw = response.choices[0].message.content.strip()

        # Strip possible markdown fences
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
            raw = raw.strip()

        cards = json.loads(raw)
        
        # Ensure it's a list
        if not isinstance(cards, list):
            return []
        
        # Validate each flashcard
        valid_cards = []
        for card in cards:
            if isinstance(card, dict) and "question" in card and "answer" in card:
                if card["question"] and card["answer"]:  # Ensure both are non-empty
                    valid_cards.append(card)
        
        return valid_cards if valid_cards else []
    
    except json.JSONDecodeError:
        return []
    except Exception as e:
        print(f"Error generating flashcards: {e}")
        return []