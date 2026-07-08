import { z } from "zod";

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    /** Optional — server generates a unique slug from the name when omitted or colliding. */
    slug: z.string().optional(),
    shortDescription: z.string(),
    longDescription: z.string(),
    careInstructions: z.string().optional(),
    badgeLabel: z.string().optional(),
    isFeatured: z.boolean().optional(),
    categoryIds: z.array(z.string()).optional(),
    tagIds: z.array(z.string()).optional(),
    imageUrl: z.string().optional(),
    variants: z.array(z.object({
      label: z.string(),
      priceKes: z.number(),
      stockQty: z.number(),
      stemsUsed: z.number().optional(),
    })).optional(),
  }),
});

export const updateProductSchema = z.object({
  body: createProductSchema.shape.body.partial(),
});

export const uploadImageSchema = z.object({
  body: z.object({
    imageData: z.string().min(100),
    filename: z.string().optional(),
    folder: z.enum(["products", "blogs"]).optional(),
  }),
});
