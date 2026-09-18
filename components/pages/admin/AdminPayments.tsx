import React from 'react';
import { PaymentConfig } from '../../../types';
import { Monitor, CreditCard, Check } from 'lucide-react';

interface AdminPaymentsProps {
  tempPaymentConfig: PaymentConfig;
  setTempPaymentConfig: (config: PaymentConfig) => void;
  hasPaymentChanges: boolean;
  setHasPaymentChanges: (hasChanges: boolean) => void;
  updatePaymentConfig: (config: PaymentConfig) => void;
}

export const AdminPayments: React.FC<AdminPaymentsProps> = ({
  tempPaymentConfig,
  setTempPaymentConfig,
  hasPaymentChanges,
  setHasPaymentChanges,
  updatePaymentConfig
}) => {
  const handleUpdatePaymentField = (field: keyof PaymentConfig['bankDetails'], value: string) => {
    setTempPaymentConfig(prev => ({ ...prev, bankDetails: { ...prev.bankDetails, [field]: value } }));
    setHasPaymentChanges(true);
  };

  const handleTogglePaymentMethod = (method: 'cashEnabled' | 'bankTransferEnabled') => {
    setTempPaymentConfig(prev => ({ ...prev, [method]: !prev[method] }));
    setHasPaymentChanges(true);
  };

  const handleSavePayments = () => {
    updatePaymentConfig(tempPaymentConfig);
    setHasPaymentChanges(false);
    alert('Payment methods updated successfully!');
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-12 pb-12">
      <div className="max-w-4xl space-y-8">
        <div className="flex flex-col gap-8">
          <div className={`p-8 rounded-[2.5rem] border-2 transition-all ${tempPaymentConfig.cashEnabled ? 'bg-white border-emerald-500 shadow-lg shadow-emerald-50' : 'bg-slate-50 border-slate-200 opacity-60'}`}>
            <div className="flex justify-between items-start mb-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center"><Monitor className="w-8 h-8" /></div>
              <button onClick={() => handleTogglePaymentMethod('cashEnabled')} className={`w-14 h-8 rounded-full relative transition-all ${tempPaymentConfig.cashEnabled ? 'bg-emerald-500' : 'bg-slate-300'}`}><div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${tempPaymentConfig.cashEnabled ? 'left-7' : 'left-1'}`}></div></button>
            </div>
            <h4 className="text-2xl font-black text-slate-900 mb-2">Cash on Delivery</h4>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">Let customers pay with physical currency upon arrival.</p>
          </div>
          <div className={`p-8 rounded-[2.5rem] border-2 transition-all ${tempPaymentConfig.bankTransferEnabled ? 'bg-white border-indigo-500 shadow-lg shadow-indigo-50' : 'bg-slate-50 border-slate-200 opacity-60'}`}>
            <div className="flex justify-between items-start mb-6">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-3xl flex items-center justify-center"><CreditCard className="w-8 h-8" /></div>
              <button onClick={() => handleTogglePaymentMethod('bankTransferEnabled')} className={`w-14 h-8 rounded-full relative transition-all ${tempPaymentConfig.bankTransferEnabled ? 'bg-indigo-500' : 'bg-slate-300'}`}><div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${tempPaymentConfig.bankTransferEnabled ? 'left-7' : 'left-1'}`}></div></button>
            </div>
            <h4 className="text-2xl font-black text-slate-900 mb-2">Bank Transfer</h4>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">Secure direct deposit. Customers see your details to initiate a transfer.</p>
          </div>
        </div>
        {tempPaymentConfig.bankTransferEnabled && (
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-10 animate-in slide-in-from-top-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Account Holder Name</label>
                <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all text-slate-800" placeholder="e.g. Buns Out Gourmet LTD" value={tempPaymentConfig.bankDetails.accountHolder} onChange={e => handleUpdatePaymentField('accountHolder', e.target.value)} />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Account Number</label>
                <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all text-slate-800" placeholder="e.g. 1234567890" value={tempPaymentConfig.bankDetails.accountNumber} onChange={e => handleUpdatePaymentField('accountNumber', e.target.value)} />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Bank Name</label>
                <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all text-slate-800" placeholder="e.g. First National Burger Bank" value={tempPaymentConfig.bankDetails.bankName} onChange={e => handleUpdatePaymentField('bankName', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Bank Code</label>
                  <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all text-slate-800" placeholder="e.g. 1002" value={tempPaymentConfig.bankDetails.bankCode} onChange={e => handleUpdatePaymentField('bankCode', e.target.value)} />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Branch Code</label>
                  <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all text-slate-800" placeholder="e.g. 001" value={tempPaymentConfig.bankDetails.branchCode} onChange={e => handleUpdatePaymentField('branchCode', e.target.value)} />
                </div>
              </div>
            </div>
            <div className="space-y-3"><label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Instructions (Optional)</label><textarea className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all text-slate-800 h-28 resize-none" placeholder="e.g. Please use Order ID as reference." value={tempPaymentConfig.bankDetails.instruction} onChange={e => handleUpdatePaymentField('instruction', e.target.value)} /></div>
          </div>
        )}
        {hasPaymentChanges && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-10"><button onClick={handleSavePayments} className="px-12 py-6 bg-slate-900 text-white font-black rounded-[2rem] shadow-2xl hover:bg-black transition-all flex items-center gap-3 active:scale-95"><Check className="w-6 h-6" />Save Payment Methods</button></div>
        )}
      </div>
    </div>
  );
};