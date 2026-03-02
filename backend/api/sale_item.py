from fastapi import APIRouter, Depends, HTTPException

from core.deps import get_current_user

router = APIRouter(
    prefix="/sale-items",
    tags=["Sale Items"],
    dependencies=[Depends(get_current_user)],
)
