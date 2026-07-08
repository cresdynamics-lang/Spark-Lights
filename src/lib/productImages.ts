/** Allowed product image sources: /public assets or Supabase Storage uploads. */

import { PUBLIC_IMAGE_FILES, publicImageUrl } from '../data/publicCatalog';

const PUBLIC_URLS = new Set(PUBLIC_IMAGE_FILES.map((f) => publicImageUrl(f)));

/** Always resolve a usable host — empty VITE_SUPABASE_URL must not wipe the allowlist. */
const DEFAULT_SUPABASE_HOST = 'xvllxzcjjleronqneftg.supabase.co';

function supabaseProjectHost(): string {
  const fromEnv = (import.meta.env.VITE_SUPABASE_URL as string | undefined)
    ?.replace(/^https?:\/\//, '')
    .replace(/\/$/, '')
    .trim();
  return fromEnv || DEFAULT_SUPABASE_HOST;
}

export function isPublicImageUrl(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return false;
  if (url.startsWith('http://') || url.startsWith('https://')) return false;
  if (!url.startsWith('/')) return false;
  return PUBLIC_URLS.has(url) || PUBLIC_URLS.has(decodeURI(url));
}

export function isUploadedProductImageUrl(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return false;
  // Accept any public product-images object URL for this project (env or default host).
  if (url.includes(`${supabaseProjectHost()}/storage/v1/object/public/product-images/`)) {
    return true;
  }
  return url.includes(`${DEFAULT_SUPABASE_HOST}/storage/v1/object/public/product-images/`);
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
