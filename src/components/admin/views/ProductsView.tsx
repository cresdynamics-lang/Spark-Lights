import React, { useEffect, useState } from 'react';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Loader2,
  AlertCircle,
  X,
  Save,
  Smartphone,
} from 'lucide-react';
import { updateProduct, uploadProductImage } from '@/api/products';
import apiClient from '@/api/client';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import PublicImage from '@/components/PublicImage';
import { isAllowedProductImageUrl } from '@/lib/productImages';
import { compressImageFile } from '@/lib/compressImage';
import { slugFromImageUrl } from '@/lib/slugFromImage';
import { ImageIcon } from 'lucide-react';

const emptyForm = {
  name: '',
  shortDescription: '',
  longDescription: '',
  priceKes: '',
  stockQty: '',
  categoryIds: [] as string[],
  imageUrl: '',
  isActive: true,
};

export const ProductsView: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const { user } = useAuthStore();
  const role = user?.role || 'FLORIST';
  const [formData, setFormData] = useState(emptyForm);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        apiClient.get('/products/admin/list'),
        apiClient.get('/products/categories'),
      ]);
      if (productsRes.data.success) {
        const list = productsRes.data.data as any[];
        const q = searchQuery.trim().toLowerCase();
        setProducts(
          q
            ? list.filter(
                (p) =>
                  p.name?.toLowerCase().includes(q) ||
                  p.slug?.toLowerCase().includes(q) ||
                  p.images?.[0]?.url?.toLowerCase().includes(q)
              )
            : list
        );
      }
      if (categoriesRes.data.success) setCategories(categoriesRes.data.data);
    } catch {
      setError('An error occurred while fetching catalog data');
      toast.error('Could not load products catalog');
    } finally {
      setIsLoading(false);
    }
  };

  const syncShowroomImages = async () => {
    if (!['OWNER', 'MANAGER'].includes(String(role))) return;
    setSyncing(true);
    try {
      const res = await apiClient.post('/products/sync-public-images');
      const n = res.data?.data?.created ?? 0;
      if (n > 0) {
        toast.success(`${n} showroom images added as products`);
        await fetchData();
      }
    } catch {
      /* ignore — route may not be live yet or already synced */
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    void (async () => {
      await fetchData();
    })();
  }, [searchQuery]);

  useEffect(() => {
    void syncShowroomImages();
    // Run once on mount so showroom images become editable products
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleCategory = (categoryId: string) => {
    setFormData((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter((id) => id !== categoryId)
        : [...prev.categoryIds, categoryId],
    }));
  };

  const openCreate = () => {
    setEditingProduct(null);
    setFormData(emptyForm);
    setIsModalOpen(true);
  };

  const openEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name ?? '',
      shortDescription: product.shortDescription ?? '',
      longDescription: product.longDescription ?? '',
      priceKes: String(product.variants?.[0]?.priceKes ?? ''),
      stockQty: String(product.variants?.[0]?.stockQty ?? ''),
      categoryIds:
        product.categories?.map((c: any) => c.categoryId ?? c.category?.id).filter(Boolean) ?? [],
      imageUrl: product.images?.[0]?.url ?? '',
      isActive: product.isActive ?? true,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.categoryIds.length === 0) {
      toast.error('Select at least one category');
      return;
    }
    if (!formData.imageUrl) {
      toast.error('Select a product image from the gallery');
      return;
    }

    const payload = {
      name: formData.name,
      shortDescription: formData.shortDescription || `${formData.name} — Spark Lights 254, Nairobi.`,
      longDescription: formData.longDescription || formData.shortDescription || `${formData.name} — Spark Lights 254, Nairobi.`,
      categoryIds: formData.categoryIds,
      isActive: formData.isActive,
      imageUrl: formData.imageUrl,
      variants: [
        {
          label: 'Default',
          priceKes: parseFloat(formData.priceKes),
          stockQty: parseInt(formData.stockQty, 10) || 0,
        },
      ],
    };

    try {
      if (editingProduct) {
        const response = await updateProduct(editingProduct.id, payload);
        if (response.success) {
          toast.success('Product saved — storefront updates on next page load');
          setIsModalOpen(false);
          fetchData();
        }
      } else {
        // Server will uniquify the slug if this name already exists
        const baseSlug =
          formData.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '') || slugFromImageUrl(formData.imageUrl);
        const response = await apiClient.post('/products', {
          ...payload,
          slug: baseSlug,
        });
        if (response.data.success) {
          toast.success('Product published to storefront');
          setIsModalOpen(false);
          fetchData();
        }
      }
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error
          ?.message ||
        (editingProduct ? 'Failed to update product' : 'Failed to add product');
      toast.error(message);
    }
  };

  const getStatus = (stock: number) => {
    if (stock === 0) return 'Out of Stock';
    if (stock < 10) return 'Low Stock';
    return 'Active';
  };

  const handleDeviceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please choose a photo from your phone or device');
      return;
    }

    setUploadingImage(true);
    try {
      const { base64 } = await compressImageFile(file);
      const response = await uploadProductImage(base64, file.name);
      if (!response.success || !response.data?.url) {
        throw new Error(response.error?.message || 'Upload failed');
      }

      setFormData((prev) => ({
        ...prev,
        imageUrl: response.data.url,
        ...(!prev.name ? { name: file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ') } : {}),
      }));
      toast.success('Photo compressed & uploaded to database storage');
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message ||
        (err as Error)?.message ||
        'Image upload failed';
      toast.error(message);
    } finally {
      setUploadingImage(false);
    }
  };

  const CategoryCheckboxes = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {categories.map((cat) => (
        <label
          key={cat.id}
          className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
            formData.categoryIds.includes(cat.id)
              ? 'border-primary-gold/50 bg-primary-gold/10'
              : 'border-white/10 bg-primary-black hover:border-white/20'
          }`}
        >
          <input
            type="checkbox"
            checked={formData.categoryIds.includes(cat.id)}
            onChange={() => toggleCategory(cat.id)}
            className="accent-primary-gold w-4 h-4"
          />
          <span className="text-[10px] font-black uppercase tracking-widest text-white">
            {cat.name}
          </span>
        </label>
      ))}
    </div>
  );

  return (
    <div className="space-y-8 px-8 pb-12">
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
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-primary-gold text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary-gold/20"
        >
          <Plus className="h-4 w-4" /> Add New Product
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="h-12 w-12 text-primary-gold animate-spin" />
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Fetching catalog...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500 opacity-50" />
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{error}</p>
          <button onClick={fetchData} className="text-[9px] font-black text-primary-gold uppercase tracking-widest hover:underline">
            Retry Connection
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.length === 0 && (
            <p className="col-span-full text-center text-slate-500 text-[10px] font-black uppercase tracking-widest py-12">
              {syncing ? 'Publishing showroom images as products…' : 'No products yet — add a new product'}
            </p>
          )}
          {products.map((product, i) => {
            const status = getStatus(product.variants?.[0]?.stockQty || 0);
            const categoryNames =
              product.categories?.map((c: any) => c.category?.name).filter(Boolean).join(', ') ||
              'Uncategorized';

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="group bg-secondary-black rounded-[2.5rem] border border-white/5 overflow-hidden hover:border-primary-pink/30 transition-all duration-500 shadow-2xl relative"
              >
                <div className="h-56 overflow-hidden relative bg-primary-black flex items-center justify-center text-slate-700">
                  <PublicImage
                    src={product.images?.[0]?.url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {!isAllowedProductImageUrl(product.images?.[0]?.url) && <ImageIcon size={32} />}
                  <div className="absolute top-4 right-4">
                    <span
                      className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                        status === 'Active'
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                          : status === 'Low Stock'
                            ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                            : 'bg-red-500/10 text-red-500 border-red-500/20'
                      }`}
                    >
                      {status}
                    </span>
                  </div>
                </div>

                <div className="p-8">
                  <p className="text-[9px] font-black text-primary-gold uppercase tracking-[0.2em] mb-2 line-clamp-2">
                    {categoryNames}
                  </p>
                  <h3 className="text-white font-black text-lg tracking-tight mb-4 group-hover:text-primary-pink transition-colors line-clamp-1">
                    {product.name}
                  </h3>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div>
                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Price</p>
                      <p className="text-white font-black text-sm mt-1">
                        KES {Number(product.variants?.[0]?.priceKes).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Stock</p>
                      <p
                        className={`font-black text-sm mt-1 ${product.variants?.[0]?.stockQty < 10 ? 'text-amber-500' : 'text-slate-300'}`}
                      >
                        {product.variants?.[0]?.stockQty || 0} units
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-8">
                    <button
                      onClick={() => openEdit(product)}
                      className="flex-1 bg-white/5 hover:bg-white/10 text-white py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                    >
                      <Edit3 size={12} /> Edit
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
              className="bg-secondary-black border border-white/10 w-full max-w-2xl rounded-[3rem] p-10 relative z-10 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                    {editingProduct ? 'Edit Product' : 'New Product'}
                  </h2>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">
                    Select one or more categories — product can appear in multiple
                  </p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-500 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                    Product Name
                  </label>
                  <input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-primary-black border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold text-white outline-none focus:border-primary-gold/50"
                    placeholder="e.g., Golden Round Chandelier"
                  />
                </div>

                <div className="space-y-3 md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                    Categories (select all that apply)
                  </label>
                  <CategoryCheckboxes />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                    Price (KES)
                  </label>
                  <input
                    required
                    type="number"
                    value={formData.priceKes}
                    onChange={(e) => setFormData({ ...formData, priceKes: e.target.value })}
                    className="w-full bg-primary-black border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold text-white outline-none focus:border-primary-gold/50"
                    placeholder="From filename (e.g. 3500) or custom"
                  />
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest ml-1">
                    Editable anytime — use the amount from the image name or set a custom price
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                    Stock Quantity
                  </label>
                  <input
                    required
                    type="number"
                    value={formData.stockQty}
                    onChange={(e) => setFormData({ ...formData, stockQty: e.target.value })}
                    className="w-full bg-primary-black border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold text-white outline-none focus:border-primary-gold/50"
                  />
                </div>

                <div className="space-y-3 md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                    Product Image
                  </label>

                  <div>
                    <label className="flex items-center justify-center gap-2 cursor-pointer bg-primary-gold/10 border border-dashed border-primary-gold/40 rounded-2xl py-4 px-4 hover:bg-primary-gold/20 transition-all">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploadingImage}
                        onChange={handleDeviceUpload}
                      />
                      {uploadingImage ? (
                        <Loader2 className="h-4 w-4 animate-spin text-primary-gold" />
                      ) : (
                        <Smartphone className="h-4 w-4 text-primary-gold" />
                      )}
                      <span className="text-[10px] font-black uppercase tracking-widest text-white">
                        {uploadingImage ? 'Compressing & uploading…' : 'Upload from device'}
                      </span>
                    </label>
                  </div>

                  {formData.imageUrl && (
                    <div className="flex items-center gap-4 p-3 rounded-xl border border-primary-gold/30 bg-primary-gold/5">
                      <PublicImage src={formData.imageUrl} alt="Selected" className="w-16 h-16 object-contain rounded-lg bg-black" />
                      <span className="text-[10px] text-slate-400 font-mono truncate">{formData.imageUrl}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                    Short Description
                  </label>
                  <input
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    className="w-full bg-primary-black border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold text-white outline-none focus:border-primary-gold/50"
                    placeholder="One line summary"
                  />
                </div>

                <div className="pt-6 md:col-span-2 flex items-center gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-primary-pink text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary-pink/20 flex items-center justify-center gap-2"
                  >
                    <Save size={14} /> {editingProduct ? 'Save Changes' : 'Add Product'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-8 bg-white/5 text-slate-500 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all"
                  >
                    Cancel
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
