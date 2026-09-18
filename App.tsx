import React, { useState, useEffect, useRef, useMemo } from 'react';
import defaultLogo from './assets/defaults/default_logo.png';
import defaultProfile from './assets/defaults/default_profile.png';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import {
  ChevronDown,
  Menu,
  Search,
  User,
  ShoppingCart,
  ArrowRight,
  X,
  Home,
  Package,
  Truck,
  CreditCard,
  Settings as SettingsIcon,
  LogOut,
  Trash2,
  Check
} from 'lucide-react';
import { MenuItem, OrderItem, Order, PaymentMethod, DeliveryMethod, OrderStatus, BurgerOption, DiscountCode, PaymentConfig, ShopSettings } from './types';
import { MENU_ITEMS as INITIAL_MENU_ITEMS, OPTIONS as INITIAL_OPTIONS } from './constants';
import { MenuCard } from './components/ui/MenuCard';
import { CustomizationModal } from './components/modals/CustomizationModal';
import { AdminDashboard } from './components/pages/AdminDashboard';
import { UserOrders } from './components/pages/UserOrders';
import { Login } from './components/pages/Login';
import { Signup } from './components/pages/Signup';
import { Landing } from './components/pages/Landing';
import { Settings } from './components/pages/Settings';
import { NotFound } from './components/pages/NotFound';

const INITIAL_PAYMENT_CONFIG: PaymentConfig = {
  cashEnabled: true,
  bankTransferEnabled: true,
  bankDetails: {
    accountNumber: '',
    accountHolder: '',
    bankName: '',
    bankCode: '',
    branchCode: '',
    instruction: ''
  }
};

const INITIAL_SHOP_SETTINGS: ShopSettings = {
  shopName: 'BUNS OUT',
  logo: defaultLogo,
  heroTitle: 'Serious Burgers.',
  heroSubtitle: 'Hand-crafted patties, premium toppings, and the best buns in town.',
  heroEst: 'EST. 2024',
  orderHistoryTitle: 'My Burger History',
  orderHistorySubtitle: 'Track your current and past cravings.',
  orderSuccessTitle: 'Order Fired!',
  orderSuccessSubtitle: 'Ready in 20 mins. Your order'
};

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userProfile, setUserProfile] = useState<{name?:string,email?:string,phone?:string,avatarUrl?:string,theme?:string}>({});
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [categories, setCategories] = useState<string[]>(['all', 'burger', 'side', 'drink']);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [globalAddons, setGlobalAddons] = useState<BurgerOption[]>(INITIAL_OPTIONS);
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([
    { id: '1', code: 'BUNS25', type: 'PERCENTAGE', value: 25, active: true, usageCount: 0, usageLimit: 50 },
    { id: '2', code: 'WELCOME5', type: 'FIXED', value: 5, active: true, usageCount: 0 }
  ]);
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig>(INITIAL_PAYMENT_CONFIG);
  const [shopSettings, setShopSettings] = useState<ShopSettings>(INITIAL_SHOP_SETTINGS);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [initialQuantity, setInitialQuantity] = useState(1);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);
  const [lastCancelledOrderId, setLastCancelledOrderId] = useState<string | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  

  // Form states for checkout
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('PICKUP');
  const [orderNotes, setOrderNotes] = useState('');
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<DiscountCode | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  // Load persistence
  useEffect(() => {
    const storedProfile = localStorage.getItem('user_profile');
    if (storedProfile) {
      try {
        setUserProfile(JSON.parse(storedProfile));
      } catch {
        setUserProfile({});
      }
    }
    
    const savedOrders = localStorage.getItem('burger_orders');
    if (savedOrders) setOrders(JSON.parse(savedOrders));
    
    const savedMenu = localStorage.getItem('burger_menu');
    if (savedMenu) setMenuItems(JSON.parse(savedMenu));

    const savedCategories = localStorage.getItem('burger_categories');
    if (savedCategories) {
      const cats = JSON.parse(savedCategories);
      if (!cats.includes('all')) cats.unshift('all');
      setCategories(cats);
    }

    const savedAddons = localStorage.getItem('burger_global_addons');
    if (savedAddons) setGlobalAddons(JSON.parse(savedAddons));

    const savedPromos = localStorage.getItem('burger_promos');
    if (savedPromos) setDiscountCodes(JSON.parse(savedPromos));

    const savedPayment = localStorage.getItem('burger_payment_config');
    if (savedPayment) setPaymentConfig(JSON.parse(savedPayment));

    const savedSettings = localStorage.getItem('burger_shop_settings');
    if (savedSettings) setShopSettings(JSON.parse(savedSettings));

    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Apply theme (light/dark) to the document element so global styles can react.
  useEffect(() => {
    const applyTheme = (themeOption?: string) => {
      const root = document.documentElement;
      // Normalize any legacy 'system' value to 'light' (we removed the system option).
      const normalized = themeOption === 'system' ? 'light' : (themeOption || 'light');
      const useDark = normalized === 'dark';
      if (useDark) root.classList.add('dark');
      else root.classList.remove('dark');
    };

    applyTheme(userProfile?.theme);
  }, [userProfile?.theme]);

  // Save persistence
  useEffect(() => {
    localStorage.setItem('burger_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('burger_menu', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('burger_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('burger_global_addons', JSON.stringify(globalAddons));
  }, [globalAddons]);

  useEffect(() => {
    localStorage.setItem('burger_promos', JSON.stringify(discountCodes));
  }, [discountCodes]);

  useEffect(() => {
    localStorage.setItem('burger_payment_config', JSON.stringify(paymentConfig));
  }, [paymentConfig]);

  useEffect(() => {
    localStorage.setItem('burger_shop_settings', JSON.stringify(shopSettings));
  }, [shopSettings]);

  const updateUserProfile = (profile: any) => {
    setUserProfile(profile || {});
    try {
      localStorage.setItem('user_profile', JSON.stringify(profile || {}));
    } catch {
      // ignore
    }
  };

  const addToCart = (item: OrderItem) => {
    const isAuthenticated = localStorage.getItem('is_authenticated') === 'true';
    if (location.pathname === '/' && !isAuthenticated) {
      // close modal and redirect to login for unauthenticated users on landing page
      setSelectedMenuItem(null);
      navigate('/login');
      return;
    }
    setCart(prev => [...prev, item]);
  };

  const removeFromCart = (id: string) => {
    const newCart = cart.filter(i => i.id !== id);
    setCart(newCart);
  };

  const subtotalCartAmount = cart.reduce((acc, item) => acc + item.totalPrice, 0);

  const discountAmount = useMemo(() => {
    if (!appliedPromo) return 0;
    if (appliedPromo.type === 'PERCENTAGE') {
      return (subtotalCartAmount * appliedPromo.value) / 100;
    }
    return Math.min(appliedPromo.value, subtotalCartAmount);
  }, [appliedPromo, subtotalCartAmount]);

  const totalCartAmount = Math.max(0, subtotalCartAmount - discountAmount);

  const filteredMenuItems = useMemo(() => {
    if (activeCategory === 'all') return menuItems;
    return menuItems.filter(item => item.category.toLowerCase() === activeCategory.toLowerCase());
  }, [menuItems, activeCategory]);
  
  const isSimplifiedHeader = ['/','/login','/signup'].includes(location.pathname);

  const applyPromo = () => {
    setPromoError(null);
    const promo = discountCodes.find(d => d.code === promoCodeInput.trim().toUpperCase() && d.active);
    if (promo) {
      if (promo.usageLimit !== undefined && promo.usageCount >= promo.usageLimit) {
        setPromoError('This code has reached its usage limit.');
        setAppliedPromo(null);
      } else {
        setAppliedPromo(promo);
      }
    } else {
      setPromoError('Invalid or inactive code.');
      setAppliedPromo(null);
    }
  };

  const placeOrder = () => {
    if (!customerName || !customerPhone || (deliveryMethod === 'FREE_DELIVERY' && !address)) {
      alert('Please complete all fields to secure your burger!');
      return;
    }

    if (paymentMethod === 'CASH' && !paymentConfig.cashEnabled) {
      alert('Cash payment is currently unavailable. Please select another method.');
      return;
    }
    if (paymentMethod === 'BANK_TRANSFER' && !paymentConfig.bankTransferEnabled) {
      alert('Bank transfer is currently unavailable. Please select another method.');
      return;
    }

    for (const cartItem of cart) {
      const menuItem = menuItems.find(m => m.id === cartItem.menuId);
      if (menuItem?.stock !== undefined && menuItem.stock < cartItem.quantity) {
        alert(`Sorry, ${menuItem.name} only has ${menuItem.stock} left in stock.`);
        return;
      }
    }

    const newOrder: Order = {
      id: `BB-${Math.random().toString(36).substr(2, 4).toUpperCase()}-${Date.now().toString().slice(-4)}`,
      items: cart,
      customerName,
      customerPhone,
      address: deliveryMethod === 'FREE_DELIVERY' ? address : undefined,
      paymentMethod,
      deliveryMethod,
      totalAmount: totalCartAmount,
      discountApplied: appliedPromo ? {
        code: appliedPromo.code,
        amount: discountAmount
      } : undefined,
      status: 'PENDING',
      isPaid: false,
      createdAt: Date.now(),
      orderNotes: orderNotes.trim() || undefined
    };

    setMenuItems(prev => prev.map(item => {
      const cartItemsCount = cart.filter(ci => ci.menuId === item.id).reduce((acc, ci) => acc + ci.quantity, 0);
      if (item.stock !== undefined) {
        return { ...item, stock: Math.max(0, item.stock - cartItemsCount) };
      }
      return item;
    }));

    if (appliedPromo) {
      setDiscountCodes(prev => prev.map(p => 
        p.id === appliedPromo.id ? { ...p, usageCount: p.usageCount + 1 } : p
      ));
    }

    setOrders(prev => [...prev, newOrder]);
    setLastPlacedOrder(newOrder);
    setCart([]);
    setAppliedPromo(null);
    setPromoCodeInput('');
    navigate('/order-success');
    
    setCustomerName('');
    setCustomerPhone('');
    setAddress('');
    setOrderNotes('');
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const toggleOrderPaymentStatus = (orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, isPaid: !o.isPaid } : o));
  };

  const addProduct = (newProduct: MenuItem) => {
    setMenuItems(prev => [...prev, newProduct]);
  };

  const updateProduct = (updatedProduct: MenuItem) => {
    setMenuItems(prev => prev.map(item => item.id === updatedProduct.id ? updatedProduct : item));
  };

  const deleteProduct = (productId: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== productId));
  };

  const addCategory = (category: string) => {
    if (!categories.includes(category.toLowerCase())) {
      setCategories(prev => [...prev, category.toLowerCase()]);
    }
  };

  const deleteCategory = (category: string) => {
    setCategories(prev => prev.filter(c => c !== category));
  };

  const addGlobalAddon = (name: string, price: number) => {
    const newAddon: BurgerOption = {
      id: `opt-${Math.random().toString(36).substr(2, 9)}`,
      name,
      price
    };
    setGlobalAddons(prev => [...prev, newAddon]);
  };

  const deleteGlobalAddon = (id: string) => {
    setGlobalAddons(prev => prev.filter(a => a.id !== id));
    setMenuItems(prev => prev.map(item => ({
      ...item,
      addons: (item.addons || []).filter(a => a.id !== id)
    })));
  };

  const handleSelectMenuItem = (item: MenuItem, qty: number) => {
    setSelectedMenuItem(item);
    setInitialQuantity(qty);
  };

  const handleReorder = (order: Order) => {
    const reorderedItems: OrderItem[] = order.items.map(item => ({
      ...item,
      id: Math.random().toString(36).substr(2, 9) 
    }));
    setCart(prev => [...prev, ...reorderedItems]);
    navigate('/checkout');
  };

  const handleCancelOrder = (orderId: string) => {
    updateOrderStatus(orderId, 'CANCELLED');
    setLastCancelledOrderId(orderId);
    navigate('/order-cancelled');
  };

  // Ensure default payment method is valid based on config
  useEffect(() => {
    if (paymentMethod === 'CASH' && !paymentConfig.cashEnabled) {
      if (paymentConfig.bankTransferEnabled) setPaymentMethod('BANK_TRANSFER');
    } else if (paymentMethod === 'BANK_TRANSFER' && !paymentConfig.bankTransferEnabled) {
      if (paymentConfig.cashEnabled) setPaymentMethod('CASH');
    }
  }, [paymentConfig]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-orange-200 font-sans">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-24 flex justify-between items-center">
          <div className="flex items-center gap-4 cursor-pointer group" onClick={() => navigate('/menu')}>
            <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg shadow-orange-100 group-hover:scale-110 transition-transform duration-500">
               <img 
                 src={shopSettings.logo || defaultLogo} 
                 alt="Shop Logo" 
                 className="w-full h-full object-contain bg-white p-1"
                 onError={(e) => {
                   e.currentTarget.src = defaultLogo;
                 }}
               />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bungee text-3xl leading-none tracking-tight text-slate-900 uppercase">{shopSettings.shopName}</h1>
            </div>
          </div>

          <nav className="flex items-center gap-1 sm:gap-4">
            {isSimplifiedHeader ? (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="px-3 sm:px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all text-slate-500 hover:text-slate-900"
                >
                  Login
                </button>

                <button
                  onClick={() => navigate('/signup')}
                  className="px-3 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all bg-orange-100 text-orange-600 hover:bg-orange-200"
                >
                  Sign Up
                </button>

                <div className="relative ml-2" ref={profileMenuRef}>
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="w-12 h-12 rounded-full border-2 border-white shadow-md hover:border-orange-500 transition-all overflow-hidden focus:outline-none group active:scale-95"
                  >
                    <img
                      src={userProfile?.avatarUrl || defaultProfile}
                      alt="User Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.src = defaultProfile; }}
                    />
                  </button>
                </div>
              </>
            ) : (
              <>
                <button 
                  onClick={() => navigate('/menu')}
                  className={`px-3 sm:px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${location.pathname === '/menu' ? 'text-orange-600 bg-orange-50' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  Menu
                </button>
                <button
                  onClick={() => navigate('/orders')}
                  className={`px-3 sm:px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${location.pathname === '/orders' ? 'text-orange-600 bg-orange-50' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  Orders
                </button>

                {!['/menu','/orders','/admin','/checkout','/settings'].includes(location.pathname) && (
                  <>
                    <button
                      onClick={() => navigate('/login')}
                      className={`px-3 sm:px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${location.pathname === '/login' ? 'text-orange-600 bg-orange-50' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                      Login
                    </button>
                    <button
                      onClick={() => navigate('/signup')}
                      className={`px-3 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                        location.pathname === '/signup'
                          ? 'bg-orange-600 text-white shadow-xl shadow-orange-100'
                          : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                      }`}
                    >
                      Sign Up
                    </button>
                  </>
                )}

                <button
                  onClick={() => navigate(location.pathname === '/admin' ? '/menu' : '/admin')}
                  className={`px-3 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                    location.pathname === '/admin'
                      ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Admin
                </button>
                
                <div className="h-8 w-px bg-slate-200 mx-1" />

                <button 
                  onClick={() => navigate('/checkout')}
                  className={`relative flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-2xl font-black transition-all group overflow-hidden ${
                    location.pathname === '/checkout' 
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-200 scale-105' 
                      : 'bg-slate-900 text-white hover:bg-black'
                  }`}
                  aria-label="Checkout"
                >
                  <ChevronDown className="w-5 h-5 group-hover:animate-bounce" />
                  <span className="hidden md:inline">Checkout</span>
                  <span className={`flex items-center justify-center min-w-[22px] h-[22px] rounded-full text-[10px] font-black border-2 ${
                    location.pathname === '/checkout' ? 'bg-white text-orange-600 border-orange-500' : 'bg-orange-500 text-white border-slate-900'
                  }`}>
                    {cart.length}
                  </span>
                </button>

                <div className="relative ml-2" ref={profileMenuRef}>
                  <button 
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="w-12 h-12 rounded-full border-2 border-white shadow-md hover:border-orange-500 transition-all overflow-hidden focus:outline-none group active:scale-95"
                  >
                    <img
                      src={userProfile?.avatarUrl || defaultProfile}
                      alt="User Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.src = defaultProfile; }}
                    />
                  </button>

                  {showProfileMenu && (
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-3xl shadow-2xl border border-slate-100 py-2 animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200 z-50">
                      <div className="px-5 py-4 border-b border-slate-50">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Signed in as</p>
                        <p className="text-sm font-black text-slate-800 truncate">Burger Enthusiast</p>
                      </div>
                      <div className="p-2">
                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            navigate('/settings');
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-600 hover:bg-slate-50 hover:text-orange-600 transition-all font-bold text-sm"
                        >
                          <SettingsIcon className="w-5 h-5" />
                          Settings
                        </button>
                        <div className="h-px bg-slate-50 my-1 mx-2" />
                        <button
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-400 hover:bg-red-50 hover:text-red-600 transition-all font-bold text-sm"
                          onClick={() => {
                            setShowProfileMenu(false);
                            try { localStorage.removeItem('is_authenticated'); } catch {}
                            updateUserProfile({});
                            navigate('/');
                          }}
                        >
                          <LogOut className="w-5 h-5" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className={`${location.pathname === '/admin' ? 'max-w-full px-0 py-0' : 'max-w-7xl mx-auto px-4 py-12'} transition-all duration-500`}>
        <Routes>
          <Route path="/order-success" element={lastPlacedOrder ? (
          <div className="max-w-2xl mx-auto text-center space-y-12 py-12">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-emerald-200 rounded-full blur-3xl opacity-40 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-emerald-400 to-emerald-600 text-white p-10 rounded-full shadow-2xl scale-in duration-700">
                <Check className="w-24 h-24" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-6xl font-black text-slate-900">{shopSettings.orderSuccessTitle}</h2>
              <p className="text-xl text-slate-500 font-medium max-w-md mx-auto">
                {shopSettings.orderSuccessSubtitle} <span className="text-orange-600 font-extrabold">#{lastPlacedOrder.id}</span> is in the kitchen.
              </p>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl inline-block w-full max-w-md text-left transition-all hover:shadow-2xl">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 border-b border-slate-50 pb-2">Final Summary</h3>
              {lastPlacedOrder.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start mb-4">
                  <div className="flex gap-3">
                    <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded-md">{item.quantity}x</span>
                    <div>
                      <span className="text-slate-800 font-bold block">{item.name}</span>
                      <span className="text-[10px] text-slate-400">{item.selectedOptions.map(o => o.name).join(', ')}</span>
                    </div>
                  </div>
                  <span className="text-slate-900 font-bold">${item.totalPrice.toFixed(2)}</span>
                </div>
              ))}
              <div className="pt-6 border-t border-slate-100 mt-6 space-y-2">
                {lastPlacedOrder.discountApplied && (
                  <div className="flex justify-between items-center text-emerald-600">
                    <span className="text-xs font-black uppercase">Promo: {lastPlacedOrder.discountApplied.code}</span>
                    <span className="font-bold">-${lastPlacedOrder.discountApplied.amount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800">Grand Total</span>
                  <span className="text-3xl font-black text-orange-600">${lastPlacedOrder.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/orders')}
                className="px-10 py-5 bg-slate-900 text-white font-black rounded-3xl hover:bg-black transition-all flex items-center justify-center gap-3 shadow-xl"
              >
                Track Progress
                <ArrowRight className="w-5 h-5" />
              </button>
              <button 
                onClick={() => navigate('/menu')}
                className="px-10 py-5 bg-white text-slate-900 border border-slate-200 font-black rounded-3xl hover:bg-slate-50 transition-all shadow-sm"
              >
                Back to Kitchen
              </button>
            </div>
          </div>
          ) : null} />

          <Route path="/order-cancelled" element={
          <div className="max-w-2xl mx-auto text-center space-y-12 py-12 animate-in fade-in zoom-in duration-500">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-red-200 rounded-full blur-3xl opacity-40 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-red-400 to-red-600 text-white p-10 rounded-full shadow-2xl">
                <X className="w-24 h-24" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-6xl font-black text-slate-900">Cancelled Order</h2>
              <p className="text-xl text-slate-500 font-medium max-w-md mx-auto">
                Your order <span className="text-red-600 font-extrabold">#{lastCancelledOrderId}</span> has been voided.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <button onClick={() => navigate('/menu')} className="px-10 py-5 bg-slate-900 text-white font-black rounded-3xl hover:bg-black transition-all">Back to Menu</button>
              <button onClick={() => navigate('/orders')} className="px-10 py-5 bg-white text-slate-900 border border-slate-200 font-black rounded-3xl hover:bg-slate-50 transition-all">View History</button>
            </div>
          </div>
          } />

          <Route path="/menu" element={
            <div className="space-y-16 animate-in fade-in duration-500">
            <section className="text-center space-y-4 max-w-2xl mx-auto mb-12">
              <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-600 rounded-full text-xs font-black uppercase tracking-widest">{shopSettings.heroEst}</span>
              <h2 className="text-5xl sm:text-7xl font-black text-slate-900 tracking-tight">{shopSettings.heroTitle}</h2>
              <p className="text-slate-500 text-lg sm:text-xl font-medium">{shopSettings.heroSubtitle}</p>
            </section>
            
            <section className="flex flex-wrap justify-center gap-3 mb-12">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                    activeCategory === cat 
                      ? 'bg-orange-500 text-white shadow-xl shadow-orange-100 scale-105' 
                      : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </section>

            <section>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredMenuItems.map(item => (
                  <MenuCard key={item.id} item={item} onSelect={handleSelectMenuItem} />
                ))}
              </div>
            </section>
          </div>
          } />

          <Route path="/" element={
            <Landing
              menuItems={menuItems}
              categories={categories}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              filteredMenuItems={filteredMenuItems}
              shopSettings={shopSettings}
              cartCount={cart.length}
              onNavigate={(p: string) => navigate(p)}
              onSelect={handleSelectMenuItem}
            />
          } />

          <Route path="/checkout" element={cart.length === 0 ? (
            <div className="max-w-2xl mx-auto text-center py-20 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-slate-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto text-slate-300">
                <ShoppingCart className="w-16 h-16" />
              </div>
              <h2 className="text-4xl font-black text-slate-900">Your Tray is Empty</h2>
              <button onClick={() => navigate('/')} className="px-10 py-5 bg-orange-600 text-white font-black rounded-3xl hover:bg-orange-700 transition-all shadow-xl shadow-orange-100">Explore Menu</button>
            </div>
          ) : (
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in slide-in-from-bottom duration-500">
              <div className="space-y-8">
                <div>
                  <h2 className="text-4xl font-black text-slate-900 mb-2">Checkout</h2>
                  <p className="text-slate-500 font-medium">Confirm details for your burger feast.</p>
                </div>

                <div className="space-y-8 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                  <div className="space-y-4">
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400">Contact Info</label>
                    <div className="relative group">
                      <input 
                        type="text" 
                        placeholder="Full Name *" 
                        className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 font-bold transition-all placeholder:text-slate-400"
                        value={customerName}
                        onChange={e => setCustomerName(e.target.value)}
                      />
                      <span className="absolute right-5 top-5 text-orange-500 font-black">*</span>
                    </div>
                    <div className="relative group">
                      <input 
                        type="tel" 
                        placeholder="Phone Number *" 
                        className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 font-bold transition-all placeholder:text-slate-400"
                        value={customerPhone}
                        onChange={e => setCustomerPhone(e.target.value)}
                      />
                      <span className="absolute right-5 top-5 text-orange-500 font-black">*</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400">Delivery Preference</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => setDeliveryMethod('PICKUP')}
                        className={`p-5 rounded-2xl border-2 font-black transition-all flex flex-col items-center gap-2 ${deliveryMethod === 'PICKUP' ? 'bg-orange-50 border-orange-500 text-orange-600' : 'bg-slate-50 border-transparent text-slate-400'}`}
                      >
                        <Package className="w-6 h-6" />
                        Pickup
                      </button>
                      <button 
                        onClick={() => setDeliveryMethod('FREE_DELIVERY')}
                        className={`p-5 rounded-2xl border-2 font-black transition-all flex flex-col items-center gap-2 ${deliveryMethod === 'FREE_DELIVERY' ? 'bg-orange-50 border-orange-500 text-orange-600' : 'bg-slate-50 border-transparent text-slate-400'}`}
                      >
                        <Truck className="w-6 h-6" />
                        Delivery
                      </button>
                    </div>
                    {deliveryMethod === 'FREE_DELIVERY' && (
                      <div className="relative group">
                        <textarea 
                          placeholder="Delivery Address *" 
                          className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 h-28 font-bold transition-all placeholder:text-slate-400"
                          value={address}
                          onChange={e => setAddress(e.target.value)}
                        />
                        <span className="absolute right-5 top-5 text-orange-500 font-black">*</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400">Payment</label>
                    <div className="grid grid-cols-2 gap-4">
                      {paymentConfig.cashEnabled && (
                        <button 
                          onClick={() => setPaymentMethod('CASH')}
                          className={`p-5 rounded-2xl border-2 font-black transition-all ${paymentMethod === 'CASH' ? 'bg-orange-50 border-orange-500 text-orange-600' : 'bg-slate-50 border-transparent text-slate-400'}`}
                        >Pay Cash</button>
                      )}
                      {paymentConfig.bankTransferEnabled && (
                        <button 
                          onClick={() => setPaymentMethod('BANK_TRANSFER')}
                          className={`p-5 rounded-2xl border-2 font-black transition-all ${paymentMethod === 'BANK_TRANSFER' ? 'bg-orange-50 border-orange-500 text-orange-600' : 'bg-slate-50 border-transparent text-slate-400'}`}
                        >Bank Transfer</button>
                      )}
                    </div>
                    {paymentMethod === 'BANK_TRANSFER' && paymentConfig.bankDetails.accountNumber && (
                      <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-2xl space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <p className="text-[10px] font-black uppercase text-indigo-600 tracking-widest">Bank Transfer Details</p>
                        <div className="grid grid-cols-2 gap-y-3">
                          <div className="space-y-1">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Account Name</p>
                            <p className="text-xs font-black text-slate-800">{paymentConfig.bankDetails.accountHolder}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Account Number</p>
                            <p className="text-xs font-black text-slate-800">{paymentConfig.bankDetails.accountNumber}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Bank Name</p>
                            <p className="text-xs font-black text-slate-800">{paymentConfig.bankDetails.bankName}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Branch / Code</p>
                            <p className="text-xs font-black text-slate-800">{paymentConfig.bankDetails.branchCode || '-'} / {paymentConfig.bankDetails.bankCode || '-'}</p>
                          </div>
                        </div>
                        {paymentConfig.bankDetails.instruction && (
                          <div className="pt-2 border-t border-indigo-100">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Instruction</p>
                            <p className="text-[10px] font-bold text-slate-600 leading-relaxed italic">"{paymentConfig.bankDetails.instruction}"</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400">Special Notes</label>
                    <textarea 
                      placeholder="Extra napkins, no onions..." 
                      className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 h-28 font-bold transition-all resize-none"
                      value={orderNotes}
                      onChange={e => setOrderNotes(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="lg:sticky lg:top-32 h-fit space-y-8">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
                  <h3 className="text-2xl font-black text-slate-900 mb-6">Your Tray</h3>
                  <div className="space-y-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                    {cart.map(item => (
                      <div key={item.id} className="flex gap-4 group">
                        <div className="bg-slate-100 w-12 h-12 rounded-2xl flex items-center justify-center font-black text-slate-500 group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                          {item.quantity}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-slate-800">{item.name}</h4>
                            <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-red-500 transition-colors p-1">
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                            {item.selectedOptions.map(o => o.name).join(', ')}
                          </p>
                          <p className="mt-1 font-black text-orange-600">${item.totalPrice.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-8 border-t-2 border-dashed border-slate-100 space-y-4">
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Promo Code</label>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="BUNS25" 
                          className={`flex-1 px-4 py-3 bg-slate-50 border rounded-xl outline-none font-black text-sm uppercase transition-all ${promoError ? 'border-red-500 bg-red-50' : appliedPromo ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-slate-100 focus:border-orange-500'}`}
                          value={promoCodeInput}
                          onChange={e => setPromoCodeInput(e.target.value)}
                        />
                        <button 
                          onClick={applyPromo}
                          className="px-6 py-3 bg-slate-900 text-white font-black rounded-xl text-xs hover:bg-black transition-all active:scale-95"
                        >
                          Apply
                        </button>
                      </div>
                      {promoError && <p className="text-[10px] font-bold text-red-500 ml-1">{promoError}</p>}
                      {appliedPromo && <p className="text-[10px] font-bold text-emerald-600 ml-1">Promo "{appliedPromo.code}" applied!</p>}
                    </div>

                    <div className="space-y-2 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">Subtotal</span>
                        <span className="font-bold text-slate-800">${subtotalCartAmount.toFixed(2)}</span>
                      </div>
                      {appliedPromo && (
                        <div className="flex justify-between items-center text-emerald-600">
                          <span className="font-bold uppercase text-xs tracking-widest">Discount</span>
                          <span className="font-black">-${discountAmount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-slate-900 font-black text-xl">Grand Total</span>
                        <span className="text-4xl font-black text-orange-600 tracking-tighter">${totalCartAmount.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={placeOrder}
                      className="w-full mt-6 py-6 bg-orange-600 hover:bg-orange-700 text-white font-black rounded-3xl shadow-2xl shadow-orange-100 transition-all flex items-center justify-center gap-3 active:scale-95"
                    >
                      Fire Up Order
                      <ArrowRight className="w-6 h-6" />
                    </button>
                  </div>
                </div>
                </div>
              </div>
            )
          } />

          <Route path="/settings" element={<Settings userProfile={userProfile} onSaveProfile={updateUserProfile} />} />

          <Route path="/admin" element={
            <AdminDashboard 
            orders={orders} 
            updateOrderStatus={updateOrderStatus} 
            toggleOrderPaymentStatus={toggleOrderPaymentStatus}
            menuItems={menuItems} 
            addProduct={addProduct}
            updateProduct={updateProduct} 
            deleteProduct={deleteProduct}
            categories={categories.filter(c => c !== 'all')}
            addCategory={addCategory}
            deleteCategory={deleteCategory}
            globalAddons={globalAddons}
            addGlobalAddon={addGlobalAddon}
            deleteGlobalAddon={deleteGlobalAddon}
            discountCodes={discountCodes}
            addDiscountCode={(d) => setDiscountCodes(prev => [...prev, d])}
            deleteDiscountCode={(id) => setDiscountCodes(prev => prev.filter(d => d.id !== id))}
            paymentConfig={paymentConfig}
            updatePaymentConfig={(config) => setPaymentConfig(config)}
            shopSettings={shopSettings}
            updateShopSettings={(settings) => setShopSettings(settings)}
          />
          } />

          <Route path="/orders" element={
            <UserOrders
              orders={orders}
              onReorder={handleReorder}
              onCancelOrder={handleCancelOrder}
              title={shopSettings.orderHistoryTitle}
              subtitle={shopSettings.orderHistorySubtitle}
            />
          } />


          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* 404 Route - must be last */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {selectedMenuItem && (
        <CustomizationModal 
          item={selectedMenuItem} 
          initialQuantity={initialQuantity}
          onClose={() => setSelectedMenuItem(null)} 
          onAddToCart={addToCart}
        />
      )}
      
    </div>
  );
};

export default App;
