import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMapPin } from 'react-icons/fi';
import { INSTALLATION_PROOFS } from '../data/conversion';
import { BRAND } from '../data/brand';
import { FaWhatsapp } from 'react-icons/fa6';

const fadeIn = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

interface InstallationGalleryProps {
  showCta?: boolean;
  id?: string;
}

export default function InstallationGallery({ showCta = true, id = 'installations' }: InstallationGalleryProps) {
  return (
    <section id={id} className="py-20 sm:py-28 bg-secondary-black border-y border-white/5">
      <div className="container mx-auto px-6">
        <motion.div {...fadeIn} className="text-center mb-14 max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter text-white mb-4">
            Real Installations Across Nairobi
          </h2>
          <p className="text-gray-500 leading-relaxed">
            Proof builds trust. Here are chandeliers, gypsum panels, and outdoor lights we have supplied and
            installed in estates like Kilimani, Runda, Syokimau, Karen, and Westlands — order the same on WhatsApp.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {INSTALLATION_PROOFS.map((item, i) => (
            <motion.article
              key={item.id}
              {...fadeIn}
              transition={{ ...fadeIn.transition, delay: i * 0.05 }}
              className="group border border-white/5 bg-primary-black overflow-hidden"
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <img
                  src={item.image}
                  alt={`${item.title} — ${item.area} installation by Spark Lights 254`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <span className="absolute top-4 left-4 bg-black/80 text-[9px] font-black uppercase tracking-widest px-3 py-1 text-primary-gold border border-primary-gold/30">
                  {item.productType}
                </span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-600 mb-2">
                  <FiMapPin size={12} className="text-primary-gold" />
                  {item.area} · {item.estate}
                </div>
                <h3 className="text-lg font-black uppercase tracking-tight text-white mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
              </div>
            </motion.article>
          ))}
        </div>

        {showCta && (
          <div className="text-center mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={BRAND.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 py-4 px-10 bg-[#25D366] hover:bg-[#20bd5a] text-white font-black uppercase tracking-widest text-[11px] transition-colors"
            >
              <FaWhatsapp size={18} /> Chat on WhatsApp to Order
            </a>
            <Link to="/installation" className="btn-secondary py-4 px-10 text-[11px]">
              Supply &amp; Fix Packages
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
