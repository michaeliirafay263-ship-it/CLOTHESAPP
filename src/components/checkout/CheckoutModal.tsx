import React, { useState } from 'react';
import {
  X,
  MapPin,
  Phone,
  User,
  Truck,
  CreditCard,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  Banknote
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { PaymentMethod } from '../../types';
import { formatTZS } from '../../data/locations';
import { PaymentSimulationModal } from './PaymentSimulationModal';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderComplete: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderComplete
}) => {
  const {
    cart,
    cartTotal,
    appliedPromo,
    deliveryZones,
    selectedZone,
    setSelectedZone,
    createOrder,
    t,
    language,
    showToast
  } = useStore();

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState(selectedZone?.district || 'Kinondoni');
  const [selectedWard, setSelectedWard] = useState(selectedZone?.wards[0] || 'Sinza');
  const [streetLandmark, setStreetLandmark] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mpesa');
  
  // Payment Simulation State
  const [isSimulatingPayment, setIsSimulatingPayment] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const currentZone = deliveryZones.find(z => z.district === selectedDistrict) || deliveryZones[0];
  const deliveryFee = currentZone.fee;

  // Discount
  let discountAmount = 0;
  if (appliedPromo) {
    if (appliedPromo.discountPercent) {
      discountAmount = Math.round((cartTotal * appliedPromo.discountPercent) / 100);
    } else if (appliedPromo.discountAmount) {
      discountAmount = appliedPromo.discountAmount;
    }
  }

  const grandTotal = Math.max(0, cartTotal - discountAmount + deliveryFee);

  const handleDistrictChange = (districtName: string) => {
    setSelectedDistrict(districtName);
    const found = deliveryZones.find(z => z.district === districtName);
    if (found) {
      setSelectedZone(found);
      setSelectedWard(found.wards[0] || '');
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!fullName.trim()) {
      errors.fullName = language === 'sw' ? 'Tafadhali weka jina lako kamili' : 'Please enter your full name';
    }
    const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 9) {
      errors.phoneNumber = language === 'sw' ? 'Weka namba sahihi ya simu (mf. 07...)' : 'Please enter a valid Tanzanian phone number';
    }
    if (!streetLandmark.trim()) {
      errors.streetLandmark = language === 'sw' ? 'Weka maelezo ya mtaa au alama maarufu' : 'Please provide street or landmark details';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (paymentMethod === 'cod') {
      // Cash on Delivery direct creation
      finalizeOrder(undefined, 'on_delivery');
    } else {
      // Prompt mobile money modal
      setIsSimulatingPayment(true);
    }
  };

  const finalizeOrder = (paymentRef?: string, payStatus: 'paid' | 'on_delivery' = 'paid') => {
    createOrder({
      customer: {
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        district: selectedDistrict,
        ward: selectedWard,
        streetLandmark: streetLandmark.trim(),
        deliveryNotes: deliveryNotes.trim()
      },
      items: cart,
      subtotal: cartTotal,
      deliveryFee,
      discount: discountAmount,
      total: grandTotal,
      status: 'new_order',
      paymentMethod,
      paymentReference: paymentRef,
      paymentStatus: payStatus
    });

    setIsSimulatingPayment(false);
    onClose();
    onOrderComplete();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 shadow-modal my-auto">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-20">
            <div>
              <h2 className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight">
                {t('checkoutTitle')}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {t('checkoutGuestNotice')}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
            {/* Step 1: Customer & Delivery Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2">
                <User className="w-4 h-4 text-brand-700" />
                <span>1. {language === 'sw' ? 'Taarifa za Mteja & Usafiri' : 'Customer & Delivery Information'}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    {t('fullName')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder={t('fullNamePlaceholder')}
                    className={`w-full text-xs p-2.5 rounded-lg border bg-white focus:outline-none ${
                      formErrors.fullName ? 'border-rose-500' : 'border-slate-300 focus:border-slate-900'
                    }`}
                  />
                  {formErrors.fullName && (
                    <p className="text-[11px] text-rose-600 font-semibold">{formErrors.fullName}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    {t('phoneNumber')} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                    placeholder={t('phonePlaceholder')}
                    className={`w-full text-xs p-2.5 rounded-lg border bg-white focus:outline-none ${
                      formErrors.phoneNumber ? 'border-rose-500' : 'border-slate-300 focus:border-slate-900'
                    }`}
                  />
                  {formErrors.phoneNumber && (
                    <p className="text-[11px] text-rose-600 font-semibold">{formErrors.phoneNumber}</p>
                  )}
                </div>
              </div>

              {/* District & Ward */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    {t('district')} *
                  </label>
                  <select
                    value={selectedDistrict}
                    onChange={e => handleDistrictChange(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-slate-900 font-medium"
                  >
                    {deliveryZones.map(zone => (
                      <option key={zone.id} value={zone.district}>
                        {language === 'sw' ? zone.districtSw : zone.district} (+{formatTZS(zone.fee)})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    {t('ward')} *
                  </label>
                  <select
                    value={selectedWard}
                    onChange={e => setSelectedWard(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-slate-900 font-medium"
                  >
                    {currentZone.wards.map(ward => (
                      <option key={ward} value={ward}>
                        {ward}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Street / Landmark */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  {t('streetLandmark')} *
                </label>
                <input
                  type="text"
                  required
                  value={streetLandmark}
                  onChange={e => setStreetLandmark(e.target.value)}
                  placeholder={t('streetPlaceholder')}
                  className={`w-full text-xs p-2.5 rounded-lg border bg-white focus:outline-none ${
                    formErrors.streetLandmark ? 'border-rose-500' : 'border-slate-300 focus:border-slate-900'
                  }`}
                />
                {formErrors.streetLandmark && (
                  <p className="text-[11px] text-rose-600 font-semibold">{formErrors.streetLandmark}</p>
                )}
              </div>

              {/* Delivery Notes */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  {t('deliveryNotes')}
                </label>
                <input
                  type="text"
                  value={deliveryNotes}
                  onChange={e => setDeliveryNotes(e.target.value)}
                  placeholder={t('notesPlaceholder')}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-slate-900"
                />
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2">
                <CreditCard className="w-4 h-4 text-brand-700" />
                <span>2. {t('paymentMethodTitle')}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* M-Pesa */}
                <label
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'mpesa'
                      ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="mpesa"
                    checked={paymentMethod === 'mpesa'}
                    onChange={() => setPaymentMethod('mpesa')}
                    className="mt-0.5 text-slate-900 focus:ring-slate-900"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                      Vodacom M-Pesa
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {language === 'sw' ? 'Ombi la PIN litatumwa kwenye simu' : 'Fast push prompt to your phone'}
                    </p>
                  </div>
                </label>

                {/* Tigo Pesa */}
                <label
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'tigopesa'
                      ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="tigopesa"
                    checked={paymentMethod === 'tigopesa'}
                    onChange={() => setPaymentMethod('tigopesa')}
                    className="mt-0.5 text-slate-900 focus:ring-slate-900"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                      Tigo Pesa (Mixx)
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {language === 'sw' ? 'Lipa kwa Tigo Pesa papo hapo' : 'Direct payment via Tigo wallet'}
                    </p>
                  </div>
                </label>

                {/* Airtel Money */}
                <label
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'airtel'
                      ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="airtel"
                    checked={paymentMethod === 'airtel'}
                    onChange={() => setPaymentMethod('airtel')}
                    className="mt-0.5 text-slate-900 focus:ring-slate-900"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-600"></span>
                      Airtel Money
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {language === 'sw' ? 'Ombi la Airtel Money' : 'Instant Airtel prompt'}
                    </p>
                  </div>
                </label>

                {/* Cash on Delivery */}
                <label
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-0.5 text-slate-900 focus:ring-slate-900"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Banknote className="w-3.5 h-3.5 text-emerald-700" />
                      {t('payCOD')}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {language === 'sw' ? 'Lipa msafirishaji akikabidhi mzigo' : 'Pay rider upon parcel arrival'}
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Order Summary Snapshot */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between font-medium">
                <span>{t('subtotal')} ({cart.length} items)</span>
                <span className="text-slate-900 font-bold">{formatTZS(cartTotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>{t('discount')} ({appliedPromo?.code})</span>
                  <span>- {formatTZS(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between font-medium">
                <span>{t('deliveryFee')} ({selectedDistrict})</span>
                <span className="text-slate-900 font-bold">{formatTZS(deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                <span>{t('orderTotal')}</span>
                <span className="text-base text-brand-700">{formatTZS(grandTotal)}</span>
              </div>
            </div>

            {/* Submit CTA */}
            <div className="space-y-2 pt-2">
              <button
                type="submit"
                className="w-full py-3.5 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-extrabold tracking-wider uppercase transition-colors shadow-subtle flex items-center justify-center gap-2"
              >
                <span>{t('placeOrder')} • {formatTZS(grandTotal)}</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Encrypted & Safe Dar es Salaam Express Checkout</span>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Mobile Money Prompt Simulation */}
      <PaymentSimulationModal
        isOpen={isSimulatingPayment}
        amount={grandTotal}
        paymentMethod={paymentMethod}
        phoneNumber={phoneNumber || '07XXXXXXXX'}
        onSuccess={reference => finalizeOrder(reference, 'paid')}
        onCancel={() => setIsSimulatingPayment(false)}
      />
    </>
  );
};
