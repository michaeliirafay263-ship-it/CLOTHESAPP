import React, { useState } from 'react';
import {
  X,
  Star,
  Heart,
  ShoppingBag,
  Ruler,
  Check,
  Truck,
  ShieldCheck,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductSize, ProductColor } from '../../types';
import { formatTZS } from '../../data/locations';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    language,
    t,
    addToCart,
    isInWishlist,
    toggleWishlist,
    setIsSizeGuideOpen,
    setIsCartDrawerOpen
  } = useStore();

  if (!selectedProduct) return null;

  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<ProductSize>(
    selectedProduct.sizes.find(s => (selectedProduct.stock[s] || 0) > 0) || selectedProduct.sizes[0]
  );
  const [selectedColor, setSelectedColor] = useState<ProductColor>(selectedProduct.colors[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const [newReviewText, setNewReviewText] = useState<string>('');
  const [newReviewAuthor, setNewReviewAuthor] = useState<string>('');
  const [newReviewRating, setNewReviewRating] = useState<number>(5);
  const [isReviewSubmitted, setIsReviewSubmitted] = useState<boolean>(false);

  const isLiked = isInWishlist(selectedProduct.id);
  const currentSizeStock = selectedProduct.stock[selectedSize] ?? 0;
  const isOutOfStock = currentSizeStock === 0;

  const handleAddToCart = (openDrawer = false) => {
    if (isOutOfStock) return;
    addToCart(selectedProduct, selectedSize, selectedColor, quantity);
    if (openDrawer) {
      setSelectedProduct(null);
      setIsCartDrawerOpen(true);
    }
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewText.trim() || !newReviewAuthor.trim()) return;
    selectedProduct.reviews.unshift({
      id: `rev-${Date.now()}`,
      author: newReviewAuthor.trim(),
      location: 'Dar es Salaam',
      rating: newReviewRating,
      date: new Date().toISOString().split('T')[0],
      comment: newReviewText.trim(),
      commentSw: newReviewText.trim()
    });
    selectedProduct.reviewCount += 1;
    setIsReviewSubmitted(true);
    setNewReviewText('');
    setNewReviewAuthor('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 shadow-modal">
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-20">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span>{selectedProduct.category.toUpperCase()}</span>
            <span>•</span>
            <span className="text-slate-900 font-bold">
              {language === 'sw' ? selectedProduct.subcategorySw : selectedProduct.subcategory}
            </span>
          </div>

          <button
            onClick={() => setSelectedProduct(null)}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
            {/* Left: Product Images Gallery */}
            <div className="md:col-span-6 space-y-3">
              {/* Main Photo */}
              <div className="relative h-80 sm:h-96 w-full rounded-xl bg-slate-100 overflow-hidden border border-slate-200">
                <img
                  src={selectedProduct.images[activeImageIndex] || selectedProduct.images[0]}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover object-center"
                />

                <button
                  onClick={() => toggleWishlist(selectedProduct.id)}
                  className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-colors shadow-subtle ${
                    isLiked
                      ? 'bg-rose-50 text-rose-600 border border-rose-200'
                      : 'bg-white/90 text-slate-600 hover:text-slate-900 hover:bg-white border border-slate-200'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-600' : ''}`} />
                </button>
              </div>

              {/* Thumbnails */}
              {selectedProduct.images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {selectedProduct.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                        activeImageIndex === idx
                          ? 'border-slate-900 shadow-subtle'
                          : 'border-slate-200 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="thumb" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Purchase Details */}
            <div className="md:col-span-6 space-y-5">
              <div>
                <div className="flex items-center gap-2 text-xs text-amber-600 font-bold mb-1">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map(st => (
                      <Star
                        key={st}
                        className={`w-3.5 h-3.5 ${
                          st <= Math.round(selectedProduct.rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-slate-700">
                    {selectedProduct.rating} {t('reviewsCount', { count: selectedProduct.reviewCount })}
                  </span>
                </div>

                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {language === 'sw' ? selectedProduct.nameSw : selectedProduct.name}
                </h1>

                {/* Price Display */}
                <div className="flex items-baseline gap-3 mt-3">
                  <span className="text-2xl font-extrabold text-slate-900">
                    {formatTZS(selectedProduct.price)}
                  </span>
                  {selectedProduct.originalPrice && (
                    <span className="text-sm text-slate-400 line-through">
                      {formatTZS(selectedProduct.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {language === 'sw' ? selectedProduct.descriptionSw : selectedProduct.description}
              </p>

              {/* Color Selector */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">{t('selectColor')}:</span>
                  <span className="text-slate-500 font-semibold">
                    {language === 'sw' ? selectedColor.nameSw : selectedColor.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {selectedProduct.colors.map(color => {
                    const isSelected = selectedColor.name === color.name;
                    return (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                          isSelected
                            ? 'border-slate-900 bg-slate-50 text-slate-900 ring-1 ring-slate-900'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-subtle shrink-0"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span>{language === 'sw' ? color.nameSw : color.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Size Selector */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-700">{t('selectSize')}:</span>
                    <span className="font-bold text-slate-900">{selectedSize}</span>
                  </div>
                  <button
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="text-xs font-bold text-brand-700 hover:text-brand-800 flex items-center gap-1"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>{t('sizeGuide')}</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedProduct.sizes.map(size => {
                    const stock = selectedProduct.stock[size] ?? 0;
                    const isSelected = selectedSize === size;
                    const isSizeOut = stock === 0;

                    return (
                      <button
                        key={size}
                        disabled={isSizeOut}
                        onClick={() => {
                          setSelectedSize(size);
                          setQuantity(1);
                        }}
                        className={`min-w-[44px] h-10 px-3 rounded-lg text-xs font-bold border transition-all flex flex-col items-center justify-center ${
                          isSelected
                            ? 'bg-slate-900 text-white border-slate-900 shadow-subtle'
                            : isSizeOut
                            ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed line-through'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                        }`}
                      >
                        <span>{size}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Stock Feedback */}
                <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
                  {isOutOfStock ? (
                    <span className="text-rose-600 font-bold">{t('outOfStock')}</span>
                  ) : currentSizeStock <= 3 ? (
                    <span className="text-amber-700 font-bold">
                      {t('lowStock', { count: currentSizeStock })}
                    </span>
                  ) : (
                    <span className="text-brand-700 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>{t('inStock')} ({currentSizeStock} available)</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Quantity & Actions */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                    <button
                      disabled={quantity <= 1 || isOutOfStock}
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-9 h-10 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-200 disabled:opacity-40 transition-colors"
                    >
                      -
                    </button>
                    <span className="w-10 text-center text-xs font-bold text-slate-900">
                      {quantity}
                    </span>
                    <button
                      disabled={quantity >= currentSizeStock || isOutOfStock}
                      onClick={() => setQuantity(Math.min(currentSizeStock, quantity + 1))}
                      className="w-9 h-10 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-200 disabled:opacity-40 transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <button
                    disabled={isOutOfStock}
                    onClick={() => handleAddToCart(false)}
                    className="flex-1 h-10 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-lg text-xs font-bold transition-colors shadow-subtle flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{t('addToCart')}</span>
                  </button>
                </div>

                <button
                  disabled={isOutOfStock}
                  onClick={() => handleAddToCart(true)}
                  className="w-full h-10 bg-brand-700 hover:bg-brand-800 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-lg text-xs font-bold transition-colors shadow-subtle flex items-center justify-center gap-2"
                >
                  <span>{t('proceedToCheckout')}</span>
                </button>
              </div>

              {/* Dar Delivery Promise */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-600 flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-brand-700 shrink-0" />
                <span>{t('deliveryPromise')}</span>
              </div>
            </div>
          </div>

          {/* Bottom Accordion: Fabric & Reviews */}
          <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fabric and Care Info */}
            <div className="space-y-3 bg-slate-50 rounded-xl p-4 border border-slate-200">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                {t('materialDetails')} & {t('careGuide')}
              </h4>
              <div className="text-xs text-slate-600 space-y-1.5">
                <p>
                  <strong className="text-slate-900">Fabric: </strong>
                  {language === 'sw' ? selectedProduct.materialSw : selectedProduct.material}
                </p>
                <p>
                  <strong className="text-slate-900">Care: </strong>
                  {language === 'sw' ? selectedProduct.careInstructionsSw : selectedProduct.careInstructions}
                </p>
              </div>
            </div>

            {/* Customer Reviews Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                  {t('customerReviews')} ({selectedProduct.reviews.length})
                </h4>
              </div>

              {/* Reviews List */}
              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                {selectedProduct.reviews.map(rev => (
                  <div key={rev.id} className="p-3 bg-white border border-slate-200 rounded-lg text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{rev.author}</span>
                      <span className="text-[10px] text-slate-400">{rev.location}</span>
                    </div>
                    <div className="flex items-center text-amber-500">
                      {[1, 2, 3, 4, 5].map(st => (
                        <Star
                          key={st}
                          className={`w-3 h-3 ${st <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                        />
                      ))}
                    </div>
                    <p className="text-slate-600">
                      {language === 'sw' && rev.commentSw ? rev.commentSw : rev.comment}
                    </p>
                  </div>
                ))}
              </div>

              {/* Add Review Form */}
              <form onSubmit={handleAddReview} className="space-y-2 pt-2">
                <input
                  type="text"
                  placeholder="Your Name (e.g. Neema, Masaki)"
                  value={newReviewAuthor}
                  onChange={e => setNewReviewAuthor(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-slate-400"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Write your review on fabric and fit..."
                    value={newReviewText}
                    onChange={e => setNewReviewText(e.target.value)}
                    className="flex-1 text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-slate-400"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800"
                  >
                    Post
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
