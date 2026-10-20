from typing import Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.core.database import get_db
from backend.app.models import User
from backend.app.schemas.analytics_ai import AIAssistantRequest, AIAssistantResponse
from backend.app.api.deps import get_current_active_user
from backend.app.ai.assistant import ai_assistant

router = APIRouter()


@router.post("/assistant", response_model=AIAssistantResponse)
def ask_ai_assistant(
    request: AIAssistantRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """Enterprise AI Business Assistant: answers natural language operational questions grounded in live metrics."""
    target_branch = request.branch_id or current_user.branch_id or 1
    rest_id = current_user.restaurant_id or 1
    return ai_assistant.answer_query(db, request.question, branch_id=target_branch, restaurant_id=rest_id)
