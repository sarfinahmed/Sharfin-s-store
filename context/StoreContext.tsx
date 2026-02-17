
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Product, Order, AppConfig, StoreContextType, OrderStatus, OrderItem, AuthResponse, UserRole } from '../types';
import { auth } from '../services/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged
} from 'firebase/auth';

// Mock Data Defaults
const defaultConfig: AppConfig = {
  appName: "Sharfin's Store",
  appLogo: "", 
  notice: "Welcome to Sharfin's Store! Instant Top-Up Available.",
  aiApiKey: "", 
  banners: [
    'https://picsum.photos/1200/600?random=1',
    'https://picsum.photos/1200/600?random=2',
    'https://picsum.photos/1200/600?random=3'
  ],
  paymentMethods: {
    bkash: '01700000000',
    nagad: '01800000000'
  },
  contactInfo: {
    phone: '+880 1700 000 000',
    email: 'support@sharfin.com',
    whatsapp: 'https://wa.me/8801700000000',
    address: 'Dhaka, Bangladesh',
    hours: '10 AM - 10 PM'
  },
  offersPage: {
    title: 'Special Offers',
    subtitle: 'Exclusive deals for you.'
  },
  productTypes: ['game', 'subscription', 'offer'],
  homeSections: [
    {
      id: 'sec_1',
      title: 'Trending Games',
      subtitle: 'Instant top-up',
      productType: 'game',
      icon: 'game'
    }
  ]
};

const defaultProducts: Product[] = [
  {
    id: 'ff_demo',
    type: 'game',
    name: 'Free Fire',
    category: 'Action',
    image: 'https://picsum.photos/400/400?random=1',
    inputs: [{ name: 'uid', label: 'Player UID', placeholder: 'Enter UID' }],
    packages: [{ id: 'p1', name: '115 Diamonds', price: 85 }],
    rules: "UID দিয়ে অর্ডার করুন।"
  }
];

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Helper for local storage
const getStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const setStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [config, setConfig] = useState<AppConfig>(defaultConfig);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  // Load Data on Mount
  useEffect(() => {
    const loadData = async () => {
      let storedConfig = getStorage('sharfin_config', defaultConfig);
      
      // Migration Fix: If user has the old single banner, reset to new default 3 banners
      if (storedConfig.banners.length === 1 && storedConfig.banners[0].includes('random=10')) {
          storedConfig.banners = defaultConfig.banners;
      }

      const storedProducts = getStorage('sharfin_products', defaultProducts);
      const storedOrders = getStorage('sharfin_orders', []);
      const storedUsers = getStorage('sharfin_users', []);

      setConfig(storedConfig);
      setProducts(storedProducts);
      setOrders(storedOrders);
      setAllUsers(storedUsers);
    };
    loadData();
  }, []);

  // Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const storedUsers = getStorage<User[]>('sharfin_users', []);
        let appUser = storedUsers.find(u => u.id === firebaseUser.uid);

        if (!appUser) {
          appUser = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'User',
            email: firebaseUser.email || '',
            role: firebaseUser.email === 'admin@sharfin.com' ? 'admin' : 'user',
            balance: 0
          };
          setAllUsers(prev => [...prev, appUser!]);
          setStorage('sharfin_users', [...storedUsers, appUser]);
        }
        
        if (appUser.email === 'admin@sharfin.com' && appUser.role !== 'admin') {
           appUser.role = 'admin';
        }

        setUser(appUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Persist Data
  useEffect(() => {
    if (!loading) {
      setStorage('sharfin_config', config);
      setStorage('sharfin_products', products);
      setStorage('sharfin_orders', orders);
      setStorage('sharfin_users', allUsers);
    }
  }, [config, products, orders, allUsers, loading]);

  // Actions
  const login = async (email: string, password?: string): Promise<AuthResponse> => {
    try {
      if (!password) throw new Error("Password required");
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error: any) {
      console.error("Login failed", error);
      return { success: false, message: error.message };
    }
  };

  const register = async (name: string, email: string, password?: string): Promise<AuthResponse> => {
    try {
      if (!password) throw new Error("Password required");
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser: User = {
        id: userCredential.user.uid,
        name,
        email,
        role: email === 'admin@sharfin.com' ? 'admin' : 'user',
        balance: 0
      };

      setAllUsers(prev => [...prev, newUser]);
      const currentUsers = getStorage<User[]>('sharfin_users', []);
      setStorage('sharfin_users', [...currentUsers, newUser]);

      return { success: true };
    } catch (error: any) {
      console.error("Registration failed", error);
      return { success: false, message: error.message };
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const updateUser = async (userId: string, data: Partial<User>) => {
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, ...data } : u));
    if (user && user.id === userId) {
      setUser(prev => prev ? { ...prev, ...data } : null);
    }
  };

  const deleteUser = async (userId: string) => {
    setAllUsers(prev => prev.filter(u => u.id !== userId));
  };

  const placeOrder = async (
    productId: string, 
    items: OrderItem[], 
    details: Record<string, string>,
    paymentMethod: 'wallet' | 'bkash' | 'nagad',
    paymentData?: { trxId?: string; sender?: string }
  ) => {
    if (!user) return { success: false, message: 'Please login first' };
    await new Promise(r => setTimeout(r, 800));

    const product = products.find(p => p.id === productId);
    if (!product) return { success: false, message: 'Product not found' };

    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (paymentMethod === 'wallet') {
      if (user.balance < totalPrice) {
        return { success: false, message: 'Insufficient wallet balance' };
      }
      const updatedUser = { ...user, balance: user.balance - totalPrice };
      setUser(updatedUser);
      setAllUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
    }

    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      userId: user.id,
      userEmail: user.email,
      type: 'purchase',
      productName: product.name,
      items: items,
      price: totalPrice,
      status: 'pending',
      date: new Date().toISOString(),
      details,
      paymentMethod,
      trxId: paymentData?.trxId,
      senderNumber: paymentData?.sender,
    };

    setOrders(prev => [newOrder, ...prev]);
    return { success: true, message: 'Order placed successfully!' };
  };

  const deposit = async (amount: number, method: string, trxId: string) => {
    if (!user) return;
    await new Promise(r => setTimeout(r, 500));
    
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      userId: user.id,
      userEmail: user.email,
      type: 'deposit',
      productName: 'Balance Deposit',
      price: amount,
      status: 'pending',
      date: new Date().toISOString(),
      details: { method, trxId }
    };

    setOrders(prev => [newOrder, ...prev]);
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    await new Promise(r => setTimeout(r, 400));
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    if (order.type === 'deposit' && order.status === 'pending' && status === 'completed') {
       const targetUser = allUsers.find(u => u.id === order.userId);
       if (targetUser) {
          const updatedUser = { ...targetUser, balance: targetUser.balance + order.price };
          setAllUsers(prev => prev.map(u => u.id === targetUser.id ? updatedUser : u));
          if (user && user.id === targetUser.id) setUser(updatedUser);
       }
    }
    
    if (order.type === 'purchase' && status === 'cancelled' && order.status !== 'cancelled') {
        if (order.paymentMethod === 'wallet') {
          const targetUser = allUsers.find(u => u.id === order.userId);
          if (targetUser) {
              const updatedUser = { ...targetUser, balance: targetUser.balance + order.price };
              setAllUsers(prev => prev.map(u => u.id === targetUser.id ? updatedUser : u));
              if (user && user.id === targetUser.id) setUser(updatedUser);
          }
        }
    }

    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const updateConfig = async (newConfig: Partial<AppConfig>) => {
    await new Promise(r => setTimeout(r, 500));
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  const addProduct = async (product: Product) => {
    await new Promise(r => setTimeout(r, 500));
    setProducts(prev => [...prev, product]);
  };
  
  const updateProduct = async (id: string, updatedProduct: Product) => {
    await new Promise(r => setTimeout(r, 500));
    setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
  };
  
  const deleteProduct = async (id: string) => {
    await new Promise(r => setTimeout(r, 300));
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <StoreContext.Provider value={{
      user, loading, config, products, orders, allUsers,
      login, register, logout, updateUser, deleteUser, placeOrder, deposit,
      updateConfig, updateOrderStatus, addProduct, updateProduct, deleteProduct
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
