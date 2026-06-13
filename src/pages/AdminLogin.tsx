import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, Loader2, Flower2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { login as loginApi } from '@/api/auth';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await loginApi({ email, password });
      if (response.success) {
        login(response.data.staff, response.data.accessToken, response.data.refreshToken);
        toast.success('Welcome back, ' + response.data.staff.name);
        navigate('/admin', { replace: true });
      } else {
        toast.error(response.error?.message || 'Login failed');
      }
    } catch (error: any) {
      const message =
        error.response?.data?.error?.message ||
        (error.code === 'ERR_NETWORK'
          ? 'Cannot reach the API. Run npm run dev and wait for "API ready at http://localhost:3001".'
          : 'An error occurred during login');
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-gold/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-pink/10 rounded-full blur-[120px]" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-secondary-black border border-white/5 rounded-[2.5rem] p-10 shadow-2xl backdrop-blur-xl">
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-primary-gold/10 rounded-2xl flex items-center justify-center mb-4 border border-primary-gold/20">
              <Flower2 className="h-8 w-8 text-primary-gold" />
            </div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Spark Lights Admin</h1>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Executive Portal Access</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-primary-gold transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-primary-black border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-white font-bold outline-none focus:border-primary-gold/30 transition-all placeholder:text-slate-700"
                  placeholder="mary@sparklights.co.ke"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-primary-gold transition-colors" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-primary-black border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-white font-bold outline-none focus:border-primary-gold/30 transition-all placeholder:text-slate-700"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary-gold hover:bg-primary-gold/90 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 uppercase text-xs tracking-widest shadow-xl shadow-primary-gold/20"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <LogIn className="h-5 w-5" /> Access Portal
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-10 text-center">
            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">
              Authorized personnel only. Access is monitored and logged.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
