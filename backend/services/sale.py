import uuid

from sqlalchemy.orm import Session

from models.sale import Sale
from models.sale_item import SaleItem
from schemas.sale import SaleCreate


def create_sale(
    db: Session,
    payload: SaleCreate,
    store_id: uuid.UUID,
    user_id: uuid.UUID,
) -> Sale:
    """
    Create a sale with its line items.
    total_amount is computed server-side from item quantities × prices.
    """
    total = sum(item.quantity * item.price_at_sale for item in payload.items)

    sale = Sale(
        store_id=store_id,
        user_id=user_id,
        total_amount=total,
    )
    db.add(sale)
    db.flush()  # generates sale.id so we can reference it in items

    for item in payload.items:
        sale_item = SaleItem(
            sale_id=sale.id,
            product_id=item.product_id,
            quantity=item.quantity,
            price_at_sale=item.price_at_sale,
        )
        db.add(sale_item)

    db.commit()
    db.refresh(sale)
    return sale


def get_sale(db: Session, sale_id: uuid.UUID) -> Sale | None:
    """Fetch a single sale by ID (includes items via relationship)."""
    return db.query(Sale).filter(Sale.id == sale_id).first()


def get_sales_by_store(db: Session, store_id: uuid.UUID) -> list[Sale]:
    """Fetch all sales belonging to a store."""
    return db.query(Sale).filter(Sale.store_id == store_id).all()


def delete_sale(db: Session, sale_id: uuid.UUID) -> bool:
    """Delete a sale and its items (cascade)."""
    sale = get_sale(db, sale_id)
    if sale:
        db.delete(sale)
        db.commit()
        return True
    return False
