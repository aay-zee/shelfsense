import { Theme } from "@radix-ui/themes";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  return (
    <Theme>
      <RouterProvider router={router} />
      <Toaster />
    </Theme>
  );
}
