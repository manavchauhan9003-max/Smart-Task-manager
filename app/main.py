from fastapi import FastAPI,HTTPException
from typing import Optional
from pydantic import BaseModel

class TaskCreate(BaseModel):
    title: str
    priority: str
    completed: bool = False

app = FastAPI()

tasks = [
    {"id": 1, "title": "Learn FastAPI", "priority": "high", "completed": False},
    {"id": 2, "title": "Buy Groceries", "priority": "low", "completed": False},
    {"id": 3, "title": "Write report", "priority": "medium", "completed": True}
]

# @app.get("/")
# def read_root():
#     return{"message": "welcome to the smart task manager"}

# @app.get("/health")
# def health_check():
#     return {"status": "healthy"}

# @app.get("/tasks")
# def get_tasks():
#     return tasks


@app.get("/tasks/{task_id}")
def get_task(task_id: int):
    for task in tasks:
        if task["id"] == task_id:
            return task
    raise HTTPException(status_code=404, detail="Task not found")


@app.get("/tasks")
def get_tasks(priority: Optional[str] = None):
    if priority:
        return [task for task in tasks if task["priority"] == priority]
    return tasks

@app.post("/tasks")
def create_task(task: TaskCreate):
    new_id = max((t["id"] for t in tasks), default=0) + 1
    new_task = {"id": new_id, "title": task.title, "priority": task.priority, "completed": task.completed}
    tasks.append(new_task)
    return new_task

@app.put("/tasks/{task_id}")
def replace_task(task_id: int, task: TaskCreate):
    for existing_task in tasks:
        if existing_task["id"] == task_id:
            existing_task["title"] = task.title
            existing_task["priority"] = task.priority
            existing_task["completed"] = task.completed
            return existing_task
    raise HTTPException(status_code=404, detail="Task not found")