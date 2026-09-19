import React, { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal, ArrowUpDown, X, Sparkles, Check } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';
import { GenderCategory, ProductSize } from '../../types';

export const ProductCatalog: React.FC = () => {
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    t,
    language
  } = useStore();

  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [maxPrice, setMaxPrice] = useState<number>(100000);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('featured');
  const [isFilterMobileOpen, setIsFilterMobileOpen] = useState<boolean>(false);

  const allAvailableSizes: ProductSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '30', '32', '34', '36', '38', 'Free Size'];

  // Filtering and Sorting
  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        // Category
        if (selectedCategory !== 'all' && p.category !== selectedCategory) {
          return false;
        }

        // Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const name = (language === 'sw' ? p.nameSw : p.name).toLowerCase();
          const desc = (language === 'sw' ? p.descriptionSw : p.description).toLowerCase();
          const subcat = p.subcategory.toLowerCase();
          if (!name.includes(q) && !desc.includes(q) && !subcat.includes(q)) {
            return false;
          }
        }

        // Size
        if (selectedSize !== 'all' && !p.sizes.includes(selectedSize as ProductSize)) {
          return false;
        }

        // In Stock
        if (inStockOnly) {
          const totalStock = Object.values(p.stock).reduce((a, b) => a + b, 0);
          if (totalStock === 0) return false;
        }

        // Max Price
        if (p.price > maxPrice) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, selectedCategory, searchQuery, selectedSize, inStockOnly, maxPrice, sortBy, language]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedSize('all');
    setInStockOnly(false);
    setMaxPrice(100000);
    setSearchQuery('');
    setSortBy('featured');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedSize !== 'all' ||
    inStockOnly ||
    maxPrice < 100000 ||
    searchQuery.trim().length > 0;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t('catalogTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t('resultsCount', { count: filteredProducts.length })}
          </p>
        </div>

        {/* Sort and Mobile Filter Toggle */}
        <div className="flex items-center gap-3">
          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 shadow-subtle">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">{t('sortBy')}:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              aria-label={t('sortBy')}
              className="bg-transparent border-none focus:outline-none font-bold text-slate-900 cursor-pointer"
            >
              <option value="featured">{t('sortFeatured')}</option>
              <option value="price-asc">{t('sortPriceLowHigh')}</option>
              <option value="price-desc">{t('sortPriceHighLow')}</option>
              <option value="newest">{t('sortNewest')}</option>
              <option value="rating">{t('sortRating')}</option>
            </select>
          </div>

          {/* Filter toggle button */}
          <button
            onClick={() => setIsFilterMobileOpen(!isFilterMobileOpen)}
            className="flex items-center gap-2 px-3 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-subtle hover:bg-slate-800 transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters {hasActiveFilters && '(Active)'}</span>
          </button>
        </div>
      </div>

      {/* Category Tabs (Quick Switcher) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'all', label: t('filterAll') },
          { id: 'men', label: t('navMen') },
          { id: 'women', label: t('navWomen') },
          { id: 'kids', label: t('navKids') },
          { id: 'accessories', label: t('navAccessories') }
        ].map(cat => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as GenderCategory)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-slate-900 text-white shadow-subtle'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Expandable Filter Panel */}
      {isFilterMobileOpen && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-card space-y-5 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
              <Filter className="w-4 h-4 text-brand-700" />
              <span>Filter Options</span>
            </div>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>{t('clearFilters')}</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Size Filter */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase text-slate-500">
                {t('filterSize')}
              </label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedSize('all')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                    selectedSize === 'all'
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  All
                </button>
                {allAvailableSizes.map(sz => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                      selectedSize === sz
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Max Filter */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold uppercase text-slate-500">
                  {t('filterPrice')}
                </label>
                <span className="font-bold text-slate-900">
                  Up to TZS {maxPrice.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="20000"
                max="100000"
                step="5000"
                value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
                aria-label={t('filterPrice')}
                className="w-full accent-brand-700 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>TZS 20,000</span>
                <span>TZS 100,000</span>
              </div>
            </div>

            {/* In Stock & Clear */}
            <div className="space-y-3 flex flex-col justify-between">
              <label className="block text-xs font-bold uppercase text-slate-500">
                Availability
              </label>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={e => setInStockOnly(e.target.checked)}
                  className="rounded border-slate-300 text-brand-700 focus:ring-brand-700 w-4 h-4"
                />
                <span>{t('filterInStockOnly')}</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Active Search / Filter Banner */}
      {searchQuery && (
        <div className="bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs">
          <div className="text-slate-700">
            Showing search results for: <span className="font-bold text-slate-900">"{searchQuery}"</span>
          </div>
          <button
            onClick={() => setSearchQuery('')}
            className="text-slate-500 hover:text-slate-800 font-bold flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      )}

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4 shadow-subtle">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Filter className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="font-bold text-base text-slate-900">{t('noProductsFound')}</h3>
            <p className="text-xs text-slate-500">{t('noProductsSub')}</p>
          </div>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors shadow-subtle"
          >
            {t('clearFilters')}
          </button>
        </div>
      )}
    </div>
  );
};
