import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppFloatButton from '../components/WhatsAppFloatButton';

export default function StorefrontLayout() {
  return (
    <div className="min-h-screen bg-primary-black text-gray-200 selection:bg-primary-gold selection:text-black flex flex-col">
      <div className="bg-primary-gold text-black py-2 text-center text-[10px] font-bold uppercase tracking-widest relative z-[60]">
        💡 Prices in KES on every product | 🚚 Same-day Nairobi via Moto/Bolt from KES 500 | 📲 Chat on WhatsApp to Order
      </div>

      <Navbar />

      <main className="flex-grow pt-24 sm:pt-28">
        <Outlet />
      </main>

      <Footer />
      <WhatsAppFloatButton />
    </div>
  );
}
