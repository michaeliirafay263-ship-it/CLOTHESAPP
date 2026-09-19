import React, { useState } from 'react';
import { useStore, StoreProvider } from './context/StoreContext';
import { DesktopSidebar } from './components/layout/DesktopSidebar';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { Header } from './components/layout/Header';
import { HeroBanner } from './components/home/HeroBanner';
import { CategoryGrid } from './components/home/CategoryGrid';
import { ProductCard } from './components/catalog/ProductCard';
import { ProductCatalog } from './components/catalog/ProductCatalog';
import { ProductDetailModal } from './components/catalog/ProductDetailModal';
import { SizeGuideModal } from './components/catalog/SizeGuideModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { OrderConfirmationView } from './components/orders/OrderConfirmationView';
import { OrderTrackingView } from './components/orders/OrderTrackingView';
import { WishlistView } from './components/wishlist/WishlistView';
import { AdminLayout } from './components/admin/AdminLayout';
import { AuthPortal } from './components/auth/AuthPortal';
import { AdminLoginPage } from './components/auth/AdminLoginPage';
import { RiderDashboard } from './components/rider/RiderDashboard';
import { ToastContainer } from './components/ui/ToastContainer';
import { ArrowRight, MapPin, Phone, MessageCircle, Clock, ShieldCheck, RefreshCw } from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    activeView,
    setActiveView,
    products,
    t,
    language,
    currentUser
  } = useStore();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // 1. Independent Admin Login Route
  if (activeView === 'admin_login') {
    return (
      <>
        <AdminLoginPage />
        <ToastContainer />
      </>
    );
  }

  // 2. Dedicated Rider Dashboard Route
  if (activeView === 'rider_dashboard') {
    return (
      <>
        <RiderDashboard />
        <ToastContainer />
      </>
    );
  }

  // 3. Independent Admin Dashboard Route
  if (activeView === 'admin_dashboard') {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <AdminLayout />
        <ToastContainer />
      </div>
    );
  }

  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 4);
  const newArrivals = products.filter(p => p.isNewArrival).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col lg:flex-row font-sans">
      {/* Desktop Left-Side Navigation Sidebar */}
      <DesktopSidebar />

      {/* Main Content Scroll Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-0">
        {/* Top Header */}
        <Header />

        {/* Page Content Rendered Based on Active View */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          {/* Customer & Rider Auth Portal */}
          {activeView === 'login' && <AuthPortal />}

          {/* Standard Storefront Views */}
          {activeView === 'home' && (
            <div className="space-y-12 animate-fade-in">
              {/* Hero Banner */}
              <HeroBanner />

              {/* Category Navigation Tiles */}
              <CategoryGrid />

              {/* Featured This Week */}
              <section className="space-y-4">
                <div className="flex items-end justify-between">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                      {t('featuredTitle')}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      {t('featuredSubtitle')}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveView('catalog')}
                    className="text-xs sm:text-sm font-bold text-brand-700 hover:text-brand-800 flex items-center gap-1"
                  >
                    <span>{t('viewAll')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {featuredProducts.map(prod => (
                    <ProductCard key={prod.id} product={prod} />
                  ))}
                </div>
              </section>

              {/* Fresh New Arrivals */}
              <section className="space-y-4">
                <div className="flex items-end justify-between">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                      {t('newArrivalsTitle')}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      {t('newArrivalsSubtitle')}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveView('catalog')}
                    className="text-xs sm:text-sm font-bold text-brand-700 hover:text-brand-800 flex items-center gap-1"
                  >
                    <span>{t('viewAll')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {newArrivals.map(prod => (
                    <ProductCard key={prod.id} product={prod} />
                  ))}
                </div>
              </section>

              {/* Local Dar es Salaam Trust Banner */}
              <section className="bg-slate-900 text-white rounded-2xl p-6 sm:p-10 border border-slate-800 space-y-4 shadow-card">
                <div className="max-w-2xl space-y-2">
                  <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                    {language === 'sw'
                      ? 'Unanunua kutoka Kariakoo & Masaki bila shida ya foleni'
                      : 'Shop direct from Dar es Salaam without the traffic'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {language === 'sw'
                      ? 'Agiza nguo zako kwa dakika 2, lipa kwa M-Pesa au pindi dereva anapofika (Cash on Delivery). Saizi ikikosekana tunabadilisha haraka.'
                      : 'Place orders in under 2 minutes. Pay with mobile money or on delivery. If the size does not fit, our team arranges a swift exchange.'}
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-slate-300">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-brand-400" />
                    <span>Same-day Dar dispatch</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-brand-400" />
                    <span>Quality-inspected fabrics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-brand-400" />
                    <span>Easy size replacement</span>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeView === 'catalog' && <ProductCatalog />}
          {activeView === 'wishlist' && <WishlistView />}
          {activeView === 'orders' && <OrderTrackingView />}
        </main>

        {/* Global Footer */}
        {activeView !== 'login' && (
          <footer className="bg-white border-t border-slate-200 mt-16 text-slate-600 text-xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-3">
                <div className="flex items-center gap-2 font-extrabold text-base text-slate-900">
                  <span className="w-6 h-6 rounded-md bg-slate-900 text-white flex items-center justify-center text-xs">C</span>
                  <span>clothesAPP</span>
                </div>
                <p className="text-slate-500 leading-relaxed text-xs">
                  {language === 'sw'
                    ? 'Duka lako la kisasa la nguo Dar es Salaam. Usafirishaji wa haraka Kinondoni, Ilala, Temeke, Ubungo na Kigamboni.'
                    : 'Your modern clothes store in Dar es Salaam. Fast door-to-door delivery across all Dar districts.'}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  Dar Delivery Areas
                </h4>
                <ul className="space-y-1 text-slate-500">
                  <li>Kinondoni (Sinza, Masaki, Mikocheni)</li>
                  <li>Ilala (Kariakoo, Posta, Tabata)</li>
                  <li>Ubungo (Kimara, Shekilango)</li>
                  <li>Temeke & Kigamboni</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  Payment & Security
                </h4>
                <ul className="space-y-1 text-slate-500">
                  <li>Vodacom M-Pesa</li>
                  <li>Tigo Pesa (Mixx by Yas)</li>
                  <li>Airtel Money & Halopesa</li>
                  <li>Cash on Delivery (COD)</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  Store & Operations Contact
                </h4>
                <div className="space-y-1.5 text-slate-500">
                  <p className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>+255 754 000 000 (Michaeli)</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Kariakoo & Masaki Hubs, Dar</span>
                  </p>
                  <a
                    href="https://wa.me/255754000000"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-emerald-700 font-bold hover:underline pt-1"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Direct WhatsApp Contact</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 py-4 px-4 text-center text-slate-400 text-[11px]">
              © 2026 clothesAPP • Dar es Salaam, Tanzania.
            </div>
          </footer>
        )}
      </div>

      {/* Mobile Bottom Navigation Bar (<1024px) */}
      {activeView !== 'login' && <MobileBottomNav />}

      {/* Global Modals and Drawers */}
      <ProductDetailModal />
      <SizeGuideModal />
      <CartDrawer onOpenCheckout={() => setIsCheckoutOpen(true)} />
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderComplete={() => setActiveView('orders')}
      />
      <ToastContainer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
};

export default App;
