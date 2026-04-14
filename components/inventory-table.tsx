"use client";

import { useState } from "react";
import { Product, Supplier } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import { 
  Edit, 
  Trash2, 
  Search, 
  AlertTriangle, 
  MoreVertical,
  Plus,
  Minus
} from "lucide-react";
import { deleteProduct } from "@/actions/products";
import { toast } from "sonner";
import { EditProductModal } from "./edit-product-modal";
import { AddStockModal } from "./add-stock-modal";
import { RemoveStockModal } from "./remove-stock-modal";

type ProductWithSupplier = Product & {
  supplier: Supplier | null;
};

interface InventoryTableProps {
  products: ProductWithSupplier[];
}

export function InventoryTable({ products }: InventoryTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showLowStock, setShowLowStock] = useState(false);
  
  // Modal states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addStockModalOpen, setAddStockModalOpen] = useState(false);
  const [removeStockModalOpen, setRemoveStockModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductWithSupplier | null>(null);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLowStock = showLowStock
      ? product.quantity <= product.lowStockThreshold
      : true;

    return matchesSearch && matchesLowStock;
  });

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    const result = await deleteProduct(id);
    if (result.success) {
      toast.success("Product deleted successfully");
    } else {
      toast.error(result.error || "Failed to delete product");
    }
  };

  const handleEdit = (product: ProductWithSupplier) => {
    setSelectedProduct(product);
    setEditModalOpen(true);
  };

  const handleAddStock = (product: ProductWithSupplier) => {
    setSelectedProduct(product);
    setAddStockModalOpen(true);
  };

  const handleRemoveStock = (product: ProductWithSupplier) => {
    setSelectedProduct(product);
    setRemoveStockModalOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant={showLowStock ? "default" : "outline"}
          onClick={() => setShowLowStock(!showLowStock)}
        >
          <AlertTriangle className="h-4 w-4 mr-2" />
          Low Stock Only
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Cost Price</TableHead>
              <TableHead>Selling Price</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-mono text-sm">
                    {product.sku}
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{product.quantity}</span>
                      {product.quantity <= product.lowStockThreshold && (
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{formatCurrency(Number(product.costPrice))}</TableCell>
                  <TableCell>{formatCurrency(Number(product.sellingPrice))}</TableCell>
                  <TableCell>
                    {product.supplier?.name || (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleEdit(product)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Product
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAddStock(product)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Stock
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRemoveStock(product)}>
                          <Minus className="h-4 w-4 mr-2" />
                          Remove Stock
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(product.id, product.name)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Product
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {filteredProducts.length} of {products.length} products
      </div>

      {/* Modals */}
      <EditProductModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        product={selectedProduct}
      />
      <AddStockModal
        open={addStockModalOpen}
        onOpenChange={setAddStockModalOpen}
        productId={selectedProduct?.id || ""}
        productName={selectedProduct?.name || ""}
      />
      <RemoveStockModal
        open={removeStockModalOpen}
        onOpenChange={setRemoveStockModalOpen}
        productId={selectedProduct?.id || ""}
        productName={selectedProduct?.name || ""}
        currentStock={selectedProduct?.quantity || 0}
      />
    </div>
  );
}
