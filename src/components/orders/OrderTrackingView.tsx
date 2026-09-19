import React, { useState } from 'react';
import {
  Truck,
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  MessageCircle,
  Package,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatTZS } from '../../data/locations';
import { Order, OrderStatus } from '../../types';

export const OrderTrackingView: React.FC = () => {
  const { orders, t, language } = useStore();
  const [searchInput, setSearchInput] = useState('');
  const [searched, setSearched] = useState(false);

  const filteredOrders = searchInput.trim()
    ? orders.filter(
        o =>
          o.id.toLowerCase().includes(searchInput.trim().toLowerCase()) ||
          o.customer.phoneNumber.includes(searchInput.trim()) ||
          o.customer.fullName.toLowerCase().includes(searchInput.trim().toLowerCase())
      )
    : orders.slice(0, 3); // show latest 3 by default

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-1 rounded-md">{t('statusDelivered')}</span>;
      case 'out_for_delivery':
        return <span className="bg-sky-100 text-sky-800 text-[11px] font-bold px-2.5 py-1 rounded-md">{t('statusOutForDelivery')}</span>;
      case 'preparing':
        return <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-1 rounded-md">{t('statusPreparing')}</span>;
      case 'payment_confirmed':
        return <span className="bg-purple-100 text-purple-800 text-[11px] font-bold px-2.5 py-1 rounded-md">{t('statusPaymentConfirmed')}</span>;
      case 'new_order':
        return <span className="bg-slate-100 text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded-md">{t('statusNew')}</span>;
      case 'cancelled':
        return <span className="bg-rose-100 text-rose-800 text-[11px] font-bold px-2.5 py-1 rounded-md">{t('statusCancelled')}</span>;
    }
  };

  const statusProgression: { key: OrderStatus; label: string }[] = [
    { key: 'new_order', label: t('statusNew') },
    { key: 'payment_confirmed', label: t('statusPaymentConfirmed') },
    { key: 'preparing', label: t('statusPreparing') },
    { key: 'out_for_delivery', label: t('statusOutForDelivery') },
    { key: 'delivered', label: t('statusDelivered') }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-subtle space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {t('trackOrderTitle')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              {t('trackOrderSub')}
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2 pt-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder={t('searchOrderInput')}
              className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-slate-900 bg-slate-50 focus:bg-white"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors shadow-subtle"
          >
            {t('searchButton')}
          </button>
        </form>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3 shadow-subtle">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-slate-900">{t('orderNotFound')}</p>
          <p className="text-xs text-slate-500">
            Check your receipt for your order ID (e.g. DAR-1082) or enter the phone number you used during checkout.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            {searchInput ? `Search Results (${filteredOrders.length})` : `Recent Orders (${filteredOrders.length})`}
          </div>

          {filteredOrders.map(order => {
            const currentStepIdx = statusProgression.findIndex(s => s.key === order.status);

            return (
              <div
                key={order.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-subtle space-y-5"
              >
                {/* Order Top Line */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-extrabold text-base text-slate-900">
                        #{order.id}
                      </span>
                      {getStatusBadge(order.status)}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(order.createdAt).toLocaleString()}</span>
                      <span>•</span>
                      <span>{order.customer.fullName} ({order.customer.phoneNumber})</span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-xs text-slate-500 block">Grand Total</span>
                    <span className="text-base font-extrabold text-slate-900">
                      {formatTZS(order.total)}
                    </span>
                  </div>
                </div>

                {/* Progress Bar / Steps */}
                <div className="space-y-2">
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {statusProgression.map((step, idx) => {
                      const isComplete = currentStepIdx >= idx;
                      const isCurrent = currentStepIdx === idx;

                      return (
                        <div
                          key={step.key}
                          className={`p-2.5 rounded-lg border text-xs ${
                            isCurrent
                              ? 'bg-slate-900 text-white border-slate-900 font-bold'
                              : isComplete
                              ? 'bg-emerald-50 text-emerald-900 border-emerald-200 font-semibold'
                              : 'bg-slate-50 text-slate-400 border-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px]">
                            <span>Step 0{idx + 1}</span>
                            {isComplete && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                          </div>
                          <div className="text-[11px] mt-1 line-clamp-1">{step.label}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Dispatch / Delivery Destination */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-800">
                        {order.customer.district} — {order.customer.ward}
                      </span>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        {order.customer.streetLandmark}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Package className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-800">
                        {order.items.length} item(s) in package
                      </span>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        {order.items.map(i => `${i.quantity}x ${i.product.name} (${i.selectedSize})`).join(', ')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Timeline Notes */}
                {order.timeline.length > 0 && (
                  <div className="border-t border-slate-100 pt-3">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Live Updates Log
                    </span>
                    <div className="space-y-1.5">
                      {order.timeline.map((log, index) => (
                        <div key={index} className="text-xs flex items-center justify-between text-slate-600">
                          <span className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-600"></span>
                            <span>{log.note || log.status.replace('_', ' ')}</span>
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
