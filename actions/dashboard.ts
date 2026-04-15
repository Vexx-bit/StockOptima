"use server";

import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  const startTime = Date.now();
  console.log("LOG: Starting getDashboardStats fetch...");

  try {
    // Proactive connection with timeout logic
    await Promise.race([
      prisma.$connect(),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Database connection timeout")), 15000))
    ]);

    // Use a single transaction for efficiency
    const [totalProducts, totalSuppliers, productsData, recentTransactions] = await prisma.$transaction([
      prisma.product.count(),
      prisma.supplier.count(),
      prisma.product.findMany({
        select: {
          id: true,
          quantity: true,
          lowStockThreshold: true,
          costPrice: true,
        }
      }),
      prisma.transaction.findMany({
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
      })
    ]);

    const lowStockCount = productsData.filter(
      p => p.quantity <= (p.lowStockThreshold ?? 10)
    ).length;

    const totalInventoryValue = productsData.reduce((sum, p) => {
      return sum + (p.quantity * Number(p.costPrice || 0));
    }, 0);

    const duration = Date.now() - startTime;
    console.log(`LOG: Dashboard stats fetched in ${duration}ms`);

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
    const duration = Date.now() - startTime;
    console.error(`CRITICAL: Error after ${duration}ms:`, error?.message || error);
    
    // Fallback data structure to prevent page-level fail if one part hangs
    return { 
      success: false, 
      error: error?.message || "Connection timeout" 
    };
  }
}
