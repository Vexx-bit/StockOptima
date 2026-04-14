"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      include: {
        supplier: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return { success: true, data: products };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { success: false, error: "Failed to fetch products" };
  }
}

export async function getProductById(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        supplier: true,
        transactions: {
          orderBy: {
            date: "desc",
          },
          take: 10,
        },
      },
    });
    return { success: true, data: product };
  } catch (error) {
    console.error("Error fetching product:", error);
    return { success: false, error: "Failed to fetch product" };
  }
}

export async function getLowStockProducts() {
  try {
    const products = await prisma.product.findMany({
      where: {
        quantity: {
          lte: prisma.product.fields.lowStockThreshold,
        },
      },
      include: {
        supplier: true,
      },
    });
    return { success: true, data: products };
  } catch (error) {
    console.error("Error fetching low stock products:", error);
    return { success: false, error: "Failed to fetch low stock products" };
  }
}

export async function createProduct(data: {
  sku: string;
  name: string;
  quantity: number;
  costPrice: number;
  sellingPrice: number;
  category: string;
  lowStockThreshold?: number;
  supplierId?: string;
}) {
  try {
    const product = await prisma.product.create({
      data: {
        ...data,
        costPrice: data.costPrice,
        sellingPrice: data.sellingPrice,
      },
    });
    revalidatePath("/inventory");
    revalidatePath("/");
    return { success: true, data: product };
  } catch (error) {
    console.error("Error creating product:", error);
    return { success: false, error: "Failed to create product" };
  }
}

export async function updateProduct(
  id: string,
  data: {
    sku?: string;
    name?: string;
    quantity?: number;
    costPrice?: number;
    sellingPrice?: number;
    category?: string;
    lowStockThreshold?: number;
    supplierId?: string;
  }
) {
  try {
    const product = await prisma.product.update({
      where: { id },
      data,
    });
    revalidatePath("/inventory");
    revalidatePath("/");
    return { success: true, data: product };
  } catch (error) {
    console.error("Error updating product:", error);
    return { success: false, error: "Failed to update product" };
  }
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({
      where: { id },
    });
    revalidatePath("/inventory");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: "Failed to delete product" };
  }
}
