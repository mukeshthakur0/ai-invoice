import importlib
import sys
from pathlib import Path

sys.path.insert(0, "backend")
log_path = Path("backend/debug_import.log")


def log(message):
    with log_path.open("a", encoding="utf-8") as log_file:
        log_file.write(message + "\n")
    print(message, flush=True)

modules = [
    "app.api.auth_routes",
    "app.api.dashboard_routes",
    "app.api.document_routes",
    "app.api.quiz_routes",
    "app.api.flashcard_routes",
    "app.api.summary_routes",
    "app.api.chat_routes",
    "app.api.search_routes",
    "app.api.study_session_routes",
]

for module in modules:
    log(f"importing {module}")
    importlib.import_module(module)
    log(f"done {module}")

log("all done")
