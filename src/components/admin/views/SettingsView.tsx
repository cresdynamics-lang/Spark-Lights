import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  GlobeIcon,
  BellIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  ExternalLinkIcon,
  SaveIcon,
  Loader2,
  AlertCircle,
  RefreshCcwIcon
} from "lucide-react"
import { getSettings } from "@/api/settings"
import toast from "react-hot-toast"

export const SettingsView = () => {
  const [settings, setSettings] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSettings = async () => {
    setIsLoading(true)
    try {
      const response = await getSettings()
      if (response.success) {
        setSettings(response.data)
      } else {
        setError(response.error?.message || "Failed to load system config")
      }
    } catch (err) {
      setError("Settings synchronization failed")
      toast.error("Database Link Failure")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  const settingsSections = [
    { title: "General", desc: "Global store configuration and metadata", icon: <GlobeIcon /> },
    { title: "Payments", desc: "Gateways, taxes, and checkout flow", icon: <CreditCardIcon /> },
    { title: "Security", desc: "Auth providers and API credentials", icon: <ShieldCheckIcon /> },
    { title: "Notifications", desc: "Email, WhatsApp, and push alerts", icon: <BellIcon /> },
    { title: "Integrations", desc: "Third-party platform connections", icon: <ExternalLinkIcon /> },
  ]

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4 bg-secondary-black rounded-[3rem] border border-white/5 mx-8">
        <Loader2 className="h-12 w-12 text-primary-gold animate-spin" />
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Scanning System Architecture...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4 bg-secondary-black rounded-[3rem] border border-white/5 mx-8 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 opacity-50" />
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{error}</p>
        <button 
          onClick={fetchSettings}
          className="text-[9px] font-black text-primary-gold uppercase tracking-widest hover:underline"
        >
          Attempt Re-link
        </button>
      </div>
    )
  }

  return (
    <div className="px-8 flex flex-col gap-8 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Navigation Column */}
        <div className="space-y-4">
          {settingsSections.map((section, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`w-full p-6 rounded-3xl border text-left transition-all flex items-center gap-4 group ${i === 0 ? 'bg-primary-gold/10 border-primary-gold/20 text-primary-gold' : 'bg-secondary-black border-white/5 text-slate-400 hover:border-white/10 hover:bg-white/[0.02]'
                }`}
            >
              <div className={`p-3 rounded-2xl ${i === 0 ? 'bg-primary-gold/20' : 'bg-white/5 group-hover:bg-white/10'}`}>
                {section.icon}
              </div>
              <div>
                <h3 className={`text-sm font-black uppercase tracking-tight ${i === 0 ? 'text-white' : 'group-hover:text-white'}`}>{section.title}</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-0.5">{section.desc}</p>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Form Column */}
        <div className="md:col-span-2 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-secondary-black rounded-3xl border border-white/5 p-8"
          >
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-xl font-black text-white uppercase tracking-tight">Store Identity</h2>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Basic identification and localization settings</p>
              </div>
              <button className="bg-primary-gold text-white px-6 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary-gold/20 flex items-center gap-2">
                <SaveIcon size={14} /> Save Changes
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Store Name</label>
                <input
                  type="text"
                  defaultValue={settings?.storeName || "Marigold Flowers Nairobi"}
                  className="w-full bg-primary-black border border-white/10 rounded-2xl py-4 px-6 text-sm font-black text-white focus:outline-none focus:border-primary-gold transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Support Email</label>
                <input
                  type="email"
                  defaultValue="concierge@marigold.com"
                  className="w-full bg-primary-black border border-white/10 rounded-2xl py-4 px-6 text-sm font-black text-white focus:outline-none focus:border-primary-gold transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Default Currency</label>
                <select className="w-full bg-primary-black border border-white/10 rounded-2xl py-4 px-6 text-sm font-black text-white focus:outline-none focus:border-primary-gold transition-all appearance-none">
                  <option selected={settings?.currency === 'KES'}>KES - Kenyan Shilling</option>
                  <option selected={settings?.currency === 'USD'}>USD - US Dollar</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Timezone</label>
                <select className="w-full bg-primary-black border border-white/10 rounded-2xl py-4 px-6 text-sm font-black text-white focus:outline-none focus:border-primary-gold transition-all appearance-none">
                  <option selected={settings?.timezone === 'Africa/Nairobi'}>(GMT+03:00) Nairobi, Kenya</option>
                  <option selected={settings?.timezone === 'UTC'}>(GMT+00:00) UTC</option>
                </select>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-white/5 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-tight">Maintenance Mode</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-0.5">Disable customer-facing website for updates</p>
                </div>
                <div className="w-12 h-6 bg-white/5 border border-white/10 rounded-full relative cursor-pointer group">
                  <div className="absolute top-1 left-1 h-3.5 w-3.5 bg-slate-500 rounded-full transition-all group-hover:bg-slate-400" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-tight">Auto-Archive Orders</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-0.5">Move completed orders to history after 30 days</p>
                </div>
                <div className="w-12 h-6 bg-emerald-500/20 border border-emerald-500/40 rounded-full relative cursor-pointer group">
                  <div className="absolute top-1 right-1 h-3.5 w-3.5 bg-emerald-500 rounded-full transition-all shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-primary-pink/[0.03] rounded-3xl border border-primary-pink/10 p-8 flex items-center justify-between group"
          >
            <div className="flex items-center gap-6">
              <div className="p-4 bg-primary-pink/10 rounded-2xl text-primary-pink group-hover:animate-spin transition-all duration-1000">
                <RefreshCcwIcon size={24} />
              </div>
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-tight">Sync Global Cache</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-0.5">Refresh all product data across CDN nodes</p>
              </div>
            </div>
            <button className="text-[10px] font-black uppercase tracking-widest text-primary-pink border border-primary-pink/20 px-6 py-2.5 rounded-full hover:bg-primary-pink hover:text-white transition-all">
              Purge Cache
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

