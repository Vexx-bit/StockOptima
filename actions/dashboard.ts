"use server";

import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  try {
    // Basic connectivity check & counts
    const [totalProducts, totalSuppliers] = await Promise.all([
      prisma.product.count(),
      prisma.supplier.count(),
    ]);

    // Calculate low stock items
    // Using a more robust approach to handle column comparisons across different drivers
    const productsForLowStock = await prisma.product.findMany({
      select: {
        id: true,
        quantity: true,
        lowStockThreshold: true,
        costPrice: true,
      }
    });

    const lowStockCount = productsForLowStock.filter(
      p => p.quantity <= (p.lowStockThreshold ?? 10)
    ).length;

    // Calculate total inventory value
    const totalInventoryValue = productsForLowStock.reduce((sum, p) => {
      return sum + (p.quantity * Number(p.costPrice || 0));
    }, 0);

    // Get recent transactions with product info
    const recentTransactions = await prisma.transaction.findMany({
      include: {
        product: {
          select: {
            name: true,
            sku: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
      take: 5,
    });

    return {
      success: true,
      data: {
        totalProducts,
        lowStockCount,
        totalInventoryValue,
        totalSuppliers,
        recentTransactions,
      },
    };
  } catch (error: any) {
    console.error("CRITICAL: Error fetching dashboard stats:", error?.message || error);
    return { 
      success: false, 
      error: error?.message || "Failed to fetch dashboard statistics" 
    };
  }
}
