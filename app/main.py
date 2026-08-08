import os
import logging
import datetime
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import text

from app import models
from app.database import engine
from app.api import auth, tasks
from app.core.config import settings
from app.exceptions.tasks import TaskNotFoundError
from app.exceptions.users import EmailAlreadyRegisteredError, InvalidCredentialsError

APP_VERSION = "1.0.0"

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)
logger = logging.getLogger("smart_task_manager")

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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


@app.exception_handler(RequestValidationError)
def handle_validation_error(request: Request, exc: RequestValidationError):
    # Pydantic gives us a list of individual field errors; collapse them into
    # one readable message, but keep the full detail available under "error"
    # for clients that want to highlight specific fields.
    first_error = exc.errors()[0]
    field = ".".join(str(loc) for loc in first_error["loc"] if loc != "body")
    message = f"{field}: {first_error['msg']}" if field else first_error["msg"]

    logger.info(f"Validation failed on {request.method} {request.url.path}: {message}")
    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "message": message,
            "error": {"code": "VALIDATION_ERROR", "fields": exc.errors()},
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
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        database_status = "connected"
        application_status = "ok"
    except Exception as exc:
        logger.error(f"Health check: database unreachable: {exc}")
        database_status = "disconnected"
        application_status = "degraded"

    return {
        "application_status": application_status,
        "database_status": database_status,
        "api_version": APP_VERSION,
        "environment": settings.ENVIRONMENT,
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
    }


app.include_router(auth.router)
app.include_router(tasks.router)

FRONTEND_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "frontend")
app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")