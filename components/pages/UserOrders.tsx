
import React, { useState, useMemo } from 'react';
import { Order, OrderStatus } from '../types';
import { Package, Edit, MapPin, CreditCard, ChevronDown, X, Check, Clock, RotateCcw } from 'lucide-react';

interface UserOrdersProps {
  orders: Order[];
  onReorder: (order: Order) => void;
  onCancelOrder: (orderId: string) => void;
  title: string;
  subtitle: string;
}

type SortOrder = 'newest' | 'oldest';

export const UserOrders: React.FC<UserOrdersProps> = ({ orders, onReorder, onCancelOrder, title, subtitle }) => {
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');

  const statusColors: Record<OrderStatus, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    PREPARING: 'bg-blue-100 text-blue-700',
    OUT_FOR_DELIVERY: 'bg-purple-100 text-purple-700',
    COMPLETED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-slate-100 text-slate-500 border border-slate-200'
  };

  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => {
      return sortOrder === 'newest' ? b.createdAt - a.createdAt : a.createdAt - b.createdAt;
    });
  }, [orders, sortOrder]);

  const canCancel = (status: OrderStatus) => {
    return status !== 'COMPLETED' && status !== 'CANCELLED';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div className="text-center md:text-left">
          <h2 className="text-5xl font-black text-slate-900 mb-2 tracking-tight">{title}</h2>
          <p className="text-slate-500 text-lg font-medium">{subtitle}</p>
        </div>

        <div className="bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-1 self-center md:self-auto">
          <button
            onClick={() => setSortOrder('newest')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${sortOrder === 'newest' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Newest First
          </button>
          <button
            onClick={() => setSortOrder('oldest')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${sortOrder === 'oldest' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Oldest First
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sortedOrders.length === 0 ? (
          <div className="md:col-span-2 py-32 bg-white rounded-[3rem] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-300">
            <Clock className="w-24 h-24 mb-6 opacity-20" />
            <p className="text-2xl font-black italic">You haven't placed any orders yet!</p>
          </div>
        ) : (
          sortedOrders.map(order => (
            <div key={order.id} className={`bg-white rounded-[2.5rem] shadow-sm border overflow-hidden flex flex-col transition-all duration-300 ${order.status === 'CANCELLED' ? 'border-slate-100 opacity-60 grayscale-[0.5]' : 'border-slate-100 hover:shadow-xl hover:-translate-y-1'}`}>
              <div className={`p-8 border-b flex justify-between items-center ${order.status === 'CANCELLED' ? 'bg-slate-50 border-slate-50' : 'bg-slate-50/50 border-slate-50'}`}>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Order ID: {order.id}</p>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}</p>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.1em] shadow-sm ${statusColors[order.status]}`}>
                  {order.status.replace(/_/g, ' ')}
                </div>
              </div>

              <div className="p-8 space-y-6 flex-1">
                <div className="space-y-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start">
                      <div className="flex gap-4">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shadow-sm ${order.status === 'CANCELLED' ? 'bg-slate-200 text-slate-500' : 'bg-orange-500 text-white'}`}>
                          {item.quantity}
                        </div>
                        <div>
                          <p className={`font-black text-lg ${order.status === 'CANCELLED' ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{item.name}</p>
                          {item.selectedOptions.length > 0 && (
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                              {item.selectedOptions.map(o => o.name).join(' • ')}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className={`text-sm font-black ${order.status === 'CANCELLED' ? 'text-slate-300' : 'text-slate-900'}`}>${item.totalPrice.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {order.orderNotes && (
                  <div className="p-5 bg-orange-50/50 rounded-2xl border border-orange-100/50">
                    <p className="text-[10px] font-black uppercase text-orange-400 tracking-widest mb-1.5 flex items-center gap-1.5">
                      <Edit className="w-3 h-3" />
                      Special Instructions
                    </p>
                    <p className="text-xs font-bold text-orange-800 italic leading-relaxed">"{order.orderNotes}"</p>
                  </div>
                )}

                <div className="pt-6 border-t border-slate-50 flex flex-col gap-4">
                  <div className="flex flex-wrap gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                      <MapPin className="w-3.5 h-3.5" />
                      {order.deliveryMethod === 'FREE_DELIVERY' ? 'Delivery' : 'Pickup'}
                    </span>
                    <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                      <CreditCard className="w-3.5 h-3.5" />
                      {order.paymentMethod.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="flex justify-between items-end pt-2">
                    <span className="text-slate-400 font-black text-xs uppercase tracking-[0.2em]">Total Amount</span>
                    <span className={`text-4xl font-black tracking-tighter ${order.status === 'CANCELLED' ? 'text-slate-300 line-through' : 'text-slate-900'}`}>${order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className={`p-8 border-t flex flex-col sm:flex-row gap-4 ${order.status === 'CANCELLED' ? 'bg-slate-50/30 border-slate-50' : 'bg-slate-50/50 border-slate-50'}`}>
                <button 
                  onClick={() => onReorder(order)}
                  className="flex-1 py-5 bg-white border-2 border-slate-100 hover:border-orange-500 hover:text-orange-600 text-slate-600 font-black rounded-3xl transition-all flex items-center justify-center gap-3 text-sm shadow-sm active:scale-95 group"
                >
                  <RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                  Reorder Item
                </button>
                {canCancel(order.status) && (
                  <button 
                    onClick={() => onCancelOrder(order.id)}
                    className="flex-1 py-5 bg-red-500 hover:bg-red-600 text-white font-black rounded-3xl transition-all flex items-center justify-center gap-3 text-sm shadow-xl shadow-red-100 active:scale-95"
                  >
                    <X className="w-5 h-5" />
                    Cancel Order
                  </button>
                )}
                {order.status === 'CANCELLED' && (
                  <div className="flex-1 py-5 flex items-center justify-center gap-3 text-xs font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-200/50 rounded-3xl border border-slate-200">
                    <X className="w-5 h-5" />
                    Order Voided
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
