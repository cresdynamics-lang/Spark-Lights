-- =============================================================================
-- SPARK LIGHTS 254 — BLOG TABLE + SEO SEED (run on existing database)
-- =============================================================================
-- Supabase Dashboard → SQL Editor → paste all → Run
-- Safe to re-run (IF NOT EXISTS + ON CONFLICT upsert).
-- =============================================================================

CREATE TABLE IF NOT EXISTS "BlogPost" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "excerpt" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "readMinutes" INTEGER NOT NULL DEFAULT 5,
  "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "image" TEXT NOT NULL,
  "seoTitle" TEXT NOT NULL,
  "metaDescription" TEXT NOT NULL,
  "seoKeywords" TEXT NOT NULL,
  "sections" JSONB NOT NULL DEFAULT '[]',
  "relatedLinks" JSONB NOT NULL DEFAULT '[]',
  "isPublished" BOOLEAN NOT NULL DEFAULT true,
  "authorId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "BlogPost_slug_key" ON "BlogPost"("slug");
CREATE INDEX IF NOT EXISTS "BlogPost_isPublished_publishedAt_idx" ON "BlogPost"("isPublished", "publishedAt");
CREATE INDEX IF NOT EXISTS "BlogPost_category_idx" ON "BlogPost"("category");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'BlogPost_authorId_fkey'
  ) THEN
    ALTER TABLE "BlogPost"
      ADD CONSTRAINT "BlogPost_authorId_fkey"
      FOREIGN KEY ("authorId") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

ALTER TABLE IF EXISTS "BlogPost" DISABLE ROW LEVEL SECURITY;

-- Remove outdated slugs (optional cleanup)
DELETE FROM "BlogPost" WHERE "slug" IN (
  'solar-security-lights-nairobi',
  'supply-and-fix-why-bundle',
  'chandeliers-nairobi-price-guide',
  'modern-gypsum-ceiling-lights-nairobi'
);

-- ── 3 SEO-optimized Spark Lights 254 blog posts ───────────────────────────────

INSERT INTO "BlogPost" (
  "id", "slug", "title", "excerpt", "category", "readMinutes", "publishedAt",
  "image", "seoTitle", "metaDescription", "seoKeywords", "sections", "relatedLinks",
  "isPublished", "authorId", "updatedAt"
) VALUES

-- BLOG 1: Product & Pricing Intent
(
  'blog_chandelier_prices_254',
  'modern-chandeliers-ceiling-lights-prices-nairobi',
  'Modern Chandeliers and Ceiling Lights Prices in Nairobi: The Ultimate Buying Guide',
  'Upgrading your Nairobi home with chandeliers or ceiling lights? Spark Lights 254 breaks down modern fixture types, real KES price ranges, and how to order same-day across Kilimani, Karen, Syokimau & more.',
  'Buying Guide',
  8,
  '2026-06-01'::timestamp,
  '/round1.jpg',
  'Modern Chandeliers & Ceiling Lights Prices Nairobi | Spark Lights 254',
  'Modern chandeliers and ceiling lights prices in Nairobi — KES 2,000 to KES 21,500+. Clear pricing, same-day delivery Westlands, Kilimani, Karen. Order on WhatsApp at Spark Lights 254.',
  'modern chandeliers and ceiling lights prices in Nairobi, chandeliers in Nairobi price, modern ceiling lights Nairobi, pendant lights Kenya, lighting shop Nyamakima, Spark Lights 254',
  $json$[
    {
      "heading": "Transform Your Space with Statement Lighting",
      "paragraphs": [
        "Upgrading your home with a statement lighting fixture is one of the fastest ways to transform a standard space into a luxury interior. Whether you are remodeling an open-plan lounge in Kilimani or finishing a new property development in Syokimau, choosing the right fixture involves balancing modern design, functionality, and cost.",
        "Finding reliable information on modern chandeliers and ceiling lights prices in Nairobi can be challenging, with many vendors withholding clear pricing structures. Spark Lights 254 publishes every price in KES on our website — no inbox quotes. This guide covers current market options and design trends to help you choose the ideal setup for your space."
      ]
    },
    {
      "heading": "Understanding Chandelier and Ceiling Light Options",
      "paragraphs": [
        "Every room serves a distinct purpose, requiring a specific lighting approach:",
        "Modern Chandeliers: Functional central focal points. Standard gold, crystal, or geometric multi-bulb designs elevate living areas and formal dining rooms.",
        "Flush Mount Ceiling Lights: For lower overhead clearance, multi-mode LED ceiling panels provide ambient illumination without compromising head space.",
        "Pendant Lights: Single-cord fixtures offering targeted downlighting — ideal for kitchen islands, breakfast counters, or dining tables."
      ]
    },
    {
      "heading": "Current Lighting Prices in Nairobi (Spark Lights 254)",
      "paragraphs": [
        "High-end interior design does not require an excessive budget. Clear, upfront local pricing helps property owners plan effectively:",
        "Sisal & Minimalist Pendants — KES 2,000 to KES 7,500. Best for kitchen counters, rustic dining areas, and cafes.",
        "Multi-Mode LED Ceiling Panels — KES 2,500 to KES 9,500. Best for bedrooms, low-ceiling corridors, and modern lounges.",
        "Modern Multi-Bulb Chandeliers — KES 8,500 to KES 15,500. Best for standard living areas and medium-sized dining spaces.",
        "Premium Gold & Crystal Chandeliers — KES 17,500 to KES 21,500+. Best for high-ceiling entries, formal lounges, and master bedrooms.",
        "Browse our shop — every product shows the exact KES price before you order."
      ]
    },
    {
      "heading": "Key Factors When Selecting Your Fixture",
      "paragraphs": [
        "Ceiling Height: Measure floor to ceiling before buying. Low ceilings need flush or semi-flush mounts; high ceilings allow descending vertical profiles like chandeliers.",
        "Color Temperature: Modern fixtures often feature tri-color switching — Warm White (cosy evening ambience), Neutral White (daytime reading), and Cool White (focused utility) via a standard wall switch.",
        "Bulb Inclusivity: Confirm if the listed price includes compatible LED bulbs to avoid surprise secondary expenses. Ask us on WhatsApp before you pay."
      ]
    },
    {
      "heading": "Order Quality Lighting from Spark Lights 254 Today",
      "paragraphs": [
        "Avoid navigating crowded market lanes looking for clear options. Spark Lights 254 stocks premium chandeliers, pendant fixtures, and multi-mode ceiling systems with explicit KES pricing at our Nyamakima showroom.",
        "We offer same-day delivery across Nairobi — Westlands, Kilimani, Karen, Lavington, Ngong Road, Syokimau, Kitengela, and Ruaka — for orders placed before 2:00 PM via Moto/Bolt courier.",
        "Browse our curated collection and order directly on WhatsApp to speak with a Spark Lights 254 specialist. Tap Chat on WhatsApp on any product page — we confirm stock, delivery fee, and payment before you send money."
      ]
    }
  ]$json$::jsonb,
  $json$[
    {"label": "Shop Chandeliers with Prices", "path": "/category/ceiling-lights"},
    {"label": "Pendant Lights Kenya", "path": "/category/dining-lights"},
    {"label": "Order on WhatsApp", "path": "/contact"},
    {"label": "Supply & Fix Packages", "path": "/installation"}
  ]$json$::jsonb,
  true,
  'staff_owner_spark',
  NOW()
),

-- BLOG 2: Installation & Supply & Fix
(
  'blog_installation_254',
  'professional-chandelier-installation-services-nairobi',
  'Professional Chandelier and Lighting Installation Services in Nairobi: What You Need to Know',
  'Heavy chandeliers and gypsum LED layouts need professional fitting. Spark Lights 254 explains installation risks, our step-by-step process, and Supply & Fix packages across Nairobi.',
  'Installation Services',
  9,
  '2026-05-15'::timestamp,
  '/round2.jpg',
  'Professional Chandelier Installation Services Nairobi | Spark Lights 254',
  'Professional chandelier and lighting installation in Nairobi. Supply & Fix — secure wiring, gypsum fitting & testing. Spark Lights 254 serves CBD, Lavington, Ruaka & more. WhatsApp quote.',
  'chandelier installation services Nairobi, lighting installation services Kenya, professional chandelier installation Nairobi, fundi for lights Nairobi, supply and fix Nairobi, Spark Lights 254',
  $json$[
    {
      "heading": "Why Professional Installation Matters",
      "paragraphs": [
        "Purchasing a premium light fixture is only the first step toward transforming your interior. Proper installation is critical to safety and performance. Heavy statement fixtures, delicate glass components, and complex multi-tiered wiring layouts require technical expertise.",
        "For property owners across Nairobi, hiring professional chandelier installation services protects your investment and ensures secure mounting. Spark Lights 254 offers integrated Supply & Fix — product, delivery, and certified fitting in one WhatsApp quote."
      ]
    },
    {
      "heading": "The Risks of DIY Structural Light Fitting",
      "paragraphs": [
        "Attempting to mount a heavy luxury light or complex crystal fixture without professional guidance presents serious challenges:",
        "Structural Anchoring Failure: Premium modern chandeliers can weigh 5 to over 20 kilograms. Standard plastic ceiling plugs cannot support this long-term — they require heavy-duty concrete anchor bolts or reinforced joist brackets.",
        "Circuit Overloads: Improperly calculating wattage loads on multi-bulb systems can trip breakers or melt wiring insulation.",
        "Tri-Color Control Issues: Modern multi-mode LED lights rely on sequential driver components. Faulty wiring can cause uneven switching or flickering."
      ]
    },
    {
      "heading": "Our Step-by-Step Professional Installation Process",
      "paragraphs": [
        "Site Inspection & Safety Isolation: Technicians isolate the breaker zone and verify ceiling substrate load capacity.",
        "Substrate Anchor Fitting: For gypsum board, installers locate galvanized furring channels or bridge into the concrete slab using steel drop-in anchors.",
        "Driver & Control Integration: Multi-stage LED drivers are housed safely within the flush junction canopy box.",
        "Balance & Component Dressing: Heavy chassis frames are hung and balanced before delicate glass accents are attached.",
        "Installation stack: Main concrete slab → heavy-duty steel anchors → gypsum furring → reinforced mounting bracket → chandelier canopy / LED driver → balanced chassis frame."
      ]
    },
    {
      "heading": "Complete Supply & Fix Solutions at Spark Lights 254",
      "paragraphs": [
        "Save time and minimize coordination hassle with one provider. Spark Lights 254 Supply & Fix includes secure wiring, physical fitting, and final electrical testing for any fixture purchased from us.",
        "Essential Ceiling Package from KES 4,500 · Chandelier Supply & Fix from KES 8,500 · Gypsum room packages on quote.",
        "Whether your project is a CBD office tower, a townhouse in Lavington, or an apartment block in Ruaka, our field team delivers dependable support.",
        "Chat with Spark Lights 254 on WhatsApp for a comprehensive product-and-installation quote today."
      ]
    }
  ]$json$::jsonb,
  $json$[
    {"label": "View Supply & Fix Packages", "path": "/installation"},
    {"label": "Shop Chandeliers", "path": "/category/ceiling-lights"},
    {"label": "Gypsum Ceiling Lights", "path": "/category/kitchen-lights"},
    {"label": "Chat on WhatsApp", "path": "/contact"}
  ]$json$::jsonb,
  true,
  'staff_owner_spark',
  NOW()
),

-- BLOG 3: Gypsum Design & Problem-Solving
(
  'blog_gypsum_design_254',
  'modern-gypsum-ceiling-lighting-design-kenyan-homes',
  'Modern Gypsum Ceiling Lighting Design Ideas for Kenyan Homes',
  'Cove LED profiles, recessed downlights, and statement chandeliers for gypsum ceilings — design strategies from Spark Lights 254 with supply, delivery & installation across Nairobi.',
  'Design Guide',
  10,
  '2026-06-08'::timestamp,
  '/3500..jpeg',
  'Modern Gypsum Ceiling Lights Nairobi | Design Ideas Kenya | Spark Lights 254',
  'Modern gypsum ceiling lighting design for Kenyan homes — LED profile strips, downlights & central chandeliers. Spark Lights 254 Nyamakima — prices in KES, same-day Nairobi delivery.',
  'modern gypsum ceiling lights, gypsum board lighting fixtures, gypsum LED profile lights, living room ceiling lighting design Kenya, how to fix gypsum lights, Spark Lights 254',
  $json$[
    {
      "heading": "Why Gypsum Ceilings Need Strategic Lighting",
      "paragraphs": [
        "Gypsum board ceilings have become a prominent architectural standard across modern Kenyan residential properties. A well-crafted ceiling partition loses visual impact without strategic lighting. The right fixtures accentuate clean geometric lines, create depth, and make spaces feel open and inviting.",
        "If you are planning an interior layout for a house or commercial property in Nairobi, these design strategies from Spark Lights 254 use modern gypsum ceiling lights to elevate your space."
      ]
    },
    {
      "heading": "1. Indirect Cove Lighting with LED Profile Strips",
      "paragraphs": [
        "Cove lighting conceals flexible LED strip lights within recessed perimeter steps along the ceiling edge. Light reflects upward off the concrete slab, creating a soft glow that eliminates harsh shadows.",
        "Best for: Lounges, master bedrooms, and home entertainment rooms.",
        "Design tip: Use aluminum LED profile tracks inside gypsum channels. They act as heat sinks to extend strip lifespan while smoothing individual dots into a continuous beam.",
        "Spark Lights 254 stocks gypsum-compatible LED profiles with public KES pricing — order on WhatsApp."
      ]
    },
    {
      "heading": "2. High-Efficiency LED Downlights (Spotlights)",
      "paragraphs": [
        "Recessed downlights provide essential ambient illumination. Installing smaller LED panel modules evenly across the ceiling distributes light uniformly instead of relying on one central bulb.",
        "Best for: Corridors, kitchen work zones, and home study areas.",
        "Design tip: Space 4W or 12W LED gypsum panel lights approximately 3 to 4 feet apart for balanced illumination without over-saturating the room.",
        "Browse corridor and kitchen categories on sparklights.co.ke — prices shown on every listing."
      ]
    },
    {
      "heading": "3. The Central Statement Piece",
      "paragraphs": [
        "Recessed profiles handle background light, but a central focal point anchors the room. A premium multi-bulb gold chandelier or minimalist linear pendant dropped into a gypsum tray design adds visual interest and completes the space.",
        "Best for: Dining room centerpieces and main sitting area clearings.",
        "Design tip: Choose tri-color light modes to shift from crisp daytime utility to warm evening relaxation.",
        "Visit our Nyamakima showroom or view chandeliers online — same-day delivery to Kilimani, Karen, Westlands, and Syokimau."
      ]
    },
    {
      "heading": "See Fixtures Installed Before You Buy",
      "paragraphs": [
        "Planning gypsum lighting works best when you see how chandeliers, pendants, and ceiling panels look when illuminated. Watch showroom walkthroughs and browse our product gallery to compare gold, crystal, and modern LED options side by side.",
        "Spark Lights 254 coordinates daily deliveries across Nairobi, and our installation team handles technical setup from start to finish."
      ]
    },
    {
      "heading": "Get the Perfect Gypsum Lighting Setup — Spark Lights 254",
      "paragraphs": [
        "Spark Lights 254 supplies high-quality LED downlights, flexible hidden profile strips, wall brackets, and premium central chandeliers tailored for gypsum board installations.",
        "Our Supply & Fix team handles wiring, mounting, and final testing. Countrywide freight via Wells Fargo or Easy Coach — quoted on WhatsApp before payment.",
        "Check our latest design options and talk to our team via WhatsApp to plan your gypsum ceiling lighting project today."
      ]
    }
  ]$json$::jsonb,
  $json$[
    {"label": "Gypsum & Kitchen Lights", "path": "/category/kitchen-lights"},
    {"label": "Room-by-Room Light Guide", "path": "/light-guide"},
    {"label": "Book Installation", "path": "/installation"},
    {"label": "Order on WhatsApp", "path": "/contact"}
  ]$json$::jsonb,
  true,
  'staff_owner_spark',
  NOW()
)

ON CONFLICT ("slug") DO UPDATE SET
  "title" = EXCLUDED."title",
  "excerpt" = EXCLUDED."excerpt",
  "category" = EXCLUDED."category",
  "readMinutes" = EXCLUDED."readMinutes",
  "publishedAt" = EXCLUDED."publishedAt",
  "image" = EXCLUDED."image",
  "seoTitle" = EXCLUDED."seoTitle",
  "metaDescription" = EXCLUDED."metaDescription",
  "seoKeywords" = EXCLUDED."seoKeywords",
  "sections" = EXCLUDED."sections",
  "relatedLinks" = EXCLUDED."relatedLinks",
  "isPublished" = EXCLUDED."isPublished",
  "updatedAt" = NOW();

-- Verify
SELECT "slug", "title", "category", "isPublished", "readMinutes"
FROM "BlogPost"
ORDER BY "publishedAt" DESC;
