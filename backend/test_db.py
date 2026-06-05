from app.core.database import engine

try:
    with engine.connect() as conn:
        print("Connected to Neon successfully!")
except Exception as e:
    print("Error:", e)