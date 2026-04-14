"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Mail, Phone, Package } from "lucide-react";
import { getSuppliers, deleteSupplier } from "@/actions/suppliers";
import { AddSupplierModal } from "@/components/add-supplier-modal";
import { toast } from "sonner";
import { Supplier, Product } from "@prisma/client";

type SupplierWithProducts = Supplier & {
  products: Product[];
};

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<SupplierWithProducts[]>([]);
  const [loading, setLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const loadSuppliers = async () => {
    setLoading(true);
    const result = await getSuppliers();
    if (result.success && result.data) {
      setSuppliers(result.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  const handleModalClose = (open: boolean) => {
    setAddModalOpen(open);
    if (!open) {
      loadSuppliers();
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    const result = await deleteSupplier(id);
    if (result.success) {
      toast.success("Supplier deleted successfully");
      loadSuppliers();
    } else {
      toast.error(result.error || "Failed to delete supplier");
    }
  };

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
              <h1 className="text-3xl font-bold tracking-tight">Suppliers</h1>
              <p className="text-muted-foreground">
                Manage your supplier relationships
              </p>
            </div>
            <Button onClick={() => setAddModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Supplier
            </Button>
          </div>

          {loading ? (
            <div className="text-center text-muted-foreground">
              Loading suppliers...
            </div>
          ) : suppliers.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground mb-4">
                  No suppliers found. Add your first supplier to get started.
                </p>
                <Button onClick={() => setAddModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Supplier
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {suppliers.map((supplier) => (
                <Card key={supplier.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{supplier.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(supplier.id, supplier.name)}
                        className="text-destructive hover:text-destructive"
                      >
                        Delete
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {supplier.email}
                      </span>
                    </div>
                    {supplier.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {supplier.phone}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm pt-2 border-t">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {supplier.products.length} product
                        {supplier.products.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>

      <AddSupplierModal open={addModalOpen} onOpenChange={handleModalClose} />
    </div>
  );
}
