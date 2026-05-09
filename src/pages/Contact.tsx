import { motion } from 'framer-motion';
import { FiPhone, FiMail, FiMapPin, FiMessageCircle, FiArrowRight } from 'react-icons/fi';

const fadeIn = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
};

export default function Contact() {
  return (
    <div className="min-h-screen pb-32 overflow-x-hidden">
      {/* Editorial Header */}
      <section className="py-24 sm:py-32 border-b border-white/5 bg-secondary-black">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div {...fadeIn}>
              <span className="text-primary-gold uppercase tracking-[0.6em] text-[10px] font-black mb-6 block">Inquiries</span>
              <h1 className="text-5xl sm:text-8xl font-black uppercase leading-none tracking-tighter mb-8">Let's Create <br/> Together</h1>
              <p className="text-gray-500 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
                Whether you're planning a grand gala or seeking the perfect individual bloom, our artisan concierge is ready to assist.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 sm:py-48">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-24 xl:gap-32">
            {/* Contact Details */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/3 space-y-16"
            >
              <div>
                <span className="text-primary-gold uppercase tracking-[0.4em] text-[9px] font-black mb-10 block">Direct Access</span>
                <div className="space-y-12">
                  {[
                    { icon: <FiPhone />, label: 'Concierge', value: '+254 700 000 000' },
                    { icon: <FiMessageCircle />, label: 'WhatsApp', value: '+254 700 000 000', sub: 'Instant Artisan Access' },
                    { icon: <FiMail />, label: 'Email', value: 'hello@marigold.co.ke' },
                    { icon: <FiMapPin />, label: 'Studio', value: 'Westlands, Nairobi, Kenya' }
                  ].map((item) => (
                    <div key={item.label} className="group">
                      <div className="flex items-center gap-6 mb-4">
                        <div className="text-primary-gold transition-transform duration-500 group-hover:scale-125">
                          {item.icon}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors">{item.label}</span>
                      </div>
                      <p className="text-xl font-black uppercase text-white group-hover:text-primary-gold transition-colors tracking-tighter">{item.value}</p>
                      {item.sub && <p className="text-[10px] text-primary-gold font-black uppercase tracking-widest mt-2">{item.sub}</p>}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="pt-16 border-t border-white/5">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-8">Studio Hours</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center group">
                    <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">Monday – Saturday</span>
                    <span className="text-sm font-black uppercase text-white group-hover:text-primary-gold transition-colors">08:00 — 18:00</span>
                  </div>
                  <div className="flex justify-between items-center group">
                    <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">Sunday</span>
                    <span className="text-sm font-black uppercase text-white group-hover:text-primary-gold transition-colors">09:00 — 14:00</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* High-End Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-2/3"
            >
              <form className="grid grid-cols-1 sm:grid-cols-2 gap-10 bg-tertiary-black p-12 sm:p-20 border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-gold/5 blur-[100px] group-hover:bg-primary-gold/10 transition-all duration-1000"></div>
                
                <div className="flex flex-col gap-4">
                  <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500">Full Identity</label>
                  <input type="text" placeholder="Your Name" className="bg-transparent border-b border-white/10 px-0 py-4 focus:outline-none focus:border-primary-gold transition-colors text-white font-medium placeholder:text-gray-700" required />
                </div>
                
                <div className="flex flex-col gap-4">
                  <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500">Digital Address</label>
                  <input type="email" placeholder="email@address.com" className="bg-transparent border-b border-white/10 px-0 py-4 focus:outline-none focus:border-primary-gold transition-colors text-white font-medium placeholder:text-gray-700" required />
                </div>
                
                <div className="flex flex-col gap-4 sm:col-span-2">
                  <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500">Curation Type</label>
                  <select className="bg-transparent border-b border-white/10 px-0 py-4 focus:outline-none focus:border-primary-gold transition-colors text-white font-medium appearance-none cursor-pointer">
                    <option className="bg-primary-black">Order Inquiry</option>
                    <option className="bg-primary-black">Bespoke Arrangement</option>
                    <option className="bg-primary-black">Wedding & Gala Curation</option>
                    <option className="bg-primary-black">Corporate Identity</option>
                    <option className="bg-primary-black">Private Workshop</option>
                  </select>
                </div>
                
                <div className="flex flex-col gap-4 sm:col-span-2">
                  <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500">Your Vision</label>
                  <textarea rows={6} placeholder="How can we elevate your occasion?" className="bg-transparent border-b border-white/10 px-0 py-4 focus:outline-none focus:border-primary-gold transition-colors text-white font-medium resize-none placeholder:text-gray-700" required></textarea>
                </div>
                
                <div className="sm:col-span-2 pt-10">
                  <button type="submit" className="btn-primary w-full py-6 text-[11px] font-black uppercase tracking-[0.5em] flex items-center justify-center gap-4 group">
                    Transmit Message <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
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
