import React from 'react';
import { Order, OrderStatus } from '../../../types';

interface AdminOrdersProps {
  orders: Order[];
  statusFilter: OrderStatus | 'ALL';
  onStatusFilterChange: (filter: OrderStatus | 'ALL') => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  toggleOrderPaymentStatus: (orderId: string) => void;
}

export const AdminOrders: React.FC<AdminOrdersProps> = ({
  orders,
  statusFilter,
  onStatusFilterChange,
  updateOrderStatus,
  toggleOrderPaymentStatus
}) => {
  const statusColors: Record<OrderStatus, string> = {
    PENDING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    PREPARING: 'bg-blue-50 text-blue-700 border-blue-200',
    OUT_FOR_DELIVERY: 'bg-purple-50 text-purple-700 border-purple-200',
    COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    CANCELLED: 'bg-red-50 text-red-700 border-red-200'
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-12">
      <div className="flex flex-col xl:flex-row gap-6 items-start xl:items-center">
        <div className="bg-white p-2 rounded-[2rem] border border-slate-100 shadow-sm flex flex-wrap items-center gap-2 flex-1 w-full">
          {['ALL', 'PENDING', 'PREPARING', 'OUT_FOR_DELIVERY', 'COMPLETED', 'CANCELLED'].map((f) => (
            <button key={f} onClick={() => onStatusFilterChange(f as OrderStatus | 'ALL')} className={`px-6 py-3 rounded-2xl text-xs font-black transition-all ${statusFilter === f ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>{f}</button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6">
        {orders.map(order => (
          <div key={order.id} className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 flex flex-col md:flex-row gap-8 hover:shadow-xl transition-shadow">
            <div className="flex-1 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">ID: {order.id}</span>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">{order.customerName}</h3>
                  <p className="text-xs text-slate-500 font-bold">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border ${statusColors[order.status]}`}>{order.status}</div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm"><span className="font-bold text-slate-700">{item.quantity}x {item.name}</span><span className="font-black text-slate-900">${item.totalPrice.toFixed(2)}</span></div>
                ))}
              </div>
            </div>
            <div className="md:w-64 space-y-4 flex flex-col justify-between">
              <select className="w-full bg-slate-100 rounded-2xl text-sm font-black p-4 outline-none focus:ring-2 focus:ring-indigo-500" value={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}>
                <option value="PENDING">Pending</option><option value="PREPARING">Preparing</option><option value="OUT_FOR_DELIVERY">Out for Delivery</option><option value="COMPLETED">Completed</option><option value="CANCELLED">Cancelled</option>
              </select>
              <button onClick={() => toggleOrderPaymentStatus(order.id)} className={`w-full py-2.5 rounded-xl text-[10px] font-black uppercase border transition-all ${order.isPaid ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>{order.isPaid ? 'PAID' : 'UNPAID'}</button>
              <div className="text-right"><p className="text-3xl font-black text-slate-900 tracking-tighter">${order.totalAmount.toFixed(2)}</p></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};