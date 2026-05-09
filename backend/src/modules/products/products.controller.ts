import { Request, Response, NextFunction } from "express";
import prisma from "../../config/prisma.js";

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
        orderBy: { sortOrder: "asc" },
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
    const { categoryIds, tagIds, variants, ...data } = req.body;

    const product = await prisma.product.create({
      data: {
        ...data,
        categories: {
          create: categoryIds?.map((id: string) => ({ categoryId: id })),
        },
        tags: {
          create: tagIds?.map((id: string) => ({ tagId: id })),
        },
        variants: {
          create: variants,
        },
      },
    });

    res.status(201).json({ success: true, data: product });
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
