from fastapi import APIRouter, Depends, HTTPException

from core.deps import get_current_user
from models.user import User

router = APIRouter(
    prefix="/users",
    tags=["Users"],
    dependencies=[Depends(get_current_user)],
)


@router.get("/me")
def read_current_user(current_user: User = Depends(get_current_user)):
    """Return the profile of the currently authenticated user."""
    return {
        "id": str(current_user.id),
        "store_id": str(current_user.store_id),
        "name": current_user.name,
        "email": current_user.email,
        "is_active": current_user.is_active,
    }
