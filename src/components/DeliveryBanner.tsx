import { Link } from 'react-router-dom';
import { FiTruck, FiPackage, FiMapPin } from 'react-icons/fi';
import { DELIVERY_RATES } from '../data/conversion';

export default function DeliveryBanner({ compact = false }: { compact?: boolean }) {
  const rates = [
    { icon: <FiTruck />, ...DELIVERY_RATES.nairobiSameDay },
    { icon: <FiPackage />, ...DELIVERY_RATES.countrywide },
    { icon: <FiMapPin />, ...DELIVERY_RATES.pickup },
  ];

  if (compact) {
    return (
      <div className="flex flex-wrap gap-4 text-[10px] font-black uppercase tracking-widest text-gray-500">
        <span className="text-primary-gold">🚚 {DELIVERY_RATES.nairobiSameDay.detail}</span>
        <span>·</span>
        <span>{DELIVERY_RATES.countrywide.detail}</span>
        <span>·</span>
        <Link to="/delivery" className="text-primary-gold hover:underline">Full delivery rates →</Link>
      </div>
    );
  }

  return (
    <section className="py-12 border-y border-white/5 bg-secondary-black/50">
      <div className="container mx-auto px-6">
        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary-gold mb-6 text-center">
          Clear Delivery Rates, No Surprises
        </h2>
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {rates.map((rate) => (
            <div key={rate.label} className="p-2 sm:p-4 border border-white/5 bg-primary-black text-center">
              <div className="text-primary-gold text-base sm:text-xl mb-2 flex justify-center">{rate.icon}</div>
              <h3 className="text-white font-black uppercase text-[9px] sm:text-xs tracking-tight mb-1">{rate.label}</h3>
              <p className="text-primary-gold font-black text-xs sm:text-base mb-1">{rate.fee}</p>
              <p className="text-gray-500 text-[9px] sm:text-xs leading-relaxed">{rate.detail.replace(' — ', ': ')}</p>
              {'freeOver' in rate && rate.freeOver && (
                <p className="text-[8px] sm:text-[10px] text-emerald-500 font-bold uppercase tracking-widest mt-2">{rate.freeOver}</p>
              )}
            </div>
          ))}
        </div>
        <p className="text-center mt-8">
          <Link to="/delivery" className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-primary-gold transition-colors">
            View full delivery policy →
          </Link>
        </p>
      </div>
    </section>
  );
}
