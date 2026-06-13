import { HERO_IMAGES } from './publicCatalog';

export const HERO_SLIDES = [
  {
    title: 'Chandeliers in Nairobi Price — From KES 2,000',
    subtitle: 'Modern ceiling lights Nairobi, gold chandeliers & crystal designs. Price on every listing — order on WhatsApp, delivered today.',
    cta: 'Shop Chandeliers',
    image: HERO_IMAGES[0],
    tagline: 'Sparklights · Nyamakima',
  },
  {
    title: 'Modern Gypsum Ceiling Lights & Pendants',
    subtitle: 'Gypsum board lighting fixtures, pendant lights Kenya & kitchen LED panels — browse by room or category.',
    cta: 'Browse Categories',
    image: HERO_IMAGES[1],
    tagline: 'Nairobi Lighting Experts',
  },
  {
    title: 'Outdoor & Solar Security Lights Nairobi',
    subtitle: 'IP65 waterproof outdoor wall lights, solar security lights & automatic gate lights — same-day Nairobi delivery.',
    cta: 'Outdoor Lighting',
    image: HERO_IMAGES[2],
    tagline: 'Energy-Saving LED',
  },
];

export const WHY_CHOOSE_US = [
  {
    title: 'Nairobi-Wide Delivery',
    desc: 'We deliver across Westlands, Kilimani, Karen, Lavington, Ngong Road, Syokimau, Kitengela, Ruaka & the CBD. Orders before 2 PM qualify for same-day delivery.',
  },
  {
    title: 'Prices That Work',
    desc: 'Our lights start from KES 2,000. Whether you need a practical ceiling light or a statement gold chandelier, we have options for every budget.',
  },
  {
    title: 'Expert Installation',
    desc: 'Our installation team handles wiring, fitting, and finishing across Nairobi. Request a quote on WhatsApp before you commit.',
  },
];

export const DELIVERY_AREAS = [
  'Westlands', 'Kilimani', 'Karen', 'Lavington', 'Kileleshwa', 'CBD',
  'Parklands', 'Upperhill', 'South B', 'Langata', 'Runda', 'Syokimau',
  'Kitengela', 'Ruaka', 'Ngong Road', 'Gigiri',
];

export const TESTIMONIALS = [
  {
    name: 'James K.',
    location: 'Kilimani',
    review: 'Bought a chandelier for our dining room — delivered same day and the installation team did a brilliant job. Highly recommend Sparklights.',
    stars: 5,
  },
  {
    name: 'Grace M.',
    location: 'Karen',
    review: 'Ordered kitchen panel lights via WhatsApp. Fast response, fair price, and they arrived within hours. Best lighting shop in Nairobi.',
    stars: 5,
  },
  {
    name: 'Peter O.',
    location: 'Westlands',
    review: 'We fitted out our new office with ceiling and corridor lights. Great selection at Nyamakima and very professional service throughout.',
    stars: 5,
  },
];

export const LIGHT_GUIDE = [
  {
    room: 'Living Room',
    slug: 'living-room',
    image: '/round2.jpg',
    tips: [
      'Use a statement chandelier or pendant as the focal point for rooms with high ceilings.',
      'Layer ambient ceiling light with wall sconces for evening ambience.',
      'Warm white (2700K–3000K) creates a welcoming feel for family spaces.',
    ],
    picks: ['ceiling-lights', 'wall-lights'],
  },
  {
    room: 'Bedroom',
    slug: 'bedroom',
    image: '/roomm3.png',
    tips: [
      'Soft, diffused ceiling lights reduce glare and help you wind down.',
      'Pair overhead lighting with bedside wall lights for reading.',
      'Dimmable LED fixtures save energy and let you control mood.',
    ],
    picks: ['bedroom-lights', 'wall-lights'],
  },
  {
    room: 'Kitchen',
    slug: 'kitchen',
    image: '/3500.jpeg',
    tips: [
      'Bright, even ceiling panels (4000K) improve visibility for cooking and prep.',
      'Install lights above worktops — shadows make chopping and cleaning harder.',
      'Moisture-resistant fixtures are essential near sinks and stoves.',
    ],
    picks: ['kitchen-lights', 'ceiling-lights'],
  },
  {
    room: 'Dining Area',
    slug: 'dining',
    image: '/round1.jpg',
    tips: [
      'Hang a chandelier 75–90 cm above the table for the best spread of light.',
      'Gold or crystal pendants add elegance for dinner parties and events.',
      'Use a dimmer so the table can shift from bright meals to soft evenings.',
    ],
    picks: ['dining-lights', 'ceiling-lights', 'events-lights'],
  },
  {
    room: 'Outdoor & Parking',
    slug: 'outdoor',
    image: '/6000.jpeg',
    tips: [
      'Choose IP-rated outdoor fixtures for gates, walls, and parking areas.',
      'Motion-sensor lights improve security without leaving lights on all night.',
      'Warm floodlights at entrances make guests feel welcome and safe.',
    ],
    picks: ['outdoor-lights', 'parking-lights'],
  },
  {
    room: 'Corridor & Hallway',
    slug: 'corridor',
    image: '/2500.jpeg',
    tips: [
      'Flush-mount ceiling lights work well in low-ceiling hallways.',
      'Space fixtures evenly — roughly one every 2–3 metres for consistent brightness.',
      'LED panels from KES 2,000 are a cost-effective upgrade for rental units.',
    ],
    picks: ['corridor-lights', 'ceiling-lights'],
  },
];

export const FAQS = [
  {
    category: 'Buying Lights in Nairobi',
    questions: [
      {
        q: 'Where can I buy chandeliers in Nairobi?',
        a: 'Sparklights in Nyamakima stocks gold, crystal, and modern chandeliers starting from KES 2,000. Visit us at Duruma Road or order quickly on WhatsApp at +254 712 827 840.',
      },
      {
        q: 'Where are lighting shops in Nyamakima?',
        a: 'Spark Lights 254 is at Nyamakima, Duruma Road, New Nyamakima Electrical Point Building, Shop 216, 2nd Floor. We are one of the go-to lighting shops in Nyamakima for chandeliers, gypsum lights, and wall brackets — open Mon–Sat 8 AM–6 PM.',
      },
      {
        q: 'Do you deliver chandeliers to Westlands and Karen?',
        a: 'Yes — we supply and deliver modern chandeliers to Westlands, Kilimani, Karen, Lavington, CBD, Syokimau, Ruaka, and across Nairobi. Same-day delivery for orders before 2 PM.',
      },
      {
        q: 'How much do ceiling lights cost in Nairobi?',
        a: 'Ceiling lights at Sparklights range from KES 2,000 to KES 18,500 and above. We offer LED ceiling lights, modern designs, and professional installation. WhatsApp us for current pricing.',
      },
      {
        q: 'Do you sell wall lights and outdoor lights?',
        a: 'Yes — we stock wall lights, outdoor lights, bedroom lights, kitchen lights, parking lights, event lights, and corridor lights. Browse by category on our website or message us on WhatsApp.',
      },
    ],
  },
  {
    category: 'Ordering & Delivery',
    questions: [
      {
        q: 'How do I order lights via WhatsApp?',
        a: 'Click any "Order on WhatsApp" button on our site, or message us at +254 712 827 840. Tell us which product you want, your location in Nairobi, and we will confirm availability, price, and delivery options.',
      },
      {
        q: 'Do you offer same-day delivery in Nairobi?',
        a: 'Yes — same-day delivery is available for orders placed before 2:00 PM, Monday to Saturday. We deliver across Westlands, Kilimani, Karen, Lavington, CBD, Syokimau, Kitengela, Ruaka, and more.',
      },
      {
        q: 'Can I visit your showroom?',
        a: 'Yes. Visit us at Nyamakima, Duruma Road, New Nyamakima Electrical Point Building, Shop 216, 2nd Floor, Nairobi. Open Monday–Saturday 8 AM–6 PM, Sunday 9 AM–2 PM.',
      },
      {
        q: 'Do you sell solar security lights and outdoor waterproof lights?',
        a: 'Yes — our Outdoor & Solar Lighting category includes solar security lights Nairobi, IP65 waterproof outdoor wall lights, and automatic gate lights. Browse prices online or WhatsApp us for recommendations.',
      },
      {
        q: 'Do you offer wholesale lighting for developers?',
        a: 'Yes — we work with property developers, hotels, and contractors as a wholesale electrical lighting supplier in Nairobi. Visit our Wholesale page or WhatsApp for bulk chandelier and gypsum LED quotes.',
      },
    ],
  },
  {
    category: 'Installation & Support',
    questions: [
      {
        q: 'Do you provide chandelier installation services in Nairobi?',
        a: 'Yes — professional chandelier installation in Nairobi, gypsum ceiling lights, wall brackets, and outdoor mounts. Book via our Installation Services page or WhatsApp +254 712 827 840 for a fundi quote before you buy.',
      },
      {
        q: 'Can you help with gypsum lights and living room lighting design?',
        a: 'Our team installs gypsum LED profile lights and advises on living room ceiling lighting design. See the Light Guide for modern gypsum ceiling ideas, then book installation on WhatsApp.',
      },
      {
        q: 'What if my light arrives damaged?',
        a: 'Contact us within 24 hours via WhatsApp or email with photos. We will replace the item or issue a refund — your satisfaction is our priority.',
      },
    ],
  },
];
