import { useState } from "react";
import { useLoaderData, useRevalidator } from "react-router";
import {
  Search,
  Plus,
  Minus,
  ShoppingCart,
  Check,
  Loader2,
  Weight,
  Package,
  Droplets,
  X,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import api from "../api/axios";

/* ── helpers ─────────────────────────────────────────────────────── */
const UNIT_SHORT = {
  PIECE: "pc",
  GRAM: "g",
  KILOGRAM: "kg",
  LITER: "L",
  MILLILITER: "ml",
};

const UNIT_TYPE_ICON = {
  COUNT: Package,
  WEIGHT: Weight,
  VOLUME: Droplets,
};

const isLoose = (product) =>
  product.unit_type === "WEIGHT" || product.unit_type === "VOLUME";

const unitShort = (product) => UNIT_SHORT[product.unit_label] || "";

const priceLabel = (product) => {
  const p = Number(product.price).toFixed(2);
  if (isLoose(product)) return `${p} Rs/${unitShort(product)}`;
  return `${p} Rs each`;
};

/* ── component ───────────────────────────────────────────────────── */
export function RecordSale() {
  const products = useLoaderData();
  const revalidator = useRevalidator();
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const filteredProducts = searchTerm
    ? products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : [];

  /* ── add to cart ─────────────────────────────────────────────── */
  const addToCart = (product) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      // already in cart — for COUNT bump by 1, for loose just focus the input
      if (!isLoose(product)) {
        if (existing.cartQty >= Number(product.quantity)) {
          toast.error(
            `Only ${Number(product.quantity)} ${unitShort(product)} in stock`,
          );
          return;
        }
        setCart(
          cart.map((item) =>
            item.id === product.id
              ? { ...item, cartQty: item.cartQty + 1 }
              : item,
          ),
        );
      } else {
        toast.info(
          `${product.name} is already in the cart — update the amount below`,
        );
      }
    } else {
      if (Number(product.quantity) <= 0) {
        toast.error(`${product.name} is out of stock`);
        return;
      }
      // for loose items default to 1 unit; cashier will type the exact amount
      setCart([...cart, { ...product, cartQty: isLoose(product) ? 1 : 1 }]);
    }
    setSearchTerm("");
    setShowSuggestions(false);
  };

  /* ── update quantity (stepper for COUNT) ─────────────────────── */
  const updateQuantity = (id, change) => {
    setCart(
      cart
        .map((item) => {
          if (item.id !== id) return item;
          const newQty = item.cartQty + change;
          if (newQty > Number(item.quantity)) {
            toast.error(
              `Only ${Number(item.quantity)} ${unitShort(item)} in stock`,
            );
            return item;
          }
          return { ...item, cartQty: Math.max(0, newQty) };
        })
        .filter((item) => item.cartQty > 0),
    );
  };

  /* ── set exact quantity (typed input for WEIGHT/VOLUME) ──────── */
  const setExactQuantity = (id, raw) => {
    setCart(
      cart.map((item) => {
        if (item.id !== id) return item;
        const val = parseFloat(raw);
        if (isNaN(val) || val < 0) return { ...item, cartQty: 0, _raw: raw };
        if (val > Number(item.quantity)) {
          toast.error(
            `Only ${Number(item.quantity)} ${unitShort(item)} in stock`,
          );
          return {
            ...item,
            cartQty: Number(item.quantity),
            _raw: String(Number(item.quantity)),
          };
        }
        return { ...item, cartQty: val, _raw: raw };
      }),
    );
  };

  /* ── remove item from cart ───────────────────────────────────── */
  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.cartQty,
    0,
  );

  const handleConfirmSale = async () => {
    // validate loose items have a quantity > 0
    const invalidItem = cart.find((item) => item.cartQty <= 0);
    if (invalidItem) {
      toast.error(`Please enter a valid amount for ${invalidItem.name}`);
      return;
    }
    if (cart.length === 0) return;
    setSubmitting(true);
    try {
      const payload = {
        items: cart.map((item) => ({
          product_id: item.id,
          quantity: item.cartQty,
          price_at_sale: Number(item.price),
        })),
      };
      await api.post("/sales/", payload);
      setShowSuccess(true);
      toast.success("Sale recorded successfully!");
      setTimeout(() => {
        setShowSuccess(false);
        setCart([]);
        revalidator.revalidate();
      }, 2000);
    } catch (err) {
      const detail = err.response?.data?.detail;
      toast.error(detail || "Failed to record sale");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Record Sale</h1>
        <p className="text-gray-600 mt-1">Quick sale entry for your store</p>
      </div>

      {/* Product Search */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Search Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Start typing product name..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => {
                // small delay so click on suggestion registers first
                setTimeout(() => setShowSuggestions(false), 200);
              }}
              className="pl-10 h-12 text-lg"
            />

            {/* Autocomplete suggestions */}
            {showSuggestions && searchTerm && filteredProducts.length > 0 && (
              <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-auto">
                {filteredProducts.map((product) => {
                  const Icon = UNIT_TYPE_ICON[product.unit_type] || Package;
                  return (
                    <button
                      key={product.id}
                      onClick={() => addToCart(product)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex justify-between items-center border-b last:border-b-0"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {product.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            Stock: {Number(product.quantity)}{" "}
                            {unitShort(product)}
                            {isLoose(product) && (
                              <span className="ml-2 text-xs text-amber-600 font-medium">
                                • Sold by {unitShort(product)}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <p className="text-lg font-semibold text-teal-600 flex-shrink-0">
                        {priceLabel(product)}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Shopping Cart */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Current Sale</CardTitle>
            <Badge variant="secondary">{cart.length} items</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No items added yet</p>
              <p className="text-gray-400 text-sm mt-1">
                Search and select products to add them to the sale
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {cart.map((item) => {
                  const loose = isLoose(item);
                  const unit = unitShort(item);
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900 truncate">
                            {item.name}
                          </p>
                          {loose ? (
                            <Badge
                              variant="outline"
                              className="text-xs flex-shrink-0 border-amber-300 text-amber-700 bg-amber-50"
                            >
                              {unit}
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="text-xs flex-shrink-0"
                            >
                              piece
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {priceLabel(item)}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        {loose ? (
                          /* ── Decimal input for weight/volume ── */
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              max={Number(item.quantity)}
                              value={
                                item._raw !== undefined
                                  ? item._raw
                                  : item.cartQty
                              }
                              onChange={(e) =>
                                setExactQuantity(item.id, e.target.value)
                              }
                              className="w-24 h-10 text-center font-semibold"
                            />
                            <span className="text-sm text-gray-500 font-medium w-6">
                              {unit}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromCart(item.id)}
                              className="h-10 w-10 text-red-400 hover:text-red-600 hover:bg-red-50"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          /* ── Integer stepper for counted items ── */
                          <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.id, -1)}
                              className="h-10 w-10"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="w-12 text-center font-semibold">
                              {item.cartQty}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.id, 1)}
                              className="h-10 w-10"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                        <div className="w-28 text-right">
                          <p className="font-bold text-gray-900">
                            {(Number(item.price) * item.cartQty).toFixed(2)} Rs
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Total */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <p className="text-xl font-semibold text-gray-900">Total</p>
                  <p className="text-3xl font-bold text-teal-600">
                    {totalAmount.toFixed(2)} Rs
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setCart([])}
                    className="flex-1 h-12"
                    disabled={submitting}
                  >
                    Clear All
                  </Button>
                  <Button
                    onClick={handleConfirmSale}
                    disabled={submitting}
                    className="flex-1 h-12 bg-teal-500 hover:bg-teal-600 text-lg"
                  >
                    {submitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "Confirm Sale"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Success Animation */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          >
            <div className="bg-white rounded-2xl p-8 shadow-2xl text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Check className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Sale Recorded!
              </h2>
              <p className="text-gray-600">
                {totalAmount.toFixed(2)} Rs has been added to today's sales
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
