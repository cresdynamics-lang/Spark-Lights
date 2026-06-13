import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiTool, FiCheckCircle, FiArrowRight, FiPackage } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa6';
import { usePageSEO } from '../hooks/usePageSEO';
import { BRAND } from '../data/brand';
import { SUPPLY_FIX_PACKAGES } from '../data/conversion';
import InstallationGallery from '../components/InstallationGallery';
import DeliveryBanner from '../components/DeliveryBanner';

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7 },
};

const SERVICES = [
  'Chandelier installation — gold, crystal & heavy ceiling mounts',
  'Gypsum ceiling lights & LED profile fitting',
  'Wall bracket and outdoor waterproof light mounting',
  'Living room & dining room lighting design consultation',
  'Commercial & restaurant lighting for property developers',
];

export default function InstallationServices() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    location: '',
    service: 'Chandelier Supply & Fix',
    details: '',
  });

  usePageSEO({
    title: 'Professional Chandelier & Ceiling Light Installation Services in Nairobi',
    description:
      'Supply & Fix Nairobi — one price for light fixture + Moto/Bolt delivery + fundi installation. Chandelier, gypsum LED & outdoor packages from Spark Lights 254.',
    path: '/installation',
    keywords:
      'Professional Chandelier Installation in Nairobi, chandelier installation services Nairobi, lighting installation services Kenya, supply and fix Nairobi, fundi for lights Nairobi',
  });

  const requestPackage = (packageName: string, totalFrom: number) => {
    const message = [
      `*SUPPLY & FIX REQUEST — ${BRAND.name}*`,
      '',
      `Package: ${packageName}`,
      `Estimated from: KES ${totalFrom.toLocaleString()}`,
      '',
      'Please send exact quote for light + delivery + installation.',
    ].join('\n');
    window.open(`${BRAND.whatsappUrl}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = [
      `*SUPPLY & FIX REQUEST — ${BRAND.name}*`,
      '',
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      `Location: ${form.location}`,
      `Package / Service: ${form.service}`,
      form.details ? `Details: ${form.details}` : '',
      '',
      'Please send one total quote: light + delivery + installation.',
    ]
      .filter(Boolean)
      .join('\n');

    window.open(`${BRAND.whatsappUrl}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen pb-32">
      <section className="py-24 sm:py-32 border-b border-white/5 bg-secondary-black">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div {...fadeIn}>
            <FiTool className="text-primary-gold text-5xl mb-8" />
            <span className="text-primary-gold text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Supply &amp; Fix</span>
            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight mb-6 text-white">
              Professional Chandelier &amp; Ceiling Light Installation Services in Nairobi
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed max-w-2xl">
              One price. One WhatsApp. Light fixture + same-day Nairobi delivery (Moto/Bolt) + trusted fundi
              installation — removes all friction for busy homeowners and developers ready to spend today.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Package deals */}
      <section className="py-20 border-b border-white/5">
        <div className="container mx-auto px-6">
          <motion.div {...fadeIn} className="text-center mb-14">
            <FiPackage className="text-primary-gold text-4xl mx-auto mb-4" />
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white mb-4">
              Supply &amp; Fix Packages
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-sm">
              Indicative totals in KES — exact quote on WhatsApp based on your estate and ceiling type.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {SUPPLY_FIX_PACKAGES.map((pkg, i) => (
              <motion.div
                key={pkg.id}
                {...fadeIn}
                transition={{ ...fadeIn.transition, delay: i * 0.05 }}
                className={`p-8 border ${pkg.popular ? 'border-primary-gold bg-primary-gold/5' : 'border-white/10 bg-tertiary-black'} relative`}
              >
                {pkg.popular && (
                  <span className="absolute top-4 right-4 text-[9px] font-black uppercase tracking-widest bg-primary-gold text-black px-3 py-1">
                    Most Popular
                  </span>
                )}
                <h3 className="text-xl font-black uppercase tracking-tight text-white mb-1">{pkg.name}</h3>
                <p className="text-gray-500 text-sm mb-6">{pkg.tagline}</p>
                <p className="text-3xl font-black text-primary-gold mb-2">
                  From KES {pkg.totalFrom.toLocaleString()}
                </p>
                <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mb-6">
                  Light KES {pkg.lightFrom.toLocaleString()}+ · Delivery KES {pkg.deliveryFrom}+ · Install KES {pkg.installFrom}+
                </p>
                <ul className="space-y-3 mb-8">
                  {pkg.includes.map((item) => (
                    <li key={item} className="flex gap-2 text-gray-400 text-sm">
                      <FiCheckCircle className="text-primary-gold shrink-0 mt-0.5" size={14} />
                      {item}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => requestPackage(pkg.name, pkg.totalFrom)}
                  className="w-full py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 transition-colors"
                >
                  <FaWhatsapp size={16} /> Get This Package on WhatsApp
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <InstallationGallery showCta={false} />

      <section className="py-20 sm:py-28">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <motion.div {...fadeIn}>
              <h2 className="text-2xl font-black uppercase tracking-tighter text-white mb-8">What We Install</h2>
              <ul className="space-y-5 mb-12">
                {SERVICES.map((item) => (
                  <li key={item} className="flex gap-3 text-gray-400 text-sm leading-relaxed">
                    <FiCheckCircle className="text-primary-gold shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/light-guide" className="text-primary-gold text-[10px] font-black uppercase tracking-widest hover:underline inline-flex items-center gap-2">
                Modern gypsum ceiling design ideas <FiArrowRight />
              </Link>
              <span className="mx-3 text-gray-700">·</span>
              <Link to="/blog" className="text-primary-gold text-[10px] font-black uppercase tracking-widest hover:underline inline-flex items-center gap-2">
                Read our lighting blog <FiArrowRight />
              </Link>
            </motion.div>

            <motion.div {...fadeIn} className="bg-tertiary-black border border-white/10 p-8 sm:p-10">
              <h2 className="text-xl font-black uppercase tracking-tighter text-white mb-8">Custom Supply &amp; Fix Quote</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 block mb-2">Full Name</label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-transparent border-b border-white/10 py-3 text-white focus:outline-none focus:border-primary-gold" />
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 block mb-2">Phone / WhatsApp</label>
                  <input required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full bg-transparent border-b border-white/10 py-3 text-white focus:outline-none focus:border-primary-gold" />
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 block mb-2">Estate / Area</label>
                  <input required placeholder="e.g. Kilimani, Runda, Syokimau" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full bg-transparent border-b border-white/10 py-3 text-white focus:outline-none focus:border-primary-gold" />
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 block mb-2">Package</label>
                  <select value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} className="w-full bg-secondary-black border border-white/10 py-3 px-3 text-white focus:outline-none focus:border-primary-gold">
                    {SUPPLY_FIX_PACKAGES.map((p) => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                    <option value="Custom quote">Custom quote</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 block mb-2">Details</label>
                  <textarea rows={3} value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} placeholder="Ceiling type, number of lights, photos welcome..." className="w-full bg-transparent border border-white/10 p-4 text-white focus:outline-none focus:border-primary-gold resize-none" />
                </div>
                <button type="submit" className="w-full py-5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 transition-colors">
                  <FaWhatsapp size={18} /> Chat on WhatsApp to Order
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      <DeliveryBanner />
    </div>
  );
}
