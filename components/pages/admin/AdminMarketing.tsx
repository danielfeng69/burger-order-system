import React from 'react';
import { DiscountCode, DiscountType } from '../../../types';
import { Plus, Trash2 } from 'lucide-react';

interface AdminMarketingProps {
  discountCodes: DiscountCode[];
  addDiscountCode: (code: DiscountCode) => void;
  deleteDiscountCode: (id: string) => void;
  promoCodeInput: string;
  setPromoCodeInput: (value: string) => void;
  promoValueInput: string;
  setPromoValueInput: (value: string) => void;
  promoType: DiscountType;
  setPromoType: (type: DiscountType) => void;
  promoLimitInput: string;
  setPromoLimitInput: (value: string) => void;
}

export const AdminMarketing: React.FC<AdminMarketingProps> = ({
  discountCodes,
  addDiscountCode,
  deleteDiscountCode,
  promoCodeInput,
  setPromoCodeInput,
  promoValueInput,
  setPromoValueInput,
  promoType,
  setPromoType,
  promoLimitInput,
  setPromoLimitInput
}) => {
  const handleAddPromoCode = () => {
    if (!promoCodeInput || !promoValueInput) return;

    const newCode: DiscountCode = {
      id: `promo-${Math.random().toString(36).substr(2, 9)}`,
      code: promoCodeInput.trim().toUpperCase(),
      type: promoType,
      value: parseFloat(promoValueInput),
      active: true,
      usageCount: 0,
      usageLimit: promoLimitInput ? parseInt(promoLimitInput) : undefined
    };

    addDiscountCode(newCode);
    setPromoCodeInput('');
    setPromoValueInput('');
    setPromoLimitInput('');
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500 pb-12 space-y-12">
      <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-10 max-w-4xl">
        <div>
          <h3 className="text-3xl font-black text-slate-900 tracking-tight">Create Promo Code</h3>
          <p className="text-slate-500 font-medium">Add new rewards for your loyal customers.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Code Name</label>
            <input
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all text-slate-800 placeholder:text-slate-300"
              placeholder="e.g. BUNS50"
              value={promoCodeInput}
              onChange={e => setPromoCodeInput(e.target.value.toUpperCase())}
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Discount Value</label>
            <input
              type="number"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all text-slate-800"
              placeholder="0"
              value={promoValueInput}
              onChange={e => setPromoValueInput(e.target.value)}
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Discount Type</label>
            <div className="flex bg-slate-100 p-1.5 rounded-2xl">
              <button
                onClick={() => setPromoType('PERCENTAGE')}
                className={`flex-1 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${promoType === 'PERCENTAGE' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
              >%</button>
              <button
                onClick={() => setPromoType('FIXED')}
                className={`flex-1 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${promoType === 'FIXED' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}>$</button>
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Usage Limit (Opt)</label>
            <input
              type="number"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all text-slate-800 placeholder:text-slate-300"
              placeholder="∞"
              value={promoLimitInput}
              onChange={e => setPromoLimitInput(e.target.value)}
            />
          </div>
        </div>
        <button
          onClick={handleAddPromoCode}
          disabled={!promoCodeInput || !promoValueInput}
          className="w-full py-6 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black rounded-3xl shadow-2xl shadow-indigo-100 transition-all flex items-center justify-center gap-3 active:scale-95 text-xs uppercase tracking-widest"
        >
          <Plus className="w-5 h-5" />
          Create Promo Code
        </button>
      </div>
      <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8 max-w-2xl">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Active Promo Codes</h3>
        <div className="space-y-4">
          {discountCodes.map(code => (
            <div key={code.id} className="flex justify-between items-center p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:border-indigo-100 transition-all group">
              <div>
                <p className="font-black text-lg text-slate-900 tracking-widest uppercase">{code.code}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-xs font-bold text-indigo-600">{code.type === 'PERCENTAGE' ? `${code.value}%` : `$${code.value}`} Off</p>
                  <span className="text-slate-300">•</span>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{code.usageCount} Used {code.usageLimit && `(Limit ${code.usageLimit})`}</p>
                </div>
              </div>
              <button onClick={() => deleteDiscountCode(code.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                <Trash2 className="w-6 h-6" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};