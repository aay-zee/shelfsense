import api from "./api/axios";

// ── Dashboard loader ─────────────────────────────────────────────
export async function dashboardLoader() {
  const [
    countRes,
    countNRes,
    healthRes,
    todayRes,
    trendRes,
    velocityRes,
    restockRes,
  ] = await Promise.all([
    api.get("/products/count"),
    api.get("/products/count/recent?days=7"),
    api.get("/analytics/stock-health"),
    api.get("/analytics/today-sales"),
    api.get("/analytics/sales-trend?days=7"),
    api.get("/analytics/velocity?days=30"),
    api.get("/analytics/restock?days=30&threshold_days=7"),
  ]);

  const h = healthRes.data;
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return {
    totalProducts: countRes.data.count,
    countRecent: countNRes.data.count,
    lowStockCount: h.out_of_stock + h.critical + h.low,
    healthScore:
      h.total_products > 0
        ? Math.round((h.healthy / h.total_products) * 100)
        : 0,
    todaySales: todayRes.data,
    salesData: trendRes.data.map((d) => ({
      date: dayNames[new Date(d.date + "T00:00:00").getUTCDay()],
      sales: d.sales,
    })),
    velocityData: velocityRes.data.map((v) => ({
      name: v.product_name,
      velocity: v.velocity_per_day,
    })),
    alerts: restockRes.data.map((r) => ({
      id: r.product_id,
      product: r.product_name,
      currentStock: r.current_stock,
      daysLeft: r.days_of_stock_left,
      severity:
        r.days_of_stock_left <= 1
          ? "critical"
          : r.days_of_stock_left <= 3
            ? "warning"
            : "low",
    })),
  };
}

// ── Products loader ──────────────────────────────────────────────
export async function productsLoader() {
  const [prodRes, velRes] = await Promise.all([
    api.get("/products/"),
    api.get("/analytics/velocity?days=30"),
  ]);

  const velMap = {};
  for (const v of velRes.data) {
    velMap[v.product_id] =
      v.velocity_per_day >= 2
        ? "fast"
        : v.velocity_per_day >= 0.5
          ? "medium"
          : "slow";
  }

  return prodRes.data.map((p) => ({
    ...p,
    minStock: p.min_stock,
    velocity: velMap[p.id] || "slow",
    status:
      p.quantity <= 0
        ? "critical"
        : p.quantity < p.min_stock * 0.5
          ? "critical"
          : p.quantity < p.min_stock
            ? "warning"
            : p.quantity < p.min_stock * 1.5
              ? "low"
              : "healthy",
  }));
}
