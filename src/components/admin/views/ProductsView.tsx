import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Layers,
  Loader2,
  AlertCircle,
  X,
  ImageIcon,
  Save
} from 'lucide-react';
import { getProducts } from '@/api/products';
import apiClient from '@/api/client';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';

export const ProductsView: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuthStore();
  const role = user?.role || 'FLORIST';

  const [formData, setFormData] = useState({
    name: '',
    shortDescription: '',
    longDescription: '',
    priceKes: '',
    stockQty: '',
    categoryId: '',
    imageUrl: '',
    isActive: true
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        getProducts({ search: searchQuery }),
        apiClient.get('/products/categories')
      ]);
      if (productsRes.success) setProducts(productsRes.data);
      if (categoriesRes.data.success) setCategories(categoriesRes.data.data);
    } catch (err: any) {
      setError('An error occurred while fetching catalog data');
      toast.error('Could not load products catalog');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchQuery]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiClient.post('/products', {
        ...formData,
        priceKes: parseFloat(formData.priceKes),
        stockQty: parseInt(formData.stockQty),
        slug: formData.name.toLowerCase().replace(/ /g, '-'),
        variants: [{
          label: 'Default',
          priceKes: parseFloat(formData.priceKes),
          stockQty: parseInt(formData.stockQty)
        }]
      });
      if (response.data.success) {
        toast.success("Flower added to collection");
        setIsModalOpen(false);
        fetchData();
      }
    } catch (error) {
      toast.error("Failed to add product");
    }
  };

  const getStatus = (stock: number) => {
    if (stock === 0) return 'Out of Stock';
    if (stock < 10) return 'Low Stock';
    return 'Active';
  };

  return (
    <div className="space-y-8 px-8 pb-12">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-secondary-black p-2 rounded-2xl border border-white/5 flex items-center gap-3 px-4 shadow-xl focus-within:border-primary-gold/30 transition-all">
            <Search className="h-4 w-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="SEARCH CATALOG..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-[10px] font-black tracking-widest placeholder:text-slate-600 w-64 text-white uppercase"
            />
          </div>
          <button className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-secondary-black border border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">
            <Layers className="h-3.5 w-3.5" /> Filter by Type
          </button>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary-gold text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary-gold/20"
        >
          <Plus className="h-4 w-4" /> Add New Flower
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="h-12 w-12 text-primary-gold animate-spin" />
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Fetching Luxury Catalog...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500 opacity-50" />
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{error}</p>
          <button onClick={fetchData} className="text-[9px] font-black text-primary-gold uppercase tracking-widest hover:underline">Retry Connection</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, i) => {
            const status = getStatus(product.variants?.[0]?.stockQty || 0);
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="group bg-secondary-black rounded-[2.5rem] border border-white/5 overflow-hidden hover:border-primary-pink/30 transition-all duration-500 shadow-2xl relative"
              >
                <div className="h-56 overflow-hidden relative">
                  <img 
                    src={product.images?.[0]?.url || "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=400"} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 grayscale-[0.3] group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary-black to-transparent opacity-60" />
                  <div className="absolute top-4 right-4">
                    <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                      status === 'Active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                      status === 'Low Stock' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                      'bg-red-500/10 text-red-500 border-red-500/20'
                    }`}>
                      {status}
                    </span>
                  </div>
                </div>

                <div className="p-8">
                  <p className="text-[9px] font-black text-primary-gold uppercase tracking-[0.2em] mb-2">
                    {product.categories?.[0]?.category?.name || 'Luxury Collection'}
                  </p>
                  <h3 className="text-white font-black text-lg tracking-tight mb-4 group-hover:text-primary-pink transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div>
                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Price Point</p>
                      <p className="text-white font-black text-sm mt-1">KES {Number(product.variants?.[0]?.priceKes).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Stock</p>
                      <p className={`font-black text-sm mt-1 ${product.variants?.[0]?.stockQty < 10 ? 'text-amber-500' : 'text-slate-300'}`}>
                        {product.variants?.[0]?.stockQty || 0} units
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-8">
                    <button className="flex-1 bg-white/5 hover:bg-white/10 text-white py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                      <Edit3 size={12} /> Edit Detail
                    </button>
                    {role === 'OWNER' && (
                      <button className="p-3 rounded-2xl bg-white/5 text-slate-400 hover:text-red-500 transition-all">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Add Product Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md" 
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-secondary-black border border-white/10 w-full max-w-2xl rounded-[3rem] p-10 relative z-10 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">New Floral Product</h2>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Register a new masterpiece in the catalog</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-500 hover:text-white"><X size={24} /></button>
              </div>

              <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Product Name</label>
                  <input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-primary-black border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold text-white outline-none focus:border-primary-gold/50" placeholder="e.g., Midnight Rose Bouquet" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Category</label>
                  <select required value={formData.categoryId} onChange={(e) => setFormData({...formData, categoryId: e.target.value})} className="w-full bg-primary-black border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold text-white outline-none focus:border-primary-gold/50 appearance-none">
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Price (KES)</label>
                  <input required type="number" value={formData.priceKes} onChange={(e) => setFormData({...formData, priceKes: e.target.value})} className="w-full bg-primary-black border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold text-white outline-none focus:border-primary-gold/50" placeholder="3500" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Stock Quantity</label>
                  <input required type="number" value={formData.stockQty} onChange={(e) => setFormData({...formData, stockQty: e.target.value})} className="w-full bg-primary-black border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold text-white outline-none focus:border-primary-gold/50" placeholder="50" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Hero Image URL</label>
                  <input value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} className="w-full bg-primary-black border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold text-white outline-none focus:border-primary-gold/50" placeholder="https://..." />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Short Narrative</label>
                  <input value={formData.shortDescription} onChange={(e) => setFormData({...formData, shortDescription: e.target.value})} className="w-full bg-primary-black border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold text-white outline-none focus:border-primary-gold/50" placeholder="One line summary for catalog" />
                </div>

                <div className="pt-6 md:col-span-2 flex items-center gap-4">
                  <button type="submit" className="flex-1 bg-primary-pink text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary-pink/20 flex items-center justify-center gap-2">
                    <Save size={14} /> Catalog New Masterpiece
                  </button>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 bg-white/5 text-slate-500 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all">Abort</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
