import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import { Package } from "lucide-react";
import api from "../api/axios";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    localStorage.removeItem("access_token");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    const response = await api.post("/auth/login", formData, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    console.log("Login successful (Response):", response);
    const token = response.data.access_token;
    localStorage.setItem("access_token", token);
    navigate("/app");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Logo and Branding */}
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Package className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Smart Restock Assistant
            </h1>
            <p className="text-lg text-gray-600">
              Know what to restock, before it runs out
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="owner@myshop.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12"
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(!!checked)}
              />
              <Label
                htmlFor="remember"
                className="text-sm font-normal cursor-pointer"
              >
                Remember me
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-teal-500 hover:bg-teal-600 text-white"
            >
              Sign In
            </Button>
          </form>

          <div className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-teal-500 hover:text-teal-600 font-medium"
            >
              Get started
            </button>
          </div>
        </div>
      </div>

      {/* Right side - Illustration/Image */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-teal-50 to-blue-50 items-center justify-center p-8">
        <div className="max-w-lg text-center space-y-6">
          <img
            src="https://images.unsplash.com/photo-1761370571806-886404629697?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFsbCUyMHNob3AlMjBvd25lciUyMHJldGFpbCUyMHN0b3JlfGVufDF8fHx8MTc3MjE5MjQwN3ww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Shop owner managing inventory"
            className="w-full h-96 object-cover rounded-2xl shadow-2xl"
          />
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">
              Manage your inventory with confidence
            </h2>
            <p className="text-gray-600">
              Track products, monitor stock levels, and get smart restock
              recommendations — all in one place.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
