# Supabase — Spark Lights 254

## Database setup

Run these in Supabase Dashboard → **SQL Editor** (in order):

1. **`setup.sql`** — full schema + seed (staff, 9 lighting categories, sample product)
2. **`blogs.sql`** — `BlogPost` table + SEO seed posts (required for Blog & SEO admin)
3. **`storage.sql`** — public `product-images` bucket (required for phone/device uploads)

### Admin login (after setup)

| Email | Password | Role |
|-------|----------|------|
| `mary@sparklights.co.ke` | `Mary@Admin254` | OWNER |
| `sarah@sparklights.co.ke` | `manager123` | MANAGER |
| `john@sparklights.co.ke` | `florist123` | FLORIST |

### Seeded category IDs (admin checkboxes)

These `Category.id` values are what product checkboxes send as `categoryIds` → `ProductCategory` rows:

| ID | Name | Slug (storefront filter) | Seed image URL |
|----|------|--------------------------|----------------|
| `cat_wall` | Wall Lights | `wall-lights` | `/5500.jpeg` |
| `cat_ceiling` | Ceiling Lights | `ceiling-lights` | `/round1.jpg` |
| `cat_outdoor` | Outdoor Lights | `outdoor-lights` | `/6000.jpeg` |
| `cat_bedroom` | Bedroom Lights | `bedroom-lights` | `/roomm3.png` |
| `cat_dining` | Dining Lights | `dining-lights` | `/3500.jpeg` |
| `cat_kitchen` | Kitchen Lights | `kitchen-lights` | `/3500..jpeg` |
| `cat_parking` | Parking Lights | `parking-lights` | `/7000.jpeg` |
| `cat_events` | Events Lights | `events-lights` | `/Screenshot_20251008_142202_1.jpg` |
| `cat_corridor` | Corridor Lights | `corridor-lights` | `/2500.jpeg` |

Storefront filters by **slug** (e.g. `/shop?category=ceiling-lights`). Admin saves **category IDs**.

### Allowed product image URLs

Saved on `ProductImage.url` — must be one of:

1. **Public showroom files** — paths like `/3500.jpeg` (files in Vite `public/`)
2. **Device uploads** —  
   `https://xvllxzcjjleronqneftg.supabase.co/storage/v1/object/public/product-images/products/...`  
   or `.../product-images/blogs/...` for blog covers

### App connection (Vercel / local `.env`)

**Do not use** `db.xvllxzcjjleronqneftg.supabase.co:5432` on Vercel — that host is IPv6-only and serverless cannot reach it.

Use the **Supavisor pooler** (region `eu-west-1` for this project):

```env
# Postgres (required)
DATABASE_URL=postgresql://postgres.xvllxzcjjleronqneftg:YOUR_PASSWORD@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.xvllxzcjjleronqneftg:YOUR_PASSWORD@aws-0-eu-west-1.pooler.supabase.com:5432/postgres

# Auth (required)
JWT_ACCESS_SECRET=your-access-secret-at-least-32-characters
JWT_REFRESH_SECRET=your-refresh-secret-at-least-32-characters
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Supabase Storage uploads (required for admin photo upload)
NEXT_PUBLIC_SUPABASE_URL=https://xvllxzcjjleronqneftg.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-jwt

# Frontend build-time (set in Vercel → Environment Variables, Production)
VITE_SUPABASE_URL=https://xvllxzcjjleronqneftg.supabase.co
VITE_API_URL=/v1
VITE_SITE_DOMAIN=sparklights.co.ke

# App
NODE_ENV=production
FRONTEND_URL=https://sparklights.co.ke
```

URL-encode `@` in passwords as `%40` (e.g. `SparkLights@254` → `SparkLights%40254`).

Copy connection strings from Supabase → **Project Settings → Database → Connection string → URI** (Transaction pooler for `DATABASE_URL`).

### Product / blog photo uploads

Admin → Products → **Upload from phone / device** compresses JPEGs client-side and stores them in Supabase Storage. URLs are saved on `ProductImage` records in Postgres.

Admin → **Blog & SEO** → default cover `/round1.jpg`, pick a showroom image, or upload (stored under `product-images/blogs/`).

If device uploads fail with file-size errors, re-run **`storage.sql`** (bucket limit is 5MB to match the API).
