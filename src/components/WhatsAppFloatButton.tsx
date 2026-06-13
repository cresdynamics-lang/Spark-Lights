import { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa6';
import { motion, AnimatePresence } from 'framer-motion';
import { BRAND } from '../data/brand';

const WHATSAPP_MESSAGE = encodeURIComponent('Hi Spark Lights 254! I want to order lights — please confirm stock and delivery.');

export default function WhatsAppFloatButton() {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[200] flex flex-col items-end gap-2 sm:gap-3"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: 8, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="rounded-full bg-white px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-gray-800 shadow-lg max-w-[10rem] sm:max-w-none sm:whitespace-nowrap text-right leading-tight"
          >
            Chat on WhatsApp to Order
          </motion.div>
        )}
      </AnimatePresence>

      <motion.a
        href={`${BRAND.whatsappUrl}?text=${WHATSAPP_MESSAGE}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp to Order"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_20px_rgba(37,211,102,0.45)] transition-colors hover:bg-[#20bd5a]"
      >
        <FaWhatsapp size={24} className="sm:w-7 sm:h-7" />
      </motion.a>
    </div>
  );
}
