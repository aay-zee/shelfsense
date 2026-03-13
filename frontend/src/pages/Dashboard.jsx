import {
  Package,
  AlertTriangle,
  DollarSign,
  Activity,
  Plus,
  ShoppingCart,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
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
import { useNavigate, useLoaderData } from "react-router";

export function Dashboard() {
  const navigate = useNavigate();

  const {
    totalProducts,
    countRecent,
    lowStockCount,
    healthScore,
    todaySales,
    salesData,
    velocityData,
    alerts,
  } = useLoaderData();

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's what's happening today.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => navigate("/app/products")}
            variant="outline"
            className="h-10"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
          <Button
            onClick={() => navigate("/app/record-sale")}
            className="h-10 bg-teal-500 hover:bg-teal-600"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Record Sale
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {totalProducts}
                </p>
                <p className="text-sm text-green-600 mt-2">
                  +{countRecent} this week
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
                <p className="text-sm text-gray-600">Low Stock Items</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {lowStockCount}
                </p>
                <p className="text-sm text-red-600 mt-2">
                  {lowStockCount > 0 ? "Needs attention" : "All good"}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Sales</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {todaySales.total.toLocaleString()} Rs
                </p>
                <p className="text-sm text-green-600 mt-2">
                  {todaySales.count} transactions
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
                <p className="text-sm text-gray-600">Stock Health Score</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {healthScore}%
                </p>
                <p className="text-sm text-teal-600 mt-2">
                  {healthScore >= 80
                    ? "Good condition"
                    : healthScore >= 50
                      ? "Needs improvement"
                      : "Poor condition"}
                </p>
              </div>
              <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-teal-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Sales Trend</CardTitle>
            <p className="text-sm text-gray-600">Last 7 days performance</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#14b8a6"
                  strokeWidth={3}
                  dot={{ fill: "#14b8a6", r: 4 }}
                  name="Daily Sales"
                  isAnimationActive={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Product Velocity */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Product Velocity</CardTitle>
            <p className="text-sm text-gray-600">Fast vs slow moving items</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={velocityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Bar
                  dataKey="velocity"
                  fill="#14b8a6"
                  radius={[8, 8, 0, 0]}
                  name="Velocity Score"
                  isAnimationActive={true}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Panel */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Low Stock Alerts</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Products that need restocking soon
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/app/insights")}
            >
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      alert.severity === "critical"
                        ? "bg-red-500"
                        : alert.severity === "warning"
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                    }`}
                  />
                  <div>
                    <p className="font-medium text-gray-900">{alert.product}</p>
                    <p className="text-sm text-gray-600">
                      Stock: {alert.currentStock}
                      {alert.minStock > 0 && ` / Min: ${alert.minStock}`}
                      {alert.daysLeft != null &&
                        ` • ~${alert.daysLeft} days left`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant={
                      alert.severity === "critical"
                        ? "destructive"
                        : alert.severity === "warning"
                          ? "default"
                          : "secondary"
                    }
                  >
                    {alert.severity === "critical"
                      ? "Critical"
                      : alert.severity === "warning"
                        ? "Warning"
                        : "Low"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
