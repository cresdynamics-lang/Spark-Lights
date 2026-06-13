export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readMinutes: number;
  publishedAt: string;
  image: string;
  seoTitle: string;
  metaDescription: string;
  seoKeywords: string;
  sections: { heading: string; paragraphs: string[] }[];
  relatedLinks: { label: string; path: string }[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'modern-gypsum-ceiling-lights-nairobi',
    title: 'Modern Gypsum Ceiling Lights: Design Ideas for Nairobi Homes',
    excerpt:
      'How to pick gypsum board lighting fixtures and LED profile lights for living rooms, kitchens, and bedrooms — with real Nairobi price ranges.',
    category: 'Design Guide',
    readMinutes: 6,
    publishedAt: '2026-03-01',
    image: '/3500..jpeg',
    seoTitle: 'Modern Gypsum Ceiling Lights Nairobi | Design Ideas Kenya',
    metaDescription:
      'Modern gypsum ceiling lights for Nairobi homes — LED profile lights, gypsum board fixtures & living room design tips. Prices from KES 2,000 at Spark Lights 254.',
    seoKeywords:
      'modern gypsum ceiling lights, gypsum board lighting fixtures, gypsum LED profile lights, living room ceiling lighting design Kenya',
    sections: [
      {
        heading: 'Why gypsum lighting dominates Nairobi renovations',
        paragraphs: [
          'Nairobi homeowners searching "modern gypsum ceiling lights" want a clean, recessed look that hides wiring and survives humid kitchens. Gypsum board lighting fixtures — especially LED profile strips and slim panels — give you that finished ceiling without bulky surface mounts.',
          'At Spark Lights 254 in Nyamakima, we stock gypsum-compatible panels from KES 2,000 with the price shown on every listing. No "inbox for price" — you see the KES figure before you WhatsApp us.',
        ],
      },
      {
        heading: 'Room-by-room gypsum lighting tips',
        paragraphs: [
          'Living room: combine a central pendant or chandelier with perimeter LED profiles for layered light. Kitchen: bright 12W–18W panels above prep areas. Bedroom: warm 3000K panels for soft ambience. Corridor: cost-effective LED downlights every 2–3 metres.',
          'Not sure which to buy? Use our Light Guide for room-by-room picks, then order with same-day Nairobi delivery via Moto/Bolt courier.',
        ],
      },
    ],
    relatedLinks: [
      { label: 'Kitchen & Gypsum Lights', path: '/category/kitchen-lights' },
      { label: 'Room-by-Room Light Guide', path: '/light-guide' },
      { label: 'Supply & Fix Installation', path: '/installation' },
    ],
  },
  {
    slug: 'chandeliers-nairobi-price-guide',
    title: 'Chandeliers in Nairobi: Public Price Guide (No Hidden Costs)',
    excerpt:
      'What chandeliers actually cost in Nairobi in 2026 — from KES 2,000 budget picks to KES 18,500 statement pieces. Every price on our site is in KES.',
    category: 'Buying Guide',
    readMinutes: 5,
    publishedAt: '2026-02-15',
    image: '/round1.jpg',
    seoTitle: 'Chandeliers in Nairobi Price Guide 2026 | Spark Lights',
    metaDescription:
      'Chandeliers in Nairobi price guide — gold, crystal & modern designs from KES 2,000. Public KES prices, same-day delivery Westlands, Karen, Kilimani. Nyamakima shop.',
    seoKeywords: 'chandeliers in Nairobi price, modern crystal chandelier price Nairobi, chandeliers Westlands, lighting shops Nyamakima',
    sections: [
      {
        heading: 'Kenyan shoppers want prices upfront',
        paragraphs: [
          'The fastest way to lose a sale online in Kenya is hiding your price. Nairobi buyers compare "chandeliers in Nairobi price" listings on Google and leave immediately if they have to DM for a quote.',
          'Spark Lights 254 shows KES on every product card, category page, and checkout. Gold crystal chandeliers start around KES 5,500; budget ceiling alternatives from KES 2,500.',
        ],
      },
      {
        heading: 'Bundle light + delivery + installation',
        paragraphs: [
          'High-intent buyers search "chandelier installation services Nairobi" because they want one bill — fixture, delivery, and fundi. Our Supply & Fix packages start from one WhatsApp quote: light + Moto delivery + professional install.',
          'Visit our Installation page for package tiers or message us with your estate name (Kilimani, Runda, Syokimau, Karen) for a same-day quote.',
        ],
      },
    ],
    relatedLinks: [
      { label: 'Shop Chandeliers with Prices', path: '/category/ceiling-lights' },
      { label: 'Supply & Fix Packages', path: '/installation' },
      { label: 'Order on WhatsApp', path: '/contact' },
    ],
  },
  {
    slug: 'solar-security-lights-nairobi',
    title: 'Solar Security Lights Nairobi: Gate & Outdoor Buying Guide',
    excerpt:
      'IP65 waterproof outdoor lights, solar security fixtures, and automatic gate lights — what Nairobi homeowners should look for before buying.',
    category: 'Outdoor & Solar',
    readMinutes: 5,
    publishedAt: '2026-02-01',
    image: '/7000.jpeg',
    seoTitle: 'Solar Security Lights Nairobi | IP65 Outdoor Wall Lights',
    metaDescription:
      'Solar security lights Nairobi, IP65 waterproof outdoor wall lights & automatic gate lights Kenya. Prices in KES — Spark Lights 254, same-day delivery.',
    seoKeywords:
      'solar security lights Nairobi, outdoor wall lights waterproof, automatic gate lights Kenya, LED power-saving bulbs price',
    sections: [
      {
        heading: 'Power cuts make solar outdoor lights essential',
        paragraphs: [
          'With rising power costs, Nairobi estates in Syokimau, Ruaka, and Karen increasingly search for solar security lights that work when KPLC fails. Look for IP65 waterproof ratings for rain and dust.',
          'Our Outdoor & Solar category lists KES prices publicly — from KES 2,500 for basic gate lights to KES 7,500+ for high-output flood fixtures.',
        ],
      },
      {
        heading: 'Installation matters for outdoor lights',
        paragraphs: [
          'A solar panel angled wrong or a gate light mounted too low wastes your money. Book our Supply & Fix outdoor package: fixture + waterproof install + delivery in one WhatsApp quote.',
        ],
      },
    ],
    relatedLinks: [
      { label: 'Outdoor & Solar Category', path: '/category/outdoor-lights' },
      { label: 'Parking & Security Lights', path: '/category/parking-lights' },
      { label: 'Book Outdoor Installation', path: '/installation' },
    ],
  },
  {
    slug: 'supply-and-fix-why-bundle',
    title: 'Supply & Fix: Why Nairobi Homeowners Bundle Light + Installation',
    excerpt:
      'One price for the fixture, delivery, and fundi — how Supply & Fix removes friction and converts browsers into paying customers.',
    category: 'Conversion',
    readMinutes: 4,
    publishedAt: '2026-01-20',
    image: '/round2.jpg',
    seoTitle: 'Supply & Fix Lighting Nairobi | Light + Delivery + Installation',
    metaDescription:
      'Supply & Fix packages in Nairobi — chandelier, ceiling light, delivery & fundi installation in one quote. Professional installation services Kenya.',
    seoKeywords:
      'chandelier installation services Nairobi, lighting installation services Kenya, fundi for lights Nairobi, supply and fix Nairobi',
    sections: [
      {
        heading: 'Developers and homeowners are busy',
        paragraphs: [
          'Nairobi buyers ready to spend today search "Professional Chandelier Installation in Nairobi" — not because they only want labour, but because they want zero friction: pick a light, confirm one total price, get it delivered and mounted.',
          'Supply & Fix means Spark Lights 254 supplies the fixture, arranges Moto/Bolt same-day delivery within Nairobi, and sends a trusted fundi to install — one WhatsApp conversation.',
        ],
      },
      {
        heading: 'Package tiers (indicative)',
        paragraphs: [
          'Essential Ceiling Package: light from KES 2,500 + delivery from KES 500 + installation from KES 1,500. Chandelier Supply & Fix: fixture from KES 5,500 + delivery + install from KES 2,500. Full gypsum room: custom quote.',
          'Countrywide orders ship via Wells Fargo or Easy Coach — we confirm freight on WhatsApp before you pay.',
        ],
      },
    ],
    relatedLinks: [
      { label: 'View Supply & Fix Packages', path: '/installation' },
      { label: 'See Real Installations', path: '/light-guide#installations' },
      { label: 'Browse All Lights', path: '/shop' },
    ],
  },
];

export function getBlogBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
