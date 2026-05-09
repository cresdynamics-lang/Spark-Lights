import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiTruck, FiGift, FiStar, FiInfo, FiCalendar, FiClock, FiPlus } from 'react-icons/fi';
import { GiSprout, GiButterfly } from 'react-icons/gi';
import { HERO_SLIDES, OCCASIONS, PRODUCTS, TESTIMONIALS } from '../data/content';
import { useCartStore } from '../store/useCartStore';
import PromoBanner from '../components/PromoBanner';

// Assets
import cakeFlowersImg from '../assets/cake flowers.jpg';
import bridalPortraitsImg from '../assets/bridal potraits.jpg';
import pinkFlowersImg from '../assets/pink flowers.jpg';
import privateWeddingImg from '../assets/private wedding flowers.jpg';
import yellowFlowersImg from '../assets/yellow flowers.jpg';
import bouquetImg from '../assets/bouquet flowers.jpg';

const fadeIn = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
};

const staggerContainer = {
  initial: {},
  whileInView: {
    transition: {
      staggerChildren: 0.15
    }
  },
  viewport: { once: true }
};

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <motion.div
              initial={{ scale: 1.25 }}
              animate={{ scale: 1 }}
              transition={{ duration: 10, ease: "linear" }}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${HERO_SLIDES[currentSlide].image}')` }}
            ></motion.div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/30 to-transparent"></div>

            <div className="container mx-auto px-6 h-full flex items-center relative z-10">
              <div className="max-w-4xl">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 1 }}
                >
                  <span className="text-primary-gold uppercase tracking-[0.6em] text-[11px] font-black mb-8 block drop-shadow-lg">
                    {HERO_SLIDES[currentSlide].tagline}
                  </span>
                  <h1 className="text-5xl md:text-9xl mb-10 leading-[1] font-black tracking-tighter uppercase">
                    {HERO_SLIDES[currentSlide].title.split(' ').map((word, i) => {
                      let colorClass = 'text-white';
                      if (i % 3 === 1) colorClass = 'text-primary-gold';
                      if (i % 3 === 2) colorClass = 'text-primary-pink';
                      return <span key={i} className={colorClass}>{word} </span>;
                    })}
                  </h1>
                  <p className="text-lg md:text-2xl text-gray-300 mb-14 max-w-2xl leading-relaxed font-medium">
                    {HERO_SLIDES[currentSlide].subtitle}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-6">
                    <Link to="/shop" className="btn-primary inline-block text-center shadow-2xl shadow-primary-gold/20 py-5 px-12">
                      {HERO_SLIDES[currentSlide].cta}
                    </Link>
                    <a href="https://wa.me/254700000000" className="btn-secondary inline-block text-center py-5 px-12 backdrop-blur-md">
                      WhatsApp Luxury Concierge
                    </a>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Slider Controls */}
        <div className="absolute bottom-16 right-6 sm:right-20 z-20 flex gap-6">
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
            className="w-14 h-14 border border-white/10 flex items-center justify-center hover:bg-primary-gold hover:border-primary-gold transition-all duration-500 backdrop-blur-2xl group"
          >
            <FiChevronLeft className="group-hover:-translate-x-1 transition-transform" size={24} />
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
            className="w-14 h-14 border border-white/10 flex items-center justify-center hover:bg-primary-gold hover:border-primary-gold transition-all duration-500 backdrop-blur-2xl group"
          >
            <FiChevronRight className="group-hover:translate-x-1 transition-transform" size={24} />
          </button>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        >
          <div className="w-[1px] h-12 bg-gradient-to-b from-primary-gold to-transparent"></div>
          <span className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-500">Scroll</span>
        </motion.div>
      </section>

      {/* Trust Metrics */}
      <section className="bg-primary-black py-24 sm:py-32">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
            {[
              { icon: <FiTruck />, title: 'Expedited Delivery', desc: 'Secure, temperature-controlled delivery within 3 hours in Nairobi.' },
              { icon: <GiSprout />, title: 'Ethical Sourcing', desc: 'Directly supporting Kenyan sustainable farms with fair trade practices.' },
              { icon: <FiGift />, title: 'Luxury Packaging', desc: 'Signature black boxes, silk ribbons, and hand-written calligraphy cards.' },
              { icon: <FiClock />, title: 'Long-Lasting Blooms', desc: 'Guaranteed 7-day freshness or a full replacement on us.' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                {...fadeIn}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-20 h-20 border border-white/5 bg-secondary-black flex items-center justify-center rounded-full text-primary-gold text-3xl mb-8 group-hover:bg-primary-pink group-hover:text-white transition-all duration-700 shadow-xl group-hover:shadow-primary-pink/20">
                  {item.icon}
                </div>
                <h4 className="text-xl font-black uppercase tracking-wider text-white mb-4">{item.title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals Bento Grid */}
      <section className="py-24 sm:py-48 bg-secondary-black">
        <div className="container mx-auto px-6">
          <motion.div {...fadeIn} className="flex flex-col md:flex-row justify-between items-end mb-24 gap-10">
            <div className="max-w-2xl">
              <span className="text-primary-gold uppercase tracking-[0.6em] text-[10px] font-black mb-6 block">New Collections</span>
              <h2 className="text-5xl sm:text-8xl font-black uppercase tracking-tighter leading-none mb-6">Seasonal Highlights</h2>
              <p className="text-gray-500 text-lg font-medium">Hand-picked curation of this week's most exquisite blooms.</p>
            </div>
            <Link to="/shop" className="btn-secondary group">
              View Collection <span className="inline-block group-hover:translate-x-2 transition-transform ml-2">→</span>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-full md:h-[900px]">
            {/* Main Featured */}
            <motion.div {...fadeIn} className="md:col-span-7 relative group overflow-hidden h-[400px] md:h-full border border-white/5">
              <img src={cakeFlowersImg} alt="Featured" className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              <div className="absolute bottom-10 left-10 right-10">
                <span className="text-primary-gold font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Signature Design</span>
                <h3 className="text-4xl sm:text-6xl font-black uppercase text-white mb-6">Floral Cake Artistry</h3>
                <Link to="/product/cake-flowers" className="text-[10px] font-black uppercase tracking-widest text-white border-b-2 border-primary-gold pb-2 hover:text-primary-gold transition-colors">Order Bespoke Piece</Link>
              </div>
            </motion.div>

            <div className="md:col-span-5 grid grid-rows-2 gap-8">
              <motion.div {...fadeIn} transition={{ delay: 0.2 }} className="relative group overflow-hidden border border-white/5">
                <img src={bridalPortraitsImg} alt="Bridal" className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all"></div>
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-10">
                  <h3 className="text-3xl font-black uppercase text-white mb-4">Bridal Portraits</h3>
                  <Link to="/shop?category=wedding" className="btn-primary py-3 px-8 text-[9px]">Explore Bridal</Link>
                </div>
              </motion.div>

              <div className="grid grid-cols-2 gap-8">
                <motion.div {...fadeIn} transition={{ delay: 0.4 }} className="relative group overflow-hidden border border-white/5">
                  <img src={yellowFlowersImg} alt="Yellow" className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-105" />
                  <div className="absolute inset-0 bg-primary-gold/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </motion.div>
                <motion.div {...fadeIn} transition={{ delay: 0.5 }} className="bg-tertiary-black flex flex-col justify-center p-8 border border-white/5">
                  <span className="text-primary-gold text-[9px] font-black uppercase tracking-widest mb-4">Upcoming</span>
                  <h4 className="text-xl font-black uppercase leading-tight mb-4 text-white">Spring <br /> Solstice Mix</h4>
                  <Link to="/shop" className="text-[9px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">Notify Me</Link>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categorical Journey */}
      <section className="py-24 sm:py-48">
        <div className="container mx-auto px-6">
          <motion.div {...fadeIn} className="text-center mb-32">
            <span className="text-primary-gold uppercase tracking-[0.6em] text-[10px] font-black mb-6 block">Our Curation</span>
            <h2 className="text-5xl sm:text-8xl font-black uppercase leading-none tracking-tighter">Shop by Mood</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {OCCASIONS.map((cat, idx) => (
              <motion.div
                key={cat.id}
                {...fadeIn}
                transition={{ delay: idx * 0.05 }}
                className="group relative h-[500px] overflow-hidden border border-white/5"
              >
                <img src={cat.img} alt={cat.name} className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-700"></div>
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <h3 className="text-3xl font-black uppercase text-white mb-6 group-hover:text-primary-pink transition-colors leading-none tracking-tighter">{cat.name}</h3>
                  <Link to={`/shop?category=${cat.id}`} className="text-[9px] font-black uppercase tracking-[0.3em] text-white overflow-hidden h-0 group-hover:h-8 transition-all duration-500 block">Explore Gallery →</Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Scroll */}
      <section className="py-24 sm:py-48 bg-secondary-black overflow-hidden">
        <div className="container mx-auto px-6">
          <motion.div {...fadeIn} className="flex justify-between items-end mb-24">
            <div>
              <span className="text-primary-gold uppercase tracking-[0.6em] text-[10px] font-black mb-6 block">Trending Now</span>
              <h2 className="text-5xl sm:text-8xl font-black uppercase leading-none tracking-tighter">Iconic Bouquets</h2>
            </div>
            <div className="hidden md:flex gap-4">
              <button className="w-16 h-16 border border-white/10 flex items-center justify-center hover:bg-primary-gold transition-all"><FiChevronLeft size={24} /></button>
              <button className="w-16 h-16 border border-white/10 flex items-center justify-center hover:bg-primary-gold transition-all"><FiChevronRight size={24} /></button>
            </div>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="flex gap-10 overflow-x-auto pb-16 no-scrollbar snap-x"
          >
            {PRODUCTS.map((prod) => (
              <motion.div
                key={prod.id}
                variants={fadeIn}
                className="min-w-[320px] sm:min-w-[450px] group snap-start"
              >
                <div className="aspect-[3/4] overflow-hidden border border-white/5 relative bg-tertiary-black">
                  <img src={prod.img} alt={prod.name} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" />
                  <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
                    {prod.badge && <span className="bg-primary-gold text-white text-[9px] font-black px-4 py-1 uppercase tracking-widest">{prod.badge}</span>}
                    <span className="bg-black text-white text-[9px] font-black px-4 py-1 uppercase tracking-widest">KES {prod.price}</span>
                  </div>
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-center items-center gap-6 p-10 text-center">
                    <p className="text-gray-300 text-sm font-medium mb-4 leading-relaxed">{prod.shortDesc}</p>
                    <div className="flex flex-col gap-4 w-full">
                      <button 
                        onClick={() => addItem(prod)}
                        className="btn-primary w-full py-4 text-[10px] flex items-center justify-center gap-2"
                      >
                        <FiPlus /> Add to Cart
                      </button>
                      <Link to={`/product/${prod.slug}`} className="btn-secondary w-full py-4 text-[10px] flex items-center justify-center">View Details</Link>
                    </div>
                  </div>
                </div>
                <div className="pt-8 text-center">
                  <h3 className="text-2xl font-black uppercase tracking-tighter group-hover:text-primary-gold transition-colors">{prod.name}</h3>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Subscription Section */}
      <section className="py-24 sm:py-48 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-fixed bg-center opacity-30 grayscale" style={{ backgroundImage: `url('${privateWeddingImg}')` }}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-primary-black via-transparent to-primary-black"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div {...fadeIn}>
              <GiButterfly className="text-primary-gold text-6xl mx-auto mb-10 animate-pulse" />
              <span className="text-primary-gold uppercase tracking-[0.6em] text-[10px] font-black mb-8 block">The Bloom Club</span>
              <h2 className="text-5xl sm:text-9xl font-black uppercase leading-none tracking-tighter mb-10">Weekly <br /> Floral Luxury</h2>
              <p className="text-xl text-gray-400 mb-16 leading-relaxed font-medium">
                Elevate your home or workspace with our signature seasonal arrangements, delivered fresh every week. Cancel anytime, joy guaranteed.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-20 text-left">
                {[
                  { title: 'The Minimalist', price: '4,500', freq: 'Weekly' },
                  { title: 'The Curated', price: '8,000', freq: 'Weekly' },
                  { title: 'The Grand', price: '15,000', freq: 'Weekly' },
                ].map((plan, idx) => (
                  <div key={idx} className="bg-secondary-black p-10 border border-white/5 hover:border-primary-gold/50 transition-all group">
                    <h4 className="text-primary-gold font-black uppercase text-[10px] mb-4 tracking-widest">{plan.freq} Subscription</h4>
                    <h3 className="text-2xl font-black uppercase text-white mb-6 tracking-tighter">{plan.title}</h3>
                    <p className="text-3xl font-black text-white mb-10">KES {plan.price} <span className="text-[10px] text-gray-500 font-medium tracking-normal lowercase">/ delivery</span></p>
                    <button className="w-full btn-secondary text-[9px] py-4 group-hover:bg-primary-gold group-hover:border-primary-gold group-hover:text-white">Start Membership</button>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.4em]">Corporate plans available on request</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Seasonal Promo */}
      <PromoBanner />

      {/* Expert Care Section */}
      <section className="py-24 sm:py-48 bg-primary-black">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-24 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:w-1/2">
              <span className="text-primary-gold uppercase tracking-[0.6em] text-[10px] font-black mb-8 block">Mastery & Care</span>
              <h2 className="text-5xl sm:text-8xl font-black uppercase leading-none tracking-tighter mb-10">Beyond the <br /> Bouquet</h2>
              <p className="text-xl text-gray-400 mb-12 leading-relaxed font-medium">
                "Our relationship with you begins when the flowers arrive. Learn the secrets of longevity from our master florists."
              </p>

              <div className="space-y-12">
                {[
                  { icon: <FiInfo />, title: 'Vase Life Hacks', desc: 'Pro-tips to double the lifespan of your specific arrangements.' },
                  { icon: <FiCalendar />, title: 'Floral Workshops', desc: 'Join our exclusive monthly design sessions in Westlands.' },
                  { icon: <GiButterfly />, title: 'Bespoke Styling', desc: 'Consult with our artisans for event-specific floral aesthetics.' }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-8 group">
                    <div className="text-primary-gold text-3xl group-hover:scale-125 transition-transform duration-500 mt-1">{item.icon}</div>
                    <div>
                      <h4 className="text-xl font-black uppercase text-white mb-2 tracking-wide">{item.title}</h4>
                      <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:w-1/2 grid grid-cols-2 gap-6 relative">
              <div className="space-y-6 pt-12">
                <img src={bouquetImg} alt="Care 1" className="w-full aspect-square object-cover border border-white/5 grayscale hover:grayscale-0 transition-all duration-700" />
                <img src={yellowFlowersImg} alt="Care 2" className="w-full aspect-[4/5] object-cover border border-white/5 grayscale hover:grayscale-0 transition-all duration-700" />
              </div>
              <div className="space-y-6">
                <img src={pinkFlowersImg} alt="Care 3" className="w-full aspect-[4/5] object-cover border border-white/5 grayscale hover:grayscale-0 transition-all duration-700" />
                <img src={privateWeddingImg} alt="Care 4" className="w-full aspect-square object-cover border border-white/5 grayscale hover:grayscale-0 transition-all duration-700" />
              </div>
              {/* Floating Badge */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-primary-gold/20 rounded-full flex items-center justify-center bg-black/80 backdrop-blur-xl z-20"
              >
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary-gold text-center">Master <br /> Certified</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 sm:py-48 bg-secondary-black">
        <div className="container mx-auto px-6 text-center">
          <motion.div {...fadeIn} className="mb-32">
            <span className="text-primary-gold uppercase tracking-[0.6em] text-[10px] font-black mb-8 block">Public Record</span>
            <h2 className="text-5xl sm:text-9xl font-black uppercase leading-none tracking-tighter">Society <br /> Chronicles</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((test, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -15, borderColor: '#CA8A04' }}
                className="p-16 border border-white/5 bg-tertiary-black transition-all duration-700 text-left relative group"
              >
                <div className="flex gap-2 text-primary-pink mb-10 group-hover:scale-110 transition-transform">
                  {[...Array(test.stars)].map((_, i) => <FiStar key={i} size={14} fill="currentColor" />)}
                </div>
                <p className="font-medium text-2xl text-white mb-12 leading-tight">"{test.review}"</p>
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-primary-gold/10 rounded-full flex items-center justify-center text-primary-gold font-black text-xl">{test.name[0]}</div>
                  <div>
                    <h4 className="text-white font-black text-[12px] uppercase tracking-widest">{test.name}</h4>
                    <span className="text-[10px] text-gray-600 uppercase tracking-[0.2em] mt-1 block font-black">{test.location}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* From the Journal */}
      <section className="py-24 sm:py-48">
        <div className="container mx-auto px-6">
          <motion.div {...fadeIn} className="flex flex-col md:flex-row justify-between items-end mb-24 gap-10">
            <div className="max-w-2xl">
              <span className="text-primary-gold uppercase tracking-[0.6em] text-[10px] font-black mb-6 block">Editorial</span>
              <h2 className="text-5xl sm:text-8xl font-black uppercase tracking-tighter leading-none mb-6">From The Journal</h2>
              <p className="text-gray-500 text-lg font-medium">Floral design, lifestyle, and the art of giving.</p>
            </div>
            <Link to="/journal" className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-gold border-b-2 border-primary-gold pb-2">Read Journal →</Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { 
                date: 'May 12, 2026', 
                title: 'The Psychology of Petals: How Flowers Change Your Mood', 
                img: yellowFlowersImg,
                cat: 'Lifestyle'
              },
              { 
                date: 'May 08, 2026', 
                title: 'Wedding Trends: The Return of the Cascading Bouquet', 
                img: bridalPortraitsImg,
                cat: 'Design'
              },
              { 
                date: 'May 01, 2026', 
                title: 'Nairobi Flower Farms: A Journey to the Rift Valley', 
                img: pinkFlowersImg,
                cat: 'Behind the Scenes'
              }
            ].map((post, i) => (
              <motion.div 
                key={i} 
                {...fadeIn} 
                transition={{ delay: i * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="aspect-[16/10] overflow-hidden mb-8 border border-white/5">
                  <img src={post.img} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-primary-gold text-[9px] font-black uppercase tracking-widest">{post.cat}</span>
                  <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                  <span className="text-gray-500 text-[9px] font-bold uppercase tracking-widest">{post.date}</span>
                </div>
                <h3 className="text-2xl font-black uppercase leading-tight group-hover:text-primary-gold transition-colors mb-6">{post.title}</h3>
                <Link to="/journal/post" className="text-[10px] font-black uppercase tracking-widest text-white group-hover:text-primary-gold transition-all flex items-center gap-2">
                  Read Article <span className="w-8 h-[1px] bg-white group-hover:bg-primary-gold transition-all"></span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Presence Banner */}
      <section className="py-24 bg-primary-gold">
        <div className="container mx-auto px-6 overflow-hidden">
          <div className="flex whitespace-nowrap animate-marquee">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex items-center gap-20 mx-10">
                <span className="text-6xl sm:text-8xl font-black uppercase text-white outline-text">Nairobi's Finest</span>
                <span className="text-6xl sm:text-8xl font-black uppercase text-black">Marigold Flowers</span>
                <span className="text-6xl sm:text-8xl font-black uppercase text-white outline-text">Est. 2018</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="relative py-24 sm:py-48 bg-primary-black text-center border-t border-white/5">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div {...fadeIn}>
            <span className="text-primary-gold uppercase tracking-[0.6em] text-[10px] font-black mb-8 block">E-Journal</span>
            <h2 className="text-5xl sm:text-9xl text-white mb-10 font-black uppercase leading-none tracking-tighter">Exclusive <br /> Invitations</h2>
            <p className="text-gray-400 text-xl mb-16 max-w-2xl mx-auto font-medium">Be the first to secure rare seasonal blooms and receive our private design lookbook.</p>
            <form className="flex flex-col sm:flex-row gap-0 max-w-3xl mx-auto shadow-[0_0_100px_rgba(255,20,147,0.1)] group">
              <input
                type="email"
                placeholder="Secure your access (email)..."
                className="flex-1 bg-secondary-black border border-white/10 px-10 py-7 text-white focus:outline-none focus:border-primary-gold placeholder:text-gray-600 font-black uppercase text-xs transition-all"
                required
              />
              <button
                type="submit"
                className="bg-primary-gold text-white px-16 py-7 font-black uppercase tracking-[0.3em] text-[12px] hover:bg-white hover:text-black transition-all"
              >
                Join Private List
              </button>
            </form>
            <p className="mt-10 text-[9px] text-gray-700 uppercase tracking-[0.4em] font-black">We value your privacy. Unsubscribe at any time.</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
