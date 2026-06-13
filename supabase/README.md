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

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.xvllxzcjjleronqneftg.supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres:YOUR_PASSWORD@db.xvllxzcjjleronqneftg.supabase.co:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://xvllxzcjjleronqneftg.supabase.co
```

Use the **pooler** URI from Supabase Dashboard for `DATABASE_URL` on Vercel (port 6543).
