from fastapi import FastAPI

# Import ALL models so SQLAlchemy registers them before any query runs.
# Without this, relationship("Product") etc. fail with "failed to locate a name".
import models.user        # noqa: F401
import models.store       # noqa: F401
import models.product     # noqa: F401
import models.sale        # noqa: F401
import models.sale_item   # noqa: F401

from api.auth import router as auth_router
from api.store import router as store_router
from api.product import router as product_router
from api.sale import router as sale_router
from api.sale_item import router as sale_item_router
from api.user import router as user_router


app = FastAPI(title="ShelfSense")


@app.get("/")
def root():
    return {"message": "Welcome to ShelfSense!"}


# ── register routers ──
app.include_router(auth_router)
app.include_router(store_router)
app.include_router(product_router)
app.include_router(sale_router)
app.include_router(sale_item_router)
app.include_router(user_router)
