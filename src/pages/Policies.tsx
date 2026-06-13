import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiTruck, FiCornerUpLeft, FiHelpCircle } from 'react-icons/fi';
import { FAQS } from '../data/content';
import { usePageSEO } from '../hooks/usePageSEO';
import { BRAND } from '../data/brand';

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: "easeOut" as const }
};

const SEO: Record<string, { title: string; description: string; path: string }> = {
  faq: {
    title: `Lighting FAQ Nairobi | ${BRAND.name}`,
    description: 'Frequently asked questions about buying chandeliers, ceiling lights & wall lights in Nairobi. Delivery, installation, WhatsApp ordering.',
    path: '/faq',
  },
  delivery: {
    title: `Lighting Delivery Nairobi | ${BRAND.name}`,
    description: 'Same-day lighting delivery across Nairobi — Westlands, Kilimani, Karen, CBD & more. Order before 2 PM.',
    path: '/delivery',
  },
  refund: {
    title: `Returns Policy | ${BRAND.name}`,
    description: 'Spark Lights 254 satisfaction guarantee. Replacement or refund for damaged or defective lighting products.',
    path: '/refund-policy',
  },
};

export default function Policies({ type }: { type: 'faq' | 'delivery' | 'refund' }) {
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  usePageSEO(SEO[type]);

  return (
    <div className="min-h-screen pb-32">
      <section className="py-24 sm:py-32">
        <div className="container mx-auto px-6 max-w-4xl">
          {type === 'faq' && (
            <motion.div {...fadeIn}>
              <div className="text-center mb-24">
                <FiHelpCircle className="text-primary-gold text-5xl mx-auto mb-8" />
                <h1 className="text-4xl sm:text-6xl font-serif mb-6">Frequently Asked Questions</h1>
                <p className="text-gray-500">Everything you need to know about buying lights in Nairobi.</p>
              </div>
              
              <div className="space-y-16">
                {FAQS.map((cat) => (
                  <div key={cat.category}>
                    <h2 className="text-sm font-black uppercase tracking-[0.3em] text-primary-gold mb-10 border-b border-white/5 pb-4">{cat.category}</h2>
                    <div className="space-y-4">
                      {cat.questions.map((item) => (
                        <div key={item.q} className="border border-white/5 bg-secondary-black overflow-hidden">
                          <button 
                            onClick={() => setOpenFaq(openFaq === item.q ? null : item.q)}
                            className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                          >
                            <span className="font-serif text-lg">{item.q}</span>
                            <FiChevronDown className={`transition-transform duration-500 ${openFaq === item.q ? 'rotate-180' : ''}`} />
                          </button>
                          <AnimatePresence>
                            {openFaq === item.q && (
                              <motion.div 
                                initial={{ height: 0 }}
                                animate={{ height: 'auto' }}
                                exit={{ height: 0 }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                              >
                                <div className="px-8 pb-8 text-gray-400 leading-relaxed text-sm border-t border-white/5 pt-6">
                                  {item.a}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {type === 'delivery' && (
            <motion.div {...fadeIn}>
              <div className="text-center mb-24">
                <FiTruck className="text-primary-gold text-5xl mx-auto mb-8" />
                <h1 className="text-4xl sm:text-6xl font-serif mb-6">Delivery Information</h1>
                <p className="text-gray-500">How we deliver lighting products across Nairobi.</p>
              </div>
              
              <div className="prose prose-invert max-w-none space-y-16">
                <div className="bg-secondary-black p-12 border border-white/5">
                  <h2 className="text-2xl font-serif mb-8 border-b border-white/5 pb-4">Nairobi Coverage</h2>
                  <p className="text-gray-400 mb-8 leading-relaxed">
                    We deliver to all major residential and commercial areas including: Westlands, Karen, Kilimani, Kileleshwa, Lavington, Gigiri, Parklands, Upperhill, CBD, South B & C, Langata, Runda, Muthaiga, Spring Valley, and more.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm">
                    <div className="bg-primary-black p-6 border border-white/5">
                      <h3 className="font-black text-primary-gold uppercase tracking-widest text-[10px] mb-4">Same-Day Delivery</h3>
                      <p className="text-gray-500">Order by 2:00 PM for same-day delivery before 6:00 PM. Delivery fee from KES 500.</p>
                    </div>
                    <div className="bg-primary-black p-6 border border-white/5">
                      <h3 className="font-black text-primary-gold uppercase tracking-widest text-[10px] mb-4">Scheduled Delivery</h3>
                      <p className="text-gray-500">Pick your date and window (Morning or Afternoon). Free over KES 3,000.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <h2 className="text-2xl font-serif border-b border-white/5 pb-4">Important Delivery Notes</h2>
                  <ul className="space-y-4 text-gray-400 text-sm list-disc pl-6 leading-relaxed">
                    <li>Deliveries are made between 9:00 AM and 6:00 PM, Monday to Saturday.</li>
                    <li>Sunday delivery is available for pre-orders placed 24 hours in advance.</li>
                    <li>Please ensure someone is available to receive the lights, or provide a safe drop location.</li>
                    <li>We will contact you via WhatsApp before delivery to confirm your Nairobi address.</li>
                    <li>For large commercial or event lighting orders, we recommend 48–72 hours notice.</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {type === 'refund' && (
            <motion.div {...fadeIn}>
              <div className="text-center mb-24">
                <FiCornerUpLeft className="text-primary-gold text-5xl mx-auto mb-8" />
                <h1 className="text-4xl sm:text-6xl font-serif mb-6">Refund & Returns Policy</h1>
                <p className="text-gray-500">Our promise to you and your satisfaction.</p>
              </div>
              
              <div className="space-y-16 text-gray-400 leading-relaxed text-sm">
                <div className="bg-secondary-black p-12 border border-white/5">
                  <h2 className="text-2xl font-serif mb-8 text-white border-b border-white/5 pb-4">Satisfaction Guarantee</h2>
                  <p>
                    We stand behind every light we sell. If your product arrives damaged, defective, or significantly different from what was ordered — we will replace it free of charge or issue a full refund. Contact us within 24 hours with photos.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <h3 className="text-lg font-serif text-white">What Qualifies</h3>
                    <ul className="space-y-4 list-disc pl-6">
                      <li>Light arrived visibly damaged or cracked.</li>
                      <li>Product significantly different from what was ordered.</li>
                      <li>Order not delivered on promised date due to our error.</li>
                    </ul>
                    <p className="text-xs text-primary-gold italic">Issues must be reported within 24 hours with photos.</p>
                  </div>
                  <div className="space-y-6">
                    <h3 className="text-lg font-serif text-white">What Does Not Qualify</h3>
                    <ul className="space-y-4 list-disc pl-6">
                      <li>Minor colour or finish variations between batches.</li>
                      <li>Damage caused by incorrect installation after delivery.</li>
                      <li>Incorrect delivery address provided by customer.</li>
                      <li>Change of mind after the item has been opened and installed.</li>
                    </ul>
                  </div>
                </div>

                <div className="pt-12 border-t border-white/5">
                  <h2 className="text-2xl font-serif mb-8 text-white">Refund Processing</h2>
                  <p>
                    Approved refunds are processed within 3–5 business days to your original payment method. M-Pesa refunds are typically instant once approved. Card refunds may take up to 7 business days depending on your bank.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
