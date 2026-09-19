import React from 'react';
import {
  ShoppingBag,
  Home,
  Grid,
  Heart,
  Truck,
  Globe,
  Sparkles,
  ChevronRight,
  Shirt,
  User,
  Baby,
  LogOut,
  LogIn
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { GenderCategory } from '../../types';
import { formatTZS } from '../../data/locations';

export const DesktopSidebar: React.FC = () => {
  const {
    language,
    setLanguage,
    t,
    activeView,
    setActiveView,
    selectedCategory,
    setSelectedCategory,
    cartItemsCount,
    cartTotal,
    wishlist,
    setIsCartDrawerOpen,
    currentUser,
    logout
  } = useStore();

  const handleCategoryClick = (cat: GenderCategory) => {
    setSelectedCategory(cat);
    setActiveView('catalog');
  };

  const navCategories: { id: GenderCategory; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: t('navShop'), icon: <Grid className="w-4 h-4" /> },
    { id: 'men', label: t('navMen'), icon: <Shirt className="w-4 h-4" /> },
    { id: 'women', label: t('navWomen'), icon: <Sparkles className="w-4 h-4" /> },
    { id: 'kids', label: t('navKids'), icon: <Baby className="w-4 h-4" /> },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-200 h-screen sticky top-0 shrink-0 z-30 select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <button
          onClick={() => {
            setActiveView('home');
            setSelectedCategory('all');
          }}
          className="flex items-center gap-3 text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xl tracking-tight shadow-subtle group-hover:bg-brand-700 transition-colors">
            C
          </div>
          <div>
            <div className="font-extrabold text-xl text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>clothesAPP</span>
              <span className="w-2 h-2 rounded-full bg-brand-600"></span>
            </div>
            <p className="text-xs text-slate-500 font-medium tracking-wide">
              {language === 'sw' ? 'Mavazi Dar es Salaam' : 'Fashion Store'}
            </p>
          </div>
        </button>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
        {/* Core Navigation */}
        <div className="space-y-1">
          <button
            onClick={() => setActiveView('home')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              activeView === 'home'
                ? 'bg-slate-900 text-white'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>{t('navHome')}</span>
          </button>

          <button
            onClick={() => {
              setSelectedCategory('all');
              setActiveView('catalog');
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              activeView === 'catalog' && selectedCategory === 'all'
                ? 'bg-slate-900 text-white'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <Grid className="w-4 h-4" />
              <span>{t('navShop')}</span>
            </div>
          </button>
        </div>

        {/* Categories Section */}
        <div>
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {t('filterCategory')}
          </div>
          <div className="space-y-1">
            {navCategories.filter(c => c.id !== 'all').map(cat => {
              const isActive = activeView === 'catalog' && selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-50 text-brand-800 font-semibold border border-brand-200'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {cat.icon}
                    <span>{cat.label}</span>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Customer Quick Links */}
        <div>
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {language === 'sw' ? 'Huduma za Mteja' : 'Customer Hub'}
          </div>
          <div className="space-y-1">
            <button
              onClick={() => setActiveView('wishlist')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeView === 'wishlist'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Heart className="w-4 h-4" />
                <span>{t('navWishlist')}</span>
              </div>
              {wishlist.length > 0 && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                  activeView === 'wishlist' ? 'bg-white text-slate-900' : 'bg-slate-200 text-slate-700'
                }`}>
                  {wishlist.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveView('orders')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeView === 'orders'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>{t('navTrackOrder')}</span>
            </button>
          </div>
        </div>

        {/* Cart Card Snapshot */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <ShoppingBag className="w-4 h-4 text-brand-600" />
              <span>{t('cart')}</span>
            </div>
            <span className="text-xs bg-slate-900 text-white px-2 py-0.5 rounded-full font-semibold">
              {cartItemsCount}
            </span>
          </div>
          <div className="text-xs text-slate-500 mb-3">
            {cartItemsCount === 0 ? t('cartEmpty') : `${formatTZS(cartTotal)}`}
          </div>
          <button
            onClick={() => setIsCartDrawerOpen(true)}
            disabled={cartItemsCount === 0}
            className="w-full py-2 px-3 bg-brand-700 hover:bg-brand-800 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-lg text-xs font-bold transition-colors shadow-subtle flex items-center justify-center gap-1.5"
          >
            <span>{t('proceedToCheckout')}</span>
          </button>
        </div>
      </div>

      {/* Footer Area: User Account & Language Selector */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-2">
        {/* User Account / Login Button */}
        {currentUser ? (
          <div className="p-2.5 bg-white border border-slate-200 rounded-xl space-y-1.5 shadow-subtle">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                  {currentUser.name.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 truncate max-w-[130px]">{currentUser.name}</p>
                  <p className="text-[10px] text-brand-700 font-bold uppercase">{currentUser.role}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="text-slate-400 hover:text-rose-600 p-1"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
            {currentUser.role === 'rider' && (
              <button
                onClick={() => setActiveView('rider_dashboard')}
                className="w-full py-1 text-[11px] font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors text-center"
              >
                Go to Rider Dashboard
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={() => setActiveView('login')}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors shadow-subtle"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In / Register</span>
          </button>
        )}

        {/* Language Switcher */}
        <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg p-1.5">
          <div className="flex items-center gap-2 pl-2 text-xs font-semibold text-slate-600">
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span>Language</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 text-xs rounded font-bold transition-colors ${
                language === 'en'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('sw')}
              className={`px-2 py-1 text-xs rounded font-bold transition-colors ${
                language === 'sw'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              SW
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
