import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiSun } from 'react-icons/fi';
import { LIGHT_GUIDE } from '../data/content';
import { LIGHT_CATEGORIES } from '../data/categories';
import { usePageSEO } from '../hooks/usePageSEO';
import { BRAND } from '../data/brand';
import PublicImage from '../components/PublicImage';

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
};

export default function LightGuide() {
  usePageSEO({
    title: `Lighting Guide Nairobi | Choose the Right Lights | ${BRAND.name}`,
    description:
      'Room-by-room lighting guide for Nairobi homes — bedroom, kitchen, dining, outdoor & corridor tips. Chandeliers, ceiling lights & wall lights from Sparklights.',
    path: '/light-guide',
  });

  const categoryName = (slug: string) =>
    LIGHT_CATEGORIES.find((c) => c.slug === slug)?.name ?? slug;

  return (
    <div className="min-h-screen pb-32">
      <section className="py-24 sm:py-32 border-b border-white/5 bg-secondary-black">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <motion.div {...fadeIn}>
            <FiSun className="text-primary-gold text-5xl mx-auto mb-8" />
            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight mb-6">
              Nairobi Lighting Guide
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed max-w-2xl mx-auto">
              Not sure which light fits your space? Use this room-by-room guide to pick chandeliers,
              ceiling panels, and wall lights — then order on WhatsApp with same-day Nairobi delivery.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="container mx-auto px-6 space-y-24">
          {LIGHT_GUIDE.map((section, i) => (
            <motion.article
              key={section.slug}
              {...fadeIn}
              transition={{ ...fadeIn.transition, delay: i * 0.05 }}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                i % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                <span className="text-primary-gold text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">
                  Room {i + 1}
                </span>
                <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight mb-6">
                  {section.room}
                </h2>
                <ul className="space-y-4 mb-8">
                  {section.tips.map((tip) => (
                    <li key={tip} className="flex gap-3 text-gray-400 text-sm leading-relaxed">
                      <span className="text-primary-gold mt-1 shrink-0">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2">
                  {section.picks.map((slug) => (
                    <Link
                      key={slug}
                      to={`/category/${slug}`}
                      className="text-[10px] font-black uppercase tracking-widest px-4 py-2 border border-primary-gold/30 text-primary-gold hover:bg-primary-gold hover:text-black transition-all"
                    >
                      {categoryName(slug)}
                    </Link>
                  ))}
                </div>
              </div>
              <div
                className={`aspect-[4/3] overflow-hidden border border-white/5 bg-tertiary-black ${
                  i % 2 === 1 ? 'lg:order-1' : ''
                }`}
              >
                <PublicImage
                  src={section.image}
                  alt={`${section.room} lighting`}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="py-16 border-t border-white/5">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-500 mb-8">Still unsure? Message us on WhatsApp with a photo of your room.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={BRAND.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center justify-center gap-2"
            >
              Order on WhatsApp <FiArrowRight />
            </a>
            <Link to="/shop" className="btn-secondary inline-flex items-center justify-center gap-2">
              Browse All Lights
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
