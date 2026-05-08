import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiMessageCircle, FiPhone, FiMail, FiMapPin } from 'react-icons/fi';
import { motion } from 'framer-motion';

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: "easeOut" }
};

export default function Footer() {
  return (
    <footer className="pt-24 sm:pt-32 pb-12 bg-primary-black border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          <motion.div {...fadeIn}>
            <Link to="/" className="font-serif text-3xl font-extrabold text-primary-pink mb-8 block tracking-tighter">MARIGOLD</Link>
            <p className="text-gray-500 leading-relaxed mb-8 italic text-sm">
              "Fresh flowers, crafted with love. Delivered to your door across Nairobi. Where every petal tells a story."
            </p>
            <div className="flex gap-4">
              {[FiInstagram, FiFacebook, FiMessageCircle].map((Icon, i) => (
                <motion.a 
                  key={i}
                  whileHover={{ scale: 1.2, color: "#ff1493", borderColor: "#ff1493" }}
                  href="#" 
                  className="w-10 h-10 border border-white/10 flex items-center justify-center rounded-full transition-all text-gray-500"
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </motion.div>
          
          <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
            <h3 className="text-primary-pink font-black uppercase tracking-[0.3em] mb-10 text-[10px]">Quick Links</h3>
            <ul className="space-y-4">
              {[
                { name: 'Home', path: '/' },
                { name: 'Shop', path: '/shop' },
                { name: 'About Us', path: '/about' },
                { name: 'Contact', path: '/contact' },
                { name: 'FAQs', path: '/faq' },
                { name: 'Delivery Info', path: '/delivery' },
                { name: 'Refund Policy', path: '/refund-policy' }
              ].map(item => (
                <li key={item.name}><Link to={item.path} className="text-sm text-gray-500 hover:text-primary-pink transition-colors font-medium">{item.name}</Link></li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div {...fadeIn} transition={{ delay: 0.3 }}>
            <h3 className="text-primary-pink font-black uppercase tracking-[0.3em] mb-10 text-[10px]">Categories</h3>
            <ul className="space-y-4">
              {['Birthday Flowers', 'Anniversary', 'Wedding Flowers', 'Sympathy', 'Corporate', 'Roses', 'Orchids', 'Sunflowers'].map(item => (
                <li key={item}><Link to={`/shop?category=${item.toLowerCase()}`} className="text-sm text-gray-500 hover:text-primary-pink transition-colors font-medium">{item}</Link></li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div {...fadeIn} transition={{ delay: 0.4 }}>
            <h3 className="text-primary-pink font-black uppercase tracking-[0.3em] mb-10 text-[10px]">Contact Us</h3>
            <ul className="space-y-6">
              {[
                { icon: <FiPhone />, text: '+254 700 000 000' },
                { icon: <FiMessageCircle />, text: 'WhatsApp: +254 700 000 000' },
                { icon: <FiMail />, text: 'info@marigold.co.ke' },
                { icon: <FiMapPin />, text: 'Westlands, Nairobi, Kenya' }
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4 group cursor-pointer">
                  <div className="text-primary-pink mt-1 group-hover:scale-125 transition-transform">{item.icon}</div>
                  <span className="text-sm text-gray-500 group-hover:text-white transition-colors font-medium">{item.text}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
        
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">
          <p>&copy; 2026 Marigold Flowers Kenya. All rights reserved.</p>
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
