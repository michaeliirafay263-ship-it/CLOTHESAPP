import React from 'react';
import { ArrowRight, Truck, PhoneCall, RefreshCw, Sparkles, MapPin } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const HeroBanner: React.FC = () => {
  const { t, setActiveView, setSelectedCategory, language } = useStore();

  return (
    <div className="space-y-6">
      {/* Main Hero Card */}
      <div className="relative bg-slate-900 text-white rounded-2xl overflow-hidden border border-slate-800 shadow-float">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          {/* Left Text Content */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 space-y-6 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-brand-400 text-xs font-semibold">
              <MapPin className="w-3.5 h-3.5" />
              <span>{language === 'sw' ? 'Maduka & Ghala Dar es Salaam' : 'Kariakoo & Masaki Delivery Hubs'}</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                {t('heroTitle')}
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
                {t('heroSubtitle')}
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setActiveView('catalog');
                }}
                className="px-6 py-3 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-sm font-bold transition-all shadow-subtle flex items-center gap-2"
              >
                <span>{t('heroShopNow')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveView('orders')}
                className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2"
              >
                <Truck className="w-4 h-4 text-brand-400" />
                <span>{t('heroTrackOrder')}</span>
              </button>
            </div>
          </div>

          {/* Right Hero Image */}
          <div className="lg:col-span-5 relative h-64 lg:h-[400px] w-full bg-slate-800">
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=80"
              alt="Dar es Salaam Fashion"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-slate-950/20 lg:bg-transparent pointer-events-none"></div>
          </div>
        </div>
      </div>

      {/* 3 Core Value Props */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Feature 1 */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-3 shadow-subtle">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">{t('heroFeatureDelivery')}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{t('heroFeatureDeliverySub')}</p>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-3 shadow-subtle">
          <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">{t('heroFeaturePayment')}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{t('heroFeaturePaymentSub')}</p>
          </div>
        </div>

        {/* Feature 3 */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-3 shadow-subtle">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">{t('heroFeatureExchange')}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{t('heroFeatureExchangeSub')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
