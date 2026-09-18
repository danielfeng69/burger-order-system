export type PaymentMethod = 'BANK_TRANSFER' | 'CASH';
export type DeliveryMethod = 'FREE_DELIVERY' | 'PICKUP';
export type OrderStatus = 'PENDING' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'COMPLETED' | 'CANCELLED';
export type DiscountType = 'PERCENTAGE' | 'FIXED';

export interface BankDetails {
  accountNumber: string;
  accountHolder: string;
  bankName: string;
  bankCode: string;
  branchCode: string;
  instruction?: string;
}

export interface PaymentConfig {
  cashEnabled: boolean;
  bankTransferEnabled: boolean;
  bankDetails: BankDetails;
}

export interface DiscountCode {
  id: string;
  code: string; // The text user enters (e.g., "SAVE10")
  type: DiscountType;
  value: number;
  active: boolean;
  usageLimit?: number; // Optional limit
  usageCount: number; // How many times it has been used
}

export interface BurgerOption {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  image: string;
  category: string; 
  addons?: BurgerOption[]; // Custom add-ons for this specific item
  stock?: number; // Optional inventory count
}

export interface OrderItem {
  id: string; // unique for each cart entry
  menuId: string;
  name: string;
  basePrice: number;
  selectedOptions: BurgerOption[];
  quantity: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  customerName: string;
  customerPhone: string;
  address?: string;
  paymentMethod: PaymentMethod;
  deliveryMethod: DeliveryMethod;
  totalAmount: number;
  discountApplied?: {
    code: string;
    amount: number;
  };
  status: OrderStatus;
  isPaid: boolean;
  createdAt: number;
  orderNotes?: string;
}

export interface ShopSettings {
  shopName: string;
  logo: string;
  heroTitle: string;
  heroSubtitle: string;
  heroEst: string;
  orderHistoryTitle: string;
  orderHistorySubtitle: string;
  orderSuccessTitle: string;
  orderSuccessSubtitle: string;
}

export type ViewType = 'menu' | 'admin' | 'order-success' | 'order-cancelled' | 'my-orders' | 'checkout';

export interface AppState {
  view: ViewType;
  cart: OrderItem[];
  orders: Order[];
}