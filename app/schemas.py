from pydantic import BaseModel, EmailStr, Field, field_validator
from datetime import datetime
from typing import Optional, Literal, Generic, TypeVar

T = TypeVar("T")


class APIResponse(BaseModel, Generic[T]):
    success: bool = True
    message: str
    data: T = None


class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=2000)
    priority: Literal["low", "medium", "high"] = "medium"

    @field_validator("title")
    @classmethod
    def title_must_not_be_blank(cls, value: str) -> str:
        stripped = value.strip()
        if not stripped:
            raise ValueError("Title cannot be blank or only whitespace")
        return stripped


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None


class UserCreate(BaseModel):
    username: Optional[str] = None
    name: Optional[str] = None
    email: EmailStr
    password: str = Field(..., min_length=8)


class UserResponse(BaseModel):
    id: int
    username: Optional[str] = None
    name: Optional[str] = None
    email: EmailStr
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


UserLogin = LoginRequest


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    priority: str
    status: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True