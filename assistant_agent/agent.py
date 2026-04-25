import os
from .database import add_task, get_tasks, add_note, get_notes
import httpx
from .static_knowledge import get_emergency_wisdom

# --- TASK TOOLS ---

def create_task(title: str, description: str = None, due_date: str = None) -> str:
    """Creates a new task in the personal task manager."""
    task_id = add_task(title, description, due_date)
    return f"Task created successfully! (ID: {task_id})"

def list_tasks(status: str = None) -> str:
    """Lists all pending or completed tasks."""
    tasks = get_tasks(status)
    if not tasks:
        return "You have no tasks in your list."
    res = "**Your Tasks**\n"
    for t in tasks:
        icon = "⏳" if t['status'] == 'pending' else "✅"
        res += f"- {icon} **{t['title']}** (ID: {t['id']}): {t['description'] or 'No description'}\n"
    return res

def take_note(content: str) -> str:
    """Saves a personal note for future reference."""
    note_id = add_note(content)
    return f"Note saved! (ID: {note_id})"

def read_notes() -> str:
    """Retrieves all saved personal notes."""
    notes = get_notes()
    if not notes:
        return "No notes found."
    res = "**Your Notes**\n"
    for n in notes:
        res += f"- [{n['timestamp']}] {n['content']}\n"
    return res

def query_knowledge_base(query: str) -> str:
    """Queries the verified project knowledge base."""
    return get_emergency_wisdom(query)
