import { Request, Response, NextFunction } from "express";
import prisma from "../../config/prisma.js";
import { isAllowedProductImageUrl } from "../../lib/productImages.js";

function slugifyProduct(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

/** Ensure Product.slug stays unique — append -2, -3… or a short timestamp if needed. */
async function ensureUniqueProductSlug(raw: string, excludeId?: string): Promise<string> {
  const base = slugifyProduct(raw) || `light-${Date.now().toString(36)}`;
  let candidate = base;
  let n = 2;

  while (true) {
    const existing = await prisma.product.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    if (!existing || (excludeId && existing.id === excludeId)) {
      return candidate;
    }
    candidate = `${base}-${n}`;
    n += 1;
    if (n > 50) {
      return `${base}-${Date.now().toString(36)}`;
    }
  }
}

/** Admin catalog — all products including inactive, no storefront filters */
export const getAdminProducts = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        images: true,
        variants: true,
        categories: { include: { category: true } },
      },
      orderBy: { updatedAt: "desc" },
      take: 200,
    });

    res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 20, category, search, featured } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = { isActive: true };
    if (category) where.categories = { some: { category: { slug: category } } };
    if (featured === "true") where.isFeatured = true;
    if (search) where.OR = [
      { name: { contains: String(search), mode: "insensitive" } },
      { shortDescription: { contains: String(search), mode: "insensitive" } },
    ];

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          images: true,
          variants: true,
          categories: { include: { category: true } },
        },
        skip,
        take: Number(limit),
        orderBy: [{ updatedAt: "desc" }, { sortOrder: "asc" }],
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      success: true,
      data: products,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getProductBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { slug: id as string },
      include: {
        images: true,
        variants: true,
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: { code: "PRODUCT_NOT_FOUND", message: "Product not found" },
      });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { categoryIds, tagIds, variants, imageUrl, images, slug, name, ...data } = req.body;

    const rawImages =
      images?.map((img: { url: string; isPrimary?: boolean }, i: number) => ({
        url: img.url,
        isPrimary: img.isPrimary ?? i === 0,
      })) ??
      (imageUrl ? [{ url: imageUrl, isPrimary: true }] : []);

    const imageCreates = rawImages.filter((img: { url: string }) => isAllowedProductImageUrl(img.url));

    if (rawImages.length > 0 && imageCreates.length === 0) {
      return res.status(400).json({
        success: false,
        error: { code: "INVALID_IMAGE", message: "Image must be from /public or an uploaded Supabase product image" },
      });
    }

    const uniqueSlug = await ensureUniqueProductSlug(slug || name || `light-${Date.now()}`);

    const product = await prisma.product.create({
      data: {
        ...data,
        name,
        slug: uniqueSlug,
        categories: {
          create: categoryIds?.map((id: string) => ({ categoryId: id })),
        },
        tags: {
          create: tagIds?.map((id: string) => ({ tagId: id })),
        },
        variants: {
          create: variants,
        },
        ...(imageCreates.length > 0 && {
          images: { create: imageCreates },
        }),
      },
      include: {
        images: true,
        variants: true,
        categories: { include: { category: true } },
      },
    });

    res.status(201).json({ success: true, data: product });
  } catch (error: any) {
    if (error?.code === "P2002") {
      return res.status(409).json({
        success: false,
        error: {
          code: "DUPLICATE_SLUG",
          message: "A product with this name/slug already exists. Rename it slightly and try again.",
        },
      });
    }
    next(error);
  }
};

const PUBLIC_IMAGE_FILES = [
  "2500.jpeg", "2500..jpeg", "2999.jpeg", "3000.jpeg", "3000..jpeg",
  "3500.jpeg", "3500..jpeg", "3500...jpeg", "3999.jpeg",
  "5500.jpeg", "5500..jpeg", "5500...jpeg",
  "6000.jpeg", "6000..jpeg", "6500.jpeg", "6500..jpeg",
  "7000.jpeg", "7000..jpeg", "7500.jpeg",
  "round1.jpg", "round2.jpg", "round3.jpg", "roomm3.png",
  "Screenshot_20251008_134500_1.jpg", "Screenshot_20251008_134652_1.jpg",
  "Screenshot_20251008_134753_1.jpg", "Screenshot_20251008_134810_1.jpg",
  "Screenshot_20251008_134900_1.jpg", "Screenshot_20251008_135721_1.jpg",
  "Screenshot_20251008_135838_2.jpg", "Screenshot_20251008_135854_1.jpg",
  "Screenshot_20251008_142202_1.jpg", "Screenshot_20251008_142223_1.jpg",
  "Screenshot_20251008_142229_1.jpg", "Screenshot_2025_1008_135432.png",
];

/** One listing image per price stem — keep 3500.jpeg, skip 3500.. / 3500... */
function isPrimaryListingImage(filename: string): boolean {
  const stem = filename.replace(/\.[^.]+$/, "");
  return !/^\d+\.+$/.test(stem);
}

function parsePriceFromFilename(filename: string): number | null {
  const stem = filename.replace(/\.[^.]+$/, "").replace(/\./g, "");
  const match = stem.match(/^(\d{3,5})$/);
  return match ? parseInt(match[1], 10) : null;
}

/** Custom showroom prices when the filename is not a KES amount (editable later in admin). */
const CUSTOM_SHOWROOM_PRICES: Record<string, number> = {
  "round1.jpg": 12500,
  "round2.jpg": 9800,
  "round3.jpg": 14500,
  "roomm3.png": 4200,
  "Screenshot_20251008_134500_1.jpg": 8900,
  "Screenshot_20251008_134652_1.jpg": 7600,
  "Screenshot_20251008_134753_1.jpg": 11200,
  "Screenshot_20251008_134810_1.jpg": 6800,
  "Screenshot_20251008_134900_1.jpg": 9400,
  "Screenshot_20251008_135721_1.jpg": 15800,
  "Screenshot_20251008_135838_2.jpg": 7200,
  "Screenshot_20251008_135854_1.jpg": 10500,
  "Screenshot_20251008_142202_1.jpg": 13200,
  "Screenshot_20251008_142223_1.jpg": 8100,
  "Screenshot_20251008_142229_1.jpg": 11900,
  "Screenshot_2025_1008_135432.png": 5600,
};

function resolveListingPrice(filename: string): number | null {
  return parsePriceFromFilename(filename) ?? CUSTOM_SHOWROOM_PRICES[filename] ?? null;
}

function categoryIdsForFilename(filename: string, bySlug: Map<string, string>): string[] {
  const pick = (...slugs: string[]) =>
    slugs.map((s) => bySlug.get(s)).filter((id): id is string => Boolean(id));

  if (filename === "roomm3.png") return pick("bedroom-lights", "ceiling-lights");
  if (filename.startsWith("round") || filename.startsWith("Screenshot")) {
    return pick("ceiling-lights", "dining-lights", "events-lights");
  }
  const price = parsePriceFromFilename(filename);
  if (price && price <= 3000) return pick("corridor-lights", "ceiling-lights", "wall-lights");
  if (price && price <= 4000) return pick("kitchen-lights", "ceiling-lights", "dining-lights");
  if (price && price >= 7000) return pick("ceiling-lights", "dining-lights", "parking-lights");
  if (price && price >= 5500) return pick("ceiling-lights", "dining-lights", "outdoor-lights");
  return pick("ceiling-lights");
}

function productNameForFilename(filename: string, price: number | null): string {
  if (filename === "roomm3.png") return "Bedroom Ceiling Light Set";
  if (filename.startsWith("round")) return "Modern Crystal Chandelier";
  if (filename.startsWith("Screenshot") || filename.startsWith("Screenshot_")) {
    return "Showroom Crystal Chandelier";
  }
  if (price != null) return `Modern Ceiling Light`;
  return "Modern Lighting Fixture";
}

export const getPublicAssets = async (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: PUBLIC_IMAGE_FILES.filter(isPrimaryListingImage).map((filename) => ({
      filename,
      url: `/${encodeURI(filename)}`,
      suggestedPrice: resolveListingPrice(filename),
    })),
  });
};

/**
 * Promote every unique /public showroom image into a Product row when missing.
 * Price = amount from filename (3500.jpeg → 3500) or a custom showroom map (editable after).
 */
export const syncPublicImagesAsProducts = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const cats = await prisma.category.findMany({ select: { id: true, slug: true } });
    const bySlug = new Map(cats.map((c) => [c.slug, c.id]));
    const fallbackCat = cats[0]?.id;

    const existing = await prisma.product.findMany({
      select: {
        id: true,
        slug: true,
        images: { select: { url: true }, take: 3 },
      },
    });
    const usedUrls = new Set(existing.flatMap((p) => p.images.map((i) => decodeURIComponent(i.url))));
    const usedSlugs = new Set(existing.map((p) => p.slug));

    const created: { id: string; slug: string; priceKes: number; image: string }[] = [];
    const skipped: string[] = [];

    for (const filename of PUBLIC_IMAGE_FILES.filter(isPrimaryListingImage)) {
      const imageUrl = `/${encodeURI(filename)}`;
      if (usedUrls.has(imageUrl) || usedUrls.has(`/${filename}`)) {
        skipped.push(filename);
        continue;
      }

      const priceKes = resolveListingPrice(filename);
      if (priceKes == null || priceKes <= 0) {
        skipped.push(filename);
        continue;
      }

      let slug = slugifyProduct(filename.replace(/\.[^.]+$/, "")) || `light-${Date.now().toString(36)}`;
      if (usedSlugs.has(slug)) {
        slug = await ensureUniqueProductSlug(slug);
      }

      const categoryIds = categoryIdsForFilename(filename, bySlug);
      const ids = categoryIds.length ? categoryIds : fallbackCat ? [fallbackCat] : [];
      const name = productNameForFilename(filename, parsePriceFromFilename(filename));

      const product = await prisma.product.create({
        data: {
          name,
          slug,
          shortDescription: `${name} available at Spark Lights 254, Nyamakima. Price editable in admin.`,
          longDescription: `${name} — showroom fixture from Spark Lights 254. Same-day Nairobi delivery. Price can be edited anytime in Products.`,
          isActive: true,
          isFeatured: false,
          categories: { create: ids.map((categoryId) => ({ categoryId })) },
          images: { create: [{ url: imageUrl, isPrimary: true, sortOrder: 0 }] },
          variants: {
            create: [{ label: "Default", priceKes, stockQty: 12, stemsUsed: 1 }],
          },
        },
      });

      usedUrls.add(imageUrl);
      usedSlugs.add(slug);
      created.push({ id: product.id, slug, priceKes, image: imageUrl });
    }

    res.json({
      success: true,
      data: { created: created.length, skipped: skipped.length, products: created },
    });
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      }
    });
    res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await prisma.category.create({
      data: req.body
    });
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { categoryIds, tagIds, variants, imageUrl, ...data } = req.body;

    const existing = await prisma.product.findUnique({ where: { id: id as string } });
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: { code: "PRODUCT_NOT_FOUND", message: "Product not found" },
      });
    }

    if (categoryIds !== undefined) {
      await prisma.productCategory.deleteMany({ where: { productId: id as string } });
    }

    if (tagIds !== undefined) {
      await prisma.productTag.deleteMany({ where: { productId: id as string } });
    }

    if (imageUrl !== undefined) {
      if (imageUrl && !isAllowedProductImageUrl(imageUrl)) {
        return res.status(400).json({
          success: false,
          error: { code: "INVALID_IMAGE", message: "Image must be from /public or an uploaded Supabase product image" },
        });
      }
      await prisma.productImage.deleteMany({ where: { productId: id as string } });
    }

    const product = await prisma.product.update({
      where: { id: id as string },
      data: {
        ...data,
        ...(categoryIds !== undefined && {
          categories: {
            create: categoryIds.map((categoryId: string) => ({ categoryId })),
          },
        }),
        ...(tagIds !== undefined && {
          tags: {
            create: tagIds.map((tagId: string) => ({ tagId })),
          },
        }),
        ...(variants !== undefined && {
          variants: {
            deleteMany: {},
            create: variants,
          },
        }),
        ...(imageUrl !== undefined && {
          images: {
            create: [{ url: imageUrl, isPrimary: true }],
          },
        }),
      },
      include: {
        images: true,
        variants: true,
        categories: { include: { category: true } },
      },
    });

    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};
