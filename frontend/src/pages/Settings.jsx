import { useState } from "react";
import { User, Bell, Store, Lock, Mail } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Switch } from "../components/ui/switch";
import { Separator } from "../components/ui/separator";
import { toast } from "sonner";

export function Settings() {
  const [notifications, setNotifications] = useState({
    lowStock: true,
    dailyReport: false,
    weeklyReport: true,
    restockSuggestions: true,
  });

  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

  return (
    <div className="p-8 space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your account and preferences
        </p>
      </div>

      {/* Store Information */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
              <Store className="w-5 h-5 text-teal-500" />
            </div>
            <CardTitle>Store Information</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="storeName">Store Name</Label>
              <Input
                id="storeName"
                defaultValue="My Corner Store"
                className="h-11"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="storeAddress">Address</Label>
              <Input
                id="storeAddress"
                defaultValue="123 Main Street, City, State"
                className="h-11"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  defaultValue="+1 (555) 123-4567"
                  className="h-11"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue="owner@mystore.com"
                  className="h-11"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Settings */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-blue-500" />
            </div>
            <CardTitle>Account Settings</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" defaultValue="John" className="h-11" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" defaultValue="Doe" className="h-11" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="accountEmail">Email Address</Label>
              <Input
                id="accountEmail"
                type="email"
                defaultValue="john.doe@example.com"
                className="h-11"
              />
            </div>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">
              Change Password
            </h3>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" className="h-11" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" className="h-11" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" className="h-11" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-yellow-500" />
            </div>
            <CardTitle>Notification Preferences</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium text-gray-900">Low Stock Alerts</p>
              <p className="text-sm text-gray-600">
                Get notified when products are running low
              </p>
            </div>
            <Switch
              checked={notifications.lowStock}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, lowStock: checked })
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium text-gray-900">Daily Sales Report</p>
              <p className="text-sm text-gray-600">
                Receive a daily summary of your sales
              </p>
            </div>
            <Switch
              checked={notifications.dailyReport}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, dailyReport: checked })
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium text-gray-900">Weekly Report</p>
              <p className="text-sm text-gray-600">
                Get a comprehensive weekly performance report
              </p>
            </div>
            <Switch
              checked={notifications.weeklyReport}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, weeklyReport: checked })
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium text-gray-900">Restock Suggestions</p>
              <p className="text-sm text-gray-600">
                Smart recommendations for restocking products
              </p>
            </div>
            <Switch
              checked={notifications.restockSuggestions}
              onCheckedChange={(checked) =>
                setNotifications({
                  ...notifications,
                  restockSuggestions: checked,
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" className="h-11 px-6">
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          className="h-11 px-6 bg-teal-500 hover:bg-teal-600"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}
