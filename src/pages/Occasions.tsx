import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { OCCASIONS } from '../data/content';

const fadeIn = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
};

export default function Occasions() {
  return (
    <div className="min-h-screen pb-32 overflow-x-hidden">
      {/* Editorial Header */}
      <section className="py-24 sm:py-32 border-b border-white/5 bg-secondary-black">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div {...fadeIn}>
              <span className="text-primary-gold uppercase tracking-[0.6em] text-[10px] font-black mb-6 block">Mood Curation</span>
              <h1 className="text-5xl sm:text-8xl font-black uppercase leading-none tracking-tighter mb-8">Shop By <br/> Occasion</h1>
              <p className="text-gray-500 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
                Every arrangement is artisanally curated to perfectly match the mood, meaning, and gravity of your special event.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 sm:py-48">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
            {OCCASIONS.map((occ, i) => (
              <motion.div 
                key={occ.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                viewport={{ once: true }}
                className="group relative flex flex-col"
              >
                <div className="aspect-[16/10] overflow-hidden bg-tertiary-black border border-white/5 relative group cursor-pointer">
                  <img src={occ.img} alt={occ.name} className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                  
                  {/* Overlay Reveal */}
                  <div className="absolute inset-0 flex flex-col justify-end p-12 translate-y-8 group-hover:translate-y-0 transition-transform duration-700">
                     <span className="text-primary-gold text-[9px] font-black uppercase tracking-[0.4em] mb-4 block opacity-0 group-hover:opacity-100 transition-opacity duration-500">Hand-Selected Specimens</span>
                     <h3 className="text-4xl sm:text-6xl font-black uppercase text-white group-hover:text-primary-gold transition-colors duration-500 tracking-tighter mb-6">{occ.name}</h3>
                     <Link 
                        to={`/shop?category=${occ.id}`} 
                        className="btn-primary w-fit py-4 px-10 text-[9px] opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                      >
                        Explore Gallery
                      </Link>
                  </div>
                </div>
                <div className="pt-10 flex flex-col items-start max-w-lg">
                   <p className="text-gray-500 text-lg font-medium leading-relaxed mb-6">
                      {occ.tagline}. Our artisans select the most vibrant seasonal blooms to tell your story with elegance and poise.
                   </p>
                   <Link to={`/shop?category=${occ.id}`} className="text-[10px] font-black uppercase tracking-[0.3em] text-white border-b-2 border-primary-gold pb-2 hover:text-primary-gold transition-all">
                      View Collection →
                   </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Newsletter Section can be added here if needed, or it's already in Footer/Home */}
    </div>
  );
}
