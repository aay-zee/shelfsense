from fastapi import FastAPI
from api.store import router as store_router

app = FastAPI(title="ShelfSense")

# ── register routers ──
app.include_router(store_router)


@app.get("/")
def root():
    return {"message": "Welcome to ShelfSense!"}
