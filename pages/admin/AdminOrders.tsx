
import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { CheckCircle, XCircle, Search, Copy, Check } from 'lucide-react';

const AdminOrders: React.FC = () => {
  const { orders, updateOrderStatus } = useStore();
  const [filter, setFilter] = useState('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const filteredOrders = orders.filter(o => filter === 'all' ? true : o.status === filter);

  const handleCopy = (text: string, id: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleStatusUpdate = async (id: string, status: 'completed' | 'cancelled') => {
      setProcessingId(id);
      await updateOrderStatus(id, status);
      setProcessingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-black text-white">Order Management</h1>
        <div className="flex gap-2 p-1 bg-slate-900 rounded-lg border border-white/5">
          {['all', 'pending', 'completed', 'cancelled'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase transition ${filter === f ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl shadow-lg border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-dark-950 text-slate-400 text-xs uppercase tracking-wider">
                <th className="p-5 font-bold">Order ID</th>
                <th className="p-5 font-bold">User</th>
                <th className="p-5 font-bold">Items</th>
                <th className="p-5 font-bold">Payment</th>
                <th className="p-5 font-bold">Details (Inputs)</th>
                <th className="p-5 font-bold">Price</th>
                <th className="p-5 font-bold">Status</th>
                <th className="p-5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-slate-800/50 transition">
                  <td className="p-5 font-mono text-xs text-slate-500">#{order.id}</td>
                  <td className="p-5">
                    <div className="font-bold text-white">{order.userEmail}</div>
                    <div className="text-xs text-brand-400 uppercase tracking-wider font-bold mt-1">{order.type}</div>
                  </td>
                  <td className="p-5 text-slate-300 min-w-[200px]">
                    <span className="text-white font-medium block mb-1">{order.productName}</span> 
                    {order.items && order.items.length > 0 ? (
                      <div className="space-y-1">
                        {order.items.map((item, i) => (
                           <div key={i} className="text-xs text-slate-400 flex gap-2">
                             <span className="text-brand-400 font-bold">{item.quantity}x</span> 
                             {item.packageName}
                           </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-500 block text-xs">{order.packageName}</span>
                    )}
                  </td>
                  <td className="p-5">
                     {order.paymentMethod ? (
                       <div>
                         <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">{order.paymentMethod}</span>
                         {order.paymentMethod !== 'wallet' && (
                           <div className="space-y-1">
                             {order.trxId && (
                               <div className="flex items-center gap-1 group">
                                  <div className="text-xs text-white bg-white/10 px-2 py-0.5 rounded inline-block font-mono">
                                    {order.trxId}
                                  </div>
                                  <button 
                                      onClick={() => handleCopy(order.trxId!, `${order.id}-trx`)}
                                      className="text-slate-500 hover:text-white transition opacity-0 group-hover:opacity-100"
                                      title="Copy TrxID"
                                  >
                                      {copiedId === `${order.id}-trx` ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                                  </button>
                               </div>
                             )}
                             {order.senderNumber && (
                               <div className="flex items-center gap-1 group text-xs text-slate-500">
                                 <span>From: {order.senderNumber}</span>
                                 <button 
                                      onClick={() => handleCopy(order.senderNumber!, `${order.id}-sender`)}
                                      className="hover:text-white transition opacity-0 group-hover:opacity-100"
                                      title="Copy Number"
                                  >
                                      {copiedId === `${order.id}-sender` ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                                  </button>
                               </div>
                             )}
                           </div>
                         )}
                       </div>
                     ) : (
                       <span className="text-xs text-slate-600">Wallet</span>
                     )}
                  </td>
                  <td className="p-5">
                    {Object.entries(order.details).map(([k,v]) => {
                      if (k === 'method' || k === 'trxId') return null; // Skip redundant deposit info if present
                      return (
                        <div key={k} className="text-xs text-slate-400 mb-1.5 flex items-center gap-2 group">
                            <span className="text-slate-500 uppercase font-bold text-[10px] w-14 truncate">{k}:</span> 
                            <span className="text-slate-300 font-mono bg-slate-800/50 px-2 py-1 rounded border border-white/5 select-all">{v}</span>
                            <button 
                                onClick={() => handleCopy(v, `${order.id}-${k}`)}
                                className="p-1 hover:bg-white/10 rounded transition text-slate-500 hover:text-white"
                                title="Copy"
                            >
                                {copiedId === `${order.id}-${k}` ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                            </button>
                        </div>
                      );
                    })}
                  </td>
                  <td className="p-5 font-bold text-white">৳ {order.price}</td>
                  <td className="p-5">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                      order.status === 'completed' ? 'bg-green-500/10 text-green-400' :
                      order.status === 'cancelled' ? 'bg-red-500/10 text-red-400' :
                      'bg-orange-500/10 text-orange-400'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    {order.status === 'pending' && (
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleStatusUpdate(order.id, 'completed')}
                          disabled={processingId === order.id}
                          className="text-green-500 hover:bg-green-500/20 p-2 rounded-lg transition disabled:opacity-50" 
                          title="Approve"
                        >
                          <CheckCircle size={20} />
                        </button>
                        <button 
                          onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                          disabled={processingId === order.id}
                          className="text-red-500 hover:bg-red-500/20 p-2 rounded-lg transition disabled:opacity-50" 
                          title="Reject"
                        >
                          <XCircle size={20} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredOrders.length === 0 && (
            <div className="p-10 text-center text-slate-600">No orders found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
