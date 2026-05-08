import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import mothersDayImg from '../assets/mothers day flowers.jpg';

export default function PromoBanner() {
  return (
    <section className="relative py-32 sm:py-48 overflow-hidden group">
      <motion.div 
        initial={{ scale: 1.1 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 bg-cover bg-fixed bg-center transition-transform duration-[3s] group-hover:scale-105" 
        style={{ backgroundImage: `url('${mothersDayImg}')` }}
      ></motion.div>
      <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/40 to-transparent"></div>
      
      <div className="container mx-auto px-6 relative z-10 flex justify-end">
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-xl text-right"
        >
          <span className="text-primary-pink uppercase tracking-[0.5em] text-[10px] font-bold mb-6 block">Limited Edition</span>
          <h2 className="text-4xl sm:text-6xl font-serif mb-8 text-white leading-tight">Mother's Day Collection 2026</h2>
          <p className="text-lg text-gray-300 mb-12 italic leading-relaxed">
            "Because she deserves the very best. Pre-order our exclusive Mother's Day bouquets today and receive a complimentary luxury candle."
          </p>
          <div className="flex justify-end gap-6">
            <Link to="/shop?category=mothers-day" className="btn-primary">Shop Collection</Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
