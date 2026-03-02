from fastapi import APIRouter, Depends, HTTPException

from core.deps import get_current_user

router = APIRouter(
    prefix="/sales",
    tags=["Sales"],
    dependencies=[Depends(get_current_user)],
)
