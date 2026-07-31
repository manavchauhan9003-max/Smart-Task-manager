from typing import Optional, List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app import schemas, models
from app.database import get_db
from app.core.security import get_current_user
from app.crud import tasks as tasks_crud

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.get("", response_model=List[schemas.TaskResponse])
@router.get("/", response_model=List[schemas.TaskResponse])
def get_tasks(
    priority: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return tasks_crud.list_tasks(db, owner_id=current_user.id, priority=priority)


@router.get("/{task_id}", response_model=schemas.TaskResponse)
def get_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return tasks_crud.get_task_or_404(db, task_id=task_id, owner_id=current_user.id)


@router.post("", response_model=schemas.TaskResponse, status_code=201)
@router.post("/", response_model=schemas.TaskResponse, status_code=201)
def create_task(
    task: schemas.TaskCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return tasks_crud.create_task(db, task=task, owner_id=current_user.id)


@router.put("/{task_id}", response_model=schemas.TaskResponse)
def replace_task(
    task_id: int,
    task: schemas.TaskCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return tasks_crud.replace_task(db, task_id=task_id, task=task, owner_id=current_user.id)


@router.patch("/{task_id}/complete", response_model=schemas.TaskResponse)
def complete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return tasks_crud.toggle_task_complete(db, task_id=task_id, owner_id=current_user.id)


@router.delete("/{task_id}", status_code=204)
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    tasks_crud.delete_task(db, task_id=task_id, owner_id=current_user.id)
    return None
