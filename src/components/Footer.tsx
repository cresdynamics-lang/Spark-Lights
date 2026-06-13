import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiMessageCircle, FiPhone, FiMail, FiMapPin } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { BRAND } from '../data/brand';
import { LIGHT_CATEGORIES } from '../data/categories';
import BrandLogo from './BrandLogo';

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: "easeOut" as const }
};

export default function Footer() {
  return (
    <footer className="pt-24 sm:pt-32 pb-12 bg-primary-black border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          <motion.div {...fadeIn}>
            <div className="mb-8">
              <BrandLogo size="sm" showSubtitle={false} />
            </div>
            <p className="text-gray-500 leading-relaxed mb-4 italic text-sm">
              "{BRAND.tagline}. Same-day delivery across Nairobi — order via WhatsApp."
            </p>
            <p className="text-gray-600 text-xs leading-relaxed mb-8">
              Lighting shops in Nyamakima · We supply chandeliers to Westlands, Kilimani, Karen, Lavington &amp; Nairobi CBD.
              Pickup: {BRAND.fullAddress}
            </p>
            <div className="flex gap-4">
              {[
                { Icon: FiInstagram, label: 'Instagram' },
                { Icon: FiFacebook, label: 'Facebook' },
                { Icon: FiMessageCircle, label: 'Social' },
              ].map(({ Icon, label }) => (
                <motion.a
                  key={label}
                  whileHover={{ scale: 1.2, color: '#DB2777', borderColor: '#DB2777' }}
                  href={BRAND.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${label} — Spark Lights 254 on Instagram`}
                  className="w-10 h-10 border border-white/10 flex items-center justify-center rounded-full transition-all text-gray-500"
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </motion.div>
          
          <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
            <h3 className="text-primary-gold font-black uppercase tracking-[0.3em] mb-10 text-[10px]">Quick Links</h3>
            <ul className="space-y-4">
              {[
                { name: 'Home', path: '/' },
                { name: 'Shop', path: '/shop' },
                { name: 'About Us', path: '/about' },
                { name: 'Contact', path: '/contact' },
                { name: 'Lighting Guide', path: '/light-guide' },
                { name: 'Blog', path: '/blog' },
                { name: 'Installation / Supply & Fix', path: '/installation' },
                { name: 'Wholesale / Bulk', path: '/wholesale' },
                { name: 'FAQs', path: '/faq' },
                { name: 'Delivery Info', path: '/delivery' },
                { name: 'Refund Policy', path: '/refund-policy' }
              ].map(item => (
                <li key={item.name}><Link to={item.path} className="text-sm text-gray-500 hover:text-primary-pink transition-colors font-medium">{item.name}</Link></li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div {...fadeIn} transition={{ delay: 0.3 }}>
            <h3 className="text-primary-gold font-black uppercase tracking-[0.3em] mb-10 text-[10px]">Categories</h3>
            <ul className="space-y-4">
              {LIGHT_CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link to={`/category/${cat.slug}`} className="text-sm text-gray-500 hover:text-primary-pink transition-colors font-medium">
                    {cat.seoH1}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div {...fadeIn} transition={{ delay: 0.4 }}>
            <h3 className="text-primary-gold font-black uppercase tracking-[0.3em] mb-10 text-[10px]">Contact Us</h3>
            <ul className="space-y-6">
              {[
                { icon: <FiPhone />, text: BRAND.phone },
                { icon: <FiMessageCircle />, text: `WhatsApp: ${BRAND.phone}` },
                { icon: <FiMail />, text: BRAND.email },
                { icon: <FiMapPin />, text: BRAND.address }
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4 group cursor-pointer">
                  <div className="text-primary-gold mt-1 group-hover:scale-125 transition-transform group-hover:text-primary-pink">{item.icon}</div>
                  <span className="text-sm text-gray-500 group-hover:text-white transition-colors font-medium">{item.text}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
        
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">
          <p>&copy; 2026 {BRAND.name}. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
            {['M-PESA', 'VISA', 'MASTERCARD', 'CASH ON DELIVERY'].map(item => (
              <span key={item} className="hover:text-white cursor-default transition-colors">{item}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
