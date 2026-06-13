import { BRAND } from '../data/brand';

const NAIROBI_AREAS = [
  'Westlands', 'Kilimani', 'Karen', 'Lavington', 'Nairobi CBD',
  'Parklands', 'Syokimau', 'Ruaka', 'Kileleshwa', 'Upperhill',
];

export default function LocalBusinessJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'LightingStore',
    name: BRAND.name,
    url: `https://${BRAND.domain}`,
    telephone: [BRAND.phone, BRAND.phone2],
    email: BRAND.email,
    description:
      'Lighting shops in Nyamakima — chandeliers in Nairobi price, modern ceiling lights, pendant lights Kenya, gypsum board lighting, outdoor solar & installation services.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Nyamakima, Duruma Road, New Nyamakima Electrical Point Building, Shop 216, 2nd Floor',
      addressLocality: 'Nairobi',
      addressRegion: 'Nairobi County',
      addressCountry: 'KE',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -1.2837,
      longitude: 36.8293,
    },
    areaServed: NAIROBI_AREAS.map((name) => ({ '@type': 'Place', name })),
    priceRange: 'KES 2,000+',
    knowsAbout: [
      'Chandeliers Nairobi',
      'Gypsum ceiling lights',
      'Solar security lights',
      'Lighting installation Nairobi',
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '08:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Sunday',
        opens: '09:00',
        closes: '14:00',
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
