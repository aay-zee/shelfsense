import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from core.database import get_db
from core.deps import get_current_user
from schemas.store import StoreCreate, StoreRead
from services.store import create_store, get_store, get_all_stores

router = APIRouter(
    prefix="/stores",
    tags=["Stores"],
    dependencies=[Depends(get_current_user)],
)


# For admin I think
# @router.post("/", response_model=StoreRead, status_code=201)
# def create(payload: StoreCreate, db: Session = Depends(get_db)):
#     """Create a new store."""
#     return create_store(db, payload)

# #for admin i think
# @router.get("/", response_model=list[StoreRead])
# def read_all(db: Session = Depends(get_db)):
#     """List every store."""
#     return get_all_stores(db)


# #for admin i think
# @router.get("/{store_id}", response_model=StoreRead)
# def read_one(store_id: uuid.UUID, db: Session = Depends(get_db)):
#     """Get a single store by ID."""
#     store = get_store(db, store_id)
#     if not store:
#         raise HTTPException(status_code=404, detail="Store not found")
#     return store
