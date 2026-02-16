
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ChevronLeft, Check, ShieldAlert, AlertCircle, Minus, Plus, Wallet, Copy } from 'lucide-react';
import { OrderItem } from '../types';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, user, placeOrder, config } = useStore();
  
  // State for multiple package quantities
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);
  const [isOrdering, setIsOrdering] = useState(false);
  
  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'bkash' | 'nagad'>('wallet');
  const [paymentData, setPaymentData] = useState({ trxId: '', sender: '' });

  const product = products.find(p => p.id === id);

  if (!product) return <div className="text-center py-20 text-slate-400">Product not found</div>;

  const handleInputChange = (name: string, value: string) => {
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleQuantityChange = (pkgId: string, delta: number) => {
    setQuantities(prev => {
      const current = prev[pkgId] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [pkgId]: next };
    });
  };

  const calculateTotal = () => {
    return product.packages.reduce((sum, pkg) => {
      const qty = quantities[pkg.id] || 0;
      return sum + (pkg.price * qty);
    }, 0);
  };

  const handleSubmit = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    const totalItems: OrderItem[] = product.packages
      .filter(pkg => (quantities[pkg.id] || 0) > 0)
      .map(pkg => ({
        packageId: pkg.id,
        packageName: pkg.name,
        quantity: quantities[pkg.id],
        price: pkg.price
      }));

    if (totalItems.length === 0) {
      setMessage({ type: 'error', text: 'Please select at least one package' });
      return;
    }
    
    // Validate inputs
    for (const input of product.inputs) {
      if (!inputs[input.name]) {
        setMessage({ type: 'error', text: `Please fill in ${input.label}` });
        return;
      }
    }

    // Validate Payment
    if (paymentMethod !== 'wallet') {
      if (!paymentData.trxId || !paymentData.sender) {
        setMessage({ type: 'error', text: 'Please enter TrxID and Sender Number' });
        return;
      }
    }

    setIsOrdering(true);
    const result = await placeOrder(product.id, totalItems, inputs, paymentMethod, paymentData);
    setIsOrdering(false);
    
    if (result.success) {
      setMessage({ type: 'success', text: result.message });
      setQuantities({});
      if (paymentMethod !== 'wallet') {
          setPaymentData({ trxId: '', sender: '' });
      }
    } else {
      setMessage({ type: 'error', text: result.message });
    }
  };

  const totalPrice = calculateTotal();

  return (
    <div className="max-w-2xl mx-auto space-y-6 md:space-y-8 pb-10">
      <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-brand-600 transition text-sm font-bold bg-white/50 px-3 py-1.5 rounded-full backdrop-blur-sm shadow-sm border border-white">
        <ChevronLeft size={18} className="mr-1" /> Back to Store
      </button>

      {/* Header */}
      <div className="liquid-card rounded-3xl p-6 flex items-center gap-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 blur-[50px] rounded-full -mr-10 -mt-10"></div>
        <img src={product.image} alt={product.name} className="w-24 h-24 rounded-2xl object-cover shadow-lg z-10 border border-white" />
        <div className="z-10">
          <h1 className="text-3xl font-black text-slate-800">{product.name}</h1>
          <p className="text-brand-600 text-sm font-bold uppercase tracking-wider mt-1 flex items-center gap-2">
            {product.type} Service
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:gap-8">
        {/* User Inputs */}
        <div className="liquid-card rounded-3xl p-6">
           <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
             <span className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-sm border border-brand-200 shadow-sm">1</span>
             Account Details
           </h2>
           <div className="space-y-5">
             {product.inputs.map(input => (
               <div key={input.name}>
                 <label className="block text-sm font-bold text-slate-500 mb-2 ml-1 uppercase tracking-wide">{input.label}</label>
                 <input
                   type="text"
                   value={inputs[input.name] || ''}
                   placeholder={input.placeholder}
                   className="w-full bg-slate-50 text-slate-800 rounded-xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition outline-none placeholder:text-slate-400 shadow-inner"
                   onChange={(e) => handleInputChange(input.name, e.target.value)}
                 />
               </div>
             ))}
           </div>
        </div>

        {/* Package Selection */}
        <div className="liquid-card rounded-3xl p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-sm border border-brand-200 shadow-sm">2</span>
            Select Packages
          </h2>
          <div className="space-y-3">
            {product.packages.map(pkg => {
              const qty = quantities[pkg.id] || 0;
              return (
                <div 
                  key={pkg.id}
                  className={`rounded-2xl p-4 flex items-center justify-between transition-all duration-200 border-2 shadow-sm ${qty > 0 ? 'bg-brand-50 border-brand-500 shadow-brand-500/10' : 'bg-white border-slate-100'}`}
                >
                   <div className="flex-1">
                     <div className="font-bold text-slate-700">{pkg.name}</div>
                     <div className="text-brand-600 font-black text-lg">৳ {pkg.price}</div>
                   </div>
                   
                   <div className="flex items-center gap-3 bg-white rounded-xl p-1 shadow-sm border border-slate-100">
                      <button 
                        onClick={() => handleQuantityChange(pkg.id, -1)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition ${qty > 0 ? 'bg-slate-100 hover:bg-slate-200 text-slate-600' : 'text-slate-300'}`}
                        disabled={qty === 0}
                      >
                        <Minus size={16} strokeWidth={3} />
                      </button>
                      <span className="w-6 text-center font-bold text-lg">{qty}</span>
                      <button 
                        onClick={() => handleQuantityChange(pkg.id, 1)}
                        className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center hover:bg-brand-500 transition shadow-lg shadow-brand-500/30"
                      >
                        <Plus size={16} strokeWidth={3} />
                      </button>
                   </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="liquid-card rounded-3xl p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-sm border border-brand-200 shadow-sm">3</span>
            Payment Method
          </h2>
          
          {/* Rules Section */}
          {product.rules && (
            <div id="rules-section" className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl mb-6">
               <h3 className="text-red-700 font-bold flex items-center gap-2 mb-2">
                  <AlertCircle size={18} /> রুলস এবং শর্তাবলী
               </h3>
               <p className="text-red-600 text-sm whitespace-pre-line leading-relaxed font-medium">
                  {product.rules}
               </p>
            </div>
          )}
          
          <div className="flex gap-3 mb-6">
              <button
                onClick={() => setPaymentMethod('wallet')}
                className={`flex-1 py-3 px-2 rounded-xl font-bold flex flex-col items-center justify-center gap-1 border-2 transition ${paymentMethod === 'wallet' ? 'bg-brand-50 border-brand-500 text-brand-700' : 'bg-white border-slate-100 text-slate-500'}`}
              >
                <Wallet size={20} />
                <span className="text-xs">Wallet</span>
              </button>
              <button
                onClick={() => setPaymentMethod('bkash')}
                className={`flex-1 py-3 px-2 rounded-xl font-bold flex flex-col items-center justify-center gap-1 border-2 transition ${paymentMethod === 'bkash' ? 'bg-pink-50 border-pink-500 text-pink-700' : 'bg-white border-slate-100 text-slate-500'}`}
              >
                <span className="text-sm">bKash</span>
                <span className="text-[10px] bg-pink-100 px-2 py-0.5 rounded-full">Instant</span>
              </button>
              <button
                onClick={() => setPaymentMethod('nagad')}
                className={`flex-1 py-3 px-2 rounded-xl font-bold flex flex-col items-center justify-center gap-1 border-2 transition ${paymentMethod === 'nagad' ? 'bg-orange-50 border-orange-500 text-orange-700' : 'bg-white border-slate-100 text-slate-500'}`}
              >
                <span className="text-sm">Nagad</span>
                <span className="text-[10px] bg-orange-100 px-2 py-0.5 rounded-full">Instant</span>
              </button>
          </div>

          {paymentMethod === 'wallet' && (
             <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Your Balance</p>
                  <p className={`text-xl font-black ${user && user.balance >= totalPrice ? 'text-green-600' : 'text-red-500'}`}>
                    ৳ {user?.balance.toFixed(2) || '0.00'}
                  </p>
                </div>
                {user && user.balance < totalPrice && (
                   <span className="text-xs font-bold text-red-500 bg-red-50 px-3 py-1 rounded-full border border-red-100">Insufficient</span>
                )}
             </div>
          )}

          {(paymentMethod === 'bkash' || paymentMethod === 'nagad') && (
            <div className="space-y-4 animate-fade-in">
               <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs p-4 rounded-xl font-medium">
                  Send <strong>৳ {totalPrice}</strong> to the number below via {paymentMethod === 'bkash' ? 'bKash' : 'Nagad'} <strong>Send Money</strong>.
               </div>
               
               <div className="flex items-center justify-between bg-slate-100 p-4 rounded-xl border border-slate-200">
                  <span className="font-mono text-lg text-slate-700 tracking-wider font-bold">
                    {paymentMethod === 'bkash' ? config.paymentMethods.bkash : config.paymentMethods.nagad}
                  </span>
                  <button 
                    className="text-brand-600 p-2 hover:bg-white rounded-lg transition"
                    onClick={() => navigator.clipboard.writeText(paymentMethod === 'bkash' ? config.paymentMethods.bkash : config.paymentMethods.nagad)}
                  >
                    <Copy size={20} />
                  </button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Sender Number</label>
                    <input 
                      type="text" 
                      placeholder="017..."
                      value={paymentData.sender}
                      onChange={(e) => setPaymentData({...paymentData, sender: e.target.value})}
                      className="w-full bg-white text-slate-800 rounded-xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition shadow-sm"
                    />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Transaction ID</label>
                    <input 
                      type="text" 
                      placeholder="TRX..."
                      value={paymentData.trxId}
                      onChange={(e) => setPaymentData({...paymentData, trxId: e.target.value})}
                      className="w-full bg-white text-slate-800 rounded-xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition shadow-sm font-mono uppercase"
                    />
                 </div>
               </div>
            </div>
          )}
      </div>

      {/* Total & Checkout */}
      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 border shadow-sm ${message.type === 'error' ? 'bg-red-50 border-red-200 text-red-600' : 'bg-green-50 border-green-200 text-green-600'}`}>
          {message.type === 'error' ? <ShieldAlert size={20} /> : <Check size={20} />}
          <span className="font-bold">{message.text}</span>
        </div>
      )}

      <div className="liquid-card rounded-3xl p-6 shadow-2xl shadow-slate-200 border-t border-white mt-8">
        <div className="flex justify-between items-center mb-5">
           <span className="text-slate-500 font-bold uppercase tracking-wider text-sm">Total Payable</span>
           <span className="text-4xl font-black text-slate-800 tracking-tight">
             ৳ {totalPrice}
           </span>
        </div>
        <button 
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-brand-600 to-brand-500 text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-brand-500/30 hover:shadow-xl hover:shadow-brand-500/40 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={totalPrice === 0 || isOrdering}
        >
          {user ? (isOrdering ? 'Processing...' : 'Confirm Payment') : 'Login to Purchase'}
        </button>
        <p className="text-center text-xs text-slate-400 mt-3 flex items-center justify-center gap-1 font-medium">
          <ShieldAlert size={12} /> Secure 256-bit encrypted transaction
        </p>
      </div>
    </div>
  );
};

export default ProductDetails;
