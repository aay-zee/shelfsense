from datetime import datetime, timezone, timedelta

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func
from sqlalchemy.orm import Session

from core.database import get_db
from core.deps import get_current_user
from models.user import User
from models.product import Product
from models.sale import Sale
from models.sale_item import SaleItem

router = APIRouter(prefix="/analytics", tags=["Analytics"])


# ── helper ─────────────────────────────────────────────────────────
def _velocity_query(db: Session, store_id, cutoff: datetime):
    """
    Return rows of (product_id, product_name, total_sold) for a store
    within the given time window.
    """
    return (
        db.query(
            SaleItem.product_id,
            Product.name.label("product_name"),
            func.sum(SaleItem.quantity).label("total_sold"),
        )
        .join(Sale, SaleItem.sale_id == Sale.id)
        .join(Product, SaleItem.product_id == Product.id)
        .filter(Sale.store_id == store_id)
        .filter(Sale.created_at >= cutoff)
        .group_by(SaleItem.product_id, Product.name)
    )


# ── 1. Product Sales Velocity ─────────────────────────────────────
@router.get("/velocity")
def product_sales_velocity(
    days: int = Query(30, ge=1),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Units sold per day for every product over the last *days* days."""
    cutoff = datetime.now(timezone.utc) - timedelta(days=days)
    rows = _velocity_query(db, current_user.store_id, cutoff).all()

    return [
        {
            "product_id": str(r.product_id),
            "product_name": r.product_name,
            "total_sold": r.total_sold,
            "days": days,
            "velocity_per_day": round(r.total_sold / days, 4),
        }
        for r in rows
    ]


# ── 2. Restock Recommendations ────────────────────────────────────
@router.get("/restock")
def restock_recommendations(
    days: int = Query(30, ge=1),
    threshold_days: int = Query(7, ge=1),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Products whose current stock will run out within *threshold_days*
    based on recent sales velocity.
    """
    cutoff = datetime.now(timezone.utc) - timedelta(days=days)
    rows = _velocity_query(db, current_user.store_id, cutoff).all()

    # Build a velocity map: product_id → (product_name, velocity)
    velocity_map: dict = {}
    for r in rows:
        velocity_map[r.product_id] = {
            "product_name": r.product_name,
            "velocity_per_day": r.total_sold / days,
        }

    products = (
        db.query(Product)
        .filter(Product.store_id == current_user.store_id)
        .all()
    )

    recommendations = []
    for p in products:
        info = velocity_map.get(p.id)
        vel = info["velocity_per_day"] if info else 0
        days_left = p.quantity / vel if vel > 0 else float("inf")

        if days_left <= threshold_days:
            recommended_qty = max(0, round(vel * days - p.quantity, 2))
            recommendations.append(
                {
                    "product_id": str(p.id),
                    "product_name": p.name,
                    "current_stock": p.quantity,
                    "velocity_per_day": round(vel, 4),
                    "days_of_stock_left": round(days_left, 2),
                    "recommended_restock_qty": recommended_qty,
                }
            )

    # Most urgent first
    recommendations.sort(key=lambda x: x["days_of_stock_left"])
    return recommendations


# ── 3. Fast-Moving Items ──────────────────────────────────────────
@router.get("/fast-moving")
def fast_moving_items(
    days: int = Query(30, ge=1),
    limit: int = Query(10, ge=1),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Top *limit* products by total units sold in the last *days* days."""
    cutoff = datetime.now(timezone.utc) - timedelta(days=days)
    rows = (
        _velocity_query(db, current_user.store_id, cutoff)
        .order_by(func.sum(SaleItem.quantity).desc())
        .limit(limit)
        .all()
    )

    return [
        {
            "product_id": str(r.product_id),
            "product_name": r.product_name,
            "total_sold": r.total_sold,
            "velocity_per_day": round(r.total_sold / days, 4),
        }
        for r in rows
    ]


# ── 4. Slow-Moving Items ─────────────────────────────────────────
@router.get("/slow-moving")
def slow_moving_items(
    days: int = Query(30, ge=1),
    limit: int = Query(10, ge=1),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Bottom *limit* products by units sold (includes products with zero
    sales in the window).
    """
    cutoff = datetime.now(timezone.utc) - timedelta(days=days)

    # Left-join so products with NO sales still appear (total_sold = 0).
    rows = (
        db.query(
            Product.id.label("product_id"),
            Product.name.label("product_name"),
            func.coalesce(func.sum(SaleItem.quantity), 0).label("total_sold"),
        )
        .outerjoin(SaleItem, SaleItem.product_id == Product.id)
        .outerjoin(
            Sale,
            (SaleItem.sale_id == Sale.id) & (Sale.created_at >= cutoff),
        )
        .filter(Product.store_id == current_user.store_id)
        .group_by(Product.id, Product.name)
        .order_by(func.coalesce(func.sum(SaleItem.quantity), 0).asc())
        .limit(limit)
        .all()
    )

    return [
        {
            "product_id": str(r.product_id),
            "product_name": r.product_name,
            "total_sold": r.total_sold,
            "velocity_per_day": round(r.total_sold / days, 4),
        }
        for r in rows
    ]


# ── 5. Stock Health Summary ───────────────────────────────────────
@router.get("/stock-health")
def stock_health_summary(
    days: int = Query(30, ge=1),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Aggregate inventory-health snapshot.

    Categories:
      • out_of_stock  – quantity is 0
      • critical       – ≤ 3 days of stock left
      • low            – ≤ 7 days of stock left
      • healthy        – 7 < days left ≤ 90
      • overstocked    – > 90 days of stock left (or no sales at all)
    """
    cutoff = datetime.now(timezone.utc) - timedelta(days=days)
    velocity_rows = _velocity_query(db, current_user.store_id, cutoff).all()

    velocity_map = {r.product_id: r.total_sold / days for r in velocity_rows}

    products = (
        db.query(Product)
        .filter(Product.store_id == current_user.store_id)
        .all()
    )

    summary = {
        "total_products": len(products),
        "total_stock_value": 0.0,
        "out_of_stock": 0,
        "critical": 0,
        "low": 0,
        "healthy": 0,
        "overstocked": 0,
    }

    for p in products:
        summary["total_stock_value"] += p.quantity * p.price
        vel = velocity_map.get(p.id, 0)

        if p.quantity == 0:
            summary["out_of_stock"] += 1
        elif vel > 0:
            days_left = p.quantity / vel
            if days_left <= 3:
                summary["critical"] += 1
            elif days_left <= 7:
                summary["low"] += 1
            elif days_left > 90:
                summary["overstocked"] += 1
            else:
                summary["healthy"] += 1
        else:
            # No sales in the window → stock isn't moving
            summary["overstocked"] += 1

    summary["total_stock_value"] = round(summary["total_stock_value"], 2)
    return summary
