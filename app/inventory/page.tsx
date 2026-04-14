export const dynamic = "force-dynamic";

import { getProducts } from "@/actions/product";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { InventoryTable } from "@/components/inventory-table";

export default async function InventoryPage() {
  const result = await getProducts();

  return (
    <div className="flex h-screen">
      <div className="w-64 flex-shrink-0">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
            <p className="text-muted-foreground">
              Manage your products and stock levels
            </p>
          </div>

          <InventoryTable initialData={result.success ? result.data || [] : []} />
        </main>
      </div>
    </div>
  );
}
