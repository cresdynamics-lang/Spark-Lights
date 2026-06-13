export interface InstallationProof {
  id: string;
  estate: string;
  area: string;
  title: string;
  description: string;
  image: string;
  productType: string;
}

/** Real-style installation showcases using showroom & product photos */
export const INSTALLATION_PROOFS: InstallationProof[] = [
  {
    id: 'kilimani-chandelier',
    estate: 'Kilimani Apartment',
    area: 'Kilimani',
    title: 'Gold Crystal Chandelier — Living Room',
    description: 'Supply & Fix install: chandelier supplied, delivered same-day, mounted by our Nairobi fundi team.',
    image: '/round1.jpg',
    productType: 'Chandelier',
  },
  {
    id: 'runda-dining',
    estate: 'Runda Home',
    area: 'Runda',
    title: 'Designer Chandelier — Dining Area',
    description: 'Statement pendant cluster installed over dining table — client ordered via WhatsApp with public KES price.',
    image: '/Screenshot_20251008_142202_1.jpg',
    productType: 'Dining Light',
  },
  {
    id: 'syokimau-bedroom',
    estate: 'Syokimau Flat',
    area: 'Syokimau',
    title: 'Bedroom Ceiling Light Set',
    description: 'Warm LED ceiling panels for master bedroom — delivered via Bolt, installed same afternoon.',
    image: '/roomm3.png',
    productType: 'Bedroom',
  },
  {
    id: 'karen-living',
    estate: 'Karen Residence',
    area: 'Karen',
    title: 'Modern Crystal Chandelier — Lounge',
    description: 'Premium chandelier glowing in client living room — full Supply & Fix package from Spark Lights 254.',
    image: '/round2.jpg',
    productType: 'Chandelier',
  },
  {
    id: 'westlands-office',
    estate: 'Westlands Office',
    area: 'Westlands',
    title: 'LED Gypsum Ceiling Panels — Office',
    description: 'Gypsum board LED profile lights for commercial fit-out — bulk supply with installation quote.',
    image: '/3500.jpeg',
    productType: 'Gypsum LED',
  },
  {
    id: 'syokimau-outdoor',
    estate: 'Syokimau Gate',
    area: 'Syokimau',
    title: 'Solar Security Light — Driveway',
    description: 'IP65 waterproof outdoor gate light — solar security fixture with professional mounting.',
    image: '/7000.jpeg',
    productType: 'Outdoor Solar',
  },
];

export const DELIVERY_RATES = {
  nairobiSameDay: {
    label: 'Same-Day Nairobi',
    fee: 'From KES 500',
    detail: 'Orders before 2:00 PM · delivered by 6:00 PM via Moto/Bolt courier',
    freeOver: 'Free delivery on orders over KES 3,000',
  },
  nairobiScheduled: {
    label: 'Scheduled Nairobi',
    fee: 'From KES 500',
    detail: 'Pick morning or afternoon window · WhatsApp confirms address before dispatch',
  },
  countrywide: {
    label: 'Countrywide Kenya',
    fee: 'From KES 800',
    detail: 'Via Wells Fargo, Easy Coach, or agreed courier — quote on WhatsApp before payment',
  },
  pickup: {
    label: 'Nyamakima Pickup',
    fee: 'Free',
    detail: 'Duruma Road, Shop 216, 2nd Floor — Mon–Sat 8 AM–6 PM',
  },
};

export const SUPPLY_FIX_PACKAGES = [
  {
    id: 'essential',
    name: 'Essential Ceiling Package',
    tagline: 'Budget ceiling light + delivery + install',
    lightFrom: 2500,
    deliveryFrom: 500,
    installFrom: 1500,
    totalFrom: 4500,
    includes: ['Ceiling light from KES 2,500', 'Nairobi delivery (Moto/Bolt)', 'Basic ceiling mount install'],
    popular: false,
  },
  {
    id: 'chandelier',
    name: 'Chandelier Supply & Fix',
    tagline: 'Statement chandelier — one quote, zero friction',
    lightFrom: 5500,
    deliveryFrom: 500,
    installFrom: 2500,
    totalFrom: 8500,
    includes: ['Gold/crystal chandelier from KES 5,500', 'Same-day Nairobi delivery', 'Professional chandelier mount + wiring check'],
    popular: true,
  },
  {
    id: 'gypsum',
    name: 'Gypsum Room Package',
    tagline: 'Full room gypsum LED profiles + install',
    lightFrom: 8000,
    deliveryFrom: 500,
    installFrom: 4000,
    totalFrom: 12500,
    includes: ['Multiple LED panels / profiles', 'Living room or kitchen layout advice', 'Full room installation by fundi team'],
    popular: false,
  },
  {
    id: 'outdoor',
    name: 'Outdoor & Gate Package',
    tagline: 'Solar security light + waterproof install',
    lightFrom: 3500,
    deliveryFrom: 500,
    installFrom: 1500,
    totalFrom: 5500,
    includes: ['IP65 outdoor or solar gate light', 'Nairobi delivery', 'Exterior mounting & alignment'],
    popular: false,
  },
];
