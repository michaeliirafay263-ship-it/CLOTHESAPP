import React, { useState, useEffect } from 'react';
import { Smartphone, CheckCircle, Clock, ShieldCheck, X, AlertCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { PaymentMethod } from '../../types';
import { formatTZS } from '../../data/locations';

interface PaymentSimulationModalProps {
  isOpen: boolean;
  amount: number;
  paymentMethod: PaymentMethod;
  phoneNumber: string;
  onSuccess: (reference: string) => void;
  onCancel: () => void;
}

export const PaymentSimulationModal: React.FC<PaymentSimulationModalProps> = ({
  isOpen,
  amount,
  paymentMethod,
  phoneNumber,
  onSuccess,
  onCancel
}) => {
  const { t, language } = useStore();
  const [countdown, setCountdown] = useState<number>(60);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;
    setCountdown(60);
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const networkName =
    paymentMethod === 'mpesa'
      ? 'Vodacom M-Pesa'
      : paymentMethod === 'tigopesa'
      ? 'Tigo Pesa (Mixx)'
      : paymentMethod === 'airtel'
      ? 'Airtel Money'
      : 'Halopesa';

  const networkColor =
    paymentMethod === 'mpesa'
      ? 'bg-rose-600'
      : paymentMethod === 'tigopesa'
      ? 'bg-blue-600'
      : paymentMethod === 'airtel'
      ? 'bg-red-600'
      : 'bg-orange-600';

  const handleSimulatePin = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const ref = `TZ-${paymentMethod.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
      setIsProcessing(false);
      onSuccess(ref);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-modal overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg ${networkColor} text-white flex items-center justify-center font-bold text-xs`}>
              TZ
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">{t('paymentPromptTitle')}</h3>
              <p className="text-[11px] text-slate-500">{networkName}</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-center">
          {/* Animated phone prompt indicator */}
          <div className="relative mx-auto w-16 h-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
            <Smartphone className="w-8 h-8 animate-pulse text-brand-700" />
          </div>

          <div className="space-y-1">
            <div className="text-2xl font-extrabold text-slate-900">{formatTZS(amount)}</div>
            <p className="text-xs text-slate-500">{t('paymentPromptSub')}</p>
          </div>

          {/* Details Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-left space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">{t('paymentNetwork')}:</span>
              <span className="font-bold text-slate-900">{networkName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{t('paymentPhone')}:</span>
              <span className="font-bold text-slate-900">{phoneNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Business / Till:</span>
              <span className="font-bold text-slate-900">DarStore Retail (584920)</span>
            </div>
          </div>

          {/* Waiting Status */}
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-600">
            <Clock className="w-4 h-4 text-amber-500 animate-spin" />
            <span>{t('paymentWaiting')}</span>
          </div>

          <div className="text-xs font-bold text-slate-400">
            {t('paymentCountdown', { seconds: countdown })}
          </div>

          {/* Simulation CTA */}
          <div className="space-y-2 pt-2">
            <button
              onClick={handleSimulatePin}
              disabled={isProcessing}
              className="w-full py-3 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold transition-colors shadow-subtle flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <span>Confirming PIN...</span>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>{t('simulateSuccess')}</span>
                </>
              )}
            </button>

            <button
              onClick={onCancel}
              className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              {t('cancelPayment')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
