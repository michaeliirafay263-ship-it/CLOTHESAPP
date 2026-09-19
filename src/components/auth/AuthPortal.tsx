import React, { useState } from 'react';
import {
  User,
  Bike,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  MapPin,
  Phone,
  FileText,
  KeyRound
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { UserRole } from '../../types';
import { DEMO_CREDENTIALS } from '../../data/mockAuth';

export const AuthPortal: React.FC = () => {
  const { login, register, setActiveView, language, showToast } = useStore();

  // Role selector: Customer vs Rider
  const [selectedRole, setSelectedRole] = useState<'customer' | 'rider'>('customer');
  // Auth mode: Login vs Register
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  
  // Rider specific fields
  const [vehicleType, setVehicleType] = useState('Boxer BM 150 (Boda Boda)');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [zone, setZone] = useState('Kinondoni & Ilala');

  // Error & Status
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDemoFill = () => {
    const creds = DEMO_CREDENTIALS[selectedRole];
    setEmail(creds.email);
    setPassword(creds.password);
    setErrorMsg('');
    showToast(`Loaded demo credentials for ${selectedRole.toUpperCase()}`, 'info');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    setTimeout(() => {
      if (authMode === 'login') {
        const res = login(email, password, selectedRole);
        if (!res.success) {
          setErrorMsg(res.message || 'Invalid email or password');
          setIsSubmitting(false);
        }
      } else {
        if (!name.trim()) {
          setErrorMsg('Please enter your full name');
          setIsSubmitting(false);
          return;
        }
        if (!email.trim() || !email.includes('@')) {
          setErrorMsg('Please provide a valid email address');
          setIsSubmitting(false);
          return;
        }
        if (password.length < 6) {
          setErrorMsg('Password must be at least 6 characters');
          setIsSubmitting(false);
          return;
        }

        const res = register(
          {
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim() || '0754000000',
            vehicleType,
            vehiclePlate: vehiclePlate.trim() || 'MC 123 ABC',
            zone
          },
          selectedRole
        );

        if (!res.success) {
          setErrorMsg(res.message || 'Registration failed');
          setIsSubmitting(false);
        }
      }
    }, 400);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full shadow-card overflow-hidden">
        {/* Top Header Banner */}
        <div className="p-6 sm:p-8 bg-slate-900 text-white text-center space-y-2 border-b border-slate-800">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-brand-400 text-xs font-bold mb-1">
            <span>clothesAPP • Dar es Salaam</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {authMode === 'login' ? 'Welcome Back' : 'Create an Account'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
            Sign in to access your clothes orders or delivery assignments.
          </p>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* 1. Clear Two-Option Role Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Select Your Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Customer Role Option */}
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('customer');
                  setErrorMsg('');
                  setEmail('');
                  setPassword('');
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                  selectedRole === 'customer'
                    ? 'border-slate-900 bg-slate-50 ring-2 ring-slate-900 shadow-subtle'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    selectedRole === 'customer'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-extrabold text-xs text-slate-900">
                    Continue as Customer
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                    Shop clothes, place orders & track
                  </div>
                </div>
              </button>

              {/* Rider Role Option */}
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('rider');
                  setErrorMsg('');
                  setEmail('');
                  setPassword('');
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                  selectedRole === 'rider'
                    ? 'border-slate-900 bg-slate-50 ring-2 ring-slate-900 shadow-subtle'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    selectedRole === 'rider'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Bike className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-extrabold text-xs text-slate-900">
                    Continue as Rider
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                    Deliver parcels & track earnings
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* 2. Login vs Register Tabs */}
          <div className="flex border-b border-slate-200">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setErrorMsg('');
              }}
              className={`flex-1 py-2.5 text-xs font-bold border-b-2 transition-colors ${
                authMode === 'login'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              Sign In ({selectedRole === 'customer' ? 'Customer' : 'Rider'})
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                setErrorMsg('');
              }}
              className={`flex-1 py-2.5 text-xs font-bold border-b-2 transition-colors ${
                authMode === 'register'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              Register New ({selectedRole === 'customer' ? 'Customer' : 'Rider'})
            </button>
          </div>

          {/* Error Message Box */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700">
              {errorMsg}
            </div>
          )}

          {/* 3. Authentication Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {authMode === 'register' && (
              <>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder={selectedRole === 'customer' ? 'e.g. Amina Mwamburi' : 'e.g. Juma Selemani'}
                      className="w-full text-xs pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-slate-900 bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="07XXXXXXXX or 06XXXXXXXX"
                      className="w-full text-xs pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-slate-900 bg-white"
                    />
                  </div>
                </div>

                {selectedRole === 'rider' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">
                        Vehicle Type
                      </label>
                      <input
                        type="text"
                        value={vehicleType}
                        onChange={e => setVehicleType(e.target.value)}
                        placeholder="e.g. Boxer BM 150"
                        className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">
                        Plate Number
                      </label>
                      <input
                        type="text"
                        value={vehiclePlate}
                        onChange={e => setVehiclePlate(e.target.value)}
                        placeholder="e.g. MC 492 EBD"
                        className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white uppercase"
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Email Field */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Email Address or Username *
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={
                    selectedRole === 'customer'
                      ? 'customer@clothesapp.tz'
                      : 'rider@clothesapp.tz'
                  }
                  className="w-full text-xs pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-slate-900 bg-white"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">
                  Password *
                </label>
                {authMode === 'login' && (
                  <button
                    type="button"
                    onClick={() => showToast('Demo Password Reminder: Use the Quick Demo Fill button below.', 'info')}
                    className="text-[11px] font-semibold text-slate-500 hover:text-slate-800"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full text-xs pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-slate-900 bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-brand-700 hover:bg-brand-800 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-subtle flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>
                    {authMode === 'login'
                      ? `Sign In as ${selectedRole === 'customer' ? 'Customer' : 'Rider'}`
                      : `Register as ${selectedRole === 'customer' ? 'Customer' : 'Rider'}`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Fill Tool */}
          {authMode === 'login' && (
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-brand-700" />
                  <span>Demo Credentials Available</span>
                </span>
                <p className="text-[10px] text-slate-500">
                  {selectedRole === 'customer'
                    ? 'customer@clothesapp.tz / customer123'
                    : 'rider@clothesapp.tz / rider123'}
                </p>
              </div>
              <button
                type="button"
                onClick={handleDemoFill}
                className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 rounded-lg text-xs font-bold transition-colors shadow-subtle shrink-0"
              >
                Auto-Fill Demo
              </button>
            </div>
          )}

          {/* Back to Shopping Button */}
          <div className="text-center pt-2">
            <button
              onClick={() => setActiveView('home')}
              className="text-xs font-bold text-slate-500 hover:text-slate-900 underline"
            >
              ← Back to Shopping Application
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
