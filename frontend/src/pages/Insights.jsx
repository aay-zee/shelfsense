import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Lightbulb,
  PackageOpen,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { useLoaderData } from "react-router";

export function Insights() {
  const { restockAlerts, fastMoving, slowMoving } = useLoaderData();

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
          {restockAlerts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <PackageOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>All products are well-stocked!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {restockAlerts.map((alert) => (
                <div
                  key={alert.product_id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        alert.severity === "critical"
                          ? "bg-red-500 animate-pulse"
                          : "bg-yellow-500"
                      }`}
                    />
                    <div>
                      <p className="font-semibold text-gray-900">
                        {alert.product_name}
                      </p>
                      <p className="text-sm text-gray-600">
                        Stock:{" "}
                        <span className="font-medium">
                          {Number(alert.current_stock)}
                        </span>
                        {alert.min_stock > 0 && (
                          <>
                            {" "}
                            • Min:{" "}
                            <span className="font-medium">
                              {alert.min_stock}
                            </span>
                          </>
                        )}
                        {alert.days_of_stock_left != null && (
                          <> • ~{alert.days_of_stock_left} days left</>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        alert.severity === "critical"
                          ? "destructive"
                          : "default"
                      }
                    >
                      {alert.severity === "critical" ? "Critical" : "Warning"}
                    </Badge>
                    <Button size="sm" className="bg-teal-500 hover:bg-teal-600">
                      Order {alert.recommended_restock_qty}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
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
          {restockAlerts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Lightbulb className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No restock recommendations at this time</p>
            </div>
          ) : (
            <div className="space-y-3">
              {restockAlerts.map((rec) => (
                <div
                  key={rec.product_id}
                  className="p-4 bg-gradient-to-r from-blue-50 to-transparent rounded-lg border border-blue-100"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-semibold text-gray-900">
                          {rec.product_name}
                        </p>
                        <Badge
                          className={
                            rec.severity === "critical"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }
                        >
                          {rec.severity === "critical" ? "high" : "medium"}{" "}
                          priority
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {rec.velocity_per_day > 0
                          ? `Selling ~${(rec.velocity_per_day * 7).toFixed(1)} units/week`
                          : "Below minimum stock level"}
                        {rec.days_of_stock_left != null &&
                          ` • ~${rec.days_of_stock_left} days of stock left`}
                      </p>
                      <p className="text-sm text-gray-500">
                        Current stock: {Number(rec.current_stock)}
                        {rec.min_stock > 0 &&
                          ` • Min required: ${rec.min_stock}`}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-sm text-gray-600 mb-2">Suggested</p>
                      <p className="text-2xl font-bold text-teal-600">
                        {rec.recommended_restock_qty}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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
            {fastMoving.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <TrendingUp className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No sales data yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {fastMoving.map((item, index) => (
                  <div
                    key={item.product_id}
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
                          {item.product_name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {Number(item.total_sold)} units/week
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700">
                      {(item.velocity_per_day * 7).toFixed(1)}/wk
                    </Badge>
                  </div>
                ))}
              </div>
            )}
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
            {slowMoving.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <TrendingDown className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No product data yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {slowMoving.map((item, index) => (
                  <div
                    key={item.product_id}
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
                          {item.product_name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {Number(item.total_sold)} units/week
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-orange-100 text-orange-700">
                      {(item.velocity_per_day * 7).toFixed(1)}/wk
                    </Badge>
                  </div>
                ))}
              </div>
            )}
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
