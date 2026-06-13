import { Request, Response, NextFunction } from "express";
import prisma from "../../config/prisma.js";
import { AuthRequest } from "../../middleware/auth.js";
import { slugifyTitle } from "./blogs.schema.js";

function routeParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

function mapBlog(post: {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readMinutes: number;
  publishedAt: Date;
  image: string;
  seoTitle: string;
  metaDescription: string;
  seoKeywords: string;
  sections: unknown;
  relatedLinks: unknown;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    category: post.category,
    readMinutes: post.readMinutes,
    publishedAt: post.publishedAt.toISOString(),
    image: post.image,
    seoTitle: post.seoTitle,
    metaDescription: post.metaDescription,
    seoKeywords: post.seoKeywords,
    sections: post.sections,
    relatedLinks: post.relatedLinks,
    isPublished: post.isPublished,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  };
}

export const listPublished = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
    });
    res.json({ success: true, data: posts.map(mapBlog) });
  } catch (error) {
    next(error);
  }
};

export const getBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slug = routeParam(req.params.slug);
    const post = await prisma.blogPost.findFirst({
      where: {
        slug,
        isPublished: true,
      },
    });
    if (!post) {
      return res.status(404).json({ success: false, error: { message: "Blog post not found" } });
    }
    res.json({ success: true, data: mapBlog(post) });
  } catch (error) {
    next(error);
  }
};

export const adminList = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { updatedAt: "desc" },
    });
    res.json({ success: true, data: posts.map(mapBlog) });
  } catch (error) {
    next(error);
  }
};

export const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const slug = req.body.slug || slugifyTitle(req.body.title);
    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (existing) {
      return res.status(409).json({ success: false, error: { message: "Slug already exists" } });
    }

    const post = await prisma.blogPost.create({
      data: {
        slug,
        title: req.body.title,
        excerpt: req.body.excerpt,
        category: req.body.category,
        readMinutes: req.body.readMinutes ?? 5,
        publishedAt: req.body.publishedAt ? new Date(req.body.publishedAt) : new Date(),
        image: req.body.image,
        seoTitle: req.body.seoTitle,
        metaDescription: req.body.metaDescription,
        seoKeywords: req.body.seoKeywords,
        sections: req.body.sections,
        relatedLinks: req.body.relatedLinks ?? [],
        isPublished: req.body.isPublished ?? true,
        authorId: req.user?.id,
      },
    });

    res.status(201).json({ success: true, data: mapBlog(post) });
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = routeParam(req.params.id);
    const data: Record<string, unknown> = { ...req.body };
    if (typeof data.publishedAt === "string") {
      data.publishedAt = new Date(data.publishedAt);
    }
    if (data.slug && typeof data.slug === "string") {
      const clash = await prisma.blogPost.findFirst({
        where: { slug: data.slug, NOT: { id } },
      });
      if (clash) {
        return res.status(409).json({ success: false, error: { message: "Slug already in use" } });
      }
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data,
    });

    res.json({ success: true, data: mapBlog(post) });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = routeParam(req.params.id);
    await prisma.blogPost.delete({ where: { id } });
    res.json({ success: true, data: { id } });
  } catch (error) {
    next(error);
  }
};
