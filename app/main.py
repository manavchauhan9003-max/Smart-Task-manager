from fastapi import FastAPI,HTTPException
from typing import Optional


app = FastAPI()

tasks = [
    {"id": 1, "title": "Learn FastAPI", "priority": "High", "Completed": "False"},
    {"id": 2, "title": "Buy Groceries", "priority": "Low", "Completed": "False"},
    {"id": 3, "title": "Write report", "priority": "Medium", "Completed": "True"}
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

