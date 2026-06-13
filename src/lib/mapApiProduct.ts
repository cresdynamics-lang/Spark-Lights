import type { StoreProduct } from '../types/product';
import { sanitizePublicImageUrl } from './publicImages';

export function mapApiProduct(p: Record<string, unknown>): StoreProduct | null {
  const variants = p.variants as { priceKes: number; label: string }[] | undefined;
  const images = p.images as { url: string }[] | undefined;
  const categories = p.categories as { category?: { slug: string } }[] | undefined;
  const img = sanitizePublicImageUrl(images?.[0]?.url);

  if (!img) return null;

  const priceKes = variants?.[0]?.priceKes ?? 0;

  return {
    id: p.id as string,
    slug: p.slug as string,
    name: p.name as string,
    price: Number(priceKes).toLocaleString('en-KE'),
    img,
    tag: (p.badgeLabel as string) || 'Lighting',
    categories: categories?.map((c) => c.category?.slug).filter(Boolean) as string[],
    shortDesc: (p.shortDescription as string) || '',
    longDesc: (p.longDescription as string) || '',
    sizes:
      variants?.map((v) => ({
        label: v.label,
        price: Number(v.priceKes).toLocaleString('en-KE'),
      })) ?? [{ label: 'Standard', price: Number(priceKes).toLocaleString('en-KE') }],
    badge: p.badgeLabel as string | undefined,
  };
}
