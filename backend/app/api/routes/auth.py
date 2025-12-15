"""Authentication API routes."""

from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.database import get_database
from app.core.deps import get_current_user
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    get_password_hash,
    verify_password,
)
from app.models.user import (
    Token,
    TokenRefresh,
    User,
    UserCreate,
    UserInDB,
    UserLogin,
    UserUpdate,
)

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post("/register", response_model=User, status_code=status.HTTP_201_CREATED)
async def register(
    user_in: UserCreate,
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Register a new user."""
    # Check if email already exists
    existing = await db.users.find_one({"email": user_in.email})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    # Create user with hashed password
    user_data = UserInDB(
        email=user_in.email,
        name=user_in.name,
        hashed_password=get_password_hash(user_in.password),
    )

    doc = user_data.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    await db.users.insert_one(doc)

    return User(**user_data.model_dump())


@router.post("/login", response_model=Token)
async def login(
    credentials: UserLogin,
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Authenticate user and return tokens."""
    user = await db.users.find_one({"email": credentials.email})

    if not user or not verify_password(credentials.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    if not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is disabled",
        )

    access_token = create_access_token(data={"sub": user["id"]})
    refresh_token = create_refresh_token(data={"sub": user["id"]})

    return Token(access_token=access_token, refresh_token=refresh_token)


@router.post("/refresh", response_model=Token)
async def refresh_token(
    token_data: TokenRefresh,
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Refresh access token using refresh token."""
    payload = decode_token(token_data.refresh_token)

    if payload is None or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        )

    user_id = payload.get("sub")
    user = await db.users.find_one({"id": user_id})

    if not user or not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive",
        )

    access_token = create_access_token(data={"sub": user_id})
    refresh_token = create_refresh_token(data={"sub": user_id})

    return Token(access_token=access_token, refresh_token=refresh_token)


@router.get("/me", response_model=User)
async def get_me(current_user: User = Depends(get_current_user)):
    """Get current user profile."""
    return current_user


@router.patch("/me", response_model=User)
async def update_me(
    user_in: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Update current user profile."""
    update_data = user_in.model_dump(exclude_unset=True)

    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fields to update",
        )

    # Check email uniqueness if updating email
    if "email" in update_data and update_data["email"] != current_user.email:
        existing = await db.users.find_one({"email": update_data["email"]})
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already in use",
            )

    await db.users.update_one({"id": current_user.id}, {"$set": update_data})

    updated_user = await db.users.find_one(
        {"id": current_user.id}, {"_id": 0, "hashed_password": 0}
    )
    return User(**updated_user)
