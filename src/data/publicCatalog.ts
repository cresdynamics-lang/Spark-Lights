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

function seoProductName(filename: string, price: number | null, categories: string[]): string {
  if (filename.startsWith('round') || filename.startsWith('Screenshot')) {
    return 'Modern Crystal Chandelier';
  }
  if (filename === 'roomm3.png') {
    return 'Bedroom Ceiling Light Set';
  }
  if (categories.includes('kitchen-lights')) {
    const watts = price && price <= 3000 ? '12W' : price && price <= 4500 ? '18W' : '24W';
    return `${watts} LED Gypsum Ceiling Panel Lights Kenya`;
  }
  if (categories.includes('outdoor-lights') || categories.includes('parking-lights')) {
    return 'Solar Security Outdoor Wall Light Nairobi';
  }
  if (categories.includes('corridor-lights') && price && price <= 3000) {
    return 'LED Corridor Ceiling Panel Light Nairobi';
  }
  if (categories.includes('dining-lights') && price && price >= 5500) {
    return 'Modern Pendant Chandelier Light Nairobi';
  }
  if (price) {
    return 'Modern Ceiling Light Price in Nairobi';
  }
  return 'Modern Lighting Fixture Nairobi';
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

function seoShortDesc(name: string, price: number | null, categories: string[]): string {
  const priceText = price ? `KES ${price.toLocaleString('en-KE')}` : 'competitive Nairobi price';
  if (categories.includes('outdoor-lights') || categories.includes('parking-lights')) {
    return `${name} — ${priceText}. IP65 waterproof / solar security lighting for Nairobi gates & driveways.`;
  }
  if (categories.includes('kitchen-lights')) {
    return `${name} — ${priceText}. Gypsum board lighting fixture for Nairobi kitchens & ceilings.`;
  }
  if (categories.includes('dining-lights')) {
    return `${name} — ${priceText}. Pendant light / chandelier for dining rooms in Nairobi.`;
  }
  return `${name} — ${priceText}. Modern ceiling light for homes & offices in Nairobi.`;
}

function buildCatalogEntry(filename: string, index: number): StoreProduct {
  const price = parsePriceFromFilename(filename);
  const priceStr = price ? price.toLocaleString('en-KE') : '5,000';
  const slug = slugFromFilename(filename, index);
  const categories = defaultCategories(filename);
  const name = seoProductName(filename, price, categories);

  return {
    id: `public-${slug}`,
    slug,
    name,
    price: priceStr,
    img: publicImageUrl(filename),
    imageFile: filename,
    tag: price && price >= 7000 ? 'Premium' : price && price <= 3000 ? 'Budget' : 'Popular',
    categories,
    shortDesc: seoShortDesc(name, price, categories),
    longDesc: `${name} available at Spark Lights 254, Nyamakima — chandeliers in Nairobi price listings with same-day delivery to Westlands, Kilimani, Karen & CBD. Professional installation available on WhatsApp.`,
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
