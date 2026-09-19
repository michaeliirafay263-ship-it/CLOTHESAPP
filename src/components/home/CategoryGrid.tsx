import React from 'react';
import { ArrowRight, Shirt, Sparkles, Baby, ShoppingBag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { GenderCategory } from '../../types';

export const CategoryGrid: React.FC = () => {
  const { t, setSelectedCategory, setActiveView, language } = useStore();

  const categories: {
    id: GenderCategory;
    title: string;
    titleSw: string;
    subtitle: string;
    subtitleSw: string;
    image: string;
    tag: string;
    tagSw: string;
  }[] = [
    {
      id: 'men',
      title: 'Men\'s Collection',
      titleSw: 'Mavazi ya Wanaume',
      subtitle: 'Linen shirts, chinos, polo shirts & casual trousers',
      subtitleSw: 'Mashati ya kitani, suruali za chino & polo',
      image: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=600&q=80',
      tag: 'Trending',
      tagSw: 'Zinazopendwa'
    },
    {
      id: 'women',
      title: 'Women\'s Collection',
      titleSw: 'Mavazi ya Wanawake',
      subtitle: 'Boho maxi dresses, modern kitenge blazers & trousers',
      subtitleSw: 'Magauni marefu, koti za kitenge & suruali za kisasa',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80',
      tag: 'New Styles',
      tagSw: 'Mitindo Mipya'
    },
    {
      id: 'kids',
      title: 'Kids & Toddlers',
      titleSw: 'Mavazi ya Watoto',
      subtitle: 'Comfortable 100% organic cotton sets & playground wear',
      subtitleSw: 'Seti laini za pamba asilia kwa ajili ya watoto',
      image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=600&q=80',
      tag: 'Soft Cotton',
      tagSw: 'Pamba Laini'
    },
    {
      id: 'accessories',
      title: 'Hats & Bags',
      titleSw: 'Vifaa, Kofia & Mikoba',
      subtitle: 'Sun hats, canvas totes & coastal accessories',
      subtitleSw: 'Kofia za jua, mifuko ya kitambaa & urembo wa ufukweni',
      image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=600&q=80',
      tag: 'Accessories',
      tagSw: 'Vifaa'
    }
  ];

  const handleSelect = (catId: GenderCategory) => {
    setSelectedCategory(catId);
    setActiveView('catalog');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {t('categoriesTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t('categoriesSubtitle')}
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedCategory('all');
            setActiveView('catalog');
          }}
          className="text-xs sm:text-sm font-bold text-brand-700 hover:text-brand-800 flex items-center gap-1"
        >
          <span>{t('viewAll')}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map(cat => (
          <div
            key={cat.id}
            onClick={() => handleSelect(cat.id)}
            className="group relative bg-white border border-slate-200 rounded-xl overflow-hidden cursor-pointer hover:border-slate-400 hover:shadow-card transition-all"
          >
            {/* Category Image */}
            <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-none text-slate-900 text-[11px] font-bold px-2.5 py-1 rounded-md shadow-subtle border border-slate-200">
                {language === 'sw' ? cat.tagSw : cat.tag}
              </div>
            </div>

            {/* Category Info */}
            <div className="p-4 space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 group-hover:text-brand-700 transition-colors">
                  {language === 'sw' ? cat.titleSw : cat.title}
                </h3>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-700 group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-xs text-slate-500 line-clamp-1">
                {language === 'sw' ? cat.subtitleSw : cat.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
