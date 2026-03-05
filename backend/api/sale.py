import uuid

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from core.database import get_db
from core.deps import get_current_user
from models.user import User
from schemas.sale import SaleCreate, SaleRead
from services.sale import (
    create_sale as svc_create_sale,
    get_sale as svc_get_sale,
    get_sales_by_store as svc_get_sales_by_store,
    delete_sale as svc_delete_sale,
)

router = APIRouter(
    prefix="/sales",
    tags=["Sales"],
)


@router.post("/", response_model=SaleRead, status_code=201)
def create_sale(
    payload: SaleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Record a new sale with line items. Total is computed server-side."""
    if not payload.items:
        raise HTTPException(
            status_code=400, detail="A sale must have at least one item")
    return svc_create_sale(db, payload, current_user.store_id, current_user.id)


@router.get("/{sale_id}", response_model=SaleRead)
def get_sale(
    sale_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Fetch a single sale by ID, ensuring it belongs to the user's store."""
    sale = svc_get_sale(db, sale_id)
    if not sale or sale.store_id != current_user.store_id:
        raise HTTPException(status_code=404, detail="Sale not found")
    return sale


@router.get("/", response_model=list[SaleRead])
def get_sales(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Fetch all sales belonging to the current user's store."""
    return svc_get_sales_by_store(db, current_user.store_id, skip=skip, limit=limit)


@router.delete("/{sale_id}", status_code=204)
def delete_sale(
    sale_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a sale and its items, ensuring it belongs to the user's store."""
    sale = svc_get_sale(db, sale_id)
    if not sale or sale.store_id != current_user.store_id:
        raise HTTPException(status_code=404, detail="Sale not found")
    svc_delete_sale(db, sale_id)
