import React, { useEffect, useState } from 'react';
import {
  Plus, Search, Edit2, Trash2, FileText, Loader2, ExternalLink, Eye, EyeOff,
  Upload, Smartphone, ImageIcon,
} from 'lucide-react';
import { getAdminBlogs, createBlog, updateBlog, deleteBlog } from '@/api/blogs';
import { uploadBlogImage } from '@/api/products';
import type { BlogPost, BlogSection } from '@/types/blog';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import PublicImage from '@/components/PublicImage';
import { isAllowedProductImageUrl } from '@/lib/productImages';
import { BLOG_DEFAULT_IMAGE, BLOG_IMAGE_PRESETS } from '@/data/blogDefaults';
import { compressImageFile } from '@/lib/compressImage';
import apiClient from '@/api/client';

const emptySection = (): BlogSection => ({ heading: '', paragraphs: [''] });

const emptyForm = {
  title: '',
  slug: '',
  excerpt: '',
  category: 'Buying Guide',
  readMinutes: 5,
  publishedAt: new Date().toISOString().slice(0, 10),
  image: BLOG_DEFAULT_IMAGE,
  seoTitle: '',
  metaDescription: '',
  seoKeywords: '',
  sections: [emptySection()],
  relatedLinks: [{ label: '', path: '' }],
  isPublished: true,
};

export const BlogView: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [publicAssets, setPublicAssets] = useState<{ filename: string; url: string }[]>([]);

  useEffect(() => {
    apiClient.get('/products/public-assets').then((res) => {
      if (res.data.success) setPublicAssets(res.data.data);
    }).catch(() => {});
  }, []);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const data = await getAdminBlogs();
      setPosts(data);
    } catch {
      toast.error('Failed to load blogs — run supabase/blogs.sql first');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEdit = (post: BlogPost) => {
    setEditingId(post.id ?? null);
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      category: post.category,
      readMinutes: post.readMinutes,
      publishedAt: post.publishedAt.slice(0, 10),
      image: post.image,
      seoTitle: post.seoTitle,
      metaDescription: post.metaDescription,
      seoKeywords: post.seoKeywords,
      sections: post.sections?.length ? post.sections : [emptySection()],
      relatedLinks: post.relatedLinks?.length ? post.relatedLinks : [{ label: '', path: '' }],
      isPublished: post.isPublished ?? true,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      image: form.image.trim() || BLOG_DEFAULT_IMAGE,
      readMinutes: Number(form.readMinutes),
      sections: form.sections.map((s) => ({
        heading: s.heading,
        paragraphs: s.paragraphs.filter((p) => p.trim()),
      })).filter((s) => s.heading && s.paragraphs.length),
      relatedLinks: form.relatedLinks.filter((l) => l.label && l.path),
      publishedAt: new Date(form.publishedAt).toISOString(),
      seoTitle: form.seoTitle || `${form.title} | Spark Lights 254`,
    };

    try {
      if (editingId) {
        await updateBlog(editingId, payload);
        toast.success('Blog updated');
      } else {
        await createBlog(payload as BlogPost);
        toast.success('Blog published');
      }
      setIsModalOpen(false);
      fetchPosts();
    } catch {
      toast.error('Save failed — check slug is unique');
    } finally {
      setSaving(false);
    }
  };

  const handleDeviceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file');
      return;
    }

    setUploadingImage(true);
    try {
      const { base64 } = await compressImageFile(file);
      const response = await uploadBlogImage(base64, file.name);
      if (!response.success || !response.data?.url) {
        throw new Error(response.error?.message || 'Upload failed');
      }
      setForm((prev) => ({ ...prev, image: response.data.url }));
      toast.success('Blog cover uploaded');
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

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this blog post?')) return;
    try {
      await deleteBlog(id);
      toast.success('Blog deleted');
      fetchPosts();
    } catch {
      toast.error('Delete failed');
    }
  };

  const filtered = posts.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="px-8 space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <FileText className="text-primary-gold" />
            Blog &amp; SEO
          </h2>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">
            CRUD blog posts · drives Nairobi lighting SEO traffic
          </p>
        </div>
        <button
          onClick={openCreate}
          className="bg-primary-gold text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary-gold/20 flex items-center gap-2"
        >
          <Plus size={16} /> New Blog Post
        </button>
      </div>

      <div className="relative max-w-xl">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 h-4 w-4" />
        <input
          type="text"
          placeholder="Search blogs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-secondary-black border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-white outline-none focus:border-primary-gold/30"
        />
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center py-20">
          <Loader2 className="h-10 w-10 text-primary-gold animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 border border-white/5 rounded-3xl">
          <p className="text-slate-500 text-sm mb-4">No blogs in database yet.</p>
          <p className="text-[10px] text-slate-600 uppercase tracking-widest">
            Run <code className="text-primary-gold">supabase/blogs.sql</code> in Supabase SQL Editor
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filtered.map((post) => (
            <motion.div
              key={post.id ?? post.slug}
              layout
              className="bg-secondary-black border border-white/5 rounded-3xl overflow-hidden flex flex-col"
            >
              <div className="aspect-[16/9] bg-black relative">
                {isAllowedProductImageUrl(post.image) ? (
                  <PublicImage src={post.image} alt={post.title} className="w-full h-full object-cover" />
                ) : post.image ? (
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600">
                    <ImageIcon size={32} />
                  </div>
                )}
                <span className={`absolute top-4 right-4 text-[9px] font-black uppercase px-3 py-1 ${post.isPublished ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}`}>
                  {post.isPublished ? 'Published' : 'Draft'}
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <span className="text-[9px] font-black uppercase tracking-widest text-primary-gold">{post.category}</span>
                <h3 className="text-lg font-black text-white uppercase tracking-tight mt-2 mb-2">{post.title}</h3>
                <p className="text-slate-500 text-xs line-clamp-2 mb-4">{post.excerpt}</p>
                <p className="text-[10px] text-slate-600 font-mono mb-4">/blog/{post.slug}</p>
                <div className="flex gap-2 mt-auto">
                  <a
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 border border-white/10 text-[10px] font-black uppercase tracking-widest text-center text-slate-400 hover:text-white flex items-center justify-center gap-2"
                  >
                    <ExternalLink size={12} /> View
                  </a>
                  <button
                    onClick={() => openEdit(post)}
                    className="flex-1 py-3 border border-primary-gold/30 text-[10px] font-black uppercase tracking-widest text-primary-gold hover:bg-primary-gold/10 flex items-center justify-center gap-2"
                  >
                    <Edit2 size={12} /> Edit
                  </button>
                  {post.id && (
                    <button
                      onClick={() => handleDelete(post.id!)}
                      className="px-4 py-3 border border-red-500/30 text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black/80 flex items-start justify-center overflow-y-auto p-6 pt-24"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.form
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              onSubmit={handleSave}
              className="w-full max-w-3xl bg-secondary-black border border-white/10 rounded-3xl p-8 space-y-6 mb-12"
            >
              <h3 className="text-xl font-black text-white uppercase">
                {editingId ? 'Edit Blog Post' : 'New Blog Post'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'title', label: 'Title' },
                  { key: 'slug', label: 'Slug (URL)' },
                  { key: 'category', label: 'Category' },
                  { key: 'seoTitle', label: 'SEO Title' },
                  { key: 'seoKeywords', label: 'SEO Keywords' },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="text-[9px] font-black uppercase text-slate-500 block mb-2">{label}</label>
                    <input
                      required={key === 'title'}
                      value={(form as Record<string, string>)[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      className="w-full bg-primary-black border border-white/10 rounded-xl py-3 px-4 text-sm text-white"
                    />
                  </div>
                ))}
                <div>
                  <label className="text-[9px] font-black uppercase text-slate-500 block mb-2">Read Minutes</label>
                  <input
                    type="number"
                    min={1}
                    value={form.readMinutes}
                    onChange={(e) => setForm({ ...form, readMinutes: Number(e.target.value) })}
                    className="w-full bg-primary-black border border-white/10 rounded-xl py-3 px-4 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase text-slate-500 block mb-2">Publish Date</label>
                  <input
                    type="date"
                    value={form.publishedAt}
                    onChange={(e) => setForm({ ...form, publishedAt: e.target.value })}
                    className="w-full bg-primary-black border border-white/10 rounded-xl py-3 px-4 text-sm text-white"
                  />
                </div>
              </div>

              <div className="space-y-3 border border-white/10 rounded-2xl p-4 bg-primary-black/50">
                <label className="text-[9px] font-black uppercase text-slate-500 block">Cover Image</label>

                <div className="aspect-[16/9] max-w-md overflow-hidden rounded-xl border border-white/10 bg-black relative">
                  {isAllowedProductImageUrl(form.image) ? (
                    <PublicImage src={form.image} alt="Blog cover preview" className="w-full h-full object-cover" />
                  ) : form.image ? (
                    <img src={form.image} alt="Blog cover preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs">No image</div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <label className="flex-1 flex items-center justify-center gap-2 cursor-pointer border border-dashed border-primary-gold/40 rounded-xl py-3 px-3 hover:bg-primary-gold/10 transition-all">
                    <input type="file" accept="image/*" capture="environment" className="hidden" disabled={uploadingImage} onChange={handleDeviceUpload} />
                    {uploadingImage ? <Loader2 className="h-4 w-4 animate-spin text-primary-gold" /> : <Smartphone className="h-4 w-4 text-primary-gold" />}
                    <span className="text-[9px] font-black uppercase tracking-widest text-white">
                      {uploadingImage ? 'Uploading…' : 'Upload from phone'}
                    </span>
                  </label>
                  <label className="flex-1 flex items-center justify-center gap-2 cursor-pointer border border-dashed border-white/20 rounded-xl py-3 px-3 hover:border-white/40 transition-all">
                    <input type="file" accept="image/*" className="hidden" disabled={uploadingImage} onChange={handleDeviceUpload} />
                    <Upload className="h-4 w-4 text-slate-400" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">From device storage</span>
                  </label>
                </div>

                <div>
                  <label className="text-[9px] font-black uppercase text-slate-500 block mb-2">Image path or URL</label>
                  <input
                    required
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    placeholder={BLOG_DEFAULT_IMAGE}
                    className="w-full bg-primary-black border border-white/10 rounded-xl py-3 px-4 text-sm text-white font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, image: BLOG_DEFAULT_IMAGE })}
                    className="mt-2 text-[9px] font-black uppercase text-primary-gold hover:underline"
                  >
                    Reset to default ({BLOG_DEFAULT_IMAGE})
                  </button>
                </div>

                <p className="text-[9px] text-slate-600 uppercase tracking-widest">Quick picks</p>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {BLOG_IMAGE_PRESETS.map((url) => (
                    <button
                      key={url}
                      type="button"
                      onClick={() => setForm({ ...form, image: url })}
                      className={`relative aspect-video overflow-hidden rounded-lg border-2 transition-all ${
                        form.image === url ? 'border-primary-gold ring-2 ring-primary-gold/40' : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <PublicImage src={url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>

                {publicAssets.length > 0 && (
                  <>
                    <p className="text-[9px] text-slate-600 uppercase tracking-widest">All showroom images</p>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-40 overflow-y-auto p-1 border border-white/5 rounded-xl">
                      {publicAssets.map((asset) => (
                        <button
                          key={asset.filename}
                          type="button"
                          onClick={() => setForm({ ...form, image: asset.url })}
                          className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                            form.image === asset.url ? 'border-primary-gold' : 'border-white/10 hover:border-white/30'
                          }`}
                        >
                          <img src={asset.url} alt={asset.filename} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div>
                <label className="text-[9px] font-black uppercase text-slate-500 block mb-2">Excerpt</label>
                <textarea
                  required
                  rows={2}
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  className="w-full bg-primary-black border border-white/10 rounded-xl py-3 px-4 text-sm text-white resize-none"
                />
              </div>
              <div>
                <label className="text-[9px] font-black uppercase text-slate-500 block mb-2">Meta Description</label>
                <textarea
                  required
                  rows={2}
                  value={form.metaDescription}
                  onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
                  className="w-full bg-primary-black border border-white/10 rounded-xl py-3 px-4 text-sm text-white resize-none"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[9px] font-black uppercase text-slate-500">Content Sections</label>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, sections: [...form.sections, emptySection()] })}
                    className="text-[10px] font-black uppercase text-primary-gold"
                  >
                    + Add Section
                  </button>
                </div>
                {form.sections.map((section, si) => (
                  <div key={si} className="p-4 border border-white/5 rounded-2xl space-y-3">
                    <input
                      placeholder="Section heading"
                      value={section.heading}
                      onChange={(e) => {
                        const sections = [...form.sections];
                        sections[si] = { ...section, heading: e.target.value };
                        setForm({ ...form, sections });
                      }}
                      className="w-full bg-primary-black border border-white/10 rounded-xl py-2 px-3 text-sm text-white"
                    />
                    <textarea
                      placeholder="Paragraphs (one per line)"
                      rows={4}
                      value={section.paragraphs.join('\n')}
                      onChange={(e) => {
                        const sections = [...form.sections];
                        sections[si] = { ...section, paragraphs: e.target.value.split('\n') };
                        setForm({ ...form, sections });
                      }}
                      className="w-full bg-primary-black border border-white/10 rounded-xl py-2 px-3 text-sm text-white resize-none"
                    />
                  </div>
                ))}
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm text-white flex items-center gap-2">
                  {form.isPublished ? <Eye size={14} className="text-emerald-400" /> : <EyeOff size={14} />}
                  Published on storefront
                </span>
              </label>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 border border-white/10 text-[10px] font-black uppercase text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-4 bg-primary-gold text-white text-[10px] font-black uppercase disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingId ? 'Update Post' : 'Publish Post'}
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
