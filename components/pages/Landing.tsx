import React from 'react';
import { MenuCard } from '../../components/ui/MenuCard';
import { MenuItem } from '../../types';

interface LandingProps {
  menuItems: MenuItem[];
  categories: string[];
  activeCategory: string;
  setActiveCategory: (c: string) => void;
  filteredMenuItems: MenuItem[];
  shopSettings: any;
  cartCount: number;
  onNavigate: (path: string) => void;
  onSelect: (item: MenuItem, qty: number) => void;
}

export const Landing: React.FC<LandingProps> = ({
  menuItems,
  categories,
  activeCategory,
  setActiveCategory,
  filteredMenuItems,
  shopSettings,
  cartCount,
  onNavigate
  , onSelect
}) => {
  return (
    <main className="max-w-7xl mx-auto px-4 py-12 transition-all duration-500">
      <div className="space-y-16 animate-in fade-in duration-500">
        <section className="text-center space-y-4 max-w-2xl mx-auto mb-12">
          <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-600 rounded-full text-xs font-black uppercase tracking-widest">{shopSettings.heroEst}</span>
          <h2 className="text-5xl sm:text-7xl font-black text-slate-900 tracking-tight">{shopSettings.heroTitle}</h2>
          <p className="text-slate-500 text-lg sm:text-xl font-medium">{shopSettings.heroSubtitle}</p>
        </section>

        <section className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-orange-500 text-white shadow-xl' : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50'}`}
            >
              {cat}
            </button>
          ))}
        </section>

        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMenuItems.map(item => (
              <MenuCard key={item.id} item={item} onSelect={onSelect} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Landing;

