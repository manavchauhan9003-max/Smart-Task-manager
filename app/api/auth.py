from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import schemas, models
from app.database import get_db
from app.core.security import create_access_token, get_current_user
from app.crud import users as users_crud

router = APIRouter()


@router.post("/register", response_model=schemas.UserResponse, status_code=201)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    return users_crud.create_user(db, user)


@router.post("/login", response_model=schemas.Token)
def login(credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    user = users_crud.authenticate_user(db, credentials.email, credentials.password)
    access_token = create_access_token(data={"user_id": user.id, "email": user.email})
    return schemas.Token(access_token=access_token)


@router.get("/me", response_model=schemas.UserResponse)
def read_current_user(current_user: models.User = Depends(get_current_user)):
    return current_user