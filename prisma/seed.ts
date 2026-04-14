import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create suppliers
  const supplier1 = await prisma.supplier.upsert({
    where: { email: 'tech@suppliers.com' },
    update: {},
    create: {
      name: 'Tech Supplies Inc.',
      email: 'tech@suppliers.com',
      phone: '+1-555-0100',
    },
  });

  const supplier2 = await prisma.supplier.upsert({
    where: { email: 'office@suppliers.com' },
    update: {},
    create: {
      name: 'Office Essentials Ltd.',
      email: 'office@suppliers.com',
      phone: '+1-555-0200',
    },
  });

  const supplier3 = await prisma.supplier.upsert({
    where: { email: 'electronics@suppliers.com' },
    update: {},
    create: {
      name: 'Electronics Warehouse',
      email: 'electronics@suppliers.com',
      phone: '+1-555-0300',
    },
  });

  console.log('✅ Created suppliers');

  // Create products
  const products = [
    {
      sku: 'TECH-001',
      name: 'Wireless Mouse',
      quantity: 45,
      costPrice: 15.99,
      sellingPrice: 29.99,
      category: 'Electronics',
      lowStockThreshold: 20,
      supplierId: supplier1.id,
    },
    {
      sku: 'TECH-002',
      name: 'Mechanical Keyboard',
      quantity: 8,
      costPrice: 45.00,
      sellingPrice: 89.99,
      category: 'Electronics',
      lowStockThreshold: 10,
      supplierId: supplier1.id,
    },
    {
      sku: 'TECH-003',
      name: 'USB-C Cable 2m',
      quantity: 150,
      costPrice: 3.50,
      sellingPrice: 9.99,
      category: 'Accessories',
      lowStockThreshold: 50,
      supplierId: supplier1.id,
    },
    {
      sku: 'TECH-004',
      name: '27" Monitor',
      quantity: 5,
      costPrice: 180.00,
      sellingPrice: 349.99,
      category: 'Electronics',
      lowStockThreshold: 5,
      supplierId: supplier3.id,
    },
    {
      sku: 'OFF-001',
      name: 'A4 Paper (500 sheets)',
      quantity: 120,
      costPrice: 4.50,
      sellingPrice: 8.99,
      category: 'Office Supplies',
      lowStockThreshold: 30,
      supplierId: supplier2.id,
    },
    {
      sku: 'OFF-002',
      name: 'Ballpoint Pens (Pack of 10)',
      quantity: 75,
      costPrice: 2.00,
      sellingPrice: 4.99,
      category: 'Office Supplies',
      lowStockThreshold: 25,
      supplierId: supplier2.id,
    },
    {
      sku: 'OFF-003',
      name: 'Desk Organizer',
      quantity: 3,
      costPrice: 12.00,
      sellingPrice: 24.99,
      category: 'Office Supplies',
      lowStockThreshold: 10,
      supplierId: supplier2.id,
    },
    {
      sku: 'TECH-005',
      name: 'Laptop Stand',
      quantity: 22,
      costPrice: 25.00,
      sellingPrice: 49.99,
      category: 'Accessories',
      lowStockThreshold: 15,
      supplierId: supplier1.id,
    },
    {
      sku: 'TECH-006',
      name: 'Webcam HD 1080p',
      quantity: 12,
      costPrice: 35.00,
      sellingPrice: 69.99,
      category: 'Electronics',
      lowStockThreshold: 10,
      supplierId: supplier3.id,
    },
    {
      sku: 'TECH-007',
      name: 'Wireless Headphones',
      quantity: 6,
      costPrice: 55.00,
      sellingPrice: 119.99,
      category: 'Electronics',
      lowStockThreshold: 8,
      supplierId: supplier3.id,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { sku: product.sku },
      update: {},
      create: product,
    });
  }

  console.log('✅ Created products');

  // Create some sample transactions
  const allProducts = await prisma.product.findMany();

  // Add stock transactions
  await prisma.transaction.create({
    data: {
      type: 'IN',
      quantity: 50,
      productId: allProducts[0].id,
      notes: 'Initial stock',
    },
  });

  await prisma.transaction.create({
    data: {
      type: 'IN',
      quantity: 100,
      productId: allProducts[2].id,
      notes: 'Bulk order',
    },
  });

  // Remove stock transactions
  await prisma.transaction.create({
    data: {
      type: 'OUT',
      quantity: 5,
      productId: allProducts[0].id,
      notes: 'Customer order #1001',
    },
  });

  await prisma.transaction.create({
    data: {
      type: 'OUT',
      quantity: 2,
      productId: allProducts[1].id,
      notes: 'Customer order #1002',
    },
  });

  await prisma.transaction.create({
    data: {
      type: 'OUT',
      quantity: 7,
      productId: allProducts[6].id,
      notes: 'Customer order #1003',
    },
  });

  console.log('✅ Created sample transactions');

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
