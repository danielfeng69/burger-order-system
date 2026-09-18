
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MenuItem, BurgerOption, OrderItem } from '../types';
import { X, Check, Plus } from 'lucide-react';

interface CustomizationModalProps {
  item: MenuItem;
  initialQuantity: number;
  onClose: () => void;
  onAddToCart: (orderItem: OrderItem) => void;
}

export const CustomizationModal: React.FC<CustomizationModalProps> = ({ item, initialQuantity, onClose, onAddToCart }) => {
  const [selectedOptions, setSelectedOptions] = useState<BurgerOption[]>([]);
  const [quantity, setQuantity] = useState(initialQuantity);

  useEffect(() => {
    // Ensure initial quantity doesn't exceed stock if stock is limited
    const safeQty = item.stock !== undefined ? Math.min(initialQuantity, item.stock) : initialQuantity;
    setQuantity(safeQty);
  }, [initialQuantity, item.stock]);

  const toggleOption = (option: BurgerOption) => {
    setSelectedOptions(prev => 
      prev.find(o => o.id === option.id) 
        ? prev.filter(o => o.id !== option.id)
        : [...prev, option]
    );
  };

  const unitPrice = item.basePrice + selectedOptions.reduce((acc, o) => acc + o.price, 0);
  const totalPrice = unitPrice * quantity;
  const isAtStockLimit = item.stock !== undefined && quantity >= item.stock;

  const navigate = useNavigate();

  const handleSubmit = () => {
    // Check authentication directly in the modal
    const isAuthenticated = localStorage.getItem('is_authenticated') === 'true';
    const isOnLandingPage = window.location.pathname === '/';

    if (isOnLandingPage && !isAuthenticated) {
      // Close modal then use React Router navigation so the SPA handles routing
      onClose();
      navigate('/login');
      return;
    }

    // Otherwise, add to cart normally
    onAddToCart({
      id: Math.random().toString(36).substr(2, 9),
      menuId: item.id,
      name: item.name,
      basePrice: item.basePrice,
      selectedOptions,
      quantity,
      totalPrice
    });
    onClose();
  };

  const filteredOptions = item.addons || [];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
        <div className="relative h-64 sm:h-80">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 bg-white/20 hover:bg-white/40 backdrop-blur-xl rounded-2xl p-3 text-white transition-all hover:rotate-90"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="px-8 pb-8 pt-0 overflow-y-auto flex-1 custom-scrollbar">
          <div className="mb-8">
            <h2 className="text-4xl font-black text-slate-900 leading-tight mb-2">{item.name}</h2>
            <p className="text-slate-500 font-medium leading-relaxed">{item.description}</p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Available Upgrades</h3>
              <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-bold">SELECT ANY</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredOptions.length > 0 ? (
                filteredOptions.map(opt => {
                  const isSelected = selectedOptions.find(o => o.id === opt.id);
                  return (
                    <button
                      key={opt.id}
                      onClick={() => toggleOption(opt)}
                      className={`flex justify-between items-center p-4 rounded-2xl border-2 transition-all ${
                        isSelected
                        ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-100 shadow-lg shadow-orange-100/50'
                        : 'border-slate-100 bg-slate-50 hover:border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3 text-left">
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${isSelected ? 'bg-orange-500 border-orange-500' : 'border-slate-300'}`}>
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className={`font-bold ${isSelected ? 'text-orange-900' : 'text-slate-700'}`}>{opt.name}</span>
                      </div>
                      <span className={`text-sm font-black ${isSelected ? 'text-orange-600' : 'text-slate-400'}`}>+${opt.price.toFixed(2)}</span>
                    </button>
                  );
                })
              ) : (
                <p className="col-span-2 text-center text-slate-400 font-medium py-4">No upgrades available for this item.</p>
              )}
            </div>
          </div>

          <div className="mt-12 p-6 bg-slate-900 rounded-[2rem] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="flex items-center gap-6 bg-white/10 p-2 rounded-2xl">
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all text-2xl font-black active:scale-90"
              >-</button>
              <span className="w-10 text-center font-black text-2xl text-white">{quantity}</span>
              <button 
                onClick={() => setQuantity(q => (item.stock !== undefined && q >= item.stock) ? q : q + 1)}
                className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all text-2xl font-black active:scale-90 ${isAtStockLimit ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600 text-white'}`}
                disabled={isAtStockLimit}
              >+</button>
            </div>
            <div className="text-center sm:text-right">
              <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Estimated Total {item.stock !== undefined && <span className="text-orange-400/60 lowercase ml-1">({item.stock} in stock)</span>}</p>
              <p className="text-4xl font-black text-orange-400 tracking-tighter">${totalPrice.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="p-8 bg-white border-t border-slate-100">
          <button 
            onClick={handleSubmit}
            className="w-full py-6 bg-orange-600 hover:bg-orange-700 text-white font-black rounded-[2rem] shadow-2xl shadow-orange-200 transition-all flex items-center justify-center gap-3 active:scale-95"
          >
            Add to Tray
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
