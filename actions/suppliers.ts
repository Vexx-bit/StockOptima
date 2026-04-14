"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getSuppliers() {
  try {
    const suppliers = await prisma.supplier.findMany({
      include: {
        products: true,
      },
      orderBy: {
        name: "asc",
      },
    });
    return { success: true, data: suppliers };
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    return { success: false, error: "Failed to fetch suppliers" };
  }
}

export async function getSupplierById(id: string) {
  try {
    const supplier = await prisma.supplier.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });
    return { success: true, data: supplier };
  } catch (error) {
    console.error("Error fetching supplier:", error);
    return { success: false, error: "Failed to fetch supplier" };
  }
}

export async function createSupplier(data: {
  name: string;
  email: string;
  phone?: string;
}) {
  try {
    const supplier = await prisma.supplier.create({
      data,
    });
    revalidatePath("/suppliers");
    return { success: true, data: supplier };
  } catch (error) {
    console.error("Error creating supplier:", error);
    return { success: false, error: "Failed to create supplier" };
  }
}

export async function updateSupplier(
  id: string,
  data: {
    name?: string;
    email?: string;
    phone?: string;
  }
) {
  try {
    const supplier = await prisma.supplier.update({
      where: { id },
      data,
    });
    revalidatePath("/suppliers");
    return { success: true, data: supplier };
  } catch (error) {
    console.error("Error updating supplier:", error);
    return { success: false, error: "Failed to update supplier" };
  }
}

export async function deleteSupplier(id: string) {
  try {
    // Check if supplier has products
    const supplier = await prisma.supplier.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });

    if (supplier && supplier.products.length > 0) {
      return {
        success: false,
        error: `Cannot delete supplier with ${supplier.products.length} associated products`,
      };
    }

    await prisma.supplier.delete({
      where: { id },
    });
    revalidatePath("/suppliers");
    return { success: true };
  } catch (error) {
    console.error("Error deleting supplier:", error);
    return { success: false, error: "Failed to delete supplier" };
  }
}
