import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Mail, 
  Phone, 
  UserPlus,
  ChevronRight,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { getCustomers } from '@/api/customers';
import toast from 'react-hot-toast';

export const CustomersView: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const response = await getCustomers({ search: searchQuery });
      if (response.success) {
        setCustomers(response.data);
      } else {
        setError(response.error?.message || 'Failed to fetch clients');
      }
    } catch (err: any) {
      setError('An error occurred while connecting to the database');
      toast.error('Connection Lost');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCustomers();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div className="space-y-8 px-8">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-tight">Client Directory</h2>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Manage relationships and customer history</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-secondary-black p-2 rounded-2xl border border-white/5 flex items-center gap-3 px-4 shadow-xl focus-within:border-primary-pink/30 transition-all">
            <Search className="h-4 w-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="SEARCH CLIENTS..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-[10px] font-black tracking-widest placeholder:text-slate-600 w-64 text-white uppercase"
            />
          </div>
          <button className="flex items-center gap-2 bg-primary-pink text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary-pink/20">
            <UserPlus className="h-4 w-4" /> Add Client
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="h-12 w-12 text-primary-pink animate-spin" />
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Accessing Client Records...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500 opacity-50" />
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{error}</p>
        </div>
      ) : (
        <div className="bg-secondary-black rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Client Name</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Contact Information</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Orders</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Investment</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer, i) => (
                  <motion.tr 
                    key={customer.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/[0.01] transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary-black border border-white/10 flex items-center justify-center text-primary-gold font-black text-sm group-hover:border-primary-pink transition-colors uppercase">
                          {customer.name.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-black text-white uppercase tracking-tight">{customer.name}</p>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">ID: {customer.id.slice(0, 8).toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 text-slate-400 group-hover:text-primary-pink transition-colors">
                          <Mail size={12} />
                          <span className="text-[11px] font-bold lowercase tracking-tight">{customer.email || 'no-email@set.com'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500">
                          <Phone size={12} />
                          <span className="text-[11px] font-bold tracking-tight">{customer.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="text-sm font-black text-white">{customer.orderCount || 0}</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-black text-primary-gold">KES {Number(customer.totalSpent || 0).toLocaleString()}</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                        customer.isVip ? 'bg-primary-gold/10 text-primary-gold border-primary-gold/20' : 
                        'bg-white/5 text-slate-400 border-white/10'
                      }`}>
                        {customer.isVip ? 'VIP' : 'REGULAR'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="p-3 rounded-full bg-white/5 text-slate-500 group-hover:text-white group-hover:bg-primary-gold transition-all">
                        <ChevronRight size={16} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {customers.length === 0 && (
              <div className="text-center py-20">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">No clients found matching your search.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
