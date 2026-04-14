"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { TransactionType } from "@prisma/client";

export async function addStock(
  productId: string,
  quantity: number,
  notes?: string
) {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // Create transaction record
      const transaction = await tx.transaction.create({
        data: {
          type: TransactionType.IN,
          quantity,
          productId,
          notes,
        },
      });

      // Update product quantity
      const product = await tx.product.update({
        where: { id: productId },
        data: {
          quantity: {
            increment: quantity,
          },
        },
      });

      return { transaction, product };
    });

    revalidatePath("/inventory");
    revalidatePath("/");
    return { success: true, data: result };
  } catch (error) {
    console.error("Error adding stock:", error);
    return { success: false, error: "Failed to add stock" };
  }
}

export async function removeStock(
  productId: string,
  quantity: number,
  notes?: string
) {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // Check if enough stock is available
      const product = await tx.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        throw new Error("Product not found");
      }

      if (product.quantity < quantity) {
        throw new Error("Insufficient stock");
      }

      // Create transaction record
      const transaction = await tx.transaction.create({
        data: {
          type: TransactionType.OUT,
          quantity,
          productId,
          notes,
        },
      });

      // Update product quantity
      const updatedProduct = await tx.product.update({
        where: { id: productId },
        data: {
          quantity: {
            decrement: quantity,
          },
        },
      });

      return { transaction, product: updatedProduct };
    });

    revalidatePath("/inventory");
    revalidatePath("/");
    return { success: true, data: result };
  } catch (error) {
    console.error("Error removing stock:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to remove stock" };
  }
}

export async function getRecentTransactions(limit: number = 10) {
  try {
    const transactions = await prisma.transaction.findMany({
      include: {
        product: true,
      },
      orderBy: {
        date: "desc",
      },
      take: limit,
    });
    return { success: true, data: transactions };
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return { success: false, error: "Failed to fetch transactions" };
  }
}

export async function getProductTransactions(productId: string) {
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        productId,
      },
      orderBy: {
        date: "desc",
      },
    });
    return { success: true, data: transactions };
  } catch (error) {
    console.error("Error fetching product transactions:", error);
    return { success: false, error: "Failed to fetch product transactions" };
  }
}
