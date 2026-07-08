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

/** One gallery tile per price — keep 3500.jpeg, hide 3500.. / 3500... duplicates */
function isPrimaryListingImage(filename: string): boolean {
  const stem = filename.replace(/\.[^.]+$/, "");
  return !/^\d+\.+$/.test(stem);
}

function parsePriceFromFilename(filename: string): number | null {
  const stem = filename.replace(/\.[^.]+$/, "").replace(/\./g, "");
  const match = stem.match(/^(\d{3,5})$/);
  return match ? parseInt(match[1], 10) : null;
}

export const getPublicAssets = async (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: PUBLIC_IMAGE_FILES.filter(isPrimaryListingImage).map((filename) => ({
      filename,
      url: `/${encodeURI(filename)}`,
      suggestedPrice: parsePriceFromFilename(filename),
    })),
  });
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
