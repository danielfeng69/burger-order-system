import React from 'react';
import { X } from 'lucide-react';
import { Order } from '../../types';

interface CustomerHistoryModalProps {
  customer: {
    name: string;
    phone: string;
    orders: Order[];
  };
  onClose: () => void;
}

export const CustomerHistoryModal: React.FC<CustomerHistoryModalProps> = ({ customer, onClose }) => {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      <div className="relative bg-white rounded-[3rem] w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh] shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
          <div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">Order History</h3>
            <p className="text-indigo-600 font-black text-sm uppercase tracking-widest mt-1">{customer.name} • {customer.phone}</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-2xl transition-all"><X className="w-6 h-6" /></button>
        </div>
        <div className="p-10 overflow-y-auto custom-scrollbar flex-1 space-y-6">
          {customer.orders.sort((a, b) => b.createdAt - a.createdAt).map(order => (
            <div key={order.id} className="p-6 rounded-3xl border border-slate-100 bg-slate-50/50 space-y-4 hover:border-indigo-200 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Order ID: {order.id}</span>
                  <p className="text-xs text-slate-500 font-bold">{new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}</p>
                </div>
                <div className="flex gap-2">
                  <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${order.isPaid ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>{order.isPaid ? 'PAID' : 'UNPAID'}</div>
                  <div className="px-3 py-1 bg-white border border-slate-100 rounded-full text-[10px] font-black text-indigo-600 uppercase tracking-widest">{order.status}</div>
                </div>
              </div>
              <div className="space-y-1">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <span className="text-slate-700 font-bold">{item.quantity}x {item.name}</span>
                    <span className="text-slate-900 font-black">${item.totalPrice.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Grand Total</span>
                <span className="text-xl font-black text-slate-900">${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};