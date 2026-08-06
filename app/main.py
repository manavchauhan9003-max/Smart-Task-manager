import os
import logging
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app import models
from app.database import engine
from app.api import auth, tasks
from app.exceptions.tasks import TaskNotFoundError
from app.exceptions.users import EmailAlreadyRegisteredError, InvalidCredentialsError

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)
logger = logging.getLogger("smart_task_manager")

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:3000", "http://localhost:3000",
                   "http://127.0.0.1:8000", "http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(TaskNotFoundError)
def handle_task_not_found(request: Request, exc: TaskNotFoundError):
    logger.warning(f"Task not found: {exc}")
    return JSONResponse(
        status_code=404,
        content={
            "success": False,
            "message": str(exc),
            "error": {"code": "TASK_NOT_FOUND"},
        },
    )


@app.exception_handler(EmailAlreadyRegisteredError)
def handle_email_taken(request: Request, exc: EmailAlreadyRegisteredError):
    logger.info(f"Registration rejected, duplicate email: {exc.email}")
    return JSONResponse(
        status_code=400,
        content={
            "success": False,
            "message": str(exc),
            "error": {"code": "EMAIL_ALREADY_REGISTERED"},
        },
    )


@app.exception_handler(InvalidCredentialsError)
def handle_invalid_credentials(request: Request, exc: InvalidCredentialsError):
    logger.warning("Failed login attempt")
    return JSONResponse(
        status_code=401,
        content={
            "success": False,
            "message": "Incorrect email or password",
            "error": {"code": "INVALID_CREDENTIALS"},
        },
    )


@app.exception_handler(Exception)
def handle_unexpected_error(request: Request, exc: Exception):
    logger.error(f"Unhandled exception on {request.method} {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "An unexpected error occurred",
            "error": {"code": "INTERNAL_SERVER_ERROR"},
        },
    )


@app.get("/api/health")
def health_check():
    return {"status": "ok"}


app.include_router(auth.router)
app.include_router(tasks.router)

FRONTEND_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "frontend")
app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")