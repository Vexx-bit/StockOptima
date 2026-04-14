"use server";

import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  try {
    // Get total products count
    const totalProducts = await prisma.product.count();

    // Get low stock count
    const lowStockCount = await prisma.product.count({
      where: {
        quantity: {
          lte: prisma.product.fields.lowStockThreshold,
        },
      },
    });

    // Calculate total inventory value
    const products = await prisma.product.findMany({
      select: {
        quantity: true,
        costPrice: true,
      },
    });

    const totalInventoryValue = products.reduce((sum, product) => {
      return sum + product.quantity * Number(product.costPrice);
    }, 0);

    // Get total suppliers count
    const totalSuppliers = await prisma.supplier.count();

    // Get recent transactions
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
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return { success: false, error: "Failed to fetch dashboard statistics" };
  }
}
