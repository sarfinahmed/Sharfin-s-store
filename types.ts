
export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  balance: number;
  phone?: string;
  password?: string; // Legacy/Optional for Firebase
}

export interface Package {
  id: string;
  name: string;
  price: number;
  bonus?: string;
}

export type ProductType = string;

export interface Product {
  id: string;
  type: ProductType;
  name: string;
  image: string;
  category?: string;
  packages: Package[];
  inputs: { name: string; label: string; placeholder: string }[];
  rules?: string;
}

export type OrderStatus = 'pending' | 'completed' | 'cancelled';
export type OrderType = 'purchase' | 'deposit';

export interface OrderItem {
  packageId: string;
  packageName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  type: OrderType;
  productName: string;
  items?: OrderItem[];
  price: number;
  status: OrderStatus;
  date: string;
  details: Record<string, string>;
  
  // Legacy single item support
  packageName?: string;
  
  // Payment info
  paymentMethod?: 'wallet' | 'bkash' | 'nagad';
  trxId?: string;
  senderNumber?: string;
}

export interface HomeSection {
  id: string;
  title: string;
  subtitle: string;
  productType: ProductType;
  categoryFilter?: string;
  icon: 'game' | 'zap' | 'star' | 'flame' | 'gift' | 'trophy';
}

export interface ContactInfo {
  phone: string;
  email: string;
  whatsapp: string;
  address: string;
  hours: string;
}

export interface AppConfig {
  appName: string;
  appLogo: string;
  notice: string;
  banners: string[];
  paymentMethods: {
    bkash: string;
    nagad: string;
  };
  contactInfo: ContactInfo;
  offersPage: {
    title: string;
    subtitle: string;
  };
  homeSections: HomeSection[];
  productTypes: string[];
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  requiresVerification?: boolean;
}

export interface StoreContextType {
  user: User | null;
  loading: boolean;
  config: AppConfig;
  products: Product[];
  orders: Order[];
  allUsers: User[]; // Admin only
  login: (email: string, password?: string) => Promise<AuthResponse>;
  register: (name: string, email: string, password?: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  updateUser: (userId: string, data: Partial<User>) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  placeOrder: (
    productId: string, 
    items: OrderItem[], 
    details: Record<string, string>,
    paymentMethod: 'wallet' | 'bkash' | 'nagad',
    paymentData?: { trxId?: string; sender?: string }
  ) => Promise<{ success: boolean; message: string }>;
  deposit: (amount: number, method: string, trxId: string) => Promise<void>;
  updateConfig: (newConfig: Partial<AppConfig>) => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (id: string, product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}