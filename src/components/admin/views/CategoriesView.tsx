import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  LayoutGrid, 
  Loader2,
  CheckCircle2,
  XCircle,
  ImageIcon
} from 'lucide-react';
import apiClient from '@/api/client';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export const CategoriesView: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    isActive: true
  });

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/products/categories'); // Using products endpoint for categories
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiClient.post('/products/categories', {
        ...formData,
        slug: formData.name.toLowerCase().replace(/ /g, '-')
      });
      if (response.data.success) {
        toast.success("Category created successfully");
        setIsModalOpen(false);
        fetchCategories();
      }
    } catch (error) {
      toast.error("Creation failed");
    }
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="px-8 space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <LayoutGrid className="text-primary-gold" />
            Category Architecture
          </h2>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Manage store taxonomy and collections</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary-gold text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary-gold/20 flex items-center gap-2"
        >
          <Plus size={16} /> Create New Category
        </button>
      </div>

      {/* Search & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 h-4 w-4" />
          <input 
            type="text" 
            placeholder="Filter collections by name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-secondary-black border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-white outline-none focus:border-primary-gold/30 transition-all"
          />
        </div>
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex items-center justify-center gap-4">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Collections</span>
          <span className="text-xl font-black text-white">{categories.length}</span>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="h-10 w-10 text-primary-gold animate-spin" />
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Indexing Taxonomy...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredCategories.map((category, i) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="bg-secondary-black border border-white/5 rounded-[2.5rem] overflow-hidden group hover:border-primary-gold/20 transition-all duration-500"
            >
              <div className="h-48 relative overflow-hidden bg-primary-black">
                {category.imageUrl ? (
                  <img 
                    src={category.imageUrl} 
                    alt={category.name} 
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-slate-800">
                    <ImageIcon size={48} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${category.isActive ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-slate-500'}`} />
                    <span className="text-[9px] font-black text-white uppercase tracking-widest">{category.isActive ? 'Active' : 'Draft'}</span>
                  </div>
                  <h3 className="text-lg font-black text-white uppercase tracking-tight mt-1">{category.name}</h3>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed line-clamp-2">
                  {category.description || "No tactical description provided for this collection."}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <span className="text-[9px] font-black text-primary-gold uppercase tracking-widest">{category._count?.products || 0} Products</span>
                  <div className="flex items-center gap-2">
                    <button className="p-2.5 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-all"><Edit2 size={14} /></button>
                    <button className="p-2.5 rounded-xl bg-white/5 text-red-500/50 hover:bg-red-500/10 hover:text-red-500 transition-all"><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Creation Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md" 
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-secondary-black border border-white/10 w-full max-w-xl rounded-[3rem] p-10 relative z-10 shadow-2xl"
            >
              <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-2">New Category</h2>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-8">Define a new conceptual collection</p>

              <form onSubmit={handleCreate} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Collection Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g., Midnight Romance"
                    className="w-full bg-primary-black border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold text-white outline-none focus:border-primary-gold/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Visual Asset URL</label>
                  <input 
                    type="url" 
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-primary-black border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold text-white outline-none focus:border-primary-gold/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Manifesto (Description)</label>
                  <textarea 
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe the essence of this collection..."
                    className="w-full bg-primary-black border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold text-white outline-none focus:border-primary-gold/50 transition-all resize-none"
                  />
                </div>

                <div className="pt-4 flex items-center gap-4">
                  <button 
                    type="submit"
                    className="flex-1 bg-primary-gold text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary-gold/20"
                  >
                    Initialize Collection
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-8 bg-white/5 text-slate-500 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all"
                  >
                    Abort
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
