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
        ? Math.round(((h.healthy + h.overstocked) / h.total_products) * 100)
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
      minStock: r.min_stock,
      daysLeft: r.days_of_stock_left,
      severity: r.severity,
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
// ── Record Sale loader ───────────────────────────────────────────
export async function recordSaleLoader() {
  const res = await api.get("/products/?limit=200");
  return res.data;
}

// ── Insights loader ──────────────────────────────────────────────
export async function insightsLoader() {
  const [restockRes, fastRes, slowRes] = await Promise.all([
    api.get("/analytics/restock?days=30&threshold_days=7"),
    api.get("/analytics/fast-moving?days=7&limit=10"),
    api.get("/analytics/slow-moving?days=7&limit=10"),
  ]);

  return {
    restockAlerts: restockRes.data,
    fastMoving: fastRes.data,
    slowMoving: slowRes.data,
  };
}

// ── Analytics loader ─────────────────────────────────────────────
export async function analyticsLoader() {
  const [trendRes, healthRes, velocityRes, fastRes, productsRes] =
    await Promise.all([
      api.get("/analytics/sales-trend?days=30"),
      api.get("/analytics/stock-health"),
      api.get("/analytics/velocity?days=30"),
      api.get("/analytics/fast-moving?days=30&limit=8"),
      api.get("/products/?limit=200"),
    ]);

  const trend = trendRes.data; // [{date, sales}, …]  (30 days)
  const health = healthRes.data;
  const velocity = velocityRes.data; // [{product_id, product_name, total_sold, velocity_per_day}, …]
  const fastMoving = fastRes.data;
  const products = productsRes.data;

  // ── KPI: Average daily sales (last 30 days) ──
  const totalSales30 = trend.reduce((s, d) => s + d.sales, 0);
  const avgDailySales =
    trend.length > 0 ? Math.round(totalSales30 / trend.length) : 0;

  // ── KPI: Inventory turnover ──
  // turnover = (total units sold) / (avg stock). Rough approx from velocity & products.
  const totalUnitsSold = velocity.reduce((s, v) => s + v.total_sold, 0);
  const totalStock = products.reduce((s, p) => s + Number(p.quantity), 0);
  const inventoryTurnover =
    totalStock > 0 ? (totalUnitsSold / totalStock).toFixed(1) : "0.0";

  // ── KPI: Best seller ──
  const bestSeller =
    fastMoving.length > 0
      ? { name: fastMoving[0].product_name, sold: fastMoving[0].total_sold }
      : { name: "—", sold: 0 };

  // ── KPI: Stock efficiency ──
  const stockEfficiency =
    health.total_products > 0
      ? Math.round(
          ((health.healthy + (health.overstocked || 0)) /
            health.total_products) *
            100,
        )
      : 0;

  // ── Weekly sales chart (aggregate 30 daily points → 4/5 weeks) ──
  const weeklySalesData = [];
  for (let i = 0; i < trend.length; i += 7) {
    const weekSlice = trend.slice(i, i + 7);
    const weekTotal = weekSlice.reduce((s, d) => s + d.sales, 0);
    weeklySalesData.push({
      week: `Week ${weeklySalesData.length + 1}`,
      sales: Math.round(weekTotal),
    });
  }

  // ── Growth badge (compare last week vs previous week) ──
  let growthPct = 0;
  if (weeklySalesData.length >= 2) {
    const last = weeklySalesData[weeklySalesData.length - 1].sales;
    const prev = weeklySalesData[weeklySalesData.length - 2].sales;
    growthPct = prev > 0 ? Math.round(((last - prev) / prev) * 100) : 0;
  }

  // ── Product performance ranking (top 8 by units sold) ──
  const productPerformance = fastMoving.map((f) => ({
    product: f.product_name,
    revenue: f.total_sold, // units sold (best available metric)
    sales: Math.round(f.velocity_per_day * 30),
  }));

  // ── Unit type distribution (pie chart) ──
  const unitCounts = {};
  const UNIT_LABELS = {
    COUNT: "Count Items",
    WEIGHT: "Weight Items",
    VOLUME: "Volume Items",
  };
  const UNIT_COLORS = {
    COUNT: "#14b8a6",
    WEIGHT: "#3b82f6",
    VOLUME: "#f59e0b",
  };
  for (const p of products) {
    const t = p.unit_type || "COUNT";
    unitCounts[t] = (unitCounts[t] || 0) + 1;
  }
  const total = products.length || 1;
  const categoryData = Object.entries(unitCounts).map(([key, count]) => ({
    name: UNIT_LABELS[key] || key,
    value: Math.round((count / total) * 100),
    color: UNIT_COLORS[key] || "#8b5cf6",
  }));

  // ── Velocity distribution (fast / medium / slow %) ──
  let fast = 0;
  let medium = 0;
  let slow = 0;
  for (const v of velocity) {
    if (v.velocity_per_day >= 2) fast++;
    else if (v.velocity_per_day >= 0.5) medium++;
    else slow++;
  }
  // Include products with zero sales as slow
  const productsWithSales = new Set(velocity.map((v) => v.product_id));
  const zeroSalesCount = products.filter(
    (p) => !productsWithSales.has(p.id),
  ).length;
  slow += zeroSalesCount;

  const velTotal = fast + medium + slow || 1;
  const velocityData = [
    { name: "Fast Moving", value: Math.round((fast / velTotal) * 100) },
    { name: "Medium Moving", value: Math.round((medium / velTotal) * 100) },
    { name: "Slow Moving", value: Math.round((slow / velTotal) * 100) },
  ];

  // ── Sales change vs last month (avg daily this month vs prev) ──
  const firstHalf = trend.slice(0, 15);
  const secondHalf = trend.slice(15);
  const avgFirst =
    firstHalf.length > 0
      ? firstHalf.reduce((s, d) => s + d.sales, 0) / firstHalf.length
      : 0;
  const avgSecond =
    secondHalf.length > 0
      ? secondHalf.reduce((s, d) => s + d.sales, 0) / secondHalf.length
      : 0;
  const salesChangePct =
    avgFirst > 0 ? Math.round(((avgSecond - avgFirst) / avgFirst) * 100) : 0;

  return {
    avgDailySales,
    salesChangePct,
    inventoryTurnover,
    bestSeller,
    stockEfficiency,
    weeklySalesData,
    growthPct,
    productPerformance,
    categoryData,
    velocityData,
    fastCount: fast,
  };
}

// ── Settings loader ──────────────────────────────────────────────
export async function settingsLoader() {
  const [userRes, storeRes] = await Promise.all([
    api.get("/auth/me"),
    api.get("/stores/my-store"),
  ]);

  return {
    user: userRes.data,
    store: storeRes.data,
  };
}
