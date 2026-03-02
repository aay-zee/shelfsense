from fastapi import APIRouter, Depends, HTTPException

from core.deps import get_current_user

router = APIRouter(
    prefix="/products",
    tags=["Products"],
    dependencies=[Depends(get_current_user)],
)


@router.post("/", status_code=201)
def create_product():
    """Create a new product."""
