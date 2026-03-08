import { useState } from "react";
import { useLoaderData } from "react-router";
import { Search, Plus, Filter, Edit, Trash2, TrendingUp } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import api from "../api/axios";

// // Mock data
// const mockProducts = [
//   {
//     id: 1,
//     name: "Milk (1L)",
//     sku: "MLK-001",
//     price: 4.99,
//     quantity: 5,
//     minStock: 20,
//     status: "critical",
//     velocity: "fast",
//   },
//   {
//     id: 2,
//     name: "Bread (White)",
//     sku: "BRD-001",
//     price: 2.49,
//     quantity: 8,
//     minStock: 15,
//     status: "warning",
//     velocity: "fast",
//   },
//   {
//     id: 3,
//     name: "Eggs (Dozen)",
//     sku: "EGG-001",
//     price: 5.99,
//     quantity: 12,
//     minStock: 10,
//     status: "low",
//     velocity: "fast",
//   },
//   {
//     id: 4,
//     name: "Orange Juice",
//     sku: "JUI-001",
//     price: 6.49,
//     quantity: 25,
//     minStock: 10,
//     status: "healthy",
//     velocity: "medium",
//   },
//   {
//     id: 5,
//     name: "Butter",
//     sku: "BUT-001",
//     price: 4.49,
//     quantity: 18,
//     minStock: 8,
//     status: "healthy",
//     velocity: "medium",
//   },
//   {
//     id: 6,
//     name: "Yogurt",
//     sku: "YOG-001",
//     price: 3.99,
//     quantity: 30,
//     minStock: 15,
//     status: "healthy",
//     velocity: "fast",
//   },
//   {
//     id: 7,
//     name: "Cheese Slices",
//     sku: "CHE-001",
//     price: 5.49,
//     quantity: 3,
//     minStock: 12,
//     status: "critical",
//     velocity: "medium",
//   },
//   {
//     id: 8,
//     name: "Cereal Box",
//     sku: "CER-001",
//     price: 7.99,
//     quantity: 15,
//     minStock: 8,
//     status: "healthy",
//     velocity: "slow",
//   },
// ];

export function Products() {
  const loaderProducts = useLoaderData();
  const [products, setProducts] = useState(loaderProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editProduct, setEditProduct] = useState({
    name: "",
    sku: "",
    price: "",
    quantity: "",
    minStock: "",
    unitType: "",
    unitLabel: "",
  });

  // New product form state
  const [newProduct, setNewProduct] = useState({
    name: "",
    sku: "",
    price: "",
    quantity: "",
    minStock: "",
    unitType: "",
    unitLabel: "",
  });

  const unitLabelOptions = {
    COUNT: ["PIECE"],
    WEIGHT: ["GRAM", "KILOGRAM"],
    VOLUME: ["LITER", "MILLILITER"],
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.sku &&
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter =
      filterStatus === "all" || product.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>;
      case "warning":
        return <Badge className="bg-yellow-500">Warning</Badge>;
      case "low":
        return <Badge variant="secondary">Low</Badge>;
      default:
        return <Badge className="bg-green-500">Healthy</Badge>;
    }
  };

  const handleAddProduct = async () => {
    const qty = parseInt(newProduct.quantity);
    const minStk = parseInt(newProduct.minStock);

    const res = await api.post("/products/", {
      name: newProduct.name,
      sku: newProduct.sku || null,
      price: parseFloat(newProduct.price),
      quantity: qty,
      min_stock: minStk,
      unit_type: newProduct.unitType,
      unit_label: newProduct.unitLabel,
    });

    const p = res.data;
    setProducts([
      ...products,
      {
        ...p,
        minStock: p.min_stock,
        velocity: "slow",
        status:
          qty <= 0
            ? "critical"
            : qty < minStk * 0.5
              ? "critical"
              : qty < minStk
                ? "warning"
                : qty < minStk * 1.5
                  ? "low"
                  : "healthy",
      },
    ]);
    setIsAddModalOpen(false);
    setNewProduct({
      name: "",
      sku: "",
      price: "",
      quantity: "",
      minStock: "",
      unitType: "",
      unitLabel: "",
    });
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setEditProduct({
      name: product.name,
      sku: product.sku || "",
      price: String(product.price),
      quantity: String(product.quantity),
      minStock: String(product.minStock),
      unitType: product.unit_type || "",
      unitLabel: product.unit_label || "",
    });
    setIsEditModalOpen(true);
  };

  const computeStatus = (qty, minStk) =>
    qty <= 0
      ? "critical"
      : qty < minStk * 0.5
        ? "critical"
        : qty < minStk
          ? "warning"
          : qty < minStk * 1.5
            ? "low"
            : "healthy";

  const handleEditProduct = async () => {
    const res = await api.patch(`/products/${selectedProduct.id}`, {
      name: editProduct.name,
      sku: editProduct.sku || null,
      price: parseFloat(editProduct.price),
      quantity: parseInt(editProduct.quantity),
      min_stock: parseInt(editProduct.minStock),
      unit_type: editProduct.unitType,
      unit_label: editProduct.unitLabel,
    });

    const p = res.data;
    setProducts(
      products.map((prod) =>
        prod.id === selectedProduct.id
          ? {
              ...p,
              minStock: p.min_stock,
              velocity: prod.velocity,
              status: computeStatus(Number(p.quantity), p.min_stock),
            }
          : prod,
      ),
    );
    setIsEditModalOpen(false);
    setSelectedProduct(null);
  };

  const handleDeleteProduct = async () => {
    await api.delete(`/products/${selectedProduct.id}`);
    setProducts(products.filter((p) => p.id !== selectedProduct.id));
    setIsDeleteDialogOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">
            Manage your inventory and track stock levels
          </p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-teal-500 hover:bg-teal-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search products by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
            <div className="flex gap-3">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px] h-11">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="healthy">Healthy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Min Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Velocity</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="text-gray-600">{product.sku}</TableCell>
                  <TableCell>{Number(product.price).toFixed(2)}</TableCell>
                  <TableCell>
                    <span
                      className={
                        product.quantity < product.minStock
                          ? "text-red-600 font-semibold"
                          : ""
                      }
                    >
                      {product.quantity}
                    </span>
                  </TableCell>
                  <TableCell>{product.minStock}</TableCell>
                  <TableCell>{getStatusBadge(product.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {product.velocity === "fast" && (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      )}
                      <span className="capitalize text-sm">
                        {product.velocity}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditModal(product)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedProduct(product);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Product Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new product to your inventory
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                placeholder="e.g., Milk (1L)"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sku">SKU (Optional)</Label>
              <Input
                id="sku"
                placeholder="e.g., MLK-001"
                value={newProduct.sku}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, sku: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, price: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="quantity">Current Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="0"
                  value={newProduct.quantity}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, quantity: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="minStock">Minimum Stock Level</Label>
              <Input
                id="minStock"
                type="number"
                placeholder="0"
                value={newProduct.minStock}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, minStock: e.target.value })
                }
              />
              <p className="text-sm text-gray-500">
                You'll be alerted when stock falls below this level
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Unit Type</Label>
                <Select
                  value={newProduct.unitType}
                  onValueChange={(val) =>
                    setNewProduct({
                      ...newProduct,
                      unitType: val,
                      unitLabel: "",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="COUNT">Count</SelectItem>
                    <SelectItem value="WEIGHT">Weight</SelectItem>
                    <SelectItem value="VOLUME">Volume</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Unit Label</Label>
                <Select
                  value={newProduct.unitLabel}
                  onValueChange={(val) =>
                    setNewProduct({ ...newProduct, unitLabel: val })
                  }
                  disabled={!newProduct.unitType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select label" />
                  </SelectTrigger>
                  <SelectContent>
                    {(unitLabelOptions[newProduct.unitType] || []).map(
                      (label) => (
                        <SelectItem key={label} value={label}>
                          {label.charAt(0) + label.slice(1).toLowerCase()}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddProduct}
              className="bg-teal-500 hover:bg-teal-600"
              disabled={
                !newProduct.name ||
                !newProduct.price ||
                !newProduct.quantity ||
                !newProduct.minStock ||
                !newProduct.unitType ||
                !newProduct.unitLabel
              }
            >
              Save Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update the product details</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Product Name</Label>
              <Input
                value={editProduct.name}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, name: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>SKU (Optional)</Label>
              <Input
                value={editProduct.sku}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, sku: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Price ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={editProduct.price}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, price: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>Current Quantity</Label>
                <Input
                  type="number"
                  value={editProduct.quantity}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, quantity: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Minimum Stock Level</Label>
              <Input
                type="number"
                value={editProduct.minStock}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, minStock: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Unit Type</Label>
                <Select
                  value={editProduct.unitType}
                  onValueChange={(val) =>
                    setEditProduct({
                      ...editProduct,
                      unitType: val,
                      unitLabel: "",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="COUNT">Count</SelectItem>
                    <SelectItem value="WEIGHT">Weight</SelectItem>
                    <SelectItem value="VOLUME">Volume</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Unit Label</Label>
                <Select
                  value={editProduct.unitLabel}
                  onValueChange={(val) =>
                    setEditProduct({ ...editProduct, unitLabel: val })
                  }
                  disabled={!editProduct.unitType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select label" />
                  </SelectTrigger>
                  <SelectContent>
                    {(unitLabelOptions[editProduct.unitType] || []).map(
                      (label) => (
                        <SelectItem key={label} value={label}>
                          {label.charAt(0) + label.slice(1).toLowerCase()}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleEditProduct}
              className="bg-teal-500 hover:bg-teal-600"
              disabled={
                !editProduct.name ||
                !editProduct.price ||
                !editProduct.quantity ||
                !editProduct.minStock ||
                !editProduct.unitType ||
                !editProduct.unitLabel
              }
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{selectedProduct?.name}</span>?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProduct}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
