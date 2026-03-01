import uuid
from sqlalchemy.orm import Session

from models.store import Store
from schemas.store import StoreCreate


def create_store(db: Session, payload: StoreCreate) -> Store:
    """Insert a new store and return it."""
    store = Store(name=payload.name)
    db.add(store)
    db.commit()
    db.refresh(store)          # reload so .id and .created_at are populated
    return store


def get_store(db: Session, store_id: uuid.UUID) -> Store | None:
    """Return a single store by ID, or None."""
    return db.query(Store).filter(Store.id == store_id).first()


def get_all_stores(db: Session) -> list[Store]:
    """Return every store."""
    return db.query(Store).all()
