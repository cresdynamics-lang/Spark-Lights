import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { 
  PackageIcon, 
  AlertTriangleIcon, 
  TrendingUpIcon, 
  ArrowUpRightIcon,
  SearchIcon,
  FilterIcon,
  PlusIcon,
  Flower2Icon,
  Loader2,
  AlertCircle
} from "lucide-react"
import { getInventory, getInventoryAlerts } from "@/api/inventory"
import toast from "react-hot-toast"

export const InventoryView = () => {
  const [items, setItems] = useState<any[]>([])
  const [alerts, setAlerts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [invRes, alertRes] = await Promise.all([
        getInventory(),
        getInventoryAlerts()
      ])
      
      if (invRes.success) setItems(invRes.data)
      if (alertRes.success) setAlerts(alertRes.data)
      
    } catch (err) {
      setError("Failed to synchronize inventory data")
      toast.error("Inventory Sync Error")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const topStats = [
    { 
      label: "Total Stems", 
      value: items.reduce((acc, item) => acc + (item.currentStemsQty || 0), 0).toLocaleString(), 
      icon: <Flower2Icon />, 
      color: "text-primary-gold" 
    },
    { 
      label: "Low Stock Items", 
      value: alerts.length.toString(), 
      icon: <AlertTriangleIcon />, 
      color: "text-red-500" 
    },
    { 
      label: "Inventory Value", 
      value: `KES ${(items.reduce((acc, item) => acc + (Number(item.currentStemsQty) * Number(item.costPerStemKes)), 0) / 1000).toFixed(1)}k`, 
      icon: <TrendingUpIcon />, 
      color: "text-primary-pink" 
    },
    { 
      label: "Freshness Index", 
      value: items.length > 0 ? `${(items.filter(i => i.freshness === 'FRESH').length / items.length * 100).toFixed(0)}%` : "0%", 
      icon: <ArrowUpRightIcon />, 
      color: "text-emerald-500" 
    },
  ]

  return (
    <div className="px-8 flex flex-col gap-8">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {topStats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-secondary-black p-6 rounded-2xl border border-white/5 group hover:border-primary-gold/30 transition-all shadow-xl"
          >
            <div className={`p-3 rounded-xl bg-white/5 w-fit mb-4 ${stat.color} group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-2xl font-black text-white mt-1 uppercase tracking-tighter">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4 bg-secondary-black rounded-3xl border border-white/5">
          <Loader2 className="h-12 w-12 text-primary-gold animate-spin" />
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Scanning Storage Vaults...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4 bg-secondary-black rounded-3xl border border-white/5">
          <AlertCircle className="h-12 w-12 text-red-500 opacity-50" />
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{error}</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-secondary-black rounded-3xl border border-white/5 overflow-hidden shadow-2xl"
        >
          <div className="p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-tight">Stock Inventory</h2>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Live tracking of flowers and supplies</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="SEARCH INVENTORY..." 
                  className="bg-primary-black border border-white/5 rounded-full py-3 pl-12 pr-6 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-primary-gold transition-all w-64 text-white"
                />
              </div>
              <button className="p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all">
                <FilterIcon className="h-4 w-4" />
              </button>
              <button className="flex items-center gap-2 bg-primary-gold text-white px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary-gold/20">
                <PlusIcon className="h-4 w-4" /> New Batch
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Item Name</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Type</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">In Stock</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Freshness</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.01] transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-primary-black border border-white/10 flex items-center justify-center text-primary-gold font-bold text-xs group-hover:border-primary-gold transition-colors">
                          {item.id.slice(-4).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-black text-white uppercase tracking-tight">{item.flowerName}</p>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">ID: {item.id.slice(0, 8).toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 py-1 rounded-full bg-white/5 border border-white/5">
                        {item.flowerType}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-black text-white">{item.currentStemsQty} Stems</span>
                        <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${item.currentStemsQty <= 20 ? 'bg-red-500' : 'bg-primary-gold'}`}
                            style={{ width: `${Math.min(100, (item.currentStemsQty / 100) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${
                          item.freshness === 'FRESH' ? 'text-emerald-500' : 
                          item.freshness === 'USE_TODAY' ? 'text-amber-500' : 'text-red-500'
                        }`}>
                          {item.freshness}
                        </span>
                        <div className={`h-2 w-2 rounded-full ${
                          item.freshness === 'FRESH' ? 'bg-emerald-500' : 
                          item.freshness === 'USE_TODAY' ? 'bg-amber-500' : 'bg-red-500'
                        }`} />
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                        item.currentStemsQty > 20 ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                        item.currentStemsQty > 0 ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                        'bg-red-500/10 text-red-500 border border-red-500/20'
                      }`}>
                        {item.currentStemsQty > 20 ? 'HEALTHY' : item.currentStemsQty > 0 ? 'LOW STOCK' : 'OUT OF STOCK'}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <button className="text-[10px] font-black text-primary-gold uppercase tracking-widest hover:text-white transition-colors">
                        Adjust
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {items.length === 0 && (
              <div className="text-center py-20">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Storage vault is currently empty.</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
}
