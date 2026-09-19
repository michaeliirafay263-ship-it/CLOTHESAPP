import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, ArrowRight, KeyRound } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { DEMO_CREDENTIALS } from '../../data/mockAuth';

export const AdminLoginPage: React.FC = () => {
  const { login, setActiveView, showToast } = useStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDemoFill = () => {
    const creds = DEMO_CREDENTIALS.admin;
    setEmail(creds.email);
    setPassword(creds.password);
    setErrorMsg('');
    showToast('Loaded Admin demo credentials', 'info');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    setTimeout(() => {
      const res = login(email, password, 'admin');
      if (!res.success) {
        setErrorMsg(res.message || 'Invalid admin credentials');
        setIsSubmitting(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white flex items-center justify-center p-4 selection:bg-brand-600 selection:text-white">
      <div className="bg-[#111827] border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-modal space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 text-brand-400 flex items-center justify-center mx-auto shadow-subtle">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="inline-block px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
              Independent Portal
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
              Owner & Staff Administration
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Authorized access for Michaeli & operations managers.
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 bg-rose-950/60 border border-rose-800 rounded-xl text-xs font-semibold text-rose-300">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Admin Email / Username
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@clothesapp.tz"
                className="w-full text-xs pl-10 pr-3 py-3 rounded-xl border border-slate-700 bg-slate-900/90 text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full text-xs pl-10 pr-10 py-3 rounded-xl border border-slate-700 bg-slate-900/90 text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-brand-600 hover:bg-brand-700 disabled:bg-slate-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-subtle flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Enter Admin Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Fill */}
        <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-bold text-slate-300 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-brand-400" />
              <span>Demo Admin Login</span>
            </span>
            <span className="text-[11px] text-slate-500 block">admin@clothesapp.tz / admin123</span>
          </div>
          <button
            type="button"
            onClick={handleDemoFill}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-colors border border-slate-700"
          >
            Auto-Fill
          </button>
        </div>

        {/* Back Link */}
        <div className="text-center pt-2">
          <button
            onClick={() => setActiveView('home')}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            ← Return to Main Storefront
          </button>
        </div>
      </div>
    </div>
  );
};
