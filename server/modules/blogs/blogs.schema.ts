import { z } from "zod";

const linkSchema = z.object({
  label: z.string().min(1),
  path: z.string().min(1),
});

const sectionSchema = z.object({
  heading: z.string().min(1),
  paragraphs: z.array(z.string().min(1)).min(1),
});

const blogBodySchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3).optional(),
  excerpt: z.string().min(10),
  category: z.string().min(2),
  readMinutes: z.number().int().min(1).max(60).optional(),
  publishedAt: z.string().optional(),
  image: z.string().min(1),
  seoTitle: z.string().min(3),
  metaDescription: z.string().min(10),
  seoKeywords: z.string().min(3),
  sections: z.array(sectionSchema).min(1),
  relatedLinks: z.array(linkSchema).optional(),
  isPublished: z.boolean().optional(),
});

export const createBlogSchema = z.object({
  body: blogBodySchema,
});

export const updateBlogSchema = z.object({
  body: blogBodySchema.partial(),
});

export function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
