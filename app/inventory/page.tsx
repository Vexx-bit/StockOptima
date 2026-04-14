"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/actions/products";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { InventoryTable } from "@/components/inventory-table";
import { AddProductModal } from "@/components/add-product-modal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Product, Supplier } from "@prisma/client";

type ProductWithSupplier = Product & {
  supplier: Supplier | null;
};

export default function InventoryPage() {
  const [products, setProducts] = useState<ProductWithSupplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const loadProducts = async () => {
    setLoading(true);
    const result = await getProducts();
    if (result.success && result.data) {
      setProducts(result.data);
      setError(null);
    } else {
      setError("Failed to load inventory data");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Reload products when modal closes
  const handleModalClose = (open: boolean) => {
    setAddModalOpen(open);
    if (!open) {
      loadProducts();
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        <div className="w-64 flex-shrink-0">
          <Sidebar />
        </div>
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-8">
            <div className="text-center text-muted-foreground">
              Loading inventory...
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen">
        <div className="w-64 flex-shrink-0">
          <Sidebar />
        </div>
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-8">
            <div className="text-center text-muted-foreground">{error}</div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <div className="w-64 flex-shrink-0">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
              <p className="text-muted-foreground">
                Manage your product inventory
              </p>
            </div>
            <Button onClick={() => setAddModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>

          <InventoryTable products={products} />
        </main>
      </div>

      <AddProductModal open={addModalOpen} onOpenChange={handleModalClose} />
    </div>
  );
}
