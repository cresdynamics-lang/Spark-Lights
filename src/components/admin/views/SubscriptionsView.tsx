import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { 
  CalendarRangeIcon, 
  RefreshCcwIcon, 
  CreditCardIcon, 
  HeartIcon,
  PlusIcon,
  SearchIcon,
  FilterIcon,
  ChevronRightIcon,
  CheckCircle2Icon,
  Loader2,
  AlertCircle
} from "lucide-react"
import { getSubscriptions } from "@/api/subscriptions"
import toast from "react-hot-toast"

export const SubscriptionsView = () => {
  const [subscriptions, setSubscriptions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchSubscriptions = async () => {
    setIsLoading(true);
    try {
      const response = await getSubscriptions();
      if (response.success) {
        setSubscriptions(response.data);
      } else {
        setError(response.error?.message || 'Failed to fetch subscriptions');
      }
    } catch (err: any) {
      setError('Subscription management system offline');
      toast.error('Data synchronization failed');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const filteredSubscriptions = subscriptions.filter(sub => 
    sub.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="px-8 flex flex-col gap-8">
      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-primary-pink/20 to-transparent p-8 rounded-3xl border border-primary-pink/10 group">
          <div className="flex justify-between items-start mb-6">
            <div className="p-4 bg-primary-pink/20 rounded-2xl text-primary-pink group-hover:rotate-12 transition-transform">
              <CalendarRangeIcon size={24} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-primary-pink bg-primary-pink/5 px-3 py-1 rounded-full">Recurring Revenue</span>
          </div>
          <h3 className="text-4xl font-black text-white">KES 842k</h3>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">Monthly Forecast</p>
        </div>

        <div className="bg-secondary-black p-8 rounded-3xl border border-white/5 group">
          <div className="flex justify-between items-start mb-6">
            <div className="p-4 bg-primary-gold/10 rounded-2xl text-primary-gold group-hover:-rotate-12 transition-transform">
              <RefreshCcwIcon size={24} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Active Plans</span>
          </div>
          <h3 className="text-4xl font-black text-white">{subscriptions.filter(s => s.status === 'ACTIVE').length}</h3>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">Total Managed Subscriptions</p>
        </div>

        <div className="bg-secondary-black p-8 rounded-3xl border border-white/5 group">
          <div className="flex justify-between items-start mb-6">
            <div className="p-4 bg-white/5 rounded-2xl text-white group-hover:scale-110 transition-transform">
              <HeartIcon size={24} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Retention Rate</span>
          </div>
          <h3 className="text-4xl font-black text-white">94%</h3>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">Last 90 Days Average</p>
        </div>
      </div>

      {/* Main Table Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-secondary-black rounded-3xl border border-white/5 overflow-hidden shadow-2xl"
      >
        <div className="p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">Recurring Subscriptions</h2>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Automated floral delivery management</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="SEARCH PLANS..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-primary-black border border-white/5 rounded-full py-3 pl-12 pr-6 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-primary-gold transition-all w-64 text-white"
              />
            </div>
            <button className="flex items-center gap-2 bg-primary-gold text-white px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary-gold/20">
              <PlusIcon className="h-4 w-4" /> New Plan
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="h-12 w-12 text-primary-gold animate-spin" />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Accessing Subscription Logs...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <AlertCircle className="h-12 w-12 text-red-500 opacity-50" />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{error}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Subscription ID</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Customer</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Plan Details</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Next Delivery</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Billing</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest"></th>
                </tr>
              </thead>
              <tbody>
                {filteredSubscriptions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-8 py-20 text-center">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">No recurring plans found.</p>
                    </td>
                  </tr>
                ) : filteredSubscriptions.map((sub, i) => (
                  <tr key={sub.id || i} className="border-b border-white/5 hover:bg-white/[0.01] transition-colors group cursor-pointer">
                    <td className="px-8 py-6">
                      <span className="text-[11px] font-black text-white">{sub.id.slice(0, 8)}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary-black border border-white/10 flex items-center justify-center text-primary-pink font-bold text-[10px]">
                          {sub.customer?.name.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        <span className="text-sm font-black text-white uppercase tracking-tight">{sub.customer?.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-300">{sub.product?.name || 'Custom Plan'}</span>
                        <CheckCircle2Icon size={14} className="text-emerald-500" />
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-slate-400">
                        <CalendarRangeIcon size={14} />
                        <span className="text-[11px] font-bold uppercase tracking-widest">
                          {sub.nextDeliveryDate ? new Date(sub.nextDeliveryDate).toLocaleDateString() : 'TBD'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-white">KES {sub.amount}</span>
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.1em]">
                          {sub.interval} BILLING
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                        sub.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                        'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      }`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="p-2 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-all text-white">
                        <ChevronRightIcon size={16} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  )
}

