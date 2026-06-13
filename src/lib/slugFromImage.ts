/** Match storefront PUBLIC_CATALOG slugs so admin edits apply to the right product. */
export function slugFromImageUrl(url: string): string {
  const filename = decodeURIComponent(url.replace(/^\//, ''));
  const stem = filename
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return stem || `light-${Date.now()}`;
}
