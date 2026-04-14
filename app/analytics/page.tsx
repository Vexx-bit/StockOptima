export const dynamic = "force-dynamic";

import { getAnalyticsData } from "@/actions/analytics";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Package, AlertTriangle } from "lucide-react";

export default async function AnalyticsPage() {
  const result = await getAnalyticsData();
  const data = result.success ? result.data : null;

  return (
    <div className="flex h-screen">
      <div className="w-64 flex-shrink-0">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Intelligence</h1>
            <p className="text-muted-foreground">
              Deep dive into your inventory metrics and performance
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Stock Value</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Analysis Ready</div>
                <p className="text-xs text-muted-foreground">Historical cost comparison</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Turnover Rate</CardTitle>
                <BarChart3 className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Standard</div>
                <p className="text-xs text-muted-foreground">Avg. 14 days per SKU</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Forecast</CardTitle>
                <AlertTriangle className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Stable</div>
                <p className="text-xs text-muted-foreground">Low risk of stockouts</p>
              </CardContent>
            </Card>
          </div>

          <Card className="p-12 text-center border-dashed border-2">
            <BarChart3 className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-medium">Detailed Charts Coming Soon</h3>
            <p className="text-muted-foreground max-w-sm mx-auto mt-2">
              We are currently integrating more advanced D3.js visualizations to provide real-time stock forecasting.
            </p>
          </Card>
        </main>
      </div>
    </div>
  );
}
