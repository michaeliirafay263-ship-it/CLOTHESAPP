import React, { useState } from 'react';
import {
  Search,
  Globe,
  ShoppingBag,
  X,
  MapPin,
  LogIn,
  User,
  LogOut
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const Header: React.FC = () => {
  const {
    language,
    setLanguage,
    t,
    searchQuery,
    setSearchQuery,
    activeView,
    setActiveView,
    cartItemsCount,
    setIsCartDrawerOpen,
    products,
    setSelectedProduct,
    currentUser,
    logout
  } = useStore();

  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Search suggestions
  const matchingProducts = searchQuery.trim()
    ? products
        .filter(p =>
          (language === 'sw' ? p.nameSw : p.name)
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          p.subcategory.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const handleSelectSuggestion = (prod: typeof products[0]) => {
    setSelectedProduct(prod);
    setSearchQuery('');
    setIsSearchFocused(false);
  };

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-slate-200">
      {/* Top Notice Bar */}
      <div className="bg-slate-900 text-white text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
        <MapPin className="w-3.5 h-3.5 text-brand-400 shrink-0" />
        <span className="truncate">{t('topBanner')}</span>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Mobile Brand Logo */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={() => setActiveView('home')}
            className="flex items-center gap-2 text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
              C
            </div>
            <div>
              <span className="font-extrabold text-base text-slate-900 tracking-tight">clothesAPP</span>
            </div>
          </button>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-xl relative">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                if (e.target.value) setActiveView('catalog');
              }}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              placeholder={t('searchPlaceholder')}
              className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-sm text-slate-900 placeholder:text-slate-400 rounded-xl pl-10 pr-9 py-2 border border-transparent focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Search Autocomplete Dropdown */}
          {isSearchFocused && matchingProducts.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-modal border border-slate-200 overflow-hidden z-50">
              <div className="p-2 text-[11px] font-bold uppercase text-slate-400 border-b border-slate-100">
                Matching Clothes ({matchingProducts.length})
              </div>
              <div className="divide-y divide-slate-100">
                {matchingProducts.map(prod => (
                  <button
                    key={prod.id}
                    onMouseDown={() => handleSelectSuggestion(prod)}
                    className="w-full px-3 py-2 text-left flex items-center gap-3 hover:bg-slate-50 transition-colors"
                  >
                    <img
                      src={prod.images[0]}
                      alt={prod.name}
                      className="w-10 h-10 object-cover rounded-md bg-slate-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-900 truncate">
                        {language === 'sw' ? prod.nameSw : prod.name}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        TZS {prod.price.toLocaleString()} • {prod.subcategory}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* User Account Button (Mobile & Desktop) */}
          {currentUser ? (
            <button
              onClick={() => {
                if (currentUser.role === 'rider') setActiveView('rider_dashboard');
                else if (currentUser.role === 'admin') setActiveView('admin_dashboard');
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700"
            >
              <User className="w-3.5 h-3.5 text-brand-700" />
              <span className="hidden sm:inline">{currentUser.name.split(' ')[0]}</span>
            </button>
          ) : (
            <button
              onClick={() => setActiveView('login')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}

          {/* Language Switch */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'sw' : 'en')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors"
            title="Toggle Language"
          >
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span className="uppercase">{language === 'en' ? 'SW' : 'EN'}</span>
          </button>

          {/* Header Cart Button */}
          <button
            onClick={() => setIsCartDrawerOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors shadow-subtle"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">{t('cart')}</span>
            <span className="bg-brand-600 text-white px-1.5 py-0.2 rounded-full text-[11px]">
              {cartItemsCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
