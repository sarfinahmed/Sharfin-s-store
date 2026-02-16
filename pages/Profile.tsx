
import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { Wallet, History, CreditCard, LogOut, Copy, RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, logout, orders, config, deposit, loading } = useStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'wallet' | 'orders'>('wallet');
  const [depositAmount, setDepositAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<'bkash' | 'nagad'>('bkash');
  const [trxId, setTrxId] = useState('');
  const [msg, setMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login'); // Changed from register to login as default
    }
  }, [user, navigate, loading]);

  if (loading || !user) {
    return <div className="text-center py-20">Loading profile...</div>;
  }

  const userOrders = orders.filter(o => o.userId === user.id);

  const handleDeposit = async () => {
    if (!depositAmount || !trxId) {
      setMsg('Please fill all fields');
      return;
    }
    setSubmitting(true);
    await deposit(Number(depositAmount), selectedMethod, trxId);
    setSubmitting(false);
    setMsg('Deposit request submitted! Wait for admin approval.');
    setDepositAmount('');
    setTrxId('');
    setTimeout(() => setActiveTab('orders'), 1500);
  };

  const handleLogout = async () => {
      await logout();
      navigate('/');
  };

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="liquid-card rounded-3xl p-6 md:p-8 flex justify-between items-center relative overflow-hidden bg-white/90">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-500 to-brand-300"></div>
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-50 to-white border border-brand-100 flex items-center justify-center font-black text-3xl text-brand-600 shadow-md">
            {user.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{user.name}</h1>
            <p className="text-slate-500 text-sm font-medium">{user.email}</p>
            <div className="mt-2 inline-flex items-center gap-1 bg-brand-50 border border-brand-100 px-2 py-0.5 rounded text-[10px] text-brand-600 uppercase tracking-widest font-bold">
              {user.role === 'admin' ? 'Admin' : 'Member'}
            </div>
          </div>
        </div>
        <button onClick={handleLogout} className="text-red-500 hover:bg-red-50 hover:text-red-600 p-3 rounded-xl transition border border-transparent hover:border-red-100">
          <LogOut size={24} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-slate-200 px-2">
        <button 
          onClick={() => setActiveTab('wallet')}
          className={`pb-4 font-bold text-sm flex items-center gap-2 transition-all ${activeTab === 'wallet' ? 'text-brand-600 border-b-2 border-brand-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Wallet size={18} /> Wallet
        </button>
        <button 
          onClick={() => setActiveTab('orders')}
          className={`pb-4 font-bold text-sm flex items-center gap-2 transition-all ${activeTab === 'orders' ? 'text-brand-600 border-b-2 border-brand-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <History size={18} /> History
        </button>
      </div>

      {activeTab === 'wallet' ? (
        <div className="grid md:grid-cols-2 gap-8">
          {/* Balance Card - Clean Light Style */}
          <div className="relative overflow-hidden rounded-3xl p-8 text-white shadow-xl shadow-brand-500/20 bg-gradient-to-br from-brand-600 to-brand-700">
            <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-white/10 rounded-full blur-[40px]"></div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                   <p className="text-brand-100 text-sm font-bold tracking-wider uppercase mb-1">Available Balance</p>
                   <h2 className="text-5xl font-black tracking-tighter text-white">
                     ৳ {user.balance.toFixed(2)}
                   </h2>
                </div>
                <div className="w-12 h-8 rounded border border-white/20 flex items-center justify-center bg-white/10 backdrop-blur">
                  <div className="w-6 h-4 bg-yellow-400 rounded-sm shadow-sm"></div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex gap-6">
                 <div>
                   <p className="text-[10px] text-brand-200 uppercase tracking-widest mb-1 font-bold">Total Spent</p>
                   <p className="font-bold text-lg">৳ {userOrders.filter(o => o.type === 'purchase' && o.status === 'completed').reduce((sum, o) => sum + o.price, 0)}</p>
                 </div>
                 <div>
                   <p className="text-[10px] text-brand-200 uppercase tracking-widest mb-1 font-bold">Status</p>
                   <p className="font-bold text-lg text-emerald-300">Active</p>
                 </div>
              </div>
            </div>
          </div>

          {/* Deposit Form */}
          <div className="liquid-card rounded-3xl p-6">
            <h3 className="font-bold text-xl text-slate-800 mb-6 flex items-center gap-2">
              <CreditCard size={22} className="text-brand-600"/> 
              Add Funds
            </h3>
            
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs p-4 rounded-xl mb-6 font-medium">
              Transfer via <strong>Send Money</strong> to the number below, then paste the TrxID.
            </div>

            <div className="flex gap-3 mb-6">
              {['bkash', 'nagad'].map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedMethod(m as any)}
                  className={`flex-1 py-3 rounded-xl font-bold capitalize transition border-2 shadow-sm ${selectedMethod === m ? 'border-brand-500 bg-brand-50 text-brand-600' : 'border-slate-100 text-slate-500 bg-white hover:border-slate-300'}`}
                >
                  {m}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl mb-6 border border-slate-200 group hover:border-brand-300 transition shadow-inner">
              <span className="font-mono text-lg text-slate-700 tracking-wider font-bold">{config.paymentMethods[selectedMethod]}</span>
              <button className="text-brand-600 hover:text-brand-700 p-2 rounded-lg hover:bg-brand-50 transition" onClick={() => navigator.clipboard.writeText(config.paymentMethods[selectedMethod])}>
                <Copy size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <input 
                type="number" 
                placeholder="Amount (৳)" 
                className="w-full bg-white text-slate-800 rounded-xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none shadow-sm"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
              />
              <input 
                type="text" 
                placeholder="Transaction ID (TrxID)" 
                className="w-full bg-white text-slate-800 rounded-xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none font-mono shadow-sm"
                value={trxId}
                onChange={(e) => setTrxId(e.target.value)}
              />
              {msg && <p className="text-xs text-brand-600 font-bold animate-pulse">{msg}</p>}
              <button 
                onClick={handleDeposit} 
                disabled={submitting}
                className="w-full bg-brand-600 text-white py-4 rounded-xl font-bold hover:bg-brand-500 transition shadow-lg shadow-brand-500/30 disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {userOrders.length === 0 ? (
            <div className="text-center py-20 text-slate-400 flex flex-col items-center gap-3 liquid-card rounded-3xl">
              <History size={40} className="opacity-30" />
              <p className="font-medium">No transactions yet.</p>
            </div>
          ) : (
            userOrders.map(order => (
              <div key={order.id} className="liquid-card p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-brand-300 transition group">
                 <div className="flex items-start gap-4">
                    <div className={`mt-1 w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
                      order.status === 'completed' ? 'bg-green-50 text-green-500' :
                      order.status === 'cancelled' ? 'bg-red-50 text-red-500' :
                      'bg-orange-50 text-orange-500'
                    }`}>
                      {order.status === 'completed' ? <CheckCircle size={20} /> :
                       order.status === 'cancelled' ? <XCircle size={20} /> :
                       <Clock size={20} />}
                    </div>
                    <div>
                       <h4 className="font-bold text-slate-800 text-lg">{order.productName}</h4>
                       
                       {/* Show Items Summary */}
                       {order.items && order.items.length > 0 ? (
                         <div className="text-sm text-slate-600 mt-1 space-y-1">
                           {order.items.map((item, idx) => (
                             <div key={idx} className="flex gap-2">
                               <span className="font-bold text-brand-600">{item.quantity}x</span>
                               <span>{item.packageName}</span>
                             </div>
                           ))}
                         </div>
                       ) : (
                         <span className="text-slate-500 font-normal text-sm">{order.packageName && `• ${order.packageName}`}</span>
                       )}

                       <div className="flex flex-wrap gap-2 mt-2">
                          <span className="text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-200 font-medium">{new Date(order.date).toLocaleDateString()}</span>
                          {Object.entries(order.details).map(([key, val]) => (
                            <span key={key} className="text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-200 font-medium"><span className="opacity-50 uppercase mr-1">{key}:</span>{val}</span>
                          ))}
                          {order.paymentMethod && order.paymentMethod !== 'wallet' && (
                             <span className="text-xs text-brand-600 bg-brand-50 px-2 py-1 rounded border border-brand-100 font-bold uppercase">{order.paymentMethod}</span>
                          )}
                       </div>
                    </div>
                 </div>
                 <div className="text-right pl-14 md:pl-0">
                   <p className={`font-black text-xl ${order.type === 'deposit' ? 'text-green-600' : 'text-slate-700'}`}>
                     {order.type === 'deposit' ? '+' : '-'} ৳ {order.price}
                   </p>
                   <span className={`text-[10px] uppercase font-bold tracking-wider ${
                      order.status === 'completed' ? 'text-green-600' :
                      order.status === 'cancelled' ? 'text-red-600' :
                      'text-orange-500'
                    }`}>
                      {order.status}
                   </span>
                 </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
