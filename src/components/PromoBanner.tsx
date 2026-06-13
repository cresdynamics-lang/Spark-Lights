import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BRAND } from '../data/brand';

export default function PromoBanner() {
  return (
    <section className="relative py-28 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: "url('/roomm3.png')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/60" />
      <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="max-w-xl"
        >
          <span className="text-primary-gold uppercase tracking-[0.5em] text-[10px] font-black mb-4 block">
            Professional Installation
          </span>
          <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter text-white mb-6 leading-tight">
            Need Lights Fitted in Nairobi?
          </h2>
          <p className="text-gray-400 leading-relaxed">
            Our installation team handles chandeliers, ceiling panels, outdoor fixtures, and more.
            Get a free quote on WhatsApp before you buy.
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex gap-4">
          <a href={BRAND.whatsappUrl} className="btn-primary py-4 px-10">Get Install Quote</a>
          <Link to="/shop" className="btn-secondary py-4 px-10">Shop Lights</Link>
        </motion.div>
      </div>
    </section>
  );
}
