from fastapi import APIRouter, Depends, HTTPException


router = APIRouter(prefix="/products", tags=["Products"])
