import React from 'react';
import { ShopSettings } from '../../../types';
import { Check } from 'lucide-react';

interface AdminSettingsProps {
  tempShopSettings: ShopSettings;
  setTempShopSettings: (settings: ShopSettings) => void;
  hasSettingsChanges: boolean;
  setHasSettingsChanges: (hasChanges: boolean) => void;
  logoInputRef: React.RefObject<HTMLInputElement>;
  updateShopSettings: (settings: ShopSettings) => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({
  tempShopSettings,
  setTempShopSettings,
  hasSettingsChanges,
  setHasSettingsChanges,
  logoInputRef,
  updateShopSettings
}) => {
  const handleUpdateSettingsField = (field: keyof ShopSettings, value: string) => {
    setTempShopSettings(prev => ({ ...prev, [field]: value }));
    setHasSettingsChanges(true);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempShopSettings(prev => ({ ...prev, logo: reader.result as string }));
        setHasSettingsChanges(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSettings = () => {
    updateShopSettings(tempShopSettings);
    setHasSettingsChanges(false);
    alert('Shop content updated successfully!');
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-12 pb-12 max-w-5xl">
      <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-12">
        <div>
          <h3 className="text-3xl font-black text-slate-900 tracking-tight">App Content Settings</h3>
          <p className="text-slate-500 font-medium">Customize the text throughout your burger shop.</p>
        </div>

        <div className="space-y-8">
          <h4 className="text-xs font-black uppercase tracking-widest text-indigo-600 border-b border-indigo-50 pb-2">Global Branding</h4>
          <div className="flex items-center gap-8 p-8 bg-slate-50/50 rounded-[2rem] border border-slate-100 border-dashed">
            <div className="w-32 h-32 rounded-3xl overflow-hidden bg-white border border-slate-100 shrink-0 shadow-sm flex items-center justify-center p-2">
              <img src={tempShopSettings.logo} className="max-w-full max-h-full object-contain" alt="Brand Logo" />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <p className="text-sm font-black text-slate-800">Shop Logo</p>
                <p className="text-xs font-medium text-slate-500 mt-1">Upload a square PNG or JPG. Recommended size 512x512px.</p>
              </div>
              <input
                type="file"
                ref={logoInputRef}
                onChange={handleLogoUpload}
                className="hidden"
                accept="image/*"
              />
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className="px-6 py-3 bg-white text-indigo-600 border border-indigo-100 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-50 hover:border-indigo-200 transition-all shadow-sm active:scale-95"
              >
                Upload New Logo
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-widest text-indigo-600 border-b border-indigo-50 pb-2">Global & Header</h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Shop Name (Logo Area)</label>
                <input
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all text-slate-800"
                  value={tempShopSettings.shopName}
                  onChange={e => handleUpdateSettingsField('shopName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Establishment Year Tag</label>
                <input
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all text-slate-800"
                  value={tempShopSettings.heroEst}
                  onChange={e => handleUpdateSettingsField('heroEst', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-widest text-indigo-600 border-b border-indigo-50 pb-2">Hero Section (Menu Page)</h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Main Hero Title</label>
                <input
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all text-slate-800"
                  value={tempShopSettings.heroTitle}
                  onChange={e => handleUpdateSettingsField('heroTitle', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Hero Subtitle</label>
                <textarea
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all text-slate-800 h-28 resize-none"
                  value={tempShopSettings.heroSubtitle}
                  onChange={e => handleUpdateSettingsField('heroSubtitle', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-widest text-indigo-600 border-b border-indigo-50 pb-2">Order Success Screen</h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Success Title</label>
                <input
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all text-slate-800"
                  value={tempShopSettings.orderSuccessTitle}
                  onChange={e => handleUpdateSettingsField('orderSuccessTitle', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Success Subtitle (Partial)</label>
                <textarea
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all text-slate-800 h-28 resize-none"
                  value={tempShopSettings.orderSuccessSubtitle}
                  onChange={e => handleUpdateSettingsField('orderSuccessSubtitle', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-widest text-indigo-600 border-b border-indigo-50 pb-2">Order History Screen</h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">History Page Title</label>
                <input
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all text-slate-800"
                  value={tempShopSettings.orderHistoryTitle}
                  onChange={e => handleUpdateSettingsField('orderHistoryTitle', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">History Page Subtitle</label>
                <textarea
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all text-slate-800 h-28 resize-none"
                  value={tempShopSettings.orderHistorySubtitle}
                  onChange={e => handleUpdateSettingsField('orderHistorySubtitle', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {hasSettingsChanges && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-10">
          <button onClick={handleSaveSettings} className="px-12 py-6 bg-slate-900 text-white font-black rounded-[2rem] shadow-2xl hover:bg-black transition-all flex items-center gap-3 active:scale-95">
            <Check className="w-6 h-6" />
            Save Content Changes
          </button>
        </div>
      )}
    </div>
  );
};