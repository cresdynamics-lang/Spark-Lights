/** Allowed product image sources: /public assets or Supabase Storage uploads. */

import { PUBLIC_IMAGE_FILES, publicImageUrl } from '../data/publicCatalog';

const PUBLIC_URLS = new Set(PUBLIC_IMAGE_FILES.map((f) => publicImageUrl(f)));

const SUPABASE_PROJECT_HOST =
  import.meta.env.VITE_SUPABASE_URL?.replace(/^https?:\/\//, '').replace(/\/$/, '') ??
  'xvllxzcjjleronqneftg.supabase.co';

export function isPublicImageUrl(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return false;
  if (url.startsWith('http://') || url.startsWith('https://')) return false;
  if (!url.startsWith('/')) return false;
  return PUBLIC_URLS.has(url) || PUBLIC_URLS.has(decodeURI(url));
}

export function isUploadedProductImageUrl(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return false;
  return url.includes(`${SUPABASE_PROJECT_HOST}/storage/v1/object/public/product-images/`);
}

export function isAllowedProductImageUrl(url?: string | null): boolean {
  return isPublicImageUrl(url) || isUploadedProductImageUrl(url);
}

export function sanitizeProductImageUrl(url?: string | null): string | null {
  if (!isAllowedProductImageUrl(url)) return null;
  return url!;
}

/** @deprecated Use sanitizeProductImageUrl */
export function sanitizePublicImageUrl(url?: string | null): string | null {
  return sanitizeProductImageUrl(url);
}

export function filenameFromPublicUrl(url: string): string | null {
  if (!isPublicImageUrl(url)) return null;
  return decodeURIComponent(url.replace(/^\//, ''));
}
