import React, { useState, useRef } from 'react';
import { X, Check } from 'lucide-react';
import { MenuItem, BurgerOption } from '../../types';

interface ProductModalProps {
  product?: MenuItem;
  categories: string[];
  globalAddons: BurgerOption[];
  onClose: () => void;
  onSave: (product: MenuItem) => void;
  title: string;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, categories, globalAddons, onClose, onSave, title }) => {
  const [formData, setFormData] = useState<MenuItem>(product ? { ...product } : {
    id: `prod-${Math.random().toString(36).substr(2, 9)}`,
    name: '',
    description: '',
    basePrice: 0,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800&h=600',
    category: categories[0] || 'burger',
    addons: [],
    stock: undefined
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleAddon = (addon: BurgerOption) => {
    const isAlreadyAdded = formData.addons?.find(a => a.id === addon.id);
    if (isAlreadyAdded) {
      setFormData({
        ...formData,
        addons: (formData.addons || []).filter(a => a.id !== addon.id)
      });
    } else {
      setFormData({
        ...formData,
        addons: [...(formData.addons || []), addon]
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={onClose} />
      <div className="relative bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 flex flex-col max-h-[90vh]">
        <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-white/50">
          <h3 className="text-3xl font-black text-slate-900 tracking-tight">{title}</h3>
          <button type="button" onClick={onClose} className="p-3 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-2xl transition-all active:scale-90">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-10 space-y-10 overflow-y-auto custom-scrollbar flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Product Name</label>
              <input
                className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl p-5 font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 focus:bg-white transition-all text-slate-800"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Delicious Burger..."
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Base Price ($)</label>
              <input
                type="number"
                step="0.01"
                className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl p-5 font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 focus:bg-white transition-all text-slate-800"
                value={formData.basePrice}
                onChange={e => setFormData({ ...formData, basePrice: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Assign Category</label>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat })}
                    className={`px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest border-2 transition-all ${
                      formData.category === cat ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-white text-slate-400 border-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Inventory / Stock (Empty = Unlimited)</label>
              <input
                type="number"
                className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl p-5 font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 focus:bg-white transition-all text-slate-800"
                value={formData.stock === undefined ? '' : formData.stock}
                onChange={e => setFormData({ ...formData, stock: e.target.value === '' ? undefined : parseInt(e.target.value) })}
                placeholder="Unlimited"
              />
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Description</label>
            <textarea
              className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl p-5 font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 focus:bg-white h-28 resize-none transition-all text-slate-800"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Tell us why this item is amazing..."
            />
          </div>
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Product Image</label>
            <div className="flex items-center gap-8 p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100 border-dashed">
              <div className="w-28 h-28 rounded-3xl overflow-hidden bg-white border border-slate-100 shrink-0 shadow-sm">
                <img src={formData.image} className="w-full h-full object-cover" alt="Preview" />
              </div>
              <div className="flex-1 space-y-3">
                <p className="text-xs font-bold text-slate-500">Choose a professional high quality file.</p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="hidden"
                  accept="image/*"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-3 bg-white text-indigo-600 border border-indigo-100 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-50 hover:border-indigo-200 transition-all shadow-sm active:scale-95"
                >
                  Upload New Image
                </button>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Link Global Add-ons</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
              {globalAddons.map(addon => {
                const isSelected = !!formData.addons?.find(a => a.id === addon.id);
                return (
                  <button
                    key={addon.id}
                    type="button"
                    onClick={() => toggleAddon(addon)}
                    className={`flex justify-between items-center p-5 rounded-2xl border-2 transition-all ${
                      isSelected ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-left">
                      <p className={`font-bold text-sm ${isSelected ? 'text-indigo-900' : 'text-slate-800'}`}>{addon.name}</p>
                      <p className={`text-[10px] font-black uppercase tracking-widest mt-0.5 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`}>+${addon.price.toFixed(2)}</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-200 text-transparent'}`}>
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div className="p-10 border-t border-slate-50 flex gap-6 bg-slate-50/20">
          <button type="button" onClick={onClose} className="flex-1 py-5 text-slate-400 font-black uppercase tracking-widest text-xs hover:text-slate-600 transition-colors">Cancel</button>
          <button type="button" onClick={() => onSave(formData)} className="flex-[2] px-12 py-5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-black uppercase tracking-widest rounded-2xl shadow-2xl shadow-indigo-200 hover:from-indigo-700 hover:to-indigo-800 active:scale-95 transition-all text-xs">Save Product</button>
        </div>
      </div>
    </div>
  );
};