"use client";

import { useState, useEffect } from "react";
import { Product } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProduct } from "@/actions/products";
import { toast } from "sonner";

interface EditProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

export function EditProductModal({
  open,
  onOpenChange,
  product,
}: EditProductModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    quantity: "",
    costPrice: "",
    sellingPrice: "",
    category: "",
    lowStockThreshold: "",
  });

  useEffect(() => {
    if (product) {
      setFormData({
        sku: product.sku,
        name: product.name,
        quantity: product.quantity.toString(),
        costPrice: product.costPrice.toString(),
        sellingPrice: product.sellingPrice.toString(),
        category: product.category,
        lowStockThreshold: product.lowStockThreshold.toString(),
      });
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setLoading(true);

    const quantity = parseInt(formData.quantity);
    const costPrice = parseFloat(formData.costPrice);
    const sellingPrice = parseFloat(formData.sellingPrice);
    const lowStockThreshold = parseInt(formData.lowStockThreshold);

    if (isNaN(quantity) || quantity < 0) {
      toast.error("Please enter a valid quantity");
      setLoading(false);
      return;
    }

    if (isNaN(costPrice) || costPrice < 0) {
      toast.error("Please enter a valid cost price");
      setLoading(false);
      return;
    }

    if (isNaN(sellingPrice) || sellingPrice < 0) {
      toast.error("Please enter a valid selling price");
      setLoading(false);
      return;
    }

    const result = await updateProduct(product.id, {
      sku: formData.sku,
      name: formData.name,
      quantity,
      costPrice,
      sellingPrice,
      category: formData.category,
      lowStockThreshold: isNaN(lowStockThreshold) ? 10 : lowStockThreshold,
    });

    if (result.success) {
      toast.success(`Product "${formData.name}" updated successfully`);
      onOpenChange(false);
    } else {
      toast.error(result.error || "Failed to update product");
    }

    setLoading(false);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update product information
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-sku">SKU</Label>
                <Input
                  id="edit-sku"
                  value={formData.sku}
                  onChange={(e) => handleChange("sku", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-name">Product Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Input
                  id="edit-category"
                  value={formData.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-quantity">Quantity</Label>
                <Input
                  id="edit-quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => handleChange("quantity", e.target.value)}
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-costPrice">Cost Price</Label>
                <Input
                  id="edit-costPrice"
                  type="number"
                  step="0.01"
                  value={formData.costPrice}
                  onChange={(e) => handleChange("costPrice", e.target.value)}
                  min="0"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-sellingPrice">Selling Price</Label>
                <Input
                  id="edit-sellingPrice"
                  type="number"
                  step="0.01"
                  value={formData.sellingPrice}
                  onChange={(e) => handleChange("sellingPrice", e.target.value)}
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-lowStockThreshold">Low Stock Threshold</Label>
              <Input
                id="edit-lowStockThreshold"
                type="number"
                value={formData.lowStockThreshold}
                onChange={(e) =>
                  handleChange("lowStockThreshold", e.target.value)
                }
                min="0"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
