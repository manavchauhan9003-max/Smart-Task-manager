from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import schemas, models
from app.database import get_db
from app.core.security import get_current_user
from app.crud import tasks as tasks_crud
from app.services import ai_service

router = APIRouter(prefix="/ai", tags=["ai"])


@router.post(
    "/tasks/{task_id}/breakdown",
    response_model=schemas.APIResponse[schemas.TaskBreakdownResponse],
)
def breakdown_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    # Reuses our EXISTING ownership-scoped lookup (Phase 8's get_task_or_404) --
    # a user can only request a breakdown for a task that's actually theirs.
    # This is the same authorization boundary every other task route already
    # enforces; the AI layer doesn't get a separate, weaker set of rules.
    task = tasks_crud.get_task_or_404(db, task_id=task_id, owner_id=current_user.id)

    breakdown = ai_service.generate_task_breakdown(task.title, task.description)

    return schemas.APIResponse(message="Task breakdown generated", data=breakdown)  