import { motion } from 'framer-motion';
import { FiStar, FiTool, FiShield, FiMapPin } from 'react-icons/fi';
import { BRAND } from '../data/brand';
import { usePageSEO } from '../hooks/usePageSEO';

const fadeIn = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8 },
};

export default function About() {
  usePageSEO({
    title: `Lighting Shops Nyamakima Nairobi | About ${BRAND.name}`,
    description: `Lighting shops in Nyamakima — ${BRAND.name} supplies chandeliers, ceiling lights & installation across Westlands, Kilimani, Karen, CBD & Nairobi. Visit Duruma Road showroom.`,
    path: '/about',
    keywords: 'lighting shops in Nyamakima, best lighting shops along Mombasa Road, chandeliers Westlands, electrical shops Nairobi CBD',
  });

  return (
    <div className="min-h-screen pb-32 overflow-x-hidden">
      <section className="relative min-h-[70vh] flex items-center bg-secondary-black border-b border-white/5 overflow-hidden">
        <div
          className="absolute inset-0 opacity-25 bg-cover bg-center"
          style={{ backgroundImage: "url('/round2.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        <div className="container mx-auto px-6 relative z-10 py-24">
          <motion.div {...fadeIn}>
            <span className="text-primary-gold uppercase tracking-[0.5em] text-[10px] font-black mb-6 block">
              About Us
            </span>
            <h1 className="text-5xl sm:text-7xl font-black uppercase tracking-tighter leading-none mb-8 text-white">
              Lighting Shops in <br /> Nyamakima, Nairobi
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl leading-relaxed mb-6">
              Spark Lights 254 is among the trusted lighting shops in Nyamakima — stocking chandeliers,
              modern ceiling lights, gypsum fixtures, and outdoor solar lighting for homes and businesses.
            </p>
            <p className="text-base text-gray-500 max-w-2xl leading-relaxed">
              We supply and deliver modern chandeliers to Westlands, Kilimani, Karen, Lavington, and across
              Nairobi CBD, with our primary pickup location at Nyamakima, Duruma Road, Shop 216. Same-day delivery
              to neighbourhoods along Mombasa Road, Syokimau, Ruaka, and Kitengela.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 sm:py-32">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:w-1/2">
              <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter leading-tight mb-10 text-white">
                The Spark Lights Standard
              </h2>
              <div className="space-y-10">
                {[
                  { icon: <FiStar />, title: 'Curated Range', text: 'Wall, ceiling, outdoor, bedroom, kitchen, dining, parking, event & corridor lighting — all under one roof in Nyamakima.' },
                  { icon: <FiTool />, title: 'Installation You Can Trust', text: 'Professional chandelier installation in Nairobi — gypsum lights, wall brackets & outdoor IP65 mounts. Book a fundi via our installation page.' },
                  { icon: <FiShield />, title: 'Honest Pricing', text: 'Lights from KES 2,000. Clear quotes on WhatsApp before you pay. No hidden costs.' },
                  { icon: <FiMapPin />, title: 'Rooted in Nairobi', text: 'We know Nairobi neighbourhoods — Westlands to Syokimau — and deliver fast because we are local.' },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-6">
                    <div className="text-primary-gold text-2xl mt-1">{item.icon}</div>
                    <div>
                      <h3 className="text-lg font-black uppercase text-white mb-2">{item.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:w-1/2">
              <img
                src="/round3.jpg"
                alt="Spark Lights 254 showroom — chandeliers and ceiling lights in Nairobi"
                className="w-full aspect-[4/5] object-cover border border-white/5"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-secondary-black text-center">
        <div className="container mx-auto px-6 max-w-3xl">
          <p className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-white leading-tight mb-8">
            "Great lighting transforms any space. We make it easy to find, buy, and install — right here in Nairobi."
          </p>
          <p className="text-primary-gold text-[10px] font-black uppercase tracking-[0.4em]">Spark Lights 254 Team</p>
        </div>
      </section>
    </div>
  );
}
