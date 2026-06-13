import { PUBLIC_IMAGE_FILES, publicImageUrl } from '../data/publicCatalog';

const PUBLIC_URLS = new Set(PUBLIC_IMAGE_FILES.map((f) => publicImageUrl(f)));

/** Only allow images that exist in /public — rejects http(s), unsplash, assets, etc. */
export function isPublicImageUrl(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return false;
  if (url.startsWith('http://') || url.startsWith('https://')) return false;
  if (!url.startsWith('/')) return false;
  return PUBLIC_URLS.has(url) || PUBLIC_URLS.has(decodeURI(url));
}

export function sanitizePublicImageUrl(url?: string | null): string | null {
  if (!isPublicImageUrl(url)) return null;
  return url!.startsWith('/') ? url! : null;
}

export function filenameFromPublicUrl(url: string): string | null {
  if (!isPublicImageUrl(url)) return null;
  return decodeURIComponent(url.replace(/^\//, ''));
}
