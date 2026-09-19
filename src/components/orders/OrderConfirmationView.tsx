import React from 'react';
import {
  CheckCircle2,
  MessageCircle,
  Truck,
  ArrowRight,
  Printer,
  Copy,
  Clock,
  ShieldCheck,
  MapPin,
  Calendar,
  CreditCard
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatTZS } from '../../data/locations';

export const OrderConfirmationView: React.FC = () => {
  const { activeOrder, setActiveView, t, language, showToast } = useStore();

  if (!activeOrder) {
    return (
      <div className="py-16 text-center space-y-4">
        <p className="text-slate-500 font-medium">{t('orderNotFound')}</p>
        <button
          onClick={() => setActiveView('home')}
          className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
        >
          {t('continueShopping')}
        </button>
      </div>
    );
  }

  const copyOrderId = () => {
    navigator.clipboard.writeText(activeOrder.id);
    showToast(`Order ID #${activeOrder.id} copied!`, 'info');
  };

  // WhatsApp Message Generator
  const generateWhatsAppLink = () => {
    const phone = '255754000000'; // Michaeli / Store Owner WhatsApp number
    const itemsSummary = activeOrder.items
      .map(
        i =>
          `- ${i.quantity}x ${i.product.name} (Size: ${i.selectedSize}, Color: ${i.selectedColor.name})`
      )
      .join('\n');

    const msg = `*NEW DARSTORE ORDER #${activeOrder.id}*\n\n` +
      `👤 *Customer:* ${activeOrder.customer.fullName}\n` +
      `📞 *Phone:* ${activeOrder.customer.phoneNumber}\n` +
      `📍 *Delivery Area:* ${activeOrder.customer.district} - ${activeOrder.customer.ward} (${activeOrder.customer.streetLandmark})\n\n` +
      `🛍️ *Items Ordered:*\n${itemsSummary}\n\n` +
      `💰 *Total:* ${formatTZS(activeOrder.total)}\n` +
      `💳 *Payment Method:* ${activeOrder.paymentMethod.toUpperCase()} (${activeOrder.paymentStatus.toUpperCase()})\n` +
      (activeOrder.paymentReference ? `🔢 *Ref:* ${activeOrder.paymentReference}\n` : '') +
      `\n_Please confirm dispatch time for Dar es Salaam rider!_`;

    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  };

  const statusSteps = [
    { key: 'new_order', label: t('statusNew') },
    { key: 'payment_confirmed', label: t('statusPaymentConfirmed') },
    { key: 'preparing', label: t('statusPreparing') },
    { key: 'out_for_delivery', label: t('statusOutForDelivery') },
    { key: 'delivered', label: t('statusDelivered') }
  ];

  const currentStepIndex = statusSteps.findIndex(s => s.key === activeOrder.status);

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Top Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 sm:p-8 text-center space-y-3">
        <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-subtle">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {t('orderConfirmedTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
          {t('orderConfirmedSub', { orderId: activeOrder.id })}
        </p>

        <div className="pt-2 flex items-center justify-center gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white border border-emerald-300 font-mono text-sm font-extrabold text-slate-900 shadow-subtle">
            <span>#{activeOrder.id}</span>
            <button
              onClick={copyOrderId}
              className="text-slate-400 hover:text-slate-700 transition-colors"
              title="Copy Order ID"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* WhatsApp Quick Link Card (PRD A10 / C11) */}
      <div className="bg-white border-2 border-emerald-600/30 rounded-2xl p-5 shadow-card flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-subtle">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900">{t('sendWhatsApp')}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{t('whatsAppSubtitle')}</p>
          </div>
        </div>

        <a
          href={generateWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-subtle flex items-center justify-center gap-2 shrink-0"
        >
          <MessageCircle className="w-4 h-4" />
          <span>WhatsApp Michaeli</span>
        </a>
      </div>

      {/* Order Status Stepper */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-subtle space-y-4">
        <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
          {t('statusTimeline')}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
          {statusSteps.map((step, idx) => {
            const isDone = currentStepIndex >= idx;
            const isCurrent = currentStepIndex === idx;

            return (
              <div
                key={step.key}
                className={`p-3 rounded-xl border text-xs flex flex-col justify-between space-y-2 ${
                  isCurrent
                    ? 'bg-slate-900 text-white border-slate-900 shadow-subtle'
                    : isDone
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                    : 'bg-slate-50 text-slate-400 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold">0{idx + 1}</span>
                  {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                </div>
                <div className="font-bold text-[11px] leading-tight">{step.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Details Receipt Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-subtle space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900">{t('orderSummary')}</h3>
            <p className="text-xs text-slate-500">
              Placed on {new Date(activeOrder.createdAt).toLocaleString()}
            </p>
          </div>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{t('printReceipt')}</span>
          </button>
        </div>

        {/* Customer & Delivery Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="space-y-1">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
              Customer
            </span>
            <p className="font-bold text-slate-900">{activeOrder.customer.fullName}</p>
            <p className="text-slate-600">{activeOrder.customer.phoneNumber}</p>
          </div>

          <div className="space-y-1">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
              Delivery Destination
            </span>
            <p className="font-bold text-slate-900">
              {activeOrder.customer.district} — {activeOrder.customer.ward}
            </p>
            <p className="text-slate-600">{activeOrder.customer.streetLandmark}</p>
          </div>
        </div>

        {/* Items List */}
        <div className="divide-y divide-slate-100">
          {activeOrder.items.map(item => (
            <div key={item.id} className="py-3 flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-12 h-14 object-cover rounded-lg bg-slate-100 border border-slate-200 shrink-0"
                />
                <div>
                  <h4 className="font-bold text-slate-900">
                    {language === 'sw' ? item.product.nameSw : item.product.name}
                  </h4>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Size: {item.selectedSize} • {language === 'sw' ? item.selectedColor.nameSw : item.selectedColor.name} • Qty: {item.quantity}
                  </p>
                </div>
              </div>
              <span className="font-bold text-slate-900">
                {formatTZS(item.unitPrice * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="border-t border-slate-200 pt-4 space-y-1.5 text-xs text-slate-600">
          <div className="flex justify-between">
            <span>{t('subtotal')}</span>
            <span className="font-bold text-slate-900">{formatTZS(activeOrder.subtotal)}</span>
          </div>
          {activeOrder.discount > 0 && (
            <div className="flex justify-between text-emerald-700 font-semibold">
              <span>{t('discount')}</span>
              <span>- {formatTZS(activeOrder.discount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>{t('deliveryFee')}</span>
            <span className="font-bold text-slate-900">{formatTZS(activeOrder.deliveryFee)}</span>
          </div>
          <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
            <span>{t('orderTotal')}</span>
            <span className="text-base text-brand-700">{formatTZS(activeOrder.total)}</span>
          </div>
        </div>
      </div>

      {/* Action Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          onClick={() => setActiveView('orders')}
          className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors shadow-subtle flex items-center justify-center gap-2"
        >
          <Truck className="w-4 h-4" />
          <span>{t('trackThisOrder')}</span>
        </button>

        <button
          onClick={() => setActiveView('catalog')}
          className="w-full sm:w-auto px-5 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
        >
          <span>{t('continueShopping')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
