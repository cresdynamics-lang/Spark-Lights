import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { 
  TicketIcon, 
  PercentIcon, 
  CalendarIcon, 
  ClockIcon,
  PlusIcon,
  SearchIcon,
  Trash2Icon,
  Edit3Icon,
  CheckCircle2Icon,
  Loader2,
  AlertCircle
} from "lucide-react"
import { getCoupons } from "@/api/discounts"
import toast from "react-hot-toast"

export const DiscountsView = () => {
  const [coupons, setCoupons] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchCoupons = async () => {
    setIsLoading(true);
    try {
      const response = await getCoupons();
      if (response.success) {
        setCoupons(response.data);
      } else {
        setError(response.error?.message || 'Failed to fetch coupons');
      }
    } catch (err: any) {
      setError('Connection to promotion engine failed');
      toast.error('Could not sync discounts');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const filteredCoupons = coupons.filter(coupon => 
    coupon.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="px-8 flex flex-col gap-8">
      {/* Header with Stats */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 bg-secondary-black p-8 rounded-3xl border border-white/5 flex items-center justify-between group overflow-hidden relative">
          <div className="relative z-10">
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Total Savings Generated</p>
            <h3 className="text-4xl font-black text-white">KES 145,200</h3>
            <div className="flex items-center gap-2 mt-4">
              <span className="text-primary-pink font-bold text-xs">+12% from last month</span>
            </div>
          </div>
          <div className="relative z-10 h-24 w-24 bg-primary-pink/10 rounded-full flex items-center justify-center text-primary-pink group-hover:scale-110 transition-transform duration-500">
            <TicketIcon size={40} />
          </div>
          {/* Abstract background element */}
          <div className="absolute -right-10 -bottom-10 h-40 w-40 bg-primary-pink/5 rounded-full blur-3xl" />
        </div>

        <div className="grid grid-cols-2 gap-6 w-full md:w-1/3">
          <div className="bg-secondary-black p-6 rounded-3xl border border-white/5 flex flex-col justify-center">
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Active Coupons</p>
            <h4 className="text-2xl font-black text-white mt-1">{coupons.filter(c => c.isActive).length}</h4>
          </div>
          <div className="bg-secondary-black p-6 rounded-3xl border border-white/5 flex flex-col justify-center border-primary-gold/20">
            <p className="text-primary-gold text-[10px] font-black uppercase tracking-[0.2em]">Most Used Code</p>
            <h4 className="text-2xl font-black text-white mt-1">GIFT50</h4>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-secondary-black rounded-3xl border border-white/5 overflow-hidden shadow-2xl"
      >
        <div className="p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/[0.01]">
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">Campaigns & Coupons</h2>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Manage promotional codes and discounts</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="SEARCH CODES..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-primary-black border border-white/5 rounded-full py-3 pl-12 pr-6 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-primary-pink transition-all w-64 text-white"
              />
            </div>
            <button className="flex items-center gap-2 bg-primary-pink text-white px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary-pink/20">
              <PlusIcon className="h-4 w-4" /> Create Coupon
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="h-12 w-12 text-primary-pink animate-spin" />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Scanning Promotion Database...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <AlertCircle className="h-12 w-12 text-red-500 opacity-50" />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-8 gap-6">
            {filteredCoupons.length === 0 ? (
              <div className="col-span-full text-center py-20">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">No promotion codes available.</p>
              </div>
            ) : filteredCoupons.map((coupon, i) => (
              <motion.div
                key={coupon.id || i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className={`p-6 rounded-2xl border ${
                  coupon.isActive ? 'border-primary-gold/20 bg-primary-gold/[0.02]' : 
                  'border-white/5 opacity-50 grayscale'
                } group relative overflow-hidden`}
              >
                {/* Ticket Notch effect */}
                <div className="absolute top-1/2 -left-3 h-6 w-6 bg-primary-black rounded-full border border-white/5 -translate-y-1/2" />
                <div className="absolute top-1/2 -right-3 h-6 w-6 bg-primary-black rounded-full border border-white/5 -translate-y-1/2" />

                <div className="flex justify-between items-start mb-6">
                  <div className={`p-2 rounded-lg ${coupon.isActive ? 'bg-primary-gold/20 text-primary-gold' : 'bg-white/10 text-slate-400'}`}>
                    <PercentIcon size={20} />
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                    coupon.isActive ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                    'bg-slate-500/10 text-slate-500 border border-slate-500/20'
                  }`}>
                    {coupon.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <h3 className="text-2xl font-black text-white tracking-tighter mb-1">{coupon.code}</h3>
                <p className="text-primary-pink font-black text-sm uppercase mb-4">
                  {coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}%` : `KES ${coupon.discountValue}`} OFF
                </p>

                <div className="space-y-3 pt-4 border-t border-dashed border-white/10">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    <span className="flex items-center gap-2"><CalendarIcon size={12} /> Expires</span>
                    <span className="text-white">{coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : 'No Limit'}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    <span className="flex items-center gap-2"><ClockIcon size={12} /> Usage</span>
                    <span className="text-white">{coupon.usedCount} / {coupon.usageLimit || '∞'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-6">
                  <button className="flex-1 py-2 rounded-lg bg-white/5 text-[9px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-colors">
                    <Edit3Icon size={12} className="inline mr-2" /> Edit
                  </button>
                  <button className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors">
                    <Trash2Icon size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}

