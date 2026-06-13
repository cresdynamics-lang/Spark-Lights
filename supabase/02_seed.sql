-- =============================================================================
-- Spark Lights 254 — seed data for Supabase
-- Run AFTER 01_schema.sql
-- =============================================================================

-- ── Staff (admin login) ─────────────────────────────────────────────────────
-- Owner: mary@sparklights.co.ke / Mary@Admin254

INSERT INTO "Staff" (
  "id", "name", "email", "phone", "passwordHash", "role", "isActive", "createdAt", "updatedAt"
) VALUES
  (
    'staff_owner_spark',
    'Mary Admin',
    'mary@sparklights.co.ke',
    '+254712827840',
    '$2b$10$tYg9e3SRpeN.ulWl/yY25uVc5Q8gGkhvr.2EPwOAT/p2VAxS6eT0.',
    'OWNER',
    true,
    NOW(),
    NOW()
  ),
  (
    'staff_manager_spark',
    'Sarah Manager',
    'sarah@sparklights.co.ke',
    '+254799953563',
    '$2b$10$I6xGeODELA4OSFHZieLpdeqYqjRKby8UaaqVeVAn.7rDHYaAgp27S',
    'MANAGER',
    true,
    NOW(),
    NOW()
  ),
  (
    'staff_florist_spark',
    'John Staff',
    'john@sparklights.co.ke',
    '+254722222222',
    '$2b$10$IIKMMzndI.VSI3K0CwNQZ.HTIsRkFlL5Nhyoz62kiAakU5LDd2Wzm',
    'FLORIST',
    true,
    NOW(),
    NOW()
  )
ON CONFLICT ("email") DO UPDATE SET
  "name" = EXCLUDED."name",
  "phone" = EXCLUDED."phone",
  "passwordHash" = EXCLUDED."passwordHash",
  "role" = EXCLUDED."role",
  "isActive" = EXCLUDED."isActive",
  "updatedAt" = NOW();

-- ── Lighting categories ─────────────────────────────────────────────────────

INSERT INTO "Category" (
  "id", "name", "slug", "description", "imageUrl", "sortOrder", "isActive", "createdAt", "updatedAt"
) VALUES
  ('cat_wall', 'Wall Lights', 'wall-lights', 'Decorative and functional wall-mounted lighting.', '/5500.jpeg', 1, true, NOW(), NOW()),
  ('cat_ceiling', 'Ceiling Lights', 'ceiling-lights', 'Chandeliers, flush mounts, and ceiling fixtures.', '/round1.jpg', 2, true, NOW(), NOW()),
  ('cat_outdoor', 'Outdoor Lights', 'outdoor-lights', 'Weather-resistant exterior and gate lighting.', '/6000.jpeg', 3, true, NOW(), NOW()),
  ('cat_bedroom', 'Bedroom Lights', 'bedroom-lights', 'Soft, ambient lighting for bedrooms.', '/roomm3.png', 4, true, NOW(), NOW()),
  ('cat_dining', 'Dining Lights', 'dining-lights', 'Statement pendants and chandeliers for dining.', '/3500.jpeg', 5, true, NOW(), NOW()),
  ('cat_kitchen', 'Kitchen Lights', 'kitchen-lights', 'Bright panel and ceiling lights for kitchens.', '/3500..jpeg', 6, true, NOW(), NOW()),
  ('cat_parking', 'Parking Lights', 'parking-lights', 'Security and flood lighting for parking areas.', '/7000.jpeg', 7, true, NOW(), NOW()),
  ('cat_events', 'Events Lights', 'events-lights', 'Decorative lighting for events and venues.', '/Screenshot_20251008_142202_1.jpg', 8, true, NOW(), NOW()),
  ('cat_corridor', 'Corridor Lights', 'corridor-lights', 'Hallway and corridor ceiling lights.', '/2500.jpeg', 9, true, NOW(), NOW())
ON CONFLICT ("slug") DO UPDATE SET
  "name" = EXCLUDED."name",
  "description" = EXCLUDED."description",
  "imageUrl" = EXCLUDED."imageUrl",
  "sortOrder" = EXCLUDED."sortOrder",
  "isActive" = EXCLUDED."isActive",
  "updatedAt" = NOW();

-- ── Nairobi delivery zones ──────────────────────────────────────────────────

INSERT INTO "DeliveryZone" (
  "id", "name", "deliveryFeeKes", "isActive", "createdAt", "updatedAt"
) VALUES
  ('zone_westlands', 'Westlands', 500, true, NOW(), NOW()),
  ('zone_kilimani', 'Kilimani', 500, true, NOW(), NOW()),
  ('zone_karen', 'Karen', 800, true, NOW(), NOW()),
  ('zone_lavington', 'Lavington', 600, true, NOW(), NOW()),
  ('zone_cbd', 'CBD', 400, true, NOW(), NOW()),
  ('zone_parklands', 'Parklands', 500, true, NOW(), NOW()),
  ('zone_syokimau', 'Syokimau', 1000, true, NOW(), NOW()),
  ('zone_ruaka', 'Ruaka', 900, true, NOW(), NOW())
ON CONFLICT ("name") DO UPDATE SET
  "deliveryFeeKes" = EXCLUDED."deliveryFeeKes",
  "isActive" = EXCLUDED."isActive",
  "updatedAt" = NOW();

-- ── Delivery slot capacity ──────────────────────────────────────────────────

INSERT INTO "DeliverySlotConfig" ("id", "slot", "maxOrders", "isActive", "updatedAt") VALUES
  ('slot_morning', 'MORNING', 20, true, NOW()),
  ('slot_afternoon', 'AFTERNOON', 30, true, NOW()),
  ('slot_evening', 'EVENING', 15, true, NOW())
ON CONFLICT ("id") DO UPDATE SET
  "maxOrders" = EXCLUDED."maxOrders",
  "isActive" = EXCLUDED."isActive",
  "updatedAt" = NOW();

-- ── Store settings (JSON) ───────────────────────────────────────────────────

INSERT INTO "StoreSetting" ("id", "key", "value", "updatedAt") VALUES
  ('setting_store_name', 'store_name', '"Spark Lights 254"', NOW()),
  ('setting_currency', 'default_currency', '"KES"', NOW()),
  ('setting_timezone', 'timezone', '"Africa/Nairobi"', NOW()),
  ('setting_free_delivery', 'free_delivery_threshold_kes', '3000', NOW()),
  ('setting_same_day_cutoff', 'same_day_cutoff_hour', '14', NOW()),
  ('setting_whatsapp', 'whatsapp_number', '"+254712827840"', NOW())
ON CONFLICT ("key") DO UPDATE SET
  "value" = EXCLUDED."value",
  "updatedAt" = NOW();

-- ── Sample product (optional — links public image to DB for admin edit demo) ─

INSERT INTO "Product" (
  "id", "name", "slug", "shortDescription", "longDescription",
  "isFeatured", "isActive", "sortOrder", "createdAt", "updatedAt"
) VALUES (
  'prod_3500_demo',
  'Modern Ceiling Light — KES 3,500',
  '3500',
  'Modern ceiling light for homes and offices in Nairobi.',
  'Available at Spark Lights 254, Nyamakima. Same-day delivery across Nairobi. Professional installation on request.',
  true,
  true,
  1,
  NOW(),
  NOW()
)
ON CONFLICT ("slug") DO UPDATE SET
  "name" = EXCLUDED."name",
  "shortDescription" = EXCLUDED."shortDescription",
  "longDescription" = EXCLUDED."longDescription",
  "updatedAt" = NOW();

INSERT INTO "ProductImage" ("id", "productId", "url", "isPrimary", "sortOrder")
VALUES ('img_3500_demo', 'prod_3500_demo', '/3500.jpeg', true, 0)
ON CONFLICT ("id") DO UPDATE SET
  "url" = EXCLUDED."url",
  "isPrimary" = EXCLUDED."isPrimary";

INSERT INTO "ProductVariant" (
  "id", "productId", "label", "priceKes", "stockQty", "lowStockAlert", "stemsUsed", "isActive", "createdAt", "updatedAt"
) VALUES (
  'var_3500_demo', 'prod_3500_demo', 'Default', 3500.00, 25, 5, 1, true, NOW(), NOW()
)
ON CONFLICT ("id") DO UPDATE SET
  "priceKes" = EXCLUDED."priceKes",
  "stockQty" = EXCLUDED."stockQty",
  "updatedAt" = NOW();

INSERT INTO "ProductCategory" ("productId", "categoryId")
VALUES
  ('prod_3500_demo', 'cat_ceiling'),
  ('prod_3500_demo', 'cat_kitchen')
ON CONFLICT ("productId", "categoryId") DO NOTHING;
