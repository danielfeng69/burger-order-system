import React, { useState, useMemo, useRef } from 'react';
import { Order, OrderStatus, MenuItem, BurgerOption, DiscountCode, PaymentConfig, ShopSettings } from '../../types';
import {
  Settings,
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Megaphone,
  CreditCard,
  Check
} from 'lucide-react';

// Import the extracted components
import { ProductModal } from '../modals/ProductModal';
import { CustomerHistoryModal } from '../modals/CustomerHistoryModal';
import { AdminDashboardHome } from './admin/AdminDashboardHome';
import { AdminOrders } from './admin/AdminOrders';
import { AdminProducts } from './admin/AdminProducts';
import { AdminCustomers } from './admin/AdminCustomers';
import { AdminMarketing } from './admin/AdminMarketing';
import { AdminPayments } from './admin/AdminPayments';
import { AdminSettings } from './admin/AdminSettings';

interface AdminDashboardProps {
  orders: Order[];
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  toggleOrderPaymentStatus: (orderId: string) => void;
  menuItems: MenuItem[];
  addProduct: (newProduct: MenuItem) => void;
  updateProduct: (updatedProduct: MenuItem) => void;
  deleteProduct: (productId: string) => void;
  categories: string[];
  addCategory: (category: string) => void;
  deleteCategory: (category: string) => void;
  globalAddons: BurgerOption[];
  addGlobalAddon: (name: string, price: number) => void;
  deleteGlobalAddon: (id: string) => void;
  discountCodes: DiscountCode[];
  addDiscountCode: (code: DiscountCode) => void;
  deleteDiscountCode: (id: string) => void;
  paymentConfig: PaymentConfig;
  updatePaymentConfig: (config: PaymentConfig) => void;
  shopSettings: ShopSettings;
  updateShopSettings: (settings: ShopSettings) => void;
}

type AdminPage = 'dashboard' | 'orders' | 'products' | 'customers' | 'marketing' | 'payments' | 'settings';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  orders, updateOrderStatus, toggleOrderPaymentStatus, menuItems, addProduct, updateProduct, deleteProduct,
  categories, addCategory, deleteCategory,
  globalAddons, addGlobalAddon, deleteGlobalAddon,
  discountCodes, addDiscountCode, deleteDiscountCode,
  paymentConfig, updatePaymentConfig,
  shopSettings, updateShopSettings
}) => {
  const [activePage, setActivePage] = useState<AdminPage>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<MenuItem | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [viewingCustomerPhone, setViewingCustomerPhone] = useState<string | null>(null);

  // State management for all sections
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [filterDate, setFilterDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Marketing state
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [promoValueInput, setPromoValueInput] = useState('');
  const [promoType, setPromoType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');
  const [promoLimitInput, setPromoLimitInput] = useState('');

  // Category state
  const [newCatInput, setNewCatInput] = useState('');

  // Addon state
  const [newAddonName, setNewAddonName] = useState('');
  const [newAddonPrice, setNewAddonPrice] = useState('');

  // Payment state
  const [tempPaymentConfig, setTempPaymentConfig] = useState<PaymentConfig>(paymentConfig);
  const [hasPaymentChanges, setHasPaymentChanges] = useState(false);

  // Settings state
  const [tempShopSettings, setTempShopSettings] = useState<ShopSettings>(shopSettings);
  const [hasSettingsChanges, setHasSettingsChanges] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Handler functions
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

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingBag className="w-5 h-5" /> },
    { id: 'products', label: 'Products', icon: <Package className="w-5 h-5" /> },
    { id: 'customers', label: 'Customers', icon: <Users className="w-5 h-5" /> },
    { id: 'marketing', label: 'Marketing', icon: <Megaphone className="w-5 h-5" /> },
    { id: 'payments', label: 'Payments', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  const processedOrders = useMemo(() => {
    let result = statusFilter === 'ALL' ? [...orders] : orders.filter(o => o.status === statusFilter);
    if (filterDate) {
      result = result.filter(o => {
        const oDate = new Date(o.createdAt).toISOString().split('T')[0];
        return oDate === filterDate;
      });
    }
    return result.sort((a, b) => sortOrder === 'newest' ? b.createdAt - a.createdAt : a.createdAt - b.createdAt);
  }, [orders, statusFilter, sortOrder, filterDate]);

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

  const currentViewingCustomer = useMemo(() => {
    if (!viewingCustomerPhone) return null;
    return customerList.find(c => c.phone === viewingCustomerPhone) || null;
  }, [viewingCustomerPhone, customerList]);

  const renderActivePage = () => {
    switch (activePage) {
      case 'dashboard':
        return (
          <AdminDashboardHome
            orders={orders}
          />
        );
      case 'orders':
        return (
          <AdminOrders
            orders={processedOrders}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            updateOrderStatus={updateOrderStatus}
            toggleOrderPaymentStatus={toggleOrderPaymentStatus}
          />
        );
      case 'products':
        return (
          <AdminProducts
            menuItems={menuItems}
            categories={categories}
            globalAddons={globalAddons}
            addProduct={addProduct}
            updateProduct={updateProduct}
            deleteProduct={deleteProduct}
            addCategory={addCategory}
            deleteCategory={deleteCategory}
            addGlobalAddon={addGlobalAddon}
            deleteGlobalAddon={deleteGlobalAddon}
            newCatInput={newCatInput}
            setNewCatInput={setNewCatInput}
            newAddonName={newAddonName}
            setNewAddonName={setNewAddonName}
            newAddonPrice={newAddonPrice}
            setNewAddonPrice={setNewAddonPrice}
            onEditProduct={setEditingProduct}
            onAddProduct={() => setIsAddingProduct(true)}
          />
        );
      case 'customers':
        return (
          <AdminCustomers
            customerList={customerList}
            onViewCustomerHistory={setViewingCustomerPhone}
          />
        );
      case 'marketing':
        return (
          <AdminMarketing
            discountCodes={discountCodes}
            addDiscountCode={addDiscountCode}
            deleteDiscountCode={deleteDiscountCode}
            promoCodeInput={promoCodeInput}
            setPromoCodeInput={setPromoCodeInput}
            promoValueInput={promoValueInput}
            setPromoValueInput={setPromoValueInput}
            promoType={promoType}
            setPromoType={setPromoType}
            promoLimitInput={promoLimitInput}
            setPromoLimitInput={setPromoLimitInput}
          />
        );
      case 'payments':
        return (
          <AdminPayments
            tempPaymentConfig={tempPaymentConfig}
            setTempPaymentConfig={setTempPaymentConfig}
            hasPaymentChanges={hasPaymentChanges}
            setHasPaymentChanges={setHasPaymentChanges}
            updatePaymentConfig={updatePaymentConfig}
          />
        );
      case 'settings':
        return (
          <AdminSettings
            tempShopSettings={tempShopSettings}
            setTempShopSettings={setTempShopSettings}
            hasSettingsChanges={hasSettingsChanges}
            setHasSettingsChanges={setHasSettingsChanges}
            logoInputRef={logoInputRef}
            updateShopSettings={updateShopSettings}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-[calc(100vh-6rem)] bg-slate-50 transition-all duration-500 overflow-hidden relative">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-80 lg:min-w-[320px] lg:max-w-[320px] bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:h-full ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-10 pb-6 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg"><Settings className="w-6 h-6 text-white" /></div>
            <h2 className="text-xl font-black text-white leading-none">AdminPortal</h2>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto px-10 py-6 space-y-2 custom-scrollbar sidebar-scroll">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => { setActivePage(item.id as AdminPage); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-sm transition-all group ${activePage === item.id ? 'bg-indigo-600 text-white shadow-2xl scale-[1.02]' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
              <span className={`transition-colors ${activePage === item.id ? 'text-white' : 'text-slate-500 group-hover:text-white'}`}>{item.icon}</span>
              {item.label}
              {item.id === 'orders' && orders.filter(o => o.status === 'PENDING').length > 0 && <span className="ml-auto w-5 h-5 bg-orange-500 rounded-full text-[10px] flex items-center justify-center border-2 border-slate-900 text-white">{orders.filter(o => o.status === 'PENDING').length}</span>}
            </button>
          ))}
        </nav>
        <div className="p-10 pt-6 shrink-0">
          <div className="p-8 bg-white/5 rounded-[2rem] border border-white/10">
             <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-700 border-2 border-indigo-500/50 shadow-lg"><img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100&h=100" alt="Admin" className="w-full h-full object-cover" /></div>
                <div><p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Signed In</p><p className="font-black text-sm text-white">ChefMaster</p></div>
             </div>
             <button type="button" className="w-full py-4 bg-red-500/10 text-red-400 text-xs font-black rounded-xl hover:bg-red-600 hover:text-white transition-all">Logout</button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-slate-50 overflow-y-auto custom-scrollbar flex flex-col h-full relative">
        <div className="p-4 sm:p-8 lg:p-14">
          <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-10">
             <div><h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight capitalize mb-2">{activePage}</h2><p className="text-slate-500 font-medium text-lg">Gourmet Burger Empire Management.</p></div>
             <div className="flex flex-col items-start md:items-end"><input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="px-5 py-2.5 bg-white rounded-2xl border border-slate-200 shadow-sm text-xs font-black text-slate-900 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all" /><p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">V2.4 ENTERPRISE</p></div>
          </header>
          <div className="flex-1">
            {renderActivePage()}
          </div>
        </div>
      </main>

      {/* Modals */}
      {editingProduct && (
        <ProductModal
          product={editingProduct}
          categories={categories}
          globalAddons={globalAddons}
          onClose={() => setEditingProduct(null)}
          title="Edit Product"
          onSave={(product) => { updateProduct(product); setEditingProduct(null); }}
        />
      )}
      {isAddingProduct && (
        <ProductModal
          categories={categories}
          globalAddons={globalAddons}
          onClose={() => setIsAddingProduct(false)}
          title="Add New Product"
          onSave={(product) => { addProduct(product); setIsAddingProduct(false); }}
        />
      )}
      {currentViewingCustomer && (
        <CustomerHistoryModal
          customer={{ name: currentViewingCustomer.name, phone: currentViewingCustomer.phone, orders: currentViewingCustomer.allOrders }}
          onClose={() => setViewingCustomerPhone(null)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
