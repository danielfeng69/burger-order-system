import React, { useState } from 'react';
import { MenuItem, BurgerOption } from '../../../types';
import { Edit, Trash2, Plus } from 'lucide-react';

type ProductSubPage = 'list' | 'categories' | 'addons';

interface AdminProductsProps {
  menuItems: MenuItem[];
  categories: string[];
  globalAddons: BurgerOption[];
  addProduct: (newProduct: MenuItem) => void;
  updateProduct: (updatedProduct: MenuItem) => void;
  deleteProduct: (productId: string) => void;
  addCategory: (category: string) => void;
  deleteCategory: (category: string) => void;
  addGlobalAddon: (name: string, price: number) => void;
  deleteGlobalAddon: (id: string) => void;
  newCatInput: string;
  setNewCatInput: (value: string) => void;
  newAddonName: string;
  setNewAddonName: (value: string) => void;
  newAddonPrice: string;
  setNewAddonPrice: (value: string) => void;
  onEditProduct: (product: MenuItem) => void;
  onAddProduct: () => void;
}

export const AdminProducts: React.FC<AdminProductsProps> = ({
  menuItems,
  categories,
  globalAddons,
  addProduct,
  updateProduct,
  deleteProduct,
  addCategory,
  deleteCategory,
  addGlobalAddon,
  deleteGlobalAddon,
  newCatInput,
  setNewCatInput,
  newAddonName,
  setNewAddonName,
  newAddonPrice,
  setNewAddonPrice,
  onEditProduct,
  onAddProduct
}) => {
  const [productSubPage, setProductSubPage] = useState<ProductSubPage>('list');

  const handleAddCategory = () => {
    if (!newCatInput.trim()) return;
    addCategory(newCatInput.trim());
    setNewCatInput('');
  };

  const handleAddAddon = () => {
    if (!newAddonName.trim() || !newAddonPrice) return;
    addGlobalAddon(newAddonName.trim(), parseFloat(newAddonPrice));
    setNewAddonName('');
    setNewAddonPrice('');
  };

  const renderItemsList = () => (
    <div className="space-y-12">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-black text-slate-900">Menu Items</h3>
        <button onClick={onAddProduct} className="px-8 py-3.5 bg-indigo-600 text-white font-black rounded-2xl text-xs flex items-center gap-2 shadow-xl shadow-indigo-100">
          <Plus className="w-4 h-4" />New Product
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {menuItems.map(p => (
          <div key={p.id} className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm group">
            <div className="h-52 overflow-hidden relative">
              <img src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={p.name} />
              <div className="absolute top-4 right-4 bg-white/95 px-4 py-2 rounded-2xl font-black text-orange-600 text-sm shadow-xl">${p.basePrice.toFixed(2)}</div>
            </div>
            <div className="p-8 space-y-4">
              <h4 className="font-black text-xl text-slate-900">{p.name}</h4>
              <p className="text-sm text-slate-500 line-clamp-2">{p.description}</p>
              <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl">{p.category}</span>
                <div className="flex gap-2">
                  <button onClick={() => onEditProduct(p)} className="p-2 text-slate-400 hover:text-indigo-600"><Edit className="w-5 h-5" /></button>
                  <button onClick={() => deleteProduct(p.id)} className="p-2 text-slate-400 hover:text-red-600"><Trash2 className="w-5 h-5" /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCategoriesManager = () => (
    <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-10 max-w-2xl animate-in slide-in-from-left-4">
      <div>
        <h3 className="text-3xl font-black text-slate-900 tracking-tight">Product Categories</h3>
        <p className="text-slate-500 font-medium">Define tags to organize your menu.</p>
      </div>
      <div className="flex gap-4">
        <input
          className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl p-5 font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all text-slate-800 placeholder:text-slate-300"
          placeholder="e.g. Dessert"
          value={newCatInput}
          onChange={e => setNewCatInput(e.target.value)}
        />
        <button onClick={handleAddCategory} className="px-8 py-5 bg-indigo-600 text-white font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all active:scale-95">Add</button>
      </div>
      <div className="flex flex-wrap gap-3">
        {categories.map(cat => (
          <div key={cat} className="flex items-center gap-3 px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-indigo-200 transition-all">
            <span className="font-black text-xs uppercase tracking-widest text-slate-700">{cat}</span>
            <button onClick={() => deleteCategory(cat)} className="text-slate-300 hover:text-red-500 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAddonsManager = () => (
    <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-10 max-w-4xl animate-in slide-in-from-left-4">
      <div>
        <h3 className="text-3xl font-black text-slate-900 tracking-tight">Global Add-ons</h3>
        <p className="text-slate-500 font-medium">Toppings available across your entire menu.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Add-on Name</label>
          <input
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all text-slate-800 placeholder:text-slate-300"
            placeholder="e.g. Extra Sauce"
            value={newAddonName}
            onChange={e => setNewAddonName(e.target.value)}
          />
        </div>
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Price ($)</label>
          <input
            type="number"
            step="0.01"
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all text-slate-800"
            placeholder="0.00"
            value={newAddonPrice}
            onChange={e => setNewAddonPrice(e.target.value)}
          />
        </div>
      </div>
      <button onClick={handleAddAddon} className="w-full py-6 bg-indigo-600 text-white font-black rounded-3xl shadow-2xl shadow-indigo-100 transition-all flex items-center justify-center gap-3 active:scale-95 text-xs uppercase tracking-widest">Create Add-on</button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {globalAddons.map(addon => (
          <div key={addon.id} className="flex justify-between items-center p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-indigo-100 transition-all">
            <div>
              <p className="font-black text-slate-900">{addon.name}</p>
              <p className="text-xs font-black text-indigo-600 uppercase tracking-widest mt-0.5">+${addon.price.toFixed(2)}</p>
            </div>
            <button onClick={() => deleteGlobalAddon(addon.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
              <Trash2 className="w-6 h-6" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-12 pb-12">
      <div className="bg-white/50 p-2 rounded-[2rem] border border-slate-200 inline-flex items-center gap-1 shadow-sm">
        <button onClick={() => setProductSubPage('list')} className={`px-8 py-3 rounded-2xl text-xs font-black transition-all uppercase tracking-widest ${productSubPage === 'list' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white hover:text-slate-600'}`}>Items</button>
        <button onClick={() => setProductSubPage('categories')} className={`px-8 py-3 rounded-2xl text-xs font-black transition-all uppercase tracking-widest ${productSubPage === 'categories' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white hover:text-slate-600'}`}>Categories</button>
        <button onClick={() => setProductSubPage('addons')} className={`px-8 py-3 rounded-2xl text-xs font-black transition-all uppercase tracking-widest ${productSubPage === 'addons' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white hover:text-slate-600'}`}>Add-ons</button>
      </div>
      {productSubPage === 'list' && renderItemsList()}
      {productSubPage === 'categories' && renderCategoriesManager()}
      {productSubPage === 'addons' && renderAddonsManager()}
    </div>
  );
};