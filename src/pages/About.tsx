import { motion } from 'framer-motion';
import { FiStar, FiHeart, FiShield, FiGlobe } from 'react-icons/fi';

const fadeIn = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
};

export default function About() {
  return (
    <div className="min-h-screen pb-32 overflow-x-hidden">
      {/* Manifesto Hero */}
      <section className="relative h-[80vh] flex items-center bg-secondary-black border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1519378304606-27b43f9a6283?q=80&w=2000')] bg-cover bg-fixed grayscale"></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div {...fadeIn}>
            <span className="text-primary-gold uppercase tracking-[0.5em] text-[10px] font-black mb-8 block">Our Manifesto</span>
            <h1 className="text-6xl sm:text-9xl font-black uppercase tracking-tighter leading-none mb-10">Artisan <br/> Integrity</h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-medium">
              We believe that flowers are more than just a gift — they are a powerful medium for human connection, emotion, and architectural beauty.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 sm:py-48">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-24 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2"
            >
              <h2 className="text-5xl sm:text-7xl font-black uppercase tracking-tighter leading-tight mb-10">The Marigold <br/> Standard</h2>
              <div className="space-y-12">
                {[
                  { icon: <FiStar />, title: 'Curated Excellence', text: 'Every stem is hand-selected by our master florists from sustainable farms in the Kenyan highlands.' },
                  { icon: <FiHeart />, title: 'Emotional Design', text: 'Our arrangements are designed not just to look beautiful, but to evoke a specific emotional response.' },
                  { icon: <FiShield />, title: 'Signature Trust', text: 'We offer a 7-day freshness guarantee, ensuring your investment remains vibrant and impactful.' },
                  { icon: <FiGlobe />, title: 'Local Impact', text: 'We directly support local growers, ensuring fair wages and community development.' }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-8 group">
                    <div className="text-primary-gold text-3xl transition-transform duration-500 group-hover:scale-125 mt-1">{item.icon}</div>
                    <div>
                      <h4 className="text-xl font-black uppercase tracking-wide text-white mb-2">{item.title}</h4>
                      <p className="text-gray-500 text-sm leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2 relative"
            >
              <div className="aspect-[3/4] overflow-hidden border border-white/5 relative shadow-2xl">
                <img src="https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=2000" alt="Studio" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-[2s]" />
              </div>
              <div className="absolute -bottom-10 -left-10 bg-primary-gold p-12 hidden sm:block">
                <span className="text-white font-black text-6xl uppercase tracking-tighter">Est. 2018</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Founder Quote */}
      <section className="py-24 sm:py-48 bg-secondary-black">
        <div className="container mx-auto px-6 text-center">
          <motion.div {...fadeIn} className="max-w-4xl mx-auto">
            <div className="w-20 h-1 bg-primary-gold mx-auto mb-16"></div>
            <p className="text-4xl sm:text-6xl font-black uppercase tracking-tighter text-white mb-16 leading-tight">
              "We don't just sell flowers; we curate moments that stay with you long after the petals have fallen."
            </p>
            <div className="flex flex-col items-center">
              <span className="text-primary-gold uppercase tracking-[0.4em] text-[10px] font-black mb-2">Our Founder</span>
              <span className="text-2xl font-black uppercase tracking-tighter text-white">Adriel Marigold</span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
