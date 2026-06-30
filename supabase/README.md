# Supabase — Spark Lights 254

## Database setup (one file)

Run **`setup.sql`** in Supabase Dashboard → SQL Editor:

1. Open [SQL Editor](https://supabase.com/dashboard/project/xvllxzcjjleronqneftg/sql)
2. Paste the entire contents of `setup.sql`
3. Click **Run**

### What's included

- Optional reset block (commented out — uncomment for clean reinstall)
- Full schema (enums, tables, indexes, foreign keys)
- Seed data (staff, 9 lighting categories, delivery zones, store settings, sample product)
- Verification queries at the end

### Admin login (after setup)

| Email | Password | Role |
|-------|----------|------|
| `mary@sparklights.co.ke` | `Mary@Admin254` | OWNER |
| `sarah@sparklights.co.ke` | `manager123` | MANAGER |
| `john@sparklights.co.ke` | `florist123` | FLORIST |

### App connection (Vercel / local `.env`)

**Do not use** `db.xvllxzcjjleronqneftg.supabase.co:5432` on Vercel — that host is IPv6-only and serverless cannot reach it.

Use the **Supavisor pooler** (region `eu-west-1` for this project):

```env
# Runtime (Vercel API, serverless) — port 6543 + pgbouncer
DATABASE_URL=postgresql://postgres.xvllxzcjjleronqneftg:YOUR_PASSWORD@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true

# Prisma directUrl (migrations) — session pooler port 5432
DIRECT_URL=postgresql://postgres.xvllxzcjjleronqneftg:YOUR_PASSWORD@aws-0-eu-west-1.pooler.supabase.com:5432/postgres

NEXT_PUBLIC_SUPABASE_URL=https://xvllxzcjjleronqneftg.supabase.co
JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret
NODE_ENV=production
FRONTEND_URL=https://your-domain.vercel.app
```

URL-encode `@` in passwords as `%40` (e.g. `SparkLights@254` → `SparkLights%40254`).

Copy connection strings from Supabase Dashboard → **Project Settings → Database → Connection string → URI** (Transaction pooler for `DATABASE_URL`).

### Product photo uploads (admin)

Run **`storage.sql`** once to create the public `product-images` bucket.

Admin → Products → **Upload from phone / device** compresses JPEGs client-side and stores them in Supabase Storage. URLs are saved on `ProductImage` records in Postgres.

Admin → **Blog & SEO** → new/edit post: default cover is `/round1.jpg`, pick another showroom image, type a custom path/URL, or **upload from phone/device** (stored under `product-images/blogs/`).
