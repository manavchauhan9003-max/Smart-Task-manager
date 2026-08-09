from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings
import logging

logger = logging.getLogger("smart_task_manager")

def init_engine():
    try:
        connect_args = {"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {}
        eng = create_engine(settings.DATABASE_URL, connect_args=connect_args)
        with eng.connect() as conn:
            pass
        return eng
    except Exception as exc:
        logger.warning(f"Primary database connection failed ({exc}), falling back to SQLite for local development.")
        sqlite_url = "sqlite:///./sql_app.db"
        return create_engine(sqlite_url, connect_args={"check_same_thread": False})

engine = init_engine()

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()