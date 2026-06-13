import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  UserPlus, 
  Mail, 
  Shield, 
  Key,
  ChevronRight,
  Search,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { getStaff } from '@/api/staff';
import toast from 'react-hot-toast';
import AvatarInitials from '@/components/AvatarInitials';
import PublicImage from '@/components/PublicImage';
import { isPublicImageUrl } from '@/lib/publicImages';

export const StaffView: React.FC = () => {
  const [staff, setStaff] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchStaff = async () => {
    setIsLoading(true);
    try {
      const response = await getStaff();
      if (response.success) {
        setStaff(response.data);
      } else {
        setError(response.error?.message || 'Failed to fetch team members');
      }
    } catch (err: any) {
      setError('An error occurred while connecting to the database');
      toast.error('Staff Directory Offline');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const filteredStaff = staff.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 px-8">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-tight">Team & Permissions</h2>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Manage staff access and security roles</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-secondary-black p-2 rounded-2xl border border-white/5 flex items-center gap-3 px-4 shadow-xl">
            <Search className="h-4 w-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="SEARCH STAFF..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-[10px] font-black tracking-widest placeholder:text-slate-600 w-48 text-white uppercase"
            />
          </div>
          <button className="flex items-center gap-2 bg-primary-gold text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary-gold/20">
            <UserPlus className="h-4 w-4" /> Invite Staff
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="h-12 w-12 text-primary-gold animate-spin" />
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Synchronizing Team Data...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500 opacity-50" />
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Staff Cards */}
          <div className="md:col-span-2 space-y-4">
            {filteredStaff.length === 0 ? (
              <div className="text-center py-20 bg-secondary-black rounded-3xl border border-white/5">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">No team members found.</p>
              </div>
            ) : filteredStaff.map((member, i) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group"
              >
                <div className="bg-secondary-black border border-white/5 p-6 rounded-3xl hover:border-primary-gold/30 transition-all duration-500 cursor-pointer flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className="relative">
                      <div className="h-14 w-14 rounded-2xl bg-primary-black border border-white/10 flex items-center justify-center text-primary-gold font-black text-lg overflow-hidden group-hover:border-primary-gold transition-colors">
                        {isPublicImageUrl(member.avatarUrl) ? (
                          <PublicImage
                            src={member.avatarUrl}
                            alt={member.name}
                            className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                          />
                        ) : (
                          <AvatarInitials name={member.name} className="h-full w-full text-lg" />
                        )}
                      </div>
                      {member.isActive && (
                        <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-emerald-500 border-4 border-secondary-black rounded-full" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-black text-white uppercase tracking-tight">{member.name}</h3>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[9px] font-black uppercase tracking-widest text-primary-gold bg-primary-gold/10 px-2 py-0.5 rounded-md border border-primary-gold/20">{member.role}</span>
                        <span className="text-[10px] font-bold text-slate-500 lowercase">{member.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Status</p>
                      <p className={`text-[11px] font-bold mt-1 ${member.isActive ? 'text-emerald-500' : 'text-red-500'}`}>
                        {member.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </p>
                    </div>
                    <button className="p-3 rounded-full bg-white/5 text-slate-500 group-hover:text-white group-hover:bg-primary-gold transition-all">
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Permissions / Quick Info */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-primary-pink/5 rounded-[2rem] border border-primary-pink/10 p-8"
            >
              <div className="p-4 bg-primary-pink/10 rounded-2xl text-primary-pink w-fit mb-6">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">Role Management</h3>
              <p className="text-slate-400 text-xs font-bold leading-relaxed">
                Define custom access levels for florists, delivery team, and managers. Keep your store data secure while empowering your team.
              </p>
              <button className="w-full mt-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-primary-pink hover:border-primary-pink transition-all">
                Manage Roles
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-secondary-black rounded-[2rem] border border-white/5 p-8"
            >
              <h3 className="text-sm font-black text-white uppercase tracking-[0.1em] mb-6 flex items-center gap-2">
                <Key size={16} className="text-primary-gold" /> Access Rules
              </h3>
              <div className="space-y-4">
                <div className="flex gap-4 items-start pb-4 border-b border-white/5 last:border-0 last:pb-0">
                  <div className="h-2 w-2 rounded-full bg-primary-gold mt-1.5 shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold text-white uppercase tracking-tight">MFA Required</p>
                    <p className="text-[9px] text-slate-500 uppercase tracking-widest mt-0.5">For all administrative accounts</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start pb-4 border-b border-white/5 last:border-0 last:pb-0">
                  <div className="h-2 w-2 rounded-full bg-primary-gold mt-1.5 shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold text-white uppercase tracking-tight">IP Whitelisting</p>
                    <p className="text-[9px] text-slate-500 uppercase tracking-widest mt-0.5">Restricted to office network</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

