import {
  TrendingUp,
  TrendingDown,
  Package,
  DollarSign,
  RefreshCw,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useLoaderData } from "react-router";

export function Analytics() {
  const {
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
  } = useLoaderData();

  const efficiencyLabel =
    stockEfficiency >= 80
      ? "Excellent"
      : stockEfficiency >= 50
        ? "Good"
        : "Needs improvement";

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">
          Detailed insights into your store's performance
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Daily Sales</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {avgDailySales.toLocaleString()} Rs
                </p>
                <p
                  className={`text-sm mt-2 flex items-center gap-1 ${
                    salesChangePct >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {salesChangePct >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {salesChangePct >= 0 ? "+" : ""}
                  {salesChangePct}% vs prior period
                </p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Inventory Turnover</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {inventoryTurnover}x
                </p>
                <p className="text-sm text-teal-600 mt-2">
                  {Number(inventoryTurnover) >= 4
                    ? "Healthy rate"
                    : Number(inventoryTurnover) >= 2
                      ? "Moderate"
                      : "Low turnover"}
                </p>
              </div>
              <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-teal-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Best Seller</p>
                <p className="text-lg font-bold text-gray-900 mt-1">
                  {bestSeller.name}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  {bestSeller.sold} units sold
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Stock Efficiency</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stockEfficiency}%
                </p>
                <p className="text-sm text-green-600 mt-2">{efficiencyLabel}</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Sales Chart */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Weekly Sales Performance</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Revenue trends over the past month
              </p>
            </div>
            <Badge
              className={
                growthPct >= 0
                  ? "bg-teal-100 text-teal-700"
                  : "bg-red-100 text-red-700"
              }
            >
              {growthPct >= 0 ? "+" : ""}
              {growthPct}% Growth
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {weeklySalesData.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={weeklySalesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#14b8a6"
                  strokeWidth={3}
                  dot={{ fill: "#14b8a6", r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[350px] text-gray-400">
              No sales data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Product Performance Ranking */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Product Performance Ranking</CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            Top products by units sold this month
          </p>
        </CardHeader>
        <CardContent>
          {productPerformance.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={productPerformance} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" stroke="#9ca3af" />
                <YAxis
                  dataKey="product"
                  type="category"
                  width={80}
                  stroke="#9ca3af"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Bar
                  dataKey="revenue"
                  fill="#14b8a6"
                  radius={[0, 8, 8, 0]}
                  name="Units Sold"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[350px] text-gray-400">
              No product performance data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sales Velocity Distribution */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Sales Velocity Distribution</CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            How your products are performing based on movement speed
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {velocityData.map((item) => (
              <div key={item.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {item.name}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {item.value}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      item.name === "Fast Moving"
                        ? "bg-green-500"
                        : item.name === "Medium Moving"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>💡 Insight:</strong>{" "}
              {velocityData[0]?.value > 0
                ? `${velocityData[0].value}% of your products are fast-moving. Focus on maintaining adequate stock levels for these items to maximize sales opportunities.`
                : "Start recording sales to see velocity insights for your products."}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
