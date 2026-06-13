import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiClock } from 'react-icons/fi';
import { BLOG_POSTS } from '../data/blogs';
import { usePageSEO } from '../hooks/usePageSEO';
import { BRAND } from '../data/brand';

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7 },
};

export default function Blog() {
  usePageSEO({
    title: 'Lighting Blog Nairobi | Gypsum, Chandeliers & Solar Guides',
    description:
      'Spark Lights 254 blog — modern gypsum ceiling lights, chandeliers in Nairobi price guides, solar security tips & Supply & Fix advice for Kenyan homeowners.',
    path: '/blog',
    keywords:
      'modern gypsum ceiling lights, chandeliers in Nairobi price, solar security lights Nairobi, lighting blog Kenya',
  });

  return (
    <div className="min-h-screen pb-32">
      <section className="py-24 sm:py-32 border-b border-white/5 bg-secondary-black">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <motion.div {...fadeIn}>
            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight mb-6 text-white">
              Nairobi Lighting Blog
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed">
              SEO guides that match how Kenyans search — gypsum lights, chandelier prices, solar outdoor tips,
              and Supply &amp; Fix bundles. Every article links to products with public KES prices.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {BLOG_POSTS.map((post, i) => (
              <motion.article
                key={post.slug}
                {...fadeIn}
                transition={{ ...fadeIn.transition, delay: i * 0.06 }}
              >
                <Link to={`/blog/${post.slug}`} className="group block border border-white/5 bg-tertiary-black overflow-hidden hover:border-primary-gold/30 transition-colors">
                  <div className="aspect-[16/9] overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-8">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary-gold">{post.category}</span>
                    <h2 className="text-xl font-black uppercase tracking-tight text-white mt-3 mb-3 group-hover:text-primary-gold transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-gray-500 text-sm leading-relaxed mb-6">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-600">
                      <span className="flex items-center gap-2"><FiClock size={12} /> {post.readMinutes} min read</span>
                      <span className="text-primary-gold flex items-center gap-1 group-hover:gap-2 transition-all">
                        Read <FiArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-gray-500 mb-6">Ready to buy? Every product shows the KES price — no inbox quotes.</p>
            <Link to="/shop" className="btn-primary py-4 px-12 text-[11px]">Shop with Public Prices</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
