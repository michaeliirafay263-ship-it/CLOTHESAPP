import React from 'react';
import { Heart, Star, ShoppingBag, Eye } from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { formatTZS } from '../../data/locations';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    language,
    t,
    setSelectedProduct,
    isInWishlist,
    toggleWishlist,
    addToCart
  } = useStore();

  const isLiked = isInWishlist(product.id);

  // Total stock across sizes
  const totalStock = Object.values(product.stock).reduce((a, b) => a + b, 0);
  const isOutOfStock = totalStock === 0;
  const isLowStock = totalStock > 0 && totalStock <= 4;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    // Default to first available size and color
    const availableSize = product.sizes.find(s => (product.stock[s] || 0) > 0) || product.sizes[0];
    addToCart(product, availableSize, product.colors[0], 1);
  };

  return (
    <div
      onClick={() => setSelectedProduct(product)}
      className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-400 hover:shadow-card transition-all cursor-pointer flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="relative h-64 sm:h-72 w-full bg-slate-100 overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-300"
        />

        {/* Badges (Top Left) */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 items-start">
          {product.isBestSeller && (
            <span className="bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-subtle">
              {language === 'sw' ? 'Inayopendwa' : 'Best Seller'}
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-brand-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-subtle">
              {language === 'sw' ? 'Mpya' : 'New Drop'}
            </span>
          )}
          {isOutOfStock ? (
            <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
              {t('outOfStock')}
            </span>
          ) : isLowStock ? (
            <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
              {t('lowStock', { count: totalStock })}
            </span>
          ) : null}
        </div>

        {/* Wishlist Button (Top Right) */}
        <button
          onClick={e => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-subtle ${
            isLiked
              ? 'bg-rose-50 text-rose-600 border border-rose-200'
              : 'bg-white/90 text-slate-600 hover:text-slate-900 hover:bg-white border border-slate-200'
          }`}
          title={isLiked ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-600' : ''}`} />
        </button>

        {/* Quick View Button Hover Overlay */}
        <div className="absolute inset-x-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5">
          <button
            onClick={e => {
              e.stopPropagation();
              setSelectedProduct(product);
            }}
            className="flex-1 py-2 bg-white/95 hover:bg-white text-slate-900 rounded-lg text-xs font-bold shadow-subtle border border-slate-200 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{t('quickView')}</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
        <div>
          {/* Subcategory and Rating */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>{language === 'sw' ? product.subcategorySw : product.subcategory}</span>
            <div className="flex items-center gap-1 text-slate-700 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="font-bold text-sm text-slate-900 line-clamp-2 group-hover:text-brand-700 transition-colors">
            {language === 'sw' ? product.nameSw : product.name}
          </h3>

          {/* Color swatches */}
          <div className="flex items-center gap-1.5 mt-2">
            {product.colors.map(color => (
              <span
                key={color.name}
                className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-subtle"
                style={{ backgroundColor: color.hex }}
                title={language === 'sw' ? color.nameSw : color.name}
              />
            ))}
            <span className="text-[11px] text-slate-500 ml-1">
              {product.sizes.join(', ')}
            </span>
          </div>
        </div>

        {/* Price & Quick Add */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="font-extrabold text-base text-slate-900">
              {formatTZS(product.price)}
            </div>
            {product.originalPrice && (
              <div className="text-xs text-slate-400 line-through">
                {formatTZS(product.originalPrice)}
              </div>
            )}
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-subtle"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('addToCart')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
