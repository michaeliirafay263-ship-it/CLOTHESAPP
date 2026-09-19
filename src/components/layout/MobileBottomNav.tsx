import React from 'react';
import { Home, Grid, Heart, ShoppingBag, Truck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const MobileBottomNav: React.FC = () => {
  const {
    activeView,
    setActiveView,
    cartItemsCount,
    wishlist,
    t,
    setSelectedCategory,
    setIsCartDrawerOpen
  } = useStore();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 px-2 py-2 safe-area-pb shadow-float">
      <div className="flex items-center justify-around">
        {/* Home */}
        <button
          onClick={() => {
            setActiveView('home');
            setSelectedCategory('all');
          }}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[11px] font-semibold transition-colors ${
            activeView === 'home'
              ? 'text-brand-700 font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Home className={`w-5 h-5 mb-0.5 ${activeView === 'home' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
          <span>{t('navHome')}</span>
        </button>

        {/* Shop */}
        <button
          onClick={() => {
            setActiveView('catalog');
          }}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[11px] font-semibold transition-colors ${
            activeView === 'catalog'
              ? 'text-brand-700 font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Grid className={`w-5 h-5 mb-0.5 ${activeView === 'catalog' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
          <span>{t('navShop')}</span>
        </button>

        {/* Wishlist */}
        <button
          onClick={() => setActiveView('wishlist')}
          className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[11px] font-semibold transition-colors ${
            activeView === 'wishlist'
              ? 'text-brand-700 font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <div className="relative">
            <Heart className={`w-5 h-5 mb-0.5 ${activeView === 'wishlist' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-2 bg-slate-900 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </div>
          <span>{t('navWishlist')}</span>
        </button>

        {/* Cart */}
        <button
          onClick={() => setIsCartDrawerOpen(true)}
          className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[11px] font-semibold transition-colors ${
            activeView === 'cart'
              ? 'text-brand-700 font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 mb-0.5 stroke-2" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-brand-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                {cartItemsCount}
              </span>
            )}
          </div>
          <span>{t('cart')}</span>
        </button>

        {/* Orders / Track */}
        <button
          onClick={() => setActiveView('orders')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[11px] font-semibold transition-colors ${
            activeView === 'orders'
              ? 'text-brand-700 font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Truck className={`w-5 h-5 mb-0.5 ${activeView === 'orders' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
          <span>{t('orders')}</span>
        </button>
      </div>
    </div>
  );
};
