import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Lightbulb,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";

const lowStockAlerts = [
  {
    id: 1,
    product: "Milk (1L)",
    current: 5,
    min: 20,
    critical: true,
    suggested: 30,
  },
  {
    id: 2,
    product: "Cheese Slices",
    current: 3,
    min: 12,
    critical: true,
    suggested: 20,
  },
  {
    id: 3,
    product: "Bread (White)",
    current: 8,
    min: 15,
    critical: false,
    suggested: 25,
  },
  {
    id: 4,
    product: "Eggs (Dozen)",
    current: 12,
    min: 10,
    critical: false,
    suggested: 18,
  },
];

const restockRecommendations = [
  {
    id: 1,
    product: "Milk (1L)",
    reason: "High sales velocity + low stock",
    suggestedQty: 30,
    estimatedDays: 3,
    priority: "high",
  },
  {
    id: 2,
    product: "Bread (White)",
    reason: "Consistent daily demand",
    suggestedQty: 25,
    estimatedDays: 5,
    priority: "medium",
  },
  {
    id: 3,
    product: "Yogurt",
    reason: "Approaching minimum stock level",
    suggestedQty: 20,
    estimatedDays: 7,
    priority: "low",
  },
];

const fastMoving = [
  { id: 1, product: "Milk (1L)", soldPerWeek: 42, trend: "+12%" },
  { id: 2, product: "Bread (White)", soldPerWeek: 38, trend: "+8%" },
  { id: 3, product: "Eggs (Dozen)", soldPerWeek: 35, trend: "+15%" },
  { id: 4, product: "Yogurt", soldPerWeek: 28, trend: "+5%" },
];

const slowMoving = [
  { id: 1, product: "Cereal Box", soldPerWeek: 4, trend: "-3%" },
  { id: 2, product: "Specialty Cheese", soldPerWeek: 2, trend: "-5%" },
  { id: 3, product: "Organic Honey", soldPerWeek: 3, trend: "0%" },
];

export function Insights() {
  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Insights & Alerts</h1>
        <p className="text-gray-600 mt-1">
          Smart recommendations to optimize your inventory
        </p>
      </div>

      {/* Low Stock Alerts */}
      <Card className="shadow-sm border-l-4 border-l-red-500">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <CardTitle>Low Stock Alerts</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Products that need immediate attention
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {lowStockAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      alert.critical
                        ? "bg-red-500 animate-pulse"
                        : "bg-yellow-500"
                    }`}
                  />
                  <div>
                    <p className="font-semibold text-gray-900">
                      {alert.product}
                    </p>
                    <p className="text-sm text-gray-600">
                      Current:{" "}
                      <span className="font-medium">{alert.current}</span> •
                      Min: <span className="font-medium">{alert.min}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={alert.critical ? "destructive" : "default"}>
                    {alert.critical ? "Critical" : "Warning"}
                  </Badge>
                  <Button size="sm" className="bg-teal-500 hover:bg-teal-600">
                    Order {alert.suggested}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Restock Recommendations */}
      <Card className="shadow-sm border-l-4 border-l-blue-500">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <CardTitle>Smart Restock Recommendations</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Based on sales patterns and demand forecasting
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {restockRecommendations.map((rec) => (
              <div
                key={rec.id}
                className="p-4 bg-gradient-to-r from-blue-50 to-transparent rounded-lg border border-blue-100"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-semibold text-gray-900">
                        {rec.product}
                      </p>
                      <Badge
                        className={
                          rec.priority === "high"
                            ? "bg-red-100 text-red-700"
                            : rec.priority === "medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                        }
                      >
                        {rec.priority} priority
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{rec.reason}</p>
                    <p className="text-sm text-gray-500">
                      Estimated to last ~{rec.estimatedDays} days at current
                      rate
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-sm text-gray-600 mb-2">Suggested</p>
                    <p className="text-2xl font-bold text-teal-600">
                      {rec.suggestedQty}
                    </p>
                    <Button
                      size="sm"
                      className="mt-2 bg-teal-500 hover:bg-teal-600"
                    >
                      Add to Order
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fast Moving Products */}
        <Card className="shadow-sm border-l-4 border-l-green-500">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <CardTitle>Fast Moving Products</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Top performers this week
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {fastMoving.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-green-700">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {item.product}
                      </p>
                      <p className="text-sm text-gray-600">
                        {item.soldPerWeek} units/week
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700">
                    {item.trend}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Slow Moving Products */}
        <Card className="shadow-sm border-l-4 border-l-orange-500">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <CardTitle>Slow Moving Products</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Consider adjusting inventory
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {slowMoving.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-orange-700">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {item.product}
                      </p>
                      <p className="text-sm text-gray-600">
                        {item.soldPerWeek} units/week
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-orange-100 text-orange-700">
                    {item.trend}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-orange-50 rounded-lg">
              <p className="text-sm text-orange-800">
                💡 <strong>Tip:</strong> Consider reducing order quantities for
                slow-moving items to free up capital and storage space.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
