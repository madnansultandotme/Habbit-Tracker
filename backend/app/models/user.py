"""User-related Pydantic models."""

from datetime import datetime, timezone
from uuid import uuid4

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserBase(BaseModel):
    """Base user schema."""

    email: EmailStr
    name: str = Field(..., min_length=1, max_length=100)


class UserCreate(UserBase):
    """Schema for user registration."""

    password: str = Field(..., min_length=8, max_length=100)


class UserLogin(BaseModel):
    """Schema for user login."""

    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    """Schema for updating user profile."""

    name: str | None = Field(None, min_length=1, max_length=100)
    email: EmailStr | None = None


class User(UserBase):
    """Complete user schema (without password)."""

    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    is_active: bool = True


class UserInDB(User):
    """User schema with hashed password (for database)."""

    hashed_password: str


class Token(BaseModel):
    """JWT token response."""

    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenRefresh(BaseModel):
    """Token refresh request."""

    refresh_token: str


class TokenPayload(BaseModel):
    """JWT token payload."""

    sub: str  # user_id
    exp: datetime
    type: str = "access"
