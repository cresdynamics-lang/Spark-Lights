import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiChevronLeft, FiChevronRight, FiTruck, FiTool, FiStar,
  FiMapPin, FiChevronDown,
} from 'react-icons/fi';
import { HERO_SLIDES, TESTIMONIALS, WHY_CHOOSE_US, FAQS, DELIVERY_AREAS } from '../data/content';
import { LIGHT_CATEGORIES } from '../data/categories';
import { BRAND } from '../data/brand';
import { usePageSEO } from '../hooks/usePageSEO';
import { SITE_KEYWORDS } from '../lib/seo';
import { usePublishedBlogs } from '../hooks/useBlogs';
import InstallationGallery from '../components/InstallationGallery';
import DeliveryBanner from '../components/DeliveryBanner';

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7 },
};

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const { posts: blogPosts } = usePublishedBlogs();

  usePageSEO({
    title: 'Chandeliers in Nairobi Price | Modern Ceiling Lights Kenya | Spark Lights 254',
    description:
      'Chandeliers in Nairobi price from KES 2,000. Modern ceiling lights, pendant lights Kenya, gypsum board lighting & wall brackets. Lighting shop Nyamakima — same-day delivery Westlands, Kilimani, Karen & CBD.',
    path: '/',
    keywords: SITE_KEYWORDS,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <motion.div
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 8 }}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${HERO_SLIDES[currentSlide].image}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/30" />
          </motion.div>
        </AnimatePresence>

        <div className="container mx-auto px-6 relative z-10 py-32">
          <motion.div
            key={`content-${currentSlide}`}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="text-primary-gold uppercase tracking-[0.5em] text-[10px] font-black mb-6 block">
              {HERO_SLIDES[currentSlide].tagline}
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-[1.05] text-white mb-6">
              {HERO_SLIDES[currentSlide].title}
            </h1>
            <p className="text-base sm:text-lg text-gray-300 mb-10 leading-relaxed max-w-2xl">
              {HERO_SLIDES[currentSlide].subtitle}
            </p>
            <div className="flex flex-row flex-wrap gap-2 sm:gap-4 w-full max-w-lg sm:max-w-none">
              <Link to="/shop" className="btn-primary text-center flex-1 min-w-[7rem] text-[8px] sm:text-sm px-2 py-2 sm:py-4 sm:px-6 whitespace-nowrap">
                {HERO_SLIDES[currentSlide].cta}
              </Link>
              <a href={BRAND.whatsappUrl} className="btn-secondary text-center flex-1 min-w-[7rem] text-[8px] sm:text-sm px-2 py-2 sm:py-4 sm:px-6 whitespace-nowrap">
                Order on WhatsApp
              </a>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-8 right-6 sm:right-16 z-20 flex gap-3">
          <button
            onClick={() => setCurrentSlide((p) => (p - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
            className="w-12 h-12 border border-white/20 flex items-center justify-center hover:bg-primary-gold hover:border-primary-gold transition-all backdrop-blur-md"
            aria-label="Previous slide"
          >
            <FiChevronLeft size={20} />
          </button>
          <button
            onClick={() => setCurrentSlide((p) => (p + 1) % HERO_SLIDES.length)}
            className="w-12 h-12 border border-white/20 flex items-center justify-center hover:bg-primary-gold hover:border-primary-gold transition-all backdrop-blur-md"
            aria-label="Next slide"
          >
            <FiChevronRight size={20} />
          </button>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y border-white/5 bg-secondary-black">
        <div className="container mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { label: 'From', value: 'KES 2,000' },
            { label: 'Delivery', value: 'Same-Day Nairobi' },
            { label: 'Install', value: 'Pro Team Available' },
            { label: 'Location', value: 'Nyamakima' },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-500">{item.label}</p>
              <p className="text-sm sm:text-base font-black text-white mt-1">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Welcome / SEO intro */}
      <section className="hidden py-20 sm:py-28">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <motion.div {...fadeIn}>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tighter text-white mb-6">
              Lighting Shops in Nyamakima, Delivering Across Nairobi
            </h2>
            <p className="text-gray-400 text-base leading-relaxed mb-6">
              At Spark Lights 254, Nairobi buyers find chandeliers in Nairobi price listings, modern ceiling
              lights, pendant lights Kenya, gypsum board lighting fixtures, and wall brackets, with the KES
              price shown on every product. We are a lighting shop in Nyamakima on Duruma Road, and we supply
              and deliver modern chandeliers to Westlands, Kilimani, Karen, Lavington, and across Nairobi CBD.
            </p>
            <p className="text-gray-500 text-base leading-relaxed">
              Need installation? See our{' '}
              <Link to="/installation" className="text-primary-gold hover:underline">chandelier installation services in Nairobi</Link>
              . Buying in bulk?{' '}
              <Link to="/wholesale" className="text-primary-gold hover:underline">wholesale electrical lighting quotes</Link>
              {' '}for developers and hotels.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 sm:py-28 bg-secondary-black">
        <div className="container mx-auto px-6">
          <motion.div {...fadeIn} className="text-center mb-16">
            <span className="text-primary-gold uppercase tracking-[0.5em] text-[10px] font-black mb-4 block">
              Shop by Room & Type
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter text-white">
              Shop by Search Intent
            </h2>
            <p className="text-gray-500 mt-4 max-w-2xl mx-auto text-xs sm:text-sm">
              Category pages match how Nairobi customers search: chandeliers price, pendant lights Kenya, gypsum lighting and outdoor solar.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {LIGHT_CATEGORIES.map((cat, idx) => (
              <motion.div
                key={cat.slug}
                {...fadeIn}
                transition={{ delay: idx * 0.05 }}
              >
                <Link
                  to={`/category/${cat.slug}`}
                  className="group block relative h-48 sm:h-64 overflow-hidden border border-accent-gold/60 bg-accent-gold/10"
                >
                  <img
                    src={cat.image}
                    alt={`${cat.name} in Nairobi, Spark Lights 254`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-accent-gold/35 via-accent-gold/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-6">
                    <h3 className="text-sm sm:text-xl font-black uppercase text-accent-gold group-hover:text-primary-pink transition-colors drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                      {cat.name}
                    </h3>
                    <p className="text-accent-gold text-[10px] sm:text-xs mt-1 sm:mt-2 line-clamp-2 font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">{cat.seoH1}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="py-20 sm:py-28 bg-secondary-black">
        <div className="container mx-auto px-6">
          <motion.div {...fadeIn} className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter text-white">Why Choose Us</h2>
          </motion.div>
          <div className="grid grid-cols-3 gap-2 sm:gap-6">
            {WHY_CHOOSE_US.map((item, idx) => (
              <motion.div
                key={item.title}
                {...fadeIn}
                transition={{ delay: idx * 0.1 }}
                className="p-3 sm:p-6 border border-white/5 bg-primary-black"
              >
                <div className="w-12 h-12 rounded-full bg-primary-gold/10 flex items-center justify-center text-primary-gold text-xl mb-5">
                  {idx === 0 ? <FiTruck /> : idx === 1 ? <FiStar /> : <FiTool />}
                </div>
                <h3 className="text-lg font-black uppercase text-white mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed text-xs sm:text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <InstallationGallery />

      {/* Blog — SEO traffic */}
      <section className="py-16 sm:py-24 border-y border-white/5">
        <div className="container mx-auto px-6">
          <motion.div {...fadeIn} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-white">Lighting Blog</h2>
            <p className="text-gray-500 mt-3 text-xs sm:text-sm">Guides that match how Kenyans search: gypsum, chandeliers, solar outdoor</p>
          </motion.div>
          <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-3 lg:grid lg:grid-cols-4 lg:overflow-visible lg:pb-0">
            {blogPosts.map((post, idx) => (
              <motion.div key={post.slug} {...fadeIn} transition={{ delay: idx * 0.05 }} className="min-w-[78vw] snap-start lg:min-w-0">
                <Link to={`/blog/${post.slug}`} className="block p-4 sm:p-6 border border-white/5 bg-secondary-black hover:border-primary-gold/30 transition-colors h-full">
                  <span className="text-[9px] font-black uppercase tracking-widest text-primary-gold">{post.category}</span>
                  <h3 className="text-sm font-black uppercase text-white mt-3 leading-tight">{post.title}</h3>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/blog" className="text-primary-gold text-[10px] font-black uppercase tracking-widest hover:underline">
              View all articles →
            </Link>
          </div>
        </div>
      </section>

      <DeliveryBanner />

      {/* FAQ — SEO */}
      <section className="py-20 sm:py-28 bg-secondary-black">
        <div className="container mx-auto px-6 max-w-3xl">
          <motion.div {...fadeIn} className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-500 mt-4">Everything about buying lights in Nairobi</p>
          </motion.div>
          <div className="space-y-4">
            {FAQS.flatMap((cat) => cat.questions).slice(0, 6).map((item) => (
              <div key={item.q} className="border border-white/5 bg-primary-black">
                <button
                  onClick={() => setOpenFaq(openFaq === item.q ? null : item.q)}
                  className="w-full px-4 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                >
                  <span className="font-bold text-white text-xs sm:text-sm pr-4">{item.q}</span>
                  <FiChevronDown className={`flex-shrink-0 transition-transform ${openFaq === item.q ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === item.q && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="px-4 pb-4 text-gray-400 text-xs sm:text-sm leading-relaxed border-t border-white/5 pt-3">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
          <div className="text-center mt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/light-guide" className="text-primary-gold text-[10px] font-black uppercase tracking-widest hover:underline">
              Room-by-Room Lighting Guide →
            </Link>
            <Link to="/installation" className="text-primary-gold text-[10px] font-black uppercase tracking-widest hover:underline">
              Supply &amp; Fix Packages →
            </Link>
            <Link to="/blog" className="text-primary-gold text-[10px] font-black uppercase tracking-widest hover:underline">
              Lighting Blog →
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 sm:py-28">
        <div className="container mx-auto px-6">
          <motion.div {...fadeIn} className="text-center mb-14">
            <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter text-white">What Nairobi Says</h2>
          </motion.div>
          <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-3 md:grid md:grid-cols-3 md:overflow-visible md:pb-0">
            {TESTIMONIALS.map((t, idx) => (
              <motion.div
                key={idx}
                {...fadeIn}
                transition={{ delay: idx * 0.1 }}
                className="min-w-[82vw] snap-start p-6 border border-white/5 bg-secondary-black md:min-w-0"
              >
                <div className="flex gap-1 text-primary-gold mb-6">
                  {[...Array(t.stars)].map((_, i) => <FiStar key={i} size={14} fill="currentColor" />)}
                </div>
                <p className="text-gray-300 leading-relaxed mb-8">"{t.review}"</p>
                <p className="font-black text-white text-sm uppercase">{t.name}</p>
                <p className="text-gray-600 text-[10px] uppercase tracking-widest mt-1">{t.location}, Nairobi</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Location CTA */}
      <section className="py-20 sm:py-28 bg-primary-gold text-black">
        <div className="container mx-auto px-6 text-center">
          <motion.div {...fadeIn}>
            <FiMapPin className="mx-auto mb-6" size={32} />
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter mb-6">
              Visit Our Nyamakima Showroom
            </h2>
            <p className="text-black/70 max-w-2xl mx-auto mb-4 font-medium">{BRAND.fullAddress}</p>
            <p className="text-sm font-bold mb-8">
              Delivering to: {DELIVERY_AREAS.slice(0, 8).join(' · ')} & more
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={BRAND.whatsappUrl} className="bg-black text-white px-10 py-4 font-black uppercase text-[11px] tracking-widest hover:bg-white hover:text-black transition-colors">
                Chat on WhatsApp
              </a>
              <a
                href={`tel:${BRAND.phone.replace(/\s/g, '')}`}
                className="border-2 border-black px-10 py-4 font-black uppercase text-[11px] tracking-widest hover:bg-black hover:text-white transition-colors"
              >
                Contact Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Marquee */}
      <section className="py-12 bg-black overflow-hidden border-t border-white/5">
        <div className="flex whitespace-nowrap animate-marquee">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-16 mx-8">
              <span className="text-4xl sm:text-6xl font-black uppercase text-white/20">Nairobi Lighting</span>
              <span className="text-4xl sm:text-6xl font-black uppercase text-primary-gold">Spark Lights 254</span>
              <span className="text-4xl sm:text-6xl font-black uppercase text-white/20">Nyamakima · Duruma Road</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
