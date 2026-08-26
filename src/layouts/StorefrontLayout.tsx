import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppFloatButton from '../components/WhatsAppFloatButton';
import { BRAND } from '../data/brand';

export default function StorefrontLayout() {
  return (
    <div className="min-h-screen bg-primary-black text-gray-200 selection:bg-primary-gold selection:text-black flex flex-col">
      <header className="fixed top-0 inset-x-0 z-[100]">
        {/* Promo / utility bar */}
        <div className="bg-primary-gold text-black text-[10px] sm:text-[11px] font-bold uppercase tracking-widest">
          <div className="container mx-auto px-6 h-9 flex items-center justify-between gap-4">
            <span className="truncate">
              Free same-day Nairobi delivery on orders over KES {BRAND.freeDeliveryThreshold ?? 3000}
            </span>
            <a
              href={BRAND.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline hover:underline whitespace-nowrap"
            >
              Order on WhatsApp
            </a>
          </div>
        </div>

        <Navbar />
      </header>

      <main className="flex-grow pt-28 sm:pt-32">
        <Outlet />
      </main>

      <Footer />
      <WhatsAppFloatButton />
    </div>
  );
}
