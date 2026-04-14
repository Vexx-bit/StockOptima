# 🚀 StockOptima - Deployment Guide

## 📋 **Pre-Deployment Checklist**

### **✅ Development Complete**

- [x] All features implemented
- [x] Database schema finalized
- [x] Sample data seeded
- [x] All pages functional
- [x] No build errors
- [x] Documentation complete

### **✅ Environment Setup**

- [x] Neon database configured
- [x] Environment variables set
- [x] Dependencies installed
- [x] Prisma client generated

---

## 🌐 **Deployment Options**

### **Option 1: Vercel (Recommended)**

#### **Why Vercel?**

- ✅ Built for Next.js
- ✅ Zero configuration
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Free tier available
- ✅ Serverless functions

#### **Deployment Steps:**

**1. Prepare Your Project**

```bash
# Ensure everything is committed
git add .
git commit -m "Ready for deployment"
git push origin main
```

**2. Install Vercel CLI**

```bash
npm install -g vercel
```

**3. Deploy**

```bash
# From project directory
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: stock-optima
# - Directory: ./
# - Override settings? No
```

**4. Set Environment Variables**

In Vercel Dashboard:

1. Go to Project Settings
2. Click "Environment Variables"
3. Add:
   ```
   DATABASE_URL=your_neon_connection_string
   ```
4. Save and redeploy

**5. Production Deployment**

```bash
vercel --prod
```

#### **Vercel Configuration**

Create `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

---

### **Option 2: Netlify**

#### **Deployment Steps:**

**1. Build Settings**

```
Build command: npm run build
Publish directory: .next
```

**2. Environment Variables**

```
DATABASE_URL=your_neon_connection_string
```

**3. Deploy**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

---

### **Option 3: Railway**

#### **Deployment Steps:**

**1. Create Railway Account**

- Visit [railway.app](https://railway.app)
- Sign up with GitHub

**2. New Project**

- Click "New Project"
- Select "Deploy from GitHub repo"
- Choose your repository

**3. Environment Variables**

```
DATABASE_URL=your_neon_connection_string
```

**4. Deploy**

- Railway auto-deploys on push

---

### **Option 4: Self-Hosted (VPS)**

#### **Requirements:**

- Ubuntu 20.04+ or similar
- Node.js 18+
- PM2 process manager
- Nginx reverse proxy

#### **Deployment Steps:**

**1. Server Setup**

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx
```

**2. Clone Repository**

```bash
cd /var/www
git clone your-repo-url stock-optima
cd stock-optima
```

**3. Install Dependencies**

```bash
npm install
```

**4. Set Environment Variables**

```bash
# Create .env file
nano .env

# Add:
DATABASE_URL=your_neon_connection_string
NODE_ENV=production
```

**5. Build Application**

```bash
npm run build
```

**6. Start with PM2**

```bash
pm2 start npm --name "stock-optima" -- start
pm2 save
pm2 startup
```

**7. Configure Nginx**

```bash
sudo nano /etc/nginx/sites-available/stock-optima
```

Add:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/stock-optima /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

**8. SSL with Let's Encrypt**

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## 🔐 **Security Checklist**

### **Before Production:**

- [ ] Change default credentials
- [ ] Enable HTTPS
- [ ] Set secure environment variables
- [ ] Configure CORS if needed
- [ ] Enable rate limiting
- [ ] Set up monitoring
- [ ] Configure backups
- [ ] Review database permissions

---

## 📊 **Database Migration**

### **Neon to Production**

**1. Export Current Data**

```bash
# Using Prisma Studio
npm run db:studio
# Export data manually

# Or using pg_dump
pg_dump $DATABASE_URL > backup.sql
```

**2. Create Production Database**

- Create new Neon project for production
- Or use your preferred PostgreSQL provider

**3. Update Environment Variables**

```bash
# Production .env
DATABASE_URL=production_database_url
```

**4. Push Schema**

```bash
npm run db:push
```

**5. Seed Production Data**

```bash
# Only if you want sample data
npm run db:seed

# Or import your backup
psql $DATABASE_URL < backup.sql
```

---

## 🔄 **CI/CD Setup**

### **GitHub Actions**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: "--prod"
```

---

## 📈 **Monitoring & Analytics**

### **Recommended Tools:**

**1. Vercel Analytics**

```bash
npm install @vercel/analytics
```

Add to `app/layout.tsx`:

```tsx
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

**2. Sentry (Error Tracking)**

```bash
npm install @sentry/nextjs
```

**3. Uptime Monitoring**

- UptimeRobot
- Pingdom
- Better Uptime

---

## 🔧 **Performance Optimization**

### **Before Deployment:**

**1. Optimize Images**

- Use Next.js Image component
- Enable image optimization

**2. Enable Caching**

- Configure cache headers
- Use ISR for static pages

**3. Minimize Bundle**

```bash
# Analyze bundle
npm run build
# Check .next/analyze
```

**4. Database Optimization**

- Add indexes (already done)
- Enable connection pooling
- Use Prisma Accelerate (optional)

---

## 🚦 **Health Checks**

### **Create Health Endpoint**

Create `app/api/health/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({
      status: "healthy",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        database: "disconnected",
      },
      { status: 500 },
    );
  }
}
```

---

## 📝 **Post-Deployment**

### **Verification Checklist:**

- [ ] Site loads correctly
- [ ] Database connection works
- [ ] All pages accessible
- [ ] Forms submit successfully
- [ ] Images load
- [ ] API routes functional
- [ ] HTTPS enabled
- [ ] Mobile responsive
- [ ] Performance acceptable
- [ ] Error tracking active

### **Test Workflows:**

1. **Create Product**
   - Add new product
   - Verify in database

2. **Stock Management**
   - Add stock
   - Remove stock
   - Check transactions

3. **Supplier Management**
   - Add supplier
   - Verify display

4. **Analytics**
   - Check calculations
   - Verify data accuracy

---

## 🔄 **Updating Production**

### **Safe Deployment Process:**

**1. Test Locally**

```bash
npm run build
npm start
# Test thoroughly
```

**2. Commit Changes**

```bash
git add .
git commit -m "Description of changes"
git push origin main
```

**3. Deploy**

```bash
vercel --prod
# Or your deployment method
```

**4. Verify**

- Check production site
- Test critical features
- Monitor for errors

---

## 🆘 **Rollback Plan**

### **If Deployment Fails:**

**Vercel:**

```bash
# Rollback to previous deployment
vercel rollback
```

**Self-Hosted:**

```bash
# Revert git commit
git revert HEAD
git push origin main

# Or checkout previous commit
git checkout previous-commit-hash
pm2 restart stock-optima
```

---

## 📞 **Support Resources**

### **Documentation:**

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Docs](https://vercel.com/docs)
- [Prisma Production](https://www.prisma.io/docs/guides/deployment)
- [Neon Docs](https://neon.tech/docs)

### **Community:**

- Next.js Discord
- Prisma Discord
- Stack Overflow

---

## 🎉 **You're Ready to Deploy!**

**Recommended Path:**

1. Start with Vercel (easiest)
2. Test thoroughly
3. Monitor performance
4. Scale as needed

**Good luck with your deployment! 🚀**

---

**Last Updated:** 2026-02-06  
**Version:** 1.0.0  
**Status:** Production Ready ✅
