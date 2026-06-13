# Supabase — Spark Lights 254

## One-file setup

Run **`setup.sql`** in Supabase Dashboard → SQL Editor (paste entire file → Run).

That single file includes:
- Optional reset (commented out)
- Full database schema
- Seed data (staff, categories, delivery zones, store settings, sample product)
- Verification queries

## Admin login (after setup)

| Email | Password | Role |
|-------|----------|------|
| `mary@sparklights.co.ke` | `Mary@Admin254` | OWNER |
| `sarah@sparklights.co.ke` | `manager123` | MANAGER |
| `john@sparklights.co.ke` | `florist123` | FLORIST |

## App connection (Vercel / local `.env`)

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.xvllxzcjjleronqneftg.supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres:YOUR_PASSWORD@db.xvllxzcjjleronqneftg.supabase.co:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://xvllxzcjjleronqneftg.supabase.co
```

Use the **pooler** URI from Supabase for `DATABASE_URL` on Vercel (port 6543).

## Other files (optional splits)

| File | Purpose |
|------|---------|
| `setup.sql` | **Use this** — everything in one file |
| `00_reset.sql` | Standalone reset only |
| `01_schema.sql` | Schema only |
| `02_seed.sql` | Seed only |
| `03_update_admin.sql` | Update owner login on existing DB |
