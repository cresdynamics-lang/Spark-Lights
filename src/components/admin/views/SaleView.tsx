import React, { useEffect, useState } from 'react';
import { BadgePercentIcon, Loader2, Link2, Copy, Check, ArrowUpDown } from 'lucide-react';
import apiClient from '@/api/client';
import { toggleProductSale } from '@/api/products';
import toast from 'react-hot-toast';
import PublicImage from '@/components/PublicImage';

const emptySale: Record<string, never> = {};

export const SaleView: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [csvUrl, setCsvUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/products/admin/list');
      const list = res.data.success ? (res.data.data as any[]) : [];
      const sorted = list
        .slice()
        .sort((a, b) => (a.saleSortOrder || 0) - (b.saleSortOrder || 0));
      setProducts(sorted);
    } catch {
      toast.error('Could not load catalog');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchData();
    setCsvUrl(`${window.location.origin}/v1/products/sale.csv`);
  }, []);

  const toggle = async (product: any) => {
    const next = !product.isOnSale;
    const previous = product.isOnSale;

    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, isOnSale: next } : p))
    );

    try {
      const res = await toggleProductSale(product.id, { isOnSale: next });
      if (!res.success) throw new Error('update failed');
      toast.success(next ? 'Added to sale' : 'Removed from sale');
    } catch {
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, isOnSale: previous } : p))
      );
      toast.error('Could not update sale status');
    }
  };

  const copyCsv = async () => {
    try {
      await navigator.clipboard.writeText(csvUrl);
      setCopied(true);
      toast.success('CSV link copied');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Copy failed — select the link manually');
    }
  };

  const saleCount = products.filter((p) => p.isOnSale).length;

  return (
    <div className="space-y-8 px-3 sm:px-8 pb-12">
      {/* CSV feed banner */}
      <div className="bg-secondary-black border border-primary-gold/20 rounded-[2rem] p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-primary-gold/10 text-primary-gold">
            <BadgePercentIcon className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-white font-black uppercase tracking-tight text-sm sm:text-base">
              Meta Catalog Feed
            </h3>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1 max-w-xl">
              {saleCount} product{saleCount === 1 ? '' : 's'} on sale — up to 10 are boosted as a Meta carousel ad.
              Paste this CSV link into a Meta catalog scheduled feed.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <div className="flex-1 lg:w-96 flex items-center gap-2 bg-primary-black border border-white/10 rounded-xl px-3 py-3 text-slate-400 text-[10px] font-mono truncate">
            <Link2 className="h-4 w-4 shrink-0" />
            <span className="truncate">{csvUrl}</span>
          </div>
          <button
            onClick={copyCsv}
            className="flex items-center gap-2 bg-primary-gold text-white px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shrink-0"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <a
            href={csvUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 bg-white/5 text-white px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all shrink-0"
          >
            Open
          </a>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="h-12 w-12 text-primary-gold animate-spin" />
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Fetching catalog…</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => {
            const isSale = !!product.isOnSale;
            return (
              <div
                key={product.id}
                className={`group bg-secondary-black rounded-2xl sm:rounded-[2rem] border overflow-hidden transition-all duration-300 ${
                  isSale ? 'border-primary-gold/50 shadow-lg shadow-primary-gold/10' : 'border-white/5'
                }`}
              >
                <div className="h-28 sm:h-48 overflow-hidden relative bg-primary-black flex items-center justify-center">
                  <PublicImage
                    src={product.images?.[0]?.url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {isSale && (
                    <span className="absolute top-2 left-2 bg-primary-gold text-black text-[8px] font-black uppercase px-2 py-0.5 sm:px-3 sm:py-1 z-10">
                      On Sale
                    </span>
                  )}
                </div>

                <div className="p-3 sm:p-5">
                  <h3 className="text-white font-black text-[10px] sm:text-sm tracking-tight mb-2 sm:mb-4 line-clamp-2 group-hover:text-primary-pink transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-[7px] sm:text-[9px] font-black text-slate-500 uppercase tracking-widest">
                    KES {Number(product.variants?.[0]?.priceKes).toLocaleString()}
                  </p>

                  <button
                    onClick={() => toggle(product)}
                    className={`mt-3 sm:mt-5 w-full py-2 sm:py-3 rounded-xl sm:rounded-2xl text-[8px] sm:text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                      isSale
                        ? 'bg-primary-gold/10 text-primary-gold hover:bg-primary-gold/20'
                        : 'bg-white/5 text-white hover:bg-white/10'
                    }`}
                  >
                    <ArrowUpDown size={12} />
                    {isSale ? 'Remove from Sale' : 'Add to Sale'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
