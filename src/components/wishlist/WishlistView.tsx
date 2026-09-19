import React from 'react';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../catalog/ProductCard';

export const WishlistView: React.FC = () => {
  const { wishlist, products, t, setActiveView } = useStore();

  const savedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
            <span>{t('wishlistTitle')}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t('wishlistSubtitle')} ({savedProducts.length})
          </p>
        </div>

        <button
          onClick={() => setActiveView('catalog')}
          className="text-xs font-bold text-brand-700 hover:text-brand-800 flex items-center gap-1 self-start sm:self-auto"
        >
          <span>{t('viewAll')}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Products Grid */}
      {savedProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {savedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4 shadow-subtle">
          <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center mx-auto">
            <Heart className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="font-bold text-base text-slate-900">{t('wishlistEmpty')}</h3>
            <p className="text-xs text-slate-500">{t('wishlistEmptySub')}</p>
          </div>
          <button
            onClick={() => setActiveView('catalog')}
            className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors shadow-subtle"
          >
            {t('startShopping')}
          </button>
        </div>
      )}
    </div>
  );
};
