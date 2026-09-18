import React from 'react';

interface Customer {
  name: string;
  phone: string;
  ordersCount: number;
  totalSpent: number;
  lastOrder: number;
  allOrders: any[];
}

interface AdminCustomersProps {
  customerList: Customer[];
  onViewCustomerHistory: (phone: string) => void;
}

export const AdminCustomers: React.FC<AdminCustomersProps> = ({ customerList, onViewCustomerHistory }) => {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500 pb-12">
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="p-6 text-xs font-black uppercase text-slate-400 tracking-widest">Customer</th>
              <th className="p-6 text-xs font-black uppercase text-slate-400 tracking-widest">Orders</th>
              <th className="p-6 text-xs font-black uppercase text-slate-400 tracking-widest">Total Spent</th>
              <th className="p-6 text-xs font-black uppercase text-slate-400 tracking-widest text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {customerList.map((c, i) => (
              <tr key={i} className="hover:bg-slate-50/30 transition-colors">
                <td className="p-6"><div><p className="font-black text-slate-900">{c.name}</p><p className="text-xs text-slate-500">{c.phone}</p></div></td>
                <td className="p-6 font-bold">{c.ordersCount}</td>
                <td className="p-6 font-black text-slate-900">${c.totalSpent.toFixed(2)}</td>
                <td className="p-6 text-right"><button onClick={() => onViewCustomerHistory(c.phone)} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">History</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};