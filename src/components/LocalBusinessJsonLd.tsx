import { BRAND } from '../data/brand';

export default function LocalBusinessJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'LightingStore',
    name: BRAND.name,
    url: `https://${BRAND.domain}`,
    telephone: [BRAND.phone, BRAND.phone2],
    email: BRAND.email,
    description: BRAND.tagline,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Nyamakima, Duruma Road, New Nyamakima Electrical Point Building, Shop 216, 2nd Floor',
      addressLocality: 'Nairobi',
      addressCountry: 'KE',
    },
    areaServed: {
      '@type': 'City',
      name: 'Nairobi',
    },
    priceRange: 'KES 2,000+',
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
