import { motion } from 'framer-motion';
import { FaInstagram, FaFacebookF, FaTiktok } from 'react-icons/fa6';
import { BRAND } from '@/data/brand';

interface Social {
  label: string;
  href: string;
  Icon: typeof FaInstagram;
  className: string;
}

const SOCIALS: Social[] = [
  {
    label: 'Instagram',
    href: BRAND.instagramUrl,
    Icon: FaInstagram,
    className: 'bg-gradient-to-br from-[#feda75] via-[#d62976] to-[#4f5bd5] text-white',
  },
  {
    label: 'Facebook',
    href: BRAND.facebookUrl,
    Icon: FaFacebookF,
    className: 'bg-[#1877F2] text-white',
  },
  {
    label: 'TikTok',
    href: BRAND.tiktokUrl,
    Icon: FaTiktok,
    className: 'bg-black text-white border border-white/15',
  },
];

export default function SocialFloat() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
      className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-[200] flex flex-col gap-2.5 sm:gap-3"
    >
      {SOCIALS.map(({ label, href, Icon, className }) => (
        <motion.a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.94 }}
          className={`flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full shadow-lg shadow-black/40 backdrop-blur-sm transition-colors ${className}`}
        >
          <Icon size={18} className="sm:w-5 sm:h-5" />
        </motion.a>
      ))}
    </motion.div>
  );
}
