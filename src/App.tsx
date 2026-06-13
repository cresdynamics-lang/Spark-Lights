import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Policies from './pages/Policies';
import CategoryPage from './pages/CategoryPage';
import Checkout from './pages/Checkout';
import LightGuide from './pages/LightGuide';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import StorefrontLayout from './layouts/StorefrontLayout';
import { ProtectedRoute } from './components/admin/ProtectedRoute';
import { Toaster } from 'react-hot-toast';
import { TooltipProvider } from './components/ui/tooltip';
import LocalBusinessJsonLd from './components/LocalBusinessJsonLd';
import { ProductProvider } from './context/ProductContext';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <TooltipProvider>
      <LocalBusinessJsonLd />
      <Router>
        <ProductProvider>
          <ScrollToTop />
          <Toaster position="bottom-right" />
          <Routes>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>

            <Route element={<StorefrontLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:slug" element={<ProductDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/light-guide" element={<LightGuide />} />
              <Route path="/faq" element={<Policies type="faq" />} />
              <Route path="/delivery" element={<Policies type="delivery" />} />
              <Route path="/refund-policy" element={<Policies type="refund" />} />
              <Route path="/category/:slug" element={<CategoryPage />} />
            </Route>
          </Routes>
        </ProductProvider>
      </Router>
    </TooltipProvider>
  );
}

export default App;
