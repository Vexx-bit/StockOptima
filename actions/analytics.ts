"use server";

import { prisma } from "@/lib/prisma";

export async function getAnalytics() {
  try {
    // Get all products with their data
    const products = await prisma.product.findMany({
      include: {
        supplier: true,
      },
    });

    // Calculate total inventory value (cost)
    const totalInventoryValue = products.reduce((sum, product) => {
      return sum + product.quantity * Number(product.costPrice);
    }, 0);

    // Calculate potential revenue (selling price)
    const potentialRevenue = products.reduce((sum, product) => {
      return sum + product.quantity * Number(product.sellingPrice);
    }, 0);

    // Calculate potential profit
    const potentialProfit = potentialRevenue - totalInventoryValue;

    // Get category breakdown
    const categoryBreakdown = products.reduce((acc, product) => {
      const category = product.category;
      if (!acc[category]) {
        acc[category] = {
          count: 0,
          value: 0,
          quantity: 0,
        };
      }
      acc[category].count += 1;
      acc[category].value += product.quantity * Number(product.costPrice);
      acc[category].quantity += product.quantity;
      return acc;
    }, {} as Record<string, { count: number; value: number; quantity: number }>);

    // Get top products by value
    const topProductsByValue = products
      .map((product) => ({
        name: product.name,
        value: product.quantity * Number(product.sellingPrice),
        quantity: product.quantity,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    // Get low stock products
    const lowStockProducts = products.filter(
      (product) => product.quantity <= product.lowStockThreshold
    );

    // Get all transactions for trend analysis
    const transactions = await prisma.transaction.findMany({
      orderBy: {
        date: "desc",
      },
      take: 30,
    });

    const stockMovements = {
      in: transactions.filter((t) => t.type === "IN").length,
      out: transactions.filter((t) => t.type === "OUT").length,
    };

    return {
      success: true,
      data: {
        totalInventoryValue,
        potentialRevenue,
        potentialProfit,
        profitMargin: totalInventoryValue > 0 
          ? ((potentialProfit / totalInventoryValue) * 100).toFixed(1)
          : "0",
        categoryBreakdown,
        topProductsByValue,
        lowStockCount: lowStockProducts.length,
        totalProducts: products.length,
        stockMovements,
      },
    };
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return { success: false, error: "Failed to fetch analytics" };
  }
}
