from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import schemas, models
from app.database import get_db
from app.core.security import create_access_token, get_current_user
from app.crud import users as users_crud

router = APIRouter()


@router.post("/register", response_model=schemas.APIResponse[schemas.UserResponse], status_code=201)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    new_user = users_crud.create_user(db, user)
    return schemas.APIResponse(message="User registered successfully", data=new_user)


@router.post("/login", response_model=schemas.APIResponse[schemas.Token])
def login(credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    user = users_crud.authenticate_user(db, credentials.email, credentials.password)
    access_token = create_access_token(data={"user_id": user.id, "email": user.email})
    token = schemas.Token(access_token=access_token)
    return schemas.APIResponse(message="Login successful", data=token)


@router.get("/me", response_model=schemas.APIResponse[schemas.UserResponse])
def read_current_user(current_user: models.User = Depends(get_current_user)):
    return schemas.APIResponse(message="Current user retrieved", data=current_user)