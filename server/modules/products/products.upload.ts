import type { Request, Response, NextFunction } from "express";

const BUCKET = "product-images";

function supabaseBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  if (!url) throw new Error("SUPABASE_URL is not configured");
  return url.replace(/\/$/, "");
}

function serviceRoleKey(): string {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured");
  return key;
}

export async function uploadToSupabaseStorage(
  buffer: Buffer,
  filename: string,
  contentType = "image/jpeg"
): Promise<string> {
  const base = supabaseBaseUrl();
  const path = `products/${Date.now()}-${filename.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
  const endpoint = `${base}/storage/v1/object/${BUCKET}/${path}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${serviceRoleKey()}`,
      "Content-Type": contentType,
      "x-upsert": "true",
    },
    body: new Uint8Array(buffer),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Supabase upload failed (${response.status}): ${detail.slice(0, 200)}`);
  }

  return `${base}/storage/v1/object/public/${BUCKET}/${path}`;
}

export const uploadProductImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { imageData, filename = "product.jpg" } = req.body as {
      imageData?: string;
      filename?: string;
    };

    if (!imageData || typeof imageData !== "string") {
      return res.status(400).json({
        success: false,
        error: { message: "imageData (base64) is required" },
      });
    }

    const base64 = imageData.includes(",") ? imageData.split(",")[1] : imageData;
    const buffer = Buffer.from(base64, "base64");

    if (buffer.length === 0) {
      return res.status(400).json({ success: false, error: { message: "Invalid image data" } });
    }

    if (buffer.length > 5_000_000) {
      return res.status(400).json({
        success: false,
        error: { message: "Image too large after compression (max ~5MB)" },
      });
    }

    const url = await uploadToSupabaseStorage(buffer, filename);

    res.status(201).json({ success: true, data: { url } });
  } catch (error) {
    next(error);
  }
};
