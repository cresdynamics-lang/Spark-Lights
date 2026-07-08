const PUBLIC_IMAGE_FILES = new Set([
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
]);

const DEFAULT_SUPABASE_HOST = "xvllxzcjjleronqneftg.supabase.co";

function supabaseHost(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? "";
  const host = url.replace(/^https?:\/\//, "").replace(/\/$/, "").trim();
  return host || DEFAULT_SUPABASE_HOST;
}

export function isPublicImageUrl(url?: string | null): boolean {
  if (!url || typeof url !== "string") return false;
  if (url.startsWith("http://") || url.startsWith("https://")) return false;
  if (!url.startsWith("/")) return false;
  const filename = decodeURIComponent(url.slice(1));
  return PUBLIC_IMAGE_FILES.has(filename);
}

export function isUploadedProductImageUrl(url?: string | null): boolean {
  if (!url || typeof url !== "string") return false;
  const host = supabaseHost();
  if (url.includes(`${host}/storage/v1/object/public/product-images/`)) return true;
  return url.includes(`${DEFAULT_SUPABASE_HOST}/storage/v1/object/public/product-images/`);
}

export function isAllowedProductImageUrl(url?: string | null): boolean {
  return isPublicImageUrl(url) || isUploadedProductImageUrl(url);
}
