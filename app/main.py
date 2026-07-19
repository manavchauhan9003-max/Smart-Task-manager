from fastapi import FastAPI

app = FastAPI()

task = [
    {"id": 1, "title": "Learn FastAPI", "Priority": "High", "Completed": "False"},
    {"id": 2, "title": "Buy Groceries", "Priority": "Low", "Completed": "False"},
    {"id": 3, "title": "Write report", "Priority": "Medium", "Completed": "True"}
]

@app.get("/")
def read_root():
    return{"message": "welcome to the smart task manager"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.get("/tasks")
def get_tasks():
    return task

@app.get("/tasks/{task_id}")
def get_task(task_id: int):
    for t in task:
        if t["id"] == task_id:
            return t
    return {"error": "Task not found"}

