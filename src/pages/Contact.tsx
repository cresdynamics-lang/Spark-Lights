import { motion } from 'framer-motion';
import { FiPhone, FiMail, FiMapPin, FiMessageCircle, FiArrowRight } from 'react-icons/fi';
import { BRAND } from '../data/brand';
import { usePageSEO } from '../hooks/usePageSEO';

const fadeIn = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8 },
};

export default function Contact() {
  usePageSEO({
    title: `Contact ${BRAND.name} | Order Lights Nairobi`,
    description: `Contact Spark Lights 254 in Nyamakima. Call ${BRAND.phone}, WhatsApp, or visit our showroom. Same-day lighting delivery across Nairobi.`,
    path: '/contact',
  });

  return (
    <div className="min-h-screen pb-32 overflow-x-hidden">
      <section className="py-24 sm:py-32 border-b border-white/5 bg-secondary-black">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <motion.div {...fadeIn}>
            <span className="text-primary-gold uppercase tracking-[0.5em] text-[10px] font-black mb-6 block">
              Get in Touch
            </span>
            <h1 className="text-5xl sm:text-7xl font-black uppercase leading-none tracking-tighter mb-8 text-white">
              Contact Spark Lights 254
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed">
              Order by WhatsApp, phone, or visit our Nyamakima showroom. We respond fast and deliver across Nairobi.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 sm:py-32">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-20">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:w-2/5 space-y-12">
              {[
                { icon: <FiPhone />, label: 'Phone', value: BRAND.phone, href: `tel:${BRAND.phone.replace(/\s/g, '')}` },
                { icon: <FiPhone />, label: 'Phone 2', value: BRAND.phone2, href: `tel:${BRAND.phone2.replace(/\s/g, '')}` },
                { icon: <FiMessageCircle />, label: 'WhatsApp', value: BRAND.phone, href: BRAND.whatsappUrl },
                { icon: <FiMail />, label: 'Email', value: BRAND.email, href: `mailto:${BRAND.email}` },
                { icon: <FiMapPin />, label: 'Showroom', value: BRAND.fullAddress },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex items-center gap-4 mb-3 text-primary-gold">{item.icon}</div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">{item.label}</p>
                  {item.href ? (
                    <a href={item.href} className="text-lg font-black text-white hover:text-primary-gold transition-colors">
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-lg font-bold text-white leading-relaxed">{item.value}</p>
                  )}
                </div>
              ))}
              <div className="pt-8 border-t border-white/5">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">Opening Hours</p>
                <p className="text-white font-bold">Mon – Sat: 8:00 AM – 6:00 PM</p>
                <p className="text-white font-bold">Sunday: 9:00 AM – 2:00 PM</p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:w-3/5">
              <form className="grid grid-cols-1 sm:grid-cols-2 gap-8 bg-tertiary-black p-10 sm:p-14 border border-white/5">
                <div className="sm:col-span-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Name</label>
                  <input type="text" required className="w-full bg-transparent border-b border-white/10 py-4 text-white focus:outline-none focus:border-primary-gold mt-2" placeholder="Your name" />
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Phone</label>
                  <input type="tel" required className="w-full bg-transparent border-b border-white/10 py-4 text-white focus:outline-none focus:border-primary-gold mt-2" placeholder="+254 7..." />
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Email</label>
                  <input type="email" className="w-full bg-transparent border-b border-white/10 py-4 text-white focus:outline-none focus:border-primary-gold mt-2" placeholder="you@email.com" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Inquiry Type</label>
                  <select className="w-full bg-transparent border-b border-white/10 py-4 text-white focus:outline-none focus:border-primary-gold mt-2">
                    <option className="bg-black">Product inquiry</option>
                    <option className="bg-black">Installation quote</option>
                    <option className="bg-black">Bulk / commercial order</option>
                    <option className="bg-black">Delivery question</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Message</label>
                  <textarea rows={5} required className="w-full bg-transparent border-b border-white/10 py-4 text-white focus:outline-none focus:border-primary-gold mt-2 resize-none" placeholder="Which lights do you need? Include your Nairobi area for delivery." />
                </div>
                <div className="sm:col-span-2">
                  <button type="submit" className="btn-primary w-full py-5 flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-widest">
                    Send Message <FiArrowRight />
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
