
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Product, Order, AppConfig, StoreContextType, OrderStatus, OrderItem, AuthResponse } from '../types';
import { auth, db } from '../services/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  getDoc 
} from 'firebase/firestore';

// Mock Data Defaults (Used for initial seeding only)
const defaultConfig: AppConfig = {
  appName: "Sharfin's Store",
  appLogo: "", 
  notice: "Welcome to Sharfin's Store! Instant Top-Up Available.",
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

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [config, setConfig] = useState<AppConfig>(defaultConfig);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  // 1. Listen to Configuration
  useEffect(() => {
    const docRef = doc(db, 'settings', 'appConfig');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setConfig(docSnap.data() as AppConfig);
      } else {
        // Seed default config if not exists
        setDoc(docRef, defaultConfig);
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. Listen to Products
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
      const prods = snapshot.docs.map(doc => doc.data() as Product);
      if (prods.length === 0) {
        // Seed default products if empty so the app isn't blank
        defaultProducts.forEach(p => setDoc(doc(db, 'products', p.id), p));
      }
      setProducts(prods);
    });
    return () => unsubscribe();
  }, []);

  // 3. Listen to Orders
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'orders'), (snapshot) => {
      const orderList = snapshot.docs.map(doc => doc.data() as Order);
      // Sort by date desc
      orderList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setOrders(orderList);
    });
    return () => unsubscribe();
  }, []);

  // 4. Listen to All Users (Admin usage mostly)
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const userList = snapshot.docs.map(doc => doc.data() as User);
      setAllUsers(userList);
    });
    return () => unsubscribe();
  }, []);

  // 5. Auth State Listener & User Sync
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser: any) => {
      if (firebaseUser) {
        // Fetch or Create user in Firestore
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUser(userSnap.data() as User);
        } else {
          // Create new user doc
          const newUser: User = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'User',
            email: firebaseUser.email || '',
            role: firebaseUser.email === 'admin@sharfin.com' ? 'admin' : 'user',
            balance: 0
          };
          await setDoc(userRef, newUser);
          setUser(newUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);


  // --- Actions ---

  const login = async (email: string, password?: string): Promise<AuthResponse> => {
    try {
      if (!password) throw new Error("Password required");
      await auth.signInWithEmailAndPassword(email, password);
      return { success: true };
    } catch (error: any) {
      console.error("Login failed", error);
      return { success: false, message: error.message };
    }
  };

  const register = async (name: string, email: string, password?: string): Promise<AuthResponse> => {
    try {
      if (!password) throw new Error("Password required");
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      
      const newUser: User = {
        id: userCredential.user.uid,
        name,
        email,
        role: email === 'admin@sharfin.com' ? 'admin' : 'user',
        balance: 0
      };

      // Save to Firestore
      await setDoc(doc(db, 'users', newUser.id), newUser);
      
      return { success: true };
    } catch (error: any) {
      console.error("Registration failed", error);
      return { success: false, message: error.message };
    }
  };

  const logout = async () => {
    await auth.signOut();
    setUser(null);
  };

  const updateUser = async (userId: string, data: Partial<User>) => {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, data);
    // Local state updates automatically via onSnapshot
  };

  const deleteUser = async (userId: string) => {
    await deleteDoc(doc(db, 'users', userId));
  };

  const placeOrder = async (
    productId: string, 
    items: OrderItem[], 
    details: Record<string, string>,
    paymentMethod: 'wallet' | 'bkash' | 'nagad',
    paymentData?: { trxId?: string; sender?: string }
  ) => {
    if (!user) return { success: false, message: 'Please login first' };

    const product = products.find(p => p.id === productId);
    if (!product) return { success: false, message: 'Product not found' };

    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Handle Wallet Balance Deduction
    if (paymentMethod === 'wallet') {
      if (user.balance < totalPrice) {
        return { success: false, message: 'Insufficient wallet balance' };
      }
      // Update balance in Firestore
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, { balance: user.balance - totalPrice });
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

    // Save Order to Firestore
    await setDoc(doc(db, 'orders', newOrder.id), newOrder);

    return { success: true, message: 'Order placed successfully!' };
  };

  const deposit = async (amount: number, method: string, trxId: string) => {
    if (!user) return;
    
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

    await setDoc(doc(db, 'orders', newOrder.id), newOrder);
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    const orderRef = doc(db, 'orders', orderId);
    const order = orders.find(o => o.id === orderId);
    
    if (!order) return;

    // Handle Deposit Approval
    if (order.type === 'deposit' && order.status === 'pending' && status === 'completed') {
       const userRef = doc(db, 'users', order.userId);
       const targetUser = allUsers.find(u => u.id === order.userId);
       if (targetUser) {
          await updateDoc(userRef, { balance: targetUser.balance + order.price });
       }
    }
    
    // Handle Refund on Cancellation (Wallet only)
    if (order.type === 'purchase' && status === 'cancelled' && order.status !== 'cancelled') {
        if (order.paymentMethod === 'wallet') {
          const userRef = doc(db, 'users', order.userId);
          const targetUser = allUsers.find(u => u.id === order.userId);
          if (targetUser) {
              await updateDoc(userRef, { balance: targetUser.balance + order.price });
          }
        }
    }

    await updateDoc(orderRef, { status });
  };

  const updateConfig = async (newConfig: Partial<AppConfig>) => {
    const configRef = doc(db, 'settings', 'appConfig');
    await setDoc(configRef, { ...config, ...newConfig });
  };

  const addProduct = async (product: Product) => {
    await setDoc(doc(db, 'products', product.id), product);
  };
  
  const updateProduct = async (id: string, updatedProduct: Product) => {
    await setDoc(doc(db, 'products', id), updatedProduct);
  };
  
  const deleteProduct = async (id: string) => {
    await deleteDoc(doc(db, 'products', id));
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
