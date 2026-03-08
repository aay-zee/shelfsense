import { createBrowserRouter } from "react-router";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Dashboard } from "./pages/Dashboard";
import { Products } from "./pages/Products";
import { dashboardLoader, productsLoader } from "./loaders";
import { RecordSale } from "./pages/RecordSale";
import { Insights } from "./pages/Insights";
import { Analytics } from "./pages/Analytics";
import { Settings } from "./pages/Settings";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/app",
    Component: ProtectedRoute,
    children: [
      {
        Component: Layout,
        children: [
          { index: true, Component: Dashboard, loader: dashboardLoader },
          { path: "products", Component: Products, loader: productsLoader },
          { path: "record-sale", Component: RecordSale },
          { path: "insights", Component: Insights },
          { path: "analytics", Component: Analytics },
          { path: "settings", Component: Settings },
        ],
      },
    ],
  },
]);
