from fastapi import FastAPI

app = FastAPI(title="ShelfSense")


@app.get("/")
def root():
    return {"message": "Welcome to ShelfSense!"}
