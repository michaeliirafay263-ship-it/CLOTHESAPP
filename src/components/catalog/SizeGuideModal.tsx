import React, { useState } from 'react';
import { X, Ruler, CheckCircle2, Info } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const SizeGuideModal: React.FC = () => {
  const { isSizeGuideOpen, setIsSizeGuideOpen, t, language } = useStore();
  const [activeTab, setActiveTab] = useState<'men' | 'women'>('men');

  if (!isSizeGuideOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-modal">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center">
              <Ruler className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">{t('sizeGuideTitle')}</h3>
              <p className="text-xs text-slate-500">{t('sizeGuideSubtitle')}</p>
            </div>
          </div>
          <button
            onClick={() => setIsSizeGuideOpen(false)}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Tab Selector */}
          <div className="flex rounded-xl bg-slate-100 p-1">
            <button
              onClick={() => setActiveTab('men')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
                activeTab === 'men'
                  ? 'bg-white text-slate-900 shadow-subtle'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('sizeGuideTabMen')}
            </button>
            <button
              onClick={() => setActiveTab('women')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
                activeTab === 'women'
                  ? 'bg-white text-slate-900 shadow-subtle'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('sizeGuideTabWomen')}
            </button>
          </div>

          {/* Men's Table */}
          {activeTab === 'men' && (
            <div className="space-y-4">
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Size</th>
                      <th className="py-2.5 px-3">Chest (cm)</th>
                      <th className="py-2.5 px-3">Waist (cm)</th>
                      <th className="py-2.5 px-3">Trousers (Inch)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-slate-900">S (Small)</td>
                      <td className="py-2.5 px-3">91 - 96 cm</td>
                      <td className="py-2.5 px-3">76 - 81 cm</td>
                      <td className="py-2.5 px-3">28 - 30</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-slate-900">M (Medium)</td>
                      <td className="py-2.5 px-3">97 - 102 cm</td>
                      <td className="py-2.5 px-3">82 - 87 cm</td>
                      <td className="py-2.5 px-3">32 - 34</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-slate-900">L (Large)</td>
                      <td className="py-2.5 px-3">103 - 108 cm</td>
                      <td className="py-2.5 px-3">88 - 93 cm</td>
                      <td className="py-2.5 px-3">34 - 36</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-slate-900">XL (Extra Large)</td>
                      <td className="py-2.5 px-3">109 - 114 cm</td>
                      <td className="py-2.5 px-3">94 - 100 cm</td>
                      <td className="py-2.5 px-3">36 - 38</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-slate-900">XXL (2X Large)</td>
                      <td className="py-2.5 px-3">115 - 122 cm</td>
                      <td className="py-2.5 px-3">101 - 108 cm</td>
                      <td className="py-2.5 px-3">38 - 40</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Women's Table */}
          {activeTab === 'women' && (
            <div className="space-y-4">
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Size</th>
                      <th className="py-2.5 px-3">Bust (cm)</th>
                      <th className="py-2.5 px-3">Waist (cm)</th>
                      <th className="py-2.5 px-3">Hips (cm)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-slate-900">S (UK 8-10)</td>
                      <td className="py-2.5 px-3">84 - 88 cm</td>
                      <td className="py-2.5 px-3">66 - 70 cm</td>
                      <td className="py-2.5 px-3">90 - 94 cm</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-slate-900">M (UK 12)</td>
                      <td className="py-2.5 px-3">89 - 94 cm</td>
                      <td className="py-2.5 px-3">71 - 76 cm</td>
                      <td className="py-2.5 px-3">95 - 100 cm</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-slate-900">L (UK 14)</td>
                      <td className="py-2.5 px-3">95 - 102 cm</td>
                      <td className="py-2.5 px-3">77 - 84 cm</td>
                      <td className="py-2.5 px-3">101 - 108 cm</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-slate-900">XL (UK 16-18)</td>
                      <td className="py-2.5 px-3">103 - 110 cm</td>
                      <td className="py-2.5 px-3">85 - 93 cm</td>
                      <td className="py-2.5 px-3">109 - 116 cm</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Helpful Dar climate tip */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3 text-xs text-emerald-900">
            <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold mb-0.5">
                {language === 'sw' ? 'Ushauri wa Uchaguzi wa Saizi Dar es Salaam' : 'Dar es Salaam Fit Recommendation'}
              </p>
              <p className="text-emerald-800 leading-relaxed">{t('sizeGuideNote')}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={() => setIsSizeGuideOpen(false)}
            className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
          >
            {t('close')}
          </button>
        </div>
      </div>
    </div>
  );
};
