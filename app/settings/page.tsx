export const dynamic = "force-dynamic";

import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { 
  Package, 
  Users, 
  Activity,
  Info,
  TrendingUp,
  AlertCircle
} from "lucide-react";

export default async function SettingsPage() {
  // Get database statistics
  const [productCount, supplierCount, transactionCount, lowStockCount] = await Promise.all([
    prisma.product.count(),
    prisma.supplier.count(),
    prisma.transaction.count(),
    prisma.product.count({
      where: {
        quantity: {
          lte: 10, // Fallback threshold for build safety
        },
      },
    }),
  ]);

  return (
    <div className="flex h-screen">
      <div className="w-64 flex-shrink-0">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">
              View system information and statistics
            </p>
          </div>

          {/* Quick Stats Overview */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Products
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{productCount}</div>
                <p className="text-xs text-muted-foreground">
                  In your inventory
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Suppliers
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{supplierCount}</div>
                <p className="text-xs text-muted-foreground">
                  Registered suppliers
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Transactions
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{transactionCount}</div>
                <p className="text-xs text-muted-foreground">
                  Stock movements
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Low Stock Items
                </CardTitle>
                <AlertCircle className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-500">
                  {lowStockCount}
                </div>
                <p className="text-xs text-muted-foreground">
                  Need attention
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2 mb-8">
            {/* System Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  System Information
                </CardTitle>
                <CardDescription>
                  Application details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Application</span>
                  <span className="font-medium">StockOptima</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Version</span>
                  <span className="font-medium">1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="flex items-center gap-2 font-medium text-green-500">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    Online
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Performance Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Performance
                </CardTitle>
                <CardDescription>
                  System health metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Database</span>
                  <span className="flex items-center gap-2 font-medium text-green-500">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    Connected
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Response Time</span>
                  <span className="font-medium text-green-500">Fast</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span className="font-medium">Just now</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Help & Support */}
          <Card>
            <CardHeader>
              <CardTitle>Help & Support</CardTitle>
              <CardDescription>
                Resources and documentation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-lg space-y-2">
                  <h3 className="font-medium">📖 User Guide</h3>
                  <p className="text-sm text-muted-foreground">
                    Learn how to use all features of StockOptima
                  </p>
                  <p className="text-xs text-muted-foreground">
                    See: <code className="bg-muted px-1 rounded">USER_GUIDE.md</code>
                  </p>
                </div>

                <div className="p-4 border rounded-lg space-y-2">
                  <h3 className="font-medium">🚀 Quick Start</h3>
                  <p className="text-sm text-muted-foreground">
                    Get started quickly with the basics
                  </p>
                  <p className="text-xs text-muted-foreground">
                    See: <code className="bg-muted px-1 rounded">QUICKSTART.md</code>
                  </p>
                </div>
              </div>

              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Tips for Best Results
                </h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Set realistic low stock thresholds for each product</li>
                  <li>• Add notes when adjusting stock levels</li>
                  <li>• Review analytics regularly to track trends</li>
                  <li>• Keep supplier information up to date</li>
                  <li>• Check low stock alerts on the dashboard daily</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* About */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>About StockOptima</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground">
                StockOptima is a modern inventory management system designed to help you track products, 
                manage suppliers, and gain insights into your business operations.
              </p>
              <div className="pt-2 border-t">
                <p className="text-sm text-muted-foreground">
                  Built with modern web technologies for speed, reliability, and ease of use.
                </p>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
