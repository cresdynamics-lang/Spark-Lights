import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiClock } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa6';
import { usePageSEO } from '../hooks/usePageSEO';
import { useBlogPost, usePublishedBlogs } from '../hooks/useBlogs';
import { BRAND } from '../data/brand';
import DeliveryBanner from '../components/DeliveryBanner';
import type { BlogSection, BlogRelatedLink } from '../types/blog';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { post, loading } = useBlogPost(slug);
  const { posts: allPosts } = usePublishedBlogs();

  usePageSEO({
    title: post?.seoTitle ?? `Blog | ${BRAND.name}`,
    description: post?.metaDescription ?? 'Lighting guides and tips from Spark Lights 254, Nairobi.',
    path: slug ? `/blog/${slug}` : '/blog',
    keywords: post?.seoKeywords,
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading article...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6">
        <h1 className="text-4xl font-black uppercase text-white">Article not found</h1>
        <Link to="/blog" className="btn-primary">Back to Blog</Link>
      </div>
    );
  }

  const sections = (post.sections ?? []) as BlogSection[];
  const relatedLinks = (post.relatedLinks ?? []) as BlogRelatedLink[];
  const others = allPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <div className="min-h-screen pb-32">
      <article>
        <header className="py-24 sm:py-32 border-b border-white/5 bg-secondary-black">
          <div className="container mx-auto px-6 max-w-3xl">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-primary-gold mb-10"
            >
              <FiArrowLeft size={14} /> All Articles
            </Link>
            <span className="text-primary-gold text-[10px] font-black uppercase tracking-widest block mb-4">{post.category}</span>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mb-6 leading-tight">
              {post.title}
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed mb-6">{post.excerpt}</p>
            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-600">
              <span className="flex items-center gap-2"><FiClock size={12} /> {post.readMinutes} min read</span>
              <span>{new Date(post.publishedAt).toLocaleDateString('en-KE', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
        </header>

        <div className="aspect-[21/9] max-h-[420px] overflow-hidden border-b border-white/5">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        </div>

        <div className="container mx-auto px-6 max-w-3xl py-16 space-y-12">
          {sections.map((section) => (
            <motion.section
              key={section.heading}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-6">{section.heading}</h2>
              {section.paragraphs.map((p) => (
                <p key={p.slice(0, 40)} className="text-gray-400 leading-relaxed mb-4">{p}</p>
              ))}
            </motion.section>
          ))}

          <div className="p-8 border-2 border-[#25D366]/40 bg-[#25D366]/5">
            <p className="text-white font-black uppercase tracking-tight mb-4">Prices shown in KES — order on WhatsApp</p>
            <p className="text-gray-400 text-sm mb-6">
              Kenyan shoppers hate hidden prices. Browse our shop with public KES on every product, or message us to bundle Supply &amp; Fix (light + delivery + fundi).
            </p>
            <a
              href={BRAND.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 py-4 px-8 bg-[#25D366] hover:bg-[#20bd5a] text-white font-black uppercase tracking-widest text-[11px] transition-colors"
            >
              <FaWhatsapp size={18} /> Chat on WhatsApp to Order
            </a>
          </div>

          {relatedLinks.length > 0 && (
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-4">Related pages</h3>
              <div className="flex flex-wrap gap-3">
                {relatedLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="text-[10px] font-black uppercase tracking-widest px-4 py-2 border border-primary-gold/30 text-primary-gold hover:bg-primary-gold hover:text-black transition-all"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      <DeliveryBanner />

      {others.length > 0 && (
        <section className="py-16 border-t border-white/5">
          <div className="container mx-auto px-6">
            <h2 className="text-xl font-black uppercase text-white mb-8">More from the blog</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {others.map((p) => (
                <Link key={p.slug} to={`/blog/${p.slug}`} className="block p-6 border border-white/5 hover:border-primary-gold/30 transition-colors">
                  <span className="text-[10px] text-primary-gold font-black uppercase tracking-widest">{p.category}</span>
                  <h3 className="text-lg font-black uppercase text-white mt-2">{p.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
