from sqlalchemy.orm import Session
from app import models, schemas
from app.core.security import hash_password


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def create_user(db: Session, user: schemas.UserCreate):
    display_name = user.name or user.username or user.email.split('@')[0]
    new_user = models.User(
        username=display_name,
        name=display_name,
        email=user.email,
        hashed_password=hash_password(user.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user