import type { StoreProduct } from '../types/product';

export const LOGO_IMAGE = '/round1.jpg';

/** All product image filenames in /public — prices parsed from names like 3500.jpeg */
export const PUBLIC_IMAGE_FILES = [
  '2500.jpeg', '2500..jpeg', '2999.jpeg', '3000.jpeg', '3000..jpeg',
  '3500.jpeg', '3500..jpeg', '3500...jpeg', '3999.jpeg',
  '5500.jpeg', '5500..jpeg', '5500...jpeg',
  '6000.jpeg', '6000..jpeg', '6500.jpeg', '6500..jpeg',
  '7000.jpeg', '7000..jpeg', '7500.jpeg',
  'round1.jpg', 'round2.jpg', 'round3.jpg', 'roomm3.png',
  'Screenshot_20251008_134500_1.jpg', 'Screenshot_20251008_134652_1.jpg',
  'Screenshot_20251008_134753_1.jpg', 'Screenshot_20251008_134810_1.jpg',
  'Screenshot_20251008_134900_1.jpg', 'Screenshot_20251008_135721_1.jpg',
  'Screenshot_20251008_135838_2.jpg', 'Screenshot_20251008_135854_1.jpg',
  'Screenshot_20251008_142202_1.jpg', 'Screenshot_20251008_142223_1.jpg',
  'Screenshot_20251008_142229_1.jpg', 'Screenshot_2025_1008_135432.png',
] as const;

export function publicImageUrl(filename: string): string {
  return `/${encodeURI(filename)}`;
}

export function parsePriceFromFilename(filename: string): number | null {
  const stem = filename.replace(/\.[^.]+$/, '').replace(/\./g, '');
  const match = stem.match(/^(\d{3,5})$/);
  return match ? parseInt(match[1], 10) : null;
}

function slugFromFilename(filename: string, index: number): string {
  const stem = filename.replace(/\.[^.]+$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return stem || `light-${index}`;
}

function defaultName(filename: string, price: number | null): string {
  if (filename.startsWith('round')) return `Gold Crystal Chandelier ${filename.replace('.jpg', '').toUpperCase()}`;
  if (filename === 'roomm3.png') return 'Bedroom Ceiling Light Set';
  if (filename.startsWith('Screenshot')) return 'Designer Chandelier';
  if (price) return `Modern Ceiling Light`;
  return 'Lighting Fixture';
}

function defaultCategories(filename: string): string[] {
  if (filename === 'roomm3.png') return ['bedroom-lights', 'ceiling-lights'];
  if (filename.startsWith('round') || filename.startsWith('Screenshot')) {
    return ['ceiling-lights', 'dining-lights', 'events-lights'];
  }
  const price = parsePriceFromFilename(filename);
  if (price && price <= 3000) return ['corridor-lights', 'ceiling-lights'];
  if (price && price <= 4000) return ['kitchen-lights', 'ceiling-lights', 'dining-lights'];
  if (price && price >= 5500) return ['ceiling-lights', 'dining-lights', 'events-lights'];
  return ['ceiling-lights'];
}

function buildCatalogEntry(filename: string, index: number): StoreProduct {
  const price = parsePriceFromFilename(filename);
  const priceStr = price ? price.toLocaleString('en-KE') : '5,000';
  const slug = slugFromFilename(filename, index);
  const name = defaultName(filename, price);

  return {
    id: `public-${slug}`,
    slug,
    name,
    price: priceStr,
    img: publicImageUrl(filename),
    imageFile: filename,
    tag: price && price >= 7000 ? 'Premium' : price && price <= 3000 ? 'Budget' : 'Popular',
    categories: defaultCategories(filename),
    shortDesc: `${name} — premium lighting for homes and offices in Nairobi.`,
    longDesc: `${name} available at Spark Lights 254, Nyamakima. Same-day delivery across Nairobi. Professional installation available on request.`,
    sizes: [{ label: 'Standard', price: priceStr }],
    badge: index < 3 ? 'Featured' : undefined,
  };
}

export const PUBLIC_CATALOG: StoreProduct[] = PUBLIC_IMAGE_FILES.map(buildCatalogEntry);

export const HERO_IMAGES = [
  publicImageUrl('round1.jpg'),
  publicImageUrl('round2.jpg'),
  publicImageUrl('roomm3.png'),
];
