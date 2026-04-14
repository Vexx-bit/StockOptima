# StockOptima - Enterprise Inventory Management System

An enterprise-grade inventory management system built with Next.js 15, TypeScript, Prisma, and Neon Serverless Postgres.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (Strict Mode)
- **Styling:** Tailwind CSS + Shadcn/UI (Dark mode default, Zinc theme)
- **Database:** Neon Serverless Postgres
- **ORM:** Prisma
- **State Management:** React Server Components + Zustand (if needed)

## Features

### ✅ Implemented

1. **Command Center Dashboard**
   - Total Inventory Value (calculated from cost price)
   - Low Stock Alerts count
   - Total Products count
   - Total Suppliers count
   - Recent Activity feed (last 5 transactions)

2. **Inventory Management**
   - Product listing with search functionality
   - Filter by low stock
   - View product details (SKU, name, category, quantity, prices, supplier)
   - Delete products
   - Visual low stock indicators

3. **Stock Management**
   - Add Stock modal (with transaction logging)
   - Remove Stock modal (with validation)
   - Transaction history tracking

4. **Database Schema**
   - Product model (with UUID, SKU, pricing, stock levels)
   - Supplier model (with contact information)
   - Transaction model (IN/OUT types with timestamps)
   - Proper relations and indexes

### 🚧 Coming Soon

- Add/Edit Product functionality
- Supplier management
- Analytics dashboard
- Settings page
- Advanced reporting
- Export functionality

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Neon database account

### Installation

1. Clone the repository:

```bash
cd StockOptima
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   Create a `.env` file with:

```env
DATABASE_URL="your_neon_database_url"
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Push the database schema:

```bash
npm run db:push
```

5. Generate Prisma Client:

```bash
npm run db:generate
```

6. Run the development server:

```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Prisma Studio
- `npm run db:generate` - Generate Prisma Client

## Project Structure

```
StockOptima/
├── actions/           # Server Actions for database operations
│   ├── dashboard.ts   # Dashboard statistics
│   ├── products.ts    # Product CRUD operations
│   └── transactions.ts # Stock management
├── app/               # Next.js App Router pages
│   ├── inventory/     # Inventory management page
│   ├── suppliers/     # Suppliers page (placeholder)
│   ├── analytics/     # Analytics page (placeholder)
│   ├── settings/      # Settings page (placeholder)
│   ├── layout.tsx     # Root layout
│   ├── page.tsx       # Dashboard page
│   └── globals.css    # Global styles
├── components/        # React components
│   ├── ui/            # Shadcn/UI components
│   ├── sidebar.tsx    # Navigation sidebar
│   ├── header.tsx     # Top header
│   ├── inventory-table.tsx    # Inventory data grid
│   ├── add-stock-modal.tsx    # Add stock dialog
│   └── remove-stock-modal.tsx # Remove stock dialog
├── lib/               # Utility functions
│   ├── prisma.ts      # Prisma client singleton
│   └── utils.ts       # Helper functions
├── prisma/
│   └── schema.prisma  # Database schema
└── package.json
```

## Database Schema

### Product

- `id` (UUID) - Primary key
- `sku` (String, unique) - Stock Keeping Unit
- `name` (String) - Product name
- `quantity` (Int) - Current stock level
- `costPrice` (Decimal) - Purchase cost
- `sellingPrice` (Decimal) - Selling price
- `category` (String) - Product category
- `lowStockThreshold` (Int, default: 10) - Alert threshold
- `supplierId` (UUID, optional) - Foreign key to Supplier

### Supplier

- `id` (UUID) - Primary key
- `name` (String) - Supplier name
- `email` (String, unique) - Contact email
- `phone` (String, optional) - Contact phone

### Transaction

- `id` (UUID) - Primary key
- `type` (Enum: IN/OUT) - Transaction type
- `quantity` (Int) - Quantity moved
- `productId` (UUID) - Foreign key to Product
- `date` (DateTime) - Transaction timestamp
- `notes` (String, optional) - Additional notes

## Design System

- **Theme:** Zinc (Dark mode default)
- **Font:** Inter (Google Fonts)
- **Icons:** Lucide React
- **Notifications:** Sonner (Toast notifications)

## License

Private - All rights reserved
