import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Policies from './pages/Policies';
import Occasions from './pages/Occasions';
import Checkout from './pages/Checkout';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import { ProtectedRoute } from './components/admin/ProtectedRoute';
import { Toaster } from 'react-hot-toast';
import { TooltipProvider } from './components/ui/tooltip';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppContent() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-black text-gray-200">
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/admin/*" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-black text-gray-200 selection:bg-primary-gold selection:text-black flex flex-col">
      {/* Announcement Bar */}
      <div className="bg-primary-gold text-black py-2 text-center text-[10px] font-bold uppercase tracking-widest relative z-[60]">
        🚚 Free delivery within Nairobi on orders over KES 3,000 | 🌸 Same-day delivery available
      </div>
      
      <Navbar />
      
      <main className="flex-grow pt-24 sm:pt-28">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/faq" element={<Policies type="faq" />} />
          <Route path="/delivery" element={<Policies type="delivery" />} />
          <Route path="/refund-policy" element={<Policies type="refund" />} />
          <Route path="/occasions" element={<Occasions />} />
        </Routes>
      </main>
      
      <Footer />
    </div>
  );
}

function App() {
  return (
    <TooltipProvider>
      <Router>
        <ScrollToTop />
        <Toaster position="bottom-right" />
        <AppContent />
      </Router>
    </TooltipProvider>
  );
}

export default App;
