import { publicImageUrl } from './publicCatalog';

export interface LightCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  seoTitle: string;
  seoH1: string;
  metaDescription: string;
  seoKeywords: string;
  seoIntro: string;
  relatedSlugs: string[];
}

export const LIGHT_CATEGORIES: LightCategory[] = [
  {
    id: 'wall-lights',
    slug: 'wall-lights',
    name: 'Wall Lights',
    description: 'Decorative and functional wall-mounted lighting for every room.',
    image: publicImageUrl('5500.jpeg'),
    seoTitle: 'Wall Brackets & Wall Lights Shop in Nairobi | Spark Lights 254',
    seoH1: 'Wall Brackets & Wall Lights Shop in Nairobi',
    metaDescription:
      'Shop wall brackets and wall lights in Nairobi from KES 2,000. Decorative sconces, outdoor wall lights & bedroom brackets. Same-day delivery from Nyamakima — order on WhatsApp.',
    seoKeywords:
      'wall brackets shop in Nairobi, wall lights Nairobi, outdoor wall lights waterproof, bedroom wall lights Kenya',
    seoIntro:
      'Looking for a wall brackets shop in Nairobi? Spark Lights 254 stocks modern wall lights for bedrooms, corridors, and outdoor walls — with prices shown on every listing and same-day delivery to Westlands, Kilimani, Karen, and across Nairobi CBD.',
    relatedSlugs: ['corridor-lights', 'outdoor-lights', 'bedroom-lights'],
  },
  {
    id: 'ceiling-lights',
    slug: 'ceiling-lights',
    name: 'Ceiling Lights',
    description: 'Chandeliers, flush mounts, and ceiling fixtures that transform any space.',
    image: publicImageUrl('round1.jpg'),
    seoTitle: 'Chandeliers in Nairobi Price | Modern Ceiling Lights Kenya',
    seoH1: 'Modern Chandeliers and Ceiling Lights in Nairobi',
    metaDescription:
      'Chandeliers in Nairobi price from KES 2,000. Gold, crystal & modern ceiling lights with same-day delivery. Visit our Nyamakima showroom or order on WhatsApp — prices on every product.',
    seoKeywords:
      'chandeliers in Nairobi price, modern ceiling lights Nairobi, chandeliers Westlands, gypsum board lighting fixtures, living room ceiling lighting design Kenya',
    seoIntro:
      'Nairobi shoppers search for chandeliers in Nairobi price before they buy — so we put the KES price on every listing. Browse gold chandeliers, crystal designs, LED ceiling panels, and modern gypsum-compatible fixtures. We supply and deliver across Westlands, Kilimani, Karen, Lavington, and Nairobi CBD.',
    relatedSlugs: ['dining-lights', 'kitchen-lights', 'bedroom-lights'],
  },
  {
    id: 'outdoor-lights',
    slug: 'outdoor-lights',
    name: 'Outdoor & Solar Lighting',
    description: 'IP65 waterproof, solar-powered & security lighting for gates, gardens, and exterior walls.',
    image: publicImageUrl('6000.jpeg'),
    seoTitle: 'Outdoor & Solar Lighting Nairobi | IP65 Waterproof Lights',
    seoH1: 'Outdoor & Solar Lighting Nairobi — Waterproof Security Lights',
    metaDescription:
      'Solar security lights Nairobi, outdoor wall lights waterproof (IP65), and automatic gate lights Kenya. Energy-saving LED outdoor lighting from KES 2,000. Same-day Nairobi delivery.',
    seoKeywords:
      'solar security lights Nairobi, outdoor wall lights waterproof, automatic gate lights Kenya, LED power-saving bulbs price, IP65 waterproof lights Nairobi',
    seoIntro:
      'Kenyan buyers want outdoor lighting that survives rain and power cuts. Our Outdoor & Solar Lighting category features IP65 waterproof fixtures, solar security lights for gates and driveways, and power-saving LED options — all with Nairobi same-day delivery and installation available on request.',
    relatedSlugs: ['parking-lights', 'wall-lights'],
  },
  {
    id: 'bedroom-lights',
    slug: 'bedroom-lights',
    name: 'Bedroom Lights',
    description: 'Soft, ambient ceiling and wall lighting designed for restful bedrooms.',
    image: publicImageUrl('roomm3.png'),
    seoTitle: 'Bedroom Ceiling Lights Nairobi | Soft Ambient Lighting',
    seoH1: 'Bedroom Ceiling Lights & Ambient Lighting in Nairobi',
    metaDescription:
      'Bedroom ceiling lights Nairobi — warm LED panels, flush mounts & pendant lights from KES 2,000. Same-day delivery across Nairobi. Spark Lights 254, Nyamakima.',
    seoKeywords:
      'bedroom ceiling lights Nairobi, living room ceiling lighting design Kenya, modern ceiling lights Nairobi',
    seoIntro:
      'Upgrade your bedroom with warm ceiling lights and soft wall brackets — ideal for apartments in Kilimani, Karen, and Westlands. Browse prices online, then order on WhatsApp for same-day Nairobi delivery.',
    relatedSlugs: ['ceiling-lights', 'wall-lights'],
  },
  {
    id: 'dining-lights',
    slug: 'dining-lights',
    name: 'Dining Lights',
    description: 'Statement pendants and chandeliers for dining areas.',
    image: publicImageUrl('3500.jpeg'),
    seoTitle: 'Pendant Lights Kenya | Dining Room Chandeliers Nairobi',
    seoH1: 'Pendant Lights Kenya — Dining Room & Chandelier Lighting Nairobi',
    metaDescription:
      'Pendant lights Kenya & dining room chandeliers in Nairobi. Gold, crystal & modern pendants from KES 2,500. Prices on listing · same-day delivery · installation available.',
    seoKeywords:
      'pendant lights Kenya, chandeliers in Nairobi price, dining room lights Nairobi, modern chandeliers Westlands',
    seoIntro:
      'Pendant lights Kenya searches often lead to dining room upgrades. We stock statement chandeliers and pendant clusters for homes and restaurants — with clear Nairobi prices and professional installation on request.',
    relatedSlugs: ['ceiling-lights', 'events-lights'],
  },
  {
    id: 'kitchen-lights',
    slug: 'kitchen-lights',
    name: 'Kitchen Lights',
    description: 'Bright LED panels and gypsum-compatible fixtures for kitchens.',
    image: publicImageUrl('3500..jpeg'),
    seoTitle: 'Gypsum Board Lighting Fixtures Nairobi | Kitchen LED Lights',
    seoH1: 'Gypsum Board Lighting Fixtures & Kitchen LED Lights Nairobi',
    metaDescription:
      'Modern gypsum ceiling lights & gypsum LED profile lights for kitchens in Nairobi. Bright, practical fixtures from KES 2,000. Nyamakima pickup · same-day delivery.',
    seoKeywords:
      'gypsum board lighting fixtures, gypsum LED profile lights, modern gypsum ceiling lights, kitchen LED lights Nairobi, how to fix gypsum lights',
    seoIntro:
      'Renovating with gypsum board? Our kitchen and gypsum lighting range includes LED profile lights, recessed panels, and bright ceiling fixtures — popular with Nairobi homeowners and fundis. See prices on each product and book installation via WhatsApp.',
    relatedSlugs: ['ceiling-lights', 'corridor-lights'],
  },
  {
    id: 'parking-lights',
    slug: 'parking-lights',
    name: 'Parking & Security Lights',
    description: 'Flood, solar security, and gate lighting for parking and driveways.',
    image: publicImageUrl('7000.jpeg'),
    seoTitle: 'Solar Security Lights Nairobi | Parking & Gate Flood Lights',
    seoH1: 'Solar Security & Parking Flood Lights Nairobi',
    metaDescription:
      'Solar security lights Nairobi, parking flood lights & automatic gate lights Kenya. IP65 waterproof options for homes and commercial sites. Spark Lights 254 — order on WhatsApp.',
    seoKeywords:
      'solar security lights Nairobi, automatic gate lights Kenya, parking flood lights Nairobi, outdoor wall lights waterproof',
    seoIntro:
      'Secure your driveway, parking, and gate with solar security lights and high-output flood fixtures. Energy-saving LED options for homes along Mombasa Road, Syokimau, Ruaka, and across Nairobi.',
    relatedSlugs: ['outdoor-lights', 'wall-lights'],
  },
  {
    id: 'events-lights',
    slug: 'events-lights',
    name: 'Events Lights',
    description: 'Decorative and rental-ready lighting for weddings and events.',
    image: publicImageUrl('Screenshot_20251008_142202_1.jpg'),
    seoTitle: 'Event & Wedding Chandeliers Nairobi | Decorative Lighting',
    seoH1: 'Event & Wedding Lighting Hire in Nairobi',
    metaDescription:
      'Wedding chandeliers, event decorative lights & bulk lighting for venues in Nairobi. Gold and crystal options with delivery and setup. WhatsApp Spark Lights 254 for quotes.',
    seoKeywords:
      'wedding lights Nairobi, event chandeliers Kenya, decorative lighting hire Nairobi',
    seoIntro:
      'Planning a wedding or corporate event? Browse decorative chandeliers and statement ceiling lights — bulk orders and venue lighting packages available for planners across Nairobi.',
    relatedSlugs: ['dining-lights', 'ceiling-lights'],
  },
  {
    id: 'corridor-lights',
    slug: 'corridor-lights',
    name: 'Corridor Lights',
    description: 'Downlights and sconces for hallways and corridors.',
    image: publicImageUrl('2500.jpeg'),
    seoTitle: 'Corridor & Hallway LED Lights Nairobi | Downlights Kenya',
    seoH1: 'Corridor & Hallway LED Downlights in Nairobi',
    metaDescription:
      'Corridor lights & hallway LED downlights in Nairobi from KES 2,000. Cost-effective panels for rentals and apartments. Same-day delivery from Spark Lights 254, Nyamakima.',
    seoKeywords:
      'corridor lights Nairobi, hallway downlights Kenya, LED ceiling lights Nairobi, LED power-saving bulbs price',
    seoIntro:
      'Affordable corridor and hallway lighting for apartments, offices, and rental units — LED downlights and slim panels with clear Nairobi prices. Popular in CBD, Westlands, and Kilimani high-rises.',
    relatedSlugs: ['ceiling-lights', 'kitchen-lights'],
  },
];

export function getCategoryBySlug(slug: string): LightCategory | undefined {
  return LIGHT_CATEGORIES.find((c) => c.slug === slug);
}

export function getCategoryName(slug: string): string {
  return getCategoryBySlug(slug)?.name ?? slug;
}
