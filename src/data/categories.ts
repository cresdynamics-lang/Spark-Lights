import { publicImageUrl } from './publicCatalog';

export interface LightCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  seoTitle: string;
}

export const LIGHT_CATEGORIES: LightCategory[] = [
  {
    id: 'wall-lights',
    slug: 'wall-lights',
    name: 'Wall Lights',
    description: 'Decorative and functional wall-mounted lighting for every room.',
    image: publicImageUrl('5500.jpeg'),
    seoTitle: 'Wall Lights Nairobi | Spark Lights 254',
  },
  {
    id: 'ceiling-lights',
    slug: 'ceiling-lights',
    name: 'Ceiling Lights',
    description: 'Chandeliers, flush mounts, and ceiling fixtures that transform any space.',
    image: publicImageUrl('round1.jpg'),
    seoTitle: 'Ceiling Lights & Chandeliers Nairobi',
  },
  {
    id: 'outdoor-lights',
    slug: 'outdoor-lights',
    name: 'Outdoor Lights',
    description: 'Weather-resistant lighting for gardens, gates, and exterior walls.',
    image: publicImageUrl('6000.jpeg'),
    seoTitle: 'Outdoor Lights Nairobi Kenya',
  },
  {
    id: 'bedroom-lights',
    slug: 'bedroom-lights',
    name: 'Bedroom Lights',
    description: 'Soft, ambient lighting designed for restful bedrooms.',
    image: publicImageUrl('roomm3.png'),
    seoTitle: 'Bedroom Ceiling Lights Nairobi',
  },
  {
    id: 'dining-lights',
    slug: 'dining-lights',
    name: 'Dining Lights',
    description: 'Statement pendants and chandeliers for dining areas.',
    image: publicImageUrl('3500.jpeg'),
    seoTitle: 'Dining Room Lights & Pendants Nairobi',
  },
  {
    id: 'kitchen-lights',
    slug: 'kitchen-lights',
    name: 'Kitchen Lights',
    description: 'Bright, practical lighting for kitchens and prep areas.',
    image: publicImageUrl('3500..jpeg'),
    seoTitle: 'Kitchen LED Lights Nairobi',
  },
  {
    id: 'parking-lights',
    slug: 'parking-lights',
    name: 'Parking Lights',
    description: 'Flood and security lighting for parking and driveways.',
    image: publicImageUrl('7000.jpeg'),
    seoTitle: 'Parking & Flood Lights Nairobi',
  },
  {
    id: 'events-lights',
    slug: 'events-lights',
    name: 'Events Lights',
    description: 'Decorative and rental-ready lighting for weddings and events.',
    image: publicImageUrl('Screenshot_20251008_142202_1.jpg'),
    seoTitle: 'Event & Wedding Lights Nairobi',
  },
  {
    id: 'corridor-lights',
    slug: 'corridor-lights',
    name: 'Corridor Lights',
    description: 'Downlights and sconces for hallways and corridors.',
    image: publicImageUrl('2500.jpeg'),
    seoTitle: 'Corridor & Hallway Lights Nairobi',
  },
];

export function getCategoryBySlug(slug: string): LightCategory | undefined {
  return LIGHT_CATEGORIES.find((c) => c.slug === slug);
}

export function getCategoryName(slug: string): string {
  return getCategoryBySlug(slug)?.name ?? slug;
}
