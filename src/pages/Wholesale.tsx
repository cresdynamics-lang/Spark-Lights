import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPackage, FiArrowRight } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa6';
import { usePageSEO } from '../hooks/usePageSEO';
import { BRAND } from '../data/brand';

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7 },
};

const WHOLESALE_MESSAGE = encodeURIComponent(
  `Hi ${BRAND.name}! I need a wholesale / bulk lighting quote for a commercial project in Nairobi.`
);

export default function Wholesale() {
  usePageSEO({
    title: 'Wholesale Electrical & Lighting Shops Nairobi | Bulk Orders',
    description:
      'Wholesale electrical shops Nairobi — bulk chandeliers, ceiling lights & LED fixtures for developers, hotels & offices. Volume pricing from Spark Lights 254, Nyamakima.',
    path: '/wholesale',
    keywords:
      'wholesale electrical shops Nairobi, bulk lighting Kenya, commercial chandeliers Nairobi, property developer lighting',
  });

  return (
    <div className="min-h-screen pb-32">
      <section className="py-24 sm:py-32 border-b border-white/5 bg-secondary-black">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <motion.div {...fadeIn}>
            <FiPackage className="text-primary-gold text-5xl mx-auto mb-8" />
            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight mb-6 text-white">
              Wholesale Electrical & Lighting — Nairobi
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto">
              Property developers, hotels, restaurants, and electrical contractors trust Spark Lights 254
              for bulk chandeliers, gypsum LED profiles, corridor panels, and outdoor security lighting —
              with volume discounts and installation across Nairobi.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6 max-w-3xl text-center space-y-10">
          <motion.div {...fadeIn} className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            {[
              { title: 'Developers', text: 'Apartment blocks, offices & retail — consistent fixtures at scale.' },
              { title: 'Hospitality', text: 'Hotels, restaurants & event venues — statement chandeliers.' },
              { title: 'Contractors', text: 'Nyamakima pickup or Nairobi delivery to your site.' },
            ].map((item) => (
              <div key={item.title} className="p-6 border border-white/5 bg-tertiary-black">
                <h2 className="text-sm font-black uppercase text-primary-gold mb-3">{item.title}</h2>
                <p className="text-gray-500 text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </motion.div>

          <a
            href={`${BRAND.whatsappUrl}?text=${WHOLESALE_MESSAGE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 py-5 px-12 bg-[#25D366] hover:bg-[#20bd5a] text-white font-black uppercase tracking-widest text-[11px] transition-colors"
          >
            <FaWhatsapp size={20} /> Get Bulk Quote on WhatsApp
          </a>

          <p className="text-gray-600 text-sm">
            Or browse our{' '}
            <Link to="/shop" className="text-primary-gold hover:underline">full catalog with prices</Link>
            {' '}·{' '}
            <Link to="/installation" className="text-primary-gold hover:underline">installation services</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
