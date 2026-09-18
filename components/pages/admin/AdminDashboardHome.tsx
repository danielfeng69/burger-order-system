import React, { useMemo } from 'react';
import { Order } from '../../../types';

interface AdminDashboardHomeProps {
  orders: Order[];
}

export const AdminDashboardHome: React.FC<AdminDashboardHomeProps> = ({
  orders
}) => {
  const totalRevenue = orders.filter(o => o.status !== 'CANCELLED').reduce((acc, o) => acc + o.totalAmount, 0);

  const customerList = useMemo(() => {
    const customersMap = new Map();
    orders.forEach(o => {
      const key = o.customerPhone.trim();
      if (!customersMap.has(key)) {
        customersMap.set(key, {
          name: o.customerName,
          phone: o.customerPhone,
          ordersCount: 0,
          totalSpent: 0,
          lastOrder: o.createdAt,
          allOrders: []
        });
      }
      const data = customersMap.get(key);
      data.ordersCount += 1;
      data.allOrders.push(o);
      if (o.status !== 'CANCELLED') data.totalSpent += o.totalAmount;
      if (o.createdAt > data.lastOrder) data.lastOrder = o.createdAt;
    });
    return Array.from(customersMap.values());
  }, [orders]);

  const statusColors: Record<Order['status'], string> = {
    PENDING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    PREPARING: 'bg-blue-50 text-blue-700 border-blue-200',
    OUT_FOR_DELIVERY: 'bg-purple-50 text-purple-700 border-purple-200',
    COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    CANCELLED: 'bg-red-50 text-red-700 border-red-200'
  };

  return (
    <div className="space-y-6 sm:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border border-slate-100 shadow-sm space-y-2">
          <p className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest">Total Revenue</p>
          <p className="text-2xl sm:text-4xl font-black text-slate-900">${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border border-slate-100 shadow-sm space-y-2">
          <p className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest">Active Orders</p>
          <p className="text-2xl sm:text-4xl font-black text-indigo-600">{orders.filter(o => ['PENDING', 'PREPARING', 'OUT_FOR_DELIVERY'].includes(o.status)).length}</p>
        </div>
        <div className="bg-white p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border border-slate-100 shadow-sm space-y-2">
          <p className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest">Completed</p>
          <p className="text-2xl sm:text-4xl font-black text-emerald-500">{orders.filter(o => o.status === 'COMPLETED').length}</p>
        </div>
        <div className="bg-white p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border border-slate-100 shadow-sm space-y-2">
          <p className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest">Loyal Fans</p>
          <p className="text-2xl sm:text-4xl font-black text-orange-500">{customerList.length}</p>
        </div>
      </div>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg sm:text-xl font-black text-slate-900">Recent Orders</h3>
        </div>
        <div className="bg-white rounded-[1.5rem] sm:rounded-[2.5rem] border border-slate-100 shadow-sm overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">ID</th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Customer</th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Items</th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Status</th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {orders.slice(0, 5).map(o => (
                <tr key={o.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="p-6 text-xs font-black text-slate-400">{o.id}</td>
                  <td className="p-6 font-black text-sm text-slate-900">{o.customerName}</td>
                  <td className="p-6 text-xs text-slate-600 font-bold">{o.items.length} items</td>
                  <td className="p-6"><span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${statusColors[o.status]}`}>{o.status}</span></td>
                  <td className="p-6 text-right font-black text-slate-900">${o.totalAmount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
