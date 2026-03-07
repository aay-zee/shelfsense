// import { TrendingUp, Package, DollarSign, RefreshCw } from "lucide-react";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "../components/ui/card";
// import { Badge } from "../components/ui/badge";
// import {
//   LineChart,
//   Line,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
// } from "recharts";

// // Mock data
// const weeklySalesData = [
//   { week: "Week 1", sales: 3200 },
//   { week: "Week 2", sales: 2800 },
//   { week: "Week 3", sales: 3600 },
//   { week: "Week 4", sales: 4100 },
// ];

// const productPerformance = [
//   { product: "Milk", revenue: 1250, sales: 250 },
//   { product: "Bread", revenue: 980, sales: 394 },
//   { product: "Eggs", revenue: 850, sales: 142 },
//   { product: "Juice", revenue: 720, sales: 111 },
//   { product: "Butter", revenue: 650, sales: 145 },
//   { product: "Yogurt", revenue: 580, sales: 145 },
//   { product: "Cheese", revenue: 450, sales: 82 },
//   { product: "Cereal", revenue: 320, sales: 40 },
// ];

// const categoryData = [
//   { name: "Dairy", value: 45, color: "#14b8a6" },
//   { name: "Bakery", value: 25, color: "#3b82f6" },
//   { name: "Beverages", value: 15, color: "#f59e0b" },
//   { name: "Others", value: 15, color: "#8b5cf6" },
// ];

// const velocityData = [
//   { name: "Fast Moving", value: 35 },
//   { name: "Medium Moving", value: 48 },
//   { name: "Slow Moving", value: 17 },
// ];

// export function Analytics() {
//   return (
//     <div className="p-8 space-y-6">
//       {/* Header */}
//       <div>
//         <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
//         <p className="text-gray-600 mt-1">
//           Detailed insights into your store's performance
//         </p>
//       </div>

//       {/* Key Metrics */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <Card className="shadow-sm">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">Avg. Daily Sales</p>
//                 <p className="text-2xl font-bold text-gray-900 mt-1">$487</p>
//                 <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
//                   <TrendingUp className="w-3 h-3" />
//                   +12% vs last month
//                 </p>
//               </div>
//               <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
//                 <DollarSign className="w-6 h-6 text-green-500" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="shadow-sm">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">Inventory Turnover</p>
//                 <p className="text-2xl font-bold text-gray-900 mt-1">6.2x</p>
//                 <p className="text-sm text-teal-600 mt-2">Healthy rate</p>
//               </div>
//               <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center">
//                 <RefreshCw className="w-6 h-6 text-teal-500" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="shadow-sm">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">Best Seller</p>
//                 <p className="text-lg font-bold text-gray-900 mt-1">
//                   Milk (1L)
//                 </p>
//                 <p className="text-sm text-gray-600 mt-2">250 units sold</p>
//               </div>
//               <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
//                 <Package className="w-6 h-6 text-blue-500" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="shadow-sm">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">Stock Efficiency</p>
//                 <p className="text-2xl font-bold text-gray-900 mt-1">87%</p>
//                 <p className="text-sm text-green-600 mt-2">Excellent</p>
//               </div>
//               <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
//                 <TrendingUp className="w-6 h-6 text-purple-500" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Weekly Sales Chart */}
//       <Card className="shadow-sm">
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <div>
//               <CardTitle>Weekly Sales Performance</CardTitle>
//               <p className="text-sm text-gray-600 mt-1">
//                 Revenue trends over the past month
//               </p>
//             </div>
//             <Badge className="bg-teal-100 text-teal-700">+15% Growth</Badge>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <ResponsiveContainer width="100%" height={350}>
//             <LineChart data={weeklySalesData}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//               <XAxis dataKey="week" stroke="#9ca3af" />
//               <YAxis stroke="#9ca3af" />
//               <Tooltip
//                 contentStyle={{
//                   backgroundColor: "#fff",
//                   border: "1px solid #e5e7eb",
//                   borderRadius: "8px",
//                 }}
//               />
//               <Line
//                 type="monotone"
//                 dataKey="sales"
//                 stroke="#14b8a6"
//                 strokeWidth={3}
//                 dot={{ fill: "#14b8a6", r: 6 }}
//                 activeDot={{ r: 8 }}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </CardContent>
//       </Card>

//       {/* Product Performance and Category Distribution */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Product Performance Ranking */}
//         <Card className="shadow-sm lg:col-span-2">
//           <CardHeader>
//             <CardTitle>Product Performance Ranking</CardTitle>
//             <p className="text-sm text-gray-600 mt-1">
//               Top products by revenue this month
//             </p>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={350}>
//               <BarChart data={productPerformance} layout="horizontal">
//                 <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                 <XAxis type="number" stroke="#9ca3af" />
//                 <YAxis
//                   dataKey="product"
//                   type="category"
//                   width={80}
//                   stroke="#9ca3af"
//                 />
//                 <Tooltip
//                   contentStyle={{
//                     backgroundColor: "#fff",
//                     border: "1px solid #e5e7eb",
//                     borderRadius: "8px",
//                   }}
//                 />
//                 <Bar dataKey="revenue" fill="#14b8a6" radius={[0, 8, 8, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>

//         {/* Category Distribution */}
//         <Card className="shadow-sm">
//           <CardHeader>
//             <CardTitle>Sales by Category</CardTitle>
//             <p className="text-sm text-gray-600 mt-1">Revenue distribution</p>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={200}>
//               <PieChart>
//                 <Pie
//                   data={categoryData}
//                   cx="50%"
//                   cy="50%"
//                   innerRadius={50}
//                   outerRadius={80}
//                   paddingAngle={5}
//                   dataKey="value"
//                 >
//                   {categoryData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.color} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//             <div className="space-y-2 mt-4">
//               {categoryData.map((item) => (
//                 <div
//                   key={item.name}
//                   className="flex items-center justify-between"
//                 >
//                   <div className="flex items-center gap-2">
//                     <div
//                       className="w-3 h-3 rounded-full"
//                       style={{ backgroundColor: item.color }}
//                     />
//                     <span className="text-sm text-gray-700">{item.name}</span>
//                   </div>
//                   <span className="text-sm font-semibold text-gray-900">
//                     {item.value}%
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Sales Velocity Distribution */}
//       <Card className="shadow-sm">
//         <CardHeader>
//           <CardTitle>Sales Velocity Distribution</CardTitle>
//           <p className="text-sm text-gray-600 mt-1">
//             How your products are performing based on movement speed
//           </p>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             {velocityData.map((item) => (
//               <div key={item.name}>
//                 <div className="flex items-center justify-between mb-2">
//                   <span className="text-sm font-medium text-gray-700">
//                     {item.name}
//                   </span>
//                   <span className="text-sm font-semibold text-gray-900">
//                     {item.value}%
//                   </span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
//                   <div
//                     className={`h-full rounded-full ${
//                       item.name === "Fast Moving"
//                         ? "bg-green-500"
//                         : item.name === "Medium Moving"
//                           ? "bg-yellow-500"
//                           : "bg-red-500"
//                     }`}
//                     style={{ width: `${item.value}%` }}
//                   />
//                 </div>
//               </div>
//             ))}
//           </div>
//           <div className="mt-6 p-4 bg-blue-50 rounded-lg">
//             <p className="text-sm text-blue-900">
//               <strong>💡 Insight:</strong> 35% of your products are fast-moving.
//               Focus on maintaining adequate stock levels for these items to
//               maximize sales opportunities.
//             </p>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
