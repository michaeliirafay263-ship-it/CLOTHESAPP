import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Trash2,
  ArrowRight,
  Tag,
  ShieldCheck,
  Truck,
  Plus,
  Minus
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatTZS } from '../../data/locations';

interface CartDrawerProps {
  onOpenCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onOpenCheckout }) => {
  const {
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartTotal,
    cartItemsCount,
    language,
    t,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    deliveryZones,
    selectedZone,
    setSelectedZone,
    setActiveView
  } = useStore();

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  if (!isCartDrawerOpen) return null;

  // Calculate discount
  let discountAmount = 0;
  if (appliedPromo) {
    if (appliedPromo.discountPercent) {
      discountAmount = Math.round((cartTotal * appliedPromo.discountPercent) / 100);
    } else if (appliedPromo.discountAmount) {
      discountAmount = appliedPromo.discountAmount;
    }
  }

  const deliveryFee = selectedZone ? selectedZone.fee : 3000;
  const grandTotal = Math.max(0, cartTotal - discountAmount + (cart.length > 0 ? deliveryFee : 0));

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    if (!promoInput.trim()) return;
    const res = applyPromoCode(promoInput);
    if (!res.success) {
      setPromoError(res.message);
    } else {
      setPromoInput('');
    }
  };

  const handleCheckoutClick = () => {
    setIsCartDrawerOpen(false);
    onOpenCheckout();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartDrawerOpen(false)}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-200 flex flex-col shadow-modal">
          {/* Top Bar */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-brand-700" />
              <h2 className="font-bold text-base text-slate-900">{t('shoppingCart')}</h2>
              <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-full">
                {cartItemsCount}
              </span>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-sm text-slate-900">{t('cartEmpty')}</p>
                  <p className="text-xs text-slate-500">{t('cartEmptySub')}</p>
                </div>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    setActiveView('catalog');
                  }}
                  className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors shadow-subtle"
                >
                  {t('startShopping')}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map(item => (
                  <div
                    key={item.id}
                    className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-16 h-20 object-cover rounded-lg bg-white border border-slate-200 shrink-0"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-xs text-slate-900 line-clamp-1">
                            {language === 'sw' ? item.product.nameSw : item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-slate-400 hover:text-rose-600 transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 font-medium">
                          <span>Size: <strong className="text-slate-700">{item.selectedSize}</strong></span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-slate-300"
                              style={{ backgroundColor: item.selectedColor.hex }}
                            />
                            {language === 'sw' ? item.selectedColor.nameSw : item.selectedColor.name}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-200/60">
                        <span className="font-extrabold text-xs text-slate-900">
                          {formatTZS(item.unitPrice * item.quantity)}
                        </span>

                        {/* Quantity Buttons */}
                        <div className="flex items-center border border-slate-300 rounded-md bg-white">
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-100"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-slate-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-100"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Clear Cart link */}
                <div className="flex justify-end pt-1">
                  <button
                    onClick={clearCart}
                    className="text-[11px] text-slate-400 hover:text-rose-600 font-semibold flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear Cart</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Summary & Checkout Section */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 space-y-4">
              {/* Delivery District Selector Snapshot */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase text-slate-500 flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-brand-700" />
                  <span>{t('deliveryEstimate')} (Dar es Salaam)</span>
                </label>
                <select
                  value={selectedZone?.id || ''}
                  onChange={e => {
                    const zone = deliveryZones.find(z => z.id === e.target.value);
                    if (zone) setSelectedZone(zone);
                  }}
                  className="w-full text-xs font-semibold p-2 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-slate-400"
                >
                  {deliveryZones.map(zone => (
                    <option key={zone.id} value={zone.id}>
                      {language === 'sw' ? zone.districtSw : zone.district} — {formatTZS(zone.fee)} ({language === 'sw' ? zone.estimatedHoursSw : zone.estimatedHours})
                    </option>
                  ))}
                </select>
              </div>

              {/* Promo Code Input */}
              <div className="space-y-1">
                {appliedPromo ? (
                  <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                    <div className="flex items-center gap-1.5 font-bold">
                      <Tag className="w-3.5 h-3.5" />
                      <span>{appliedPromo.code} ({appliedPromo.discountPercent ? `${appliedPromo.discountPercent}% OFF` : `TZS ${appliedPromo.discountAmount?.toLocaleString()} OFF`})</span>
                    </div>
                    <button
                      onClick={removePromoCode}
                      className="text-emerald-700 hover:text-emerald-900 text-[11px] font-bold underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={e => setPromoInput(e.target.value)}
                      placeholder={t('promoCodePlaceholder')}
                      className="flex-1 text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-slate-400 uppercase"
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800"
                    >
                      {t('applyPromo')}
                    </button>
                  </form>
                )}
                {promoError && (
                  <p className="text-[11px] text-rose-600 font-semibold">{promoError}</p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-200">
                <div className="flex justify-between">
                  <span>{t('subtotal')}</span>
                  <span className="font-bold text-slate-900">{formatTZS(cartTotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>{t('discount')}</span>
                    <span>- {formatTZS(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>{t('deliveryFee')}</span>
                  <span className="font-bold text-slate-900">{formatTZS(deliveryFee)}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                  <span>{t('orderTotal')}</span>
                  <span className="text-base text-brand-700">{formatTZS(grandTotal)}</span>
                </div>
              </div>

              {/* Proceed to Checkout CTA */}
              <button
                onClick={handleCheckoutClick}
                className="w-full py-3 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-extrabold tracking-wide uppercase transition-all shadow-subtle flex items-center justify-center gap-2"
              >
                <span>{t('proceedToCheckout')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-center text-slate-400 font-medium">
                {t('checkoutFast')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
