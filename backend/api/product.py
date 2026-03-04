from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from core.database import get_db
from schemas.product import ProductCreate, ProductRead
from core.deps import get_current_user
from models.user import User
from services.product import create_product as svc_create_product
from services.product import get_product as svc_get_product
from services.product import get_products_by_store as svc_get_products_by_store
from services.product import delete_product as svc_delete_product
from services.product import update_product as svc_update_product

router = APIRouter(
    prefix="/products",
    tags=["Products"],
)


@router.post("/", response_model=ProductRead, status_code=201)
def create_product(
    payload: ProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new product in the current user's store."""
    return svc_create_product(db, payload, current_user.store_id)


@router.get("/{product_id}", response_model=ProductRead)
def get_product(
    product_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Fetch a product by ID, ensuring it belongs to the user's store."""
    product = svc_get_product(db, product_id)
    if not product or product.store_id != current_user.store_id:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.get("/", response_model=list[ProductRead])
def get_products(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Fetch all products belonging to the current user's store."""
    return svc_get_products_by_store(db, current_user.store_id)


@router.patch("/{product_id}", response_model=ProductRead)
def update_product(
    product_id: str,
    payload: ProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update a product's details, ensuring it belongs to the user's store."""
    product = svc_get_product(db, product_id)
    if not product or product.store_id != current_user.store_id:
        raise HTTPException(status_code=404, detail="Product not found")
    return svc_update_product(db, product_id, payload)


@router.delete("/{product_id}", status_code=204)
def delete_product(
    product_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a product by ID, ensuring it belongs to the user's store."""
    product = svc_get_product(db, product_id)
    if not product or product.store_id != current_user.store_id:
        raise HTTPException(status_code=404, detail="Product not found")
    return svc_delete_product(db, product_id)
