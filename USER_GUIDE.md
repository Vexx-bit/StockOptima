# 📖 StockOptima - Complete User Guide

## 🎯 **Getting Started**

### **Access the Application**

1. Open your browser
2. Navigate to: `http://localhost:3000`
3. You'll see the Dashboard (Command Center)

---

## 📊 **Dashboard (Home)**

### **What You'll See:**

- **4 KPI Cards:**
  - 💰 Total Inventory Value ($7,234.50)
  - 📦 Total Products (10)
  - ⚠️ Low Stock Alerts (4)
  - 👥 Total Suppliers (3)

- **Recent Activity Feed:**
  - Last 5 transactions
  - Green arrows (↑) = Stock IN
  - Red arrows (↓) = Stock OUT
  - Shows product name, quantity, and time

### **How to Use:**

- View at-a-glance metrics
- Click on low stock alerts to see which products need attention
- Monitor recent stock movements

---

## 📦 **Inventory Management**

### **Viewing Products**

1. Click **"Inventory"** in the left sidebar
2. You'll see a table with all products showing:
   - SKU (unique identifier)
   - Product Name
   - Category
   - Quantity (with ⚠️ icon if low stock)
   - Cost Price
   - Selling Price
   - Supplier

### **Search & Filter**

**Search:**

- Type in the search box to find products by name or SKU
- Example: Type "Mouse" to find "Wireless Mouse"

**Filter:**

- Click **"Low Stock Only"** button to see products below threshold
- Click again to show all products

### **Adding a New Product**

1. Click **"Add Product"** button (top right)
2. Fill in the form:
   - **SKU:** Unique code (e.g., TECH-008)
   - **Product Name:** Descriptive name
   - **Category:** Product category
   - **Initial Quantity:** Starting stock
   - **Cost Price:** What you paid
   - **Selling Price:** What you charge
   - **Low Stock Threshold:** Alert level (default: 10)
3. Click **"Create Product"**
4. See success toast notification
5. Product appears in table

### **Editing a Product**

1. Find the product in the table
2. Click the **⋮** (three dots) menu
3. Select **"Edit Product"**
4. Update any fields
5. Click **"Update Product"**
6. Changes saved immediately

### **Adding Stock**

1. Click **⋮** menu on product
2. Select **"Add Stock"**
3. Enter quantity to add
4. Add optional notes (e.g., "Supplier delivery")
5. Click **"Add Stock"**
6. Quantity updates
7. Transaction logged

### **Removing Stock**

1. Click **⋮** menu on product
2. Select **"Remove Stock"**
3. Enter quantity to remove
4. Add optional notes (e.g., "Customer order #1234")
5. Click **"Remove Stock"**
6. System validates you have enough stock
7. Quantity updates
8. Transaction logged

### **Deleting a Product**

1. Click **⋮** menu on product
2. Select **"Delete Product"**
3. Confirm deletion
4. Product removed from database

---

## 👥 **Supplier Management**

### **Viewing Suppliers**

1. Click **"Suppliers"** in sidebar
2. See supplier cards showing:
   - Supplier name
   - Email address
   - Phone number
   - Number of products

### **Adding a Supplier**

1. Click **"Add Supplier"** button
2. Fill in the form:
   - **Supplier Name:** Company name
   - **Email:** Contact email (required)
   - **Phone:** Contact number (optional)
3. Click **"Create Supplier"**
4. New card appears

### **Deleting a Supplier**

1. Find supplier card
2. Click **"Delete"** button
3. Confirm deletion
4. **Note:** Cannot delete if supplier has products

---

## 📈 **Analytics Dashboard**

### **Financial KPIs**

**Inventory Value:**

- Total cost of all stock
- Based on cost price × quantity

**Potential Revenue:**

- Total if all stock sold
- Based on selling price × quantity

**Potential Profit:**

- Revenue minus cost
- Shows profit margin %

**Total Products:**

- Count of all products
- Shows low stock count

### **Category Breakdown**

- Visual progress bars
- Shows value distribution
- Lists products per category
- Total units per category

### **Top Products**

- Top 5 products by total value
- Ranked with numbered badges
- Shows quantity and value

### **Stock Movements**

- **Stock IN:** Recent additions
- **Stock OUT:** Recent removals
- Last 30 transactions tracked

---

## ⚙️ **Settings**

### **System Information**

- Application name and version
- Framework details
- Database type

### **Database Statistics**

- Real-time counts:
  - Products
  - Suppliers
  - Transactions

### **Quick Actions**

**Database Management:**

- Open Prisma Studio
- Command: `npm run db:studio`

**Sample Data:**

- Reseed database
- Command: `npm run db:seed`

**Development Commands:**

- Listed with copy-ready commands

### **Tech Stack**

- Visual badges showing technologies used

---

## 🎯 **Common Workflows**

### **Workflow 1: Receiving New Stock**

1. Go to **Inventory**
2. Find the product
3. Click **⋮** → **"Add Stock"**
4. Enter quantity received
5. Add note: "Delivery from [Supplier]"
6. Confirm
7. Check Dashboard for updated value

### **Workflow 2: Processing Customer Order**

1. Go to **Inventory**
2. Find products in order
3. For each product:
   - Click **⋮** → **"Remove Stock"**
   - Enter quantity sold
   - Add note: "Order #[number]"
4. Check Dashboard for updated metrics

### **Workflow 3: Adding New Product Line**

1. Go to **Suppliers**
2. Add supplier if new
3. Go to **Inventory**
4. Click **"Add Product"**
5. Fill in all details
6. Select supplier
7. Set low stock threshold
8. Create product

### **Workflow 4: Monthly Review**

1. Go to **Analytics**
2. Review financial KPIs
3. Check category performance
4. Identify top products
5. Review stock movements
6. Go to **Inventory**
7. Filter **"Low Stock Only"**
8. Reorder products below threshold

---

## 💡 **Tips & Best Practices**

### **Inventory Management**

✅ **Set Realistic Thresholds:**

- Fast-moving items: Higher threshold (20-50)
- Slow-moving items: Lower threshold (5-10)

✅ **Use Descriptive SKUs:**

- Include category prefix (TECH-, OFF-, etc.)
- Sequential numbering
- Easy to remember

✅ **Add Transaction Notes:**

- Always note why stock changed
- Include order numbers
- Reference supplier deliveries

### **Supplier Management**

✅ **Keep Contact Info Updated:**

- Verify email addresses
- Include direct phone numbers
- Update when changes occur

✅ **Track Product Distribution:**

- Monitor products per supplier
- Diversify suppliers for critical items

### **Analytics**

✅ **Regular Reviews:**

- Check weekly for trends
- Monthly deep dives
- Quarterly planning

✅ **Monitor Profit Margins:**

- Identify low-margin products
- Adjust pricing as needed
- Focus on high-value items

---

## 🔍 **Troubleshooting**

### **Product Not Appearing**

- Check search filters
- Verify not filtered by "Low Stock Only"
- Refresh page

### **Cannot Delete Supplier**

- Supplier has associated products
- Reassign or delete products first
- Then delete supplier

### **Stock Removal Fails**

- Check current quantity
- Cannot remove more than available
- Verify quantity entered correctly

### **Page Not Loading**

- Check dev server is running
- Verify database connection
- Check browser console for errors

---

## ⌨️ **Keyboard Shortcuts**

Currently, the app uses standard browser shortcuts:

- **Ctrl/Cmd + F:** Search in page
- **Ctrl/Cmd + R:** Refresh page
- **Tab:** Navigate form fields
- **Enter:** Submit forms
- **Esc:** Close modals

---

## 📱 **Mobile Usage**

The app is fully responsive:

- **Sidebar:** Collapsible on mobile
- **Tables:** Horizontal scroll
- **Cards:** Stack vertically
- **Modals:** Full-screen on small devices

---

## 🚀 **Advanced Features**

### **Bulk Operations** (Future)

- Import products from CSV
- Export data to Excel
- Batch update prices

### **Reporting** (Future)

- PDF reports
- Email notifications
- Scheduled exports

### **Multi-User** (Future)

- User accounts
- Role-based permissions
- Activity logs

---

## 📞 **Support**

### **Documentation**

- `README.md` - Project overview
- `QUICKSTART.md` - Quick start
- `COMPLETE.md` - Feature list
- `FINAL.md` - Implementation report
- `USER_GUIDE.md` - This guide

### **Commands**

```bash
npm run dev          # Start development
npm run db:studio    # Database GUI
npm run db:seed      # Reset data
npm run build        # Production build
```

---

## 🎓 **Learning Resources**

### **Technologies Used**

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Shadcn/UI](https://ui.shadcn.com)

---

**🎉 You're now ready to use StockOptima like a pro!**

For questions or issues, refer to the documentation files or check the Settings page for system information.

**Happy Inventory Managing! 📦**
