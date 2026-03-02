import uuid

from sqlalchemy.orm import Session

from backend.models.product import Product
from backend.schemas.product import ProductCreate


def create_product(db: Session, payload: ProductCreate, store_id: uuid.UUID) -> Product:
    """Create a new product linked to the caller's store."""
    product = Product(
        store_id=store_id,
        name=payload.name,
        sku=payload.sku,
        price=payload.price,
        quantity=payload.quantity,
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


def get_products_by_store(db: Session, store_id: uuid.UUID) -> list[Product]:
    """Fetch all products belonging to a store."""
    return db.query(Product).filter(Product.store_id == store_id).all()


def delete_product(db: Session, product_id: uuid.UUID) -> None:
    """Delete a product by its ID."""
    product = get_product(db, product_id)
    if product:
        db.delete(product)
        db.commit()
        return True
    return False


def update_product(db: Session, product_id: uuid.UUID, payload: ProductCreate) -> Product | None:
    """Update a product's details."""
    product = get_product(db, product_id)
    if not product:
        return None
    for field, value in payload.dict(exclude_unset=True).items():
        setattr(product, field, value)
    db.commit()
    db.refresh(product)
    return product
