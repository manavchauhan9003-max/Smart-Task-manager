from sqlalchemy.orm import Session
from app import models, schemas
from app.core.constants import TaskStatus
from app.exceptions.tasks import TaskNotFoundError


def get_task_or_404(db: Session, task_id: int, owner_id: int) -> models.Task:
    task = db.query(models.Task).filter(
        models.Task.id == task_id, models.Task.owner_id == owner_id
    ).first()
    if task is None:
        raise TaskNotFoundError(task_id)
    return task


def list_tasks(db: Session, owner_id: int, priority: str = None):
    query = db.query(models.Task).filter(models.Task.owner_id == owner_id)
    if priority:
        query = query.filter(models.Task.priority == priority)
    return query.all()


def create_task(db: Session, task: schemas.TaskCreate, owner_id: int):
    new_task = models.Task(
        title=task.title,
        description=task.description,
        priority=task.priority,
        owner_id=owner_id
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task


def replace_task(db: Session, task_id: int, task: schemas.TaskCreate, owner_id: int):
    existing_task = get_task_or_404(db, task_id, owner_id)
    existing_task.title = task.title
    existing_task.description = task.description
    existing_task.priority = task.priority
    db.commit()
    db.refresh(existing_task)
    return existing_task


def toggle_task_complete(db: Session, task_id: int, owner_id: int):
    task = get_task_or_404(db, task_id, owner_id)
    task.status = TaskStatus.PENDING if task.status == TaskStatus.COMPLETED else TaskStatus.COMPLETED
    db.commit()
    db.refresh(task)
    return task


def delete_task(db: Session, task_id: int, owner_id: int):
    task = get_task_or_404(db, task_id, owner_id)
    db.delete(task)
    db.commit()