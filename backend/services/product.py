import uuid
from datetime import datetime, timezone, timedelta

from sqlalchemy.orm import Session

from models.product import Product
from schemas.product import ProductCreate, ProductUpdate


def create_product(db: Session, payload: ProductCreate, store_id: uuid.UUID) -> Product:
    """Create a new product linked to the caller's store."""
    product = Product(
        store_id=store_id,
        name=payload.name,
        sku=payload.sku,
        price=payload.price,
        quantity=payload.quantity,
        min_stock=payload.min_stock,
        unit_type=payload.unit_type,
        unit_label=payload.unit_label,
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


def get_product(db: Session, product_id: uuid.UUID) -> Product | None:
    """Fetch a product by its ID."""
    return db.query(Product).filter(Product.id == product_id).first()


def count_products_by_store(db: Session, store_id: uuid.UUID) -> int:
    """Return the total number of products belonging to a store."""
    return db.query(Product).filter(Product.store_id == store_id).count()


def count_recent_products_by_store(db: Session, store_id: uuid.UUID, days: int) -> int:
    """Return the number of products added in the last *days* days."""
    cutoff = datetime.now(timezone.utc) - timedelta(days=days)
    return (
        db.query(Product)
        .filter(Product.store_id == store_id, Product.created_at >= cutoff)
        .count()
    )


def get_products_by_store(
    db: Session, store_id: uuid.UUID, skip: int = 0, limit: int = 50
) -> list[Product]:
    """Fetch products belonging to a store with pagination."""
    return (
        db.query(Product)
        .filter(Product.store_id == store_id)
        .offset(skip)
        .limit(limit)
        .all()
    )


def delete_product(db: Session, product_id: uuid.UUID) -> None:
    """Delete a product by its ID."""
    product = get_product(db, product_id)
    if product:
        db.delete(product)
        db.commit()


def update_product(db: Session, product_id: uuid.UUID, payload: ProductUpdate) -> Product | None:
    """Update a product's details."""
    product = get_product(db, product_id)
    if not product:
        return None
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(product, field, value)
    db.commit()
    db.refresh(product)
    return product
