
import React, { useState } from 'react';
import { MenuItem } from '../types';
import { Plus } from 'lucide-react';

interface MenuCardProps {
  item: MenuItem;
  onSelect: (item: MenuItem, initialQuantity: number) => void;
}

export const MenuCard: React.FC<MenuCardProps> = ({ item, onSelect }) => {
  const [quantity, setQuantity] = useState(1);
  const isOutOfStock = item.stock !== undefined && item.stock <= 0;
  const isAtStockLimit = item.stock !== undefined && quantity >= item.stock;

  const increment = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock || isAtStockLimit) return;
    setQuantity(q => q + 1);
  };

  const decrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    setQuantity(q => Math.max(1, q - 1));
  };

  return (
    <div className={`group flex flex-col h-full bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden transition-all duration-500 ${isOutOfStock ? 'opacity-75 grayscale-[0.5]' : 'hover:shadow-2xl hover:shadow-orange-100/50 hover:-translate-y-2'}`}>
      <div className="relative overflow-hidden h-64 shrink-0">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-lg">
          <span className="text-orange-600 font-black text-lg">${item.basePrice.toFixed(2)}</span>
        </div>
        
        {isOutOfStock ? (
          <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg animate-pulse">
            Out of Stock
          </div>
        ) : item.category === 'burger' && (
          <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">
            Signature
          </div>
        )}
      </div>
      
      <div className="p-8 flex flex-col flex-1 space-y-6">
        <div className="flex-1">
          <h3 className={`text-2xl font-black transition-colors leading-tight ${isOutOfStock ? 'text-slate-400' : 'text-slate-900 group-hover:text-orange-600'}`}>{item.name}</h3>
          <p className="text-slate-500 text-sm mt-3 line-clamp-3 leading-relaxed font-medium">{item.description}</p>
          {item.stock !== undefined && item.stock < 5 && !isOutOfStock && (
            <p className="text-[10px] font-black uppercase tracking-widest mt-2 text-red-500">
              Only {item.stock} left in kitchen!
            </p>
          )}
        </div>
        
        <div className="flex gap-2 shrink-0 pt-2">
          {!isOutOfStock ? (
            <>
              <div className="flex items-center bg-slate-100 rounded-2xl p-1.5 px-3 border border-slate-200">
                <button 
                  onClick={decrement}
                  className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-500 hover:bg-white hover:text-orange-600 transition-all font-black disabled:opacity-30"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="w-8 text-center font-black text-slate-700">{quantity}</span>
                <button 
                  onClick={increment}
                  className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all font-black ${isAtStockLimit ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500 hover:bg-white hover:text-orange-600'}`}
                  disabled={isAtStockLimit}
                >
                  +
                </button>
              </div>
              <button
                onClick={() => onSelect(item, quantity)}
                className="flex-1 py-4 bg-slate-50 group-hover:bg-orange-600 group-hover:text-white text-slate-900 font-black rounded-2xl transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-md"
              >
                <span className="text-sm">Customize Order</span>
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
              </button>
            </>
          ) : (
            <div className="w-full py-4 bg-slate-100 text-slate-400 font-black rounded-2xl text-center text-sm border-2 border-dashed border-slate-200">
              Sold Out
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
