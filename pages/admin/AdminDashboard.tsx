
import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Users, ShoppingCart, DollarSign, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const { orders, allUsers } = useStore();

  const totalRevenue = orders
    .filter(o => o.type === 'purchase' && o.status === 'completed')
    .reduce((sum, o) => sum + o.price, 0);

  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  const stats = [
    { label: 'Total Users', value: allUsers.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Sales', value: `৳ ${totalRevenue}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Pending Orders', value: pendingOrders, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Total Orders', value: orders.length, icon: ShoppingCart, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-black text-slate-800">Admin Dashboard</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="liquid-card p-6 rounded-2xl shadow-sm hover:shadow-md transition">
            <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
              <stat.icon size={24} />
            </div>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">{stat.label}</p>
            <h3 className="text-3xl font-black text-slate-800 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="liquid-card p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-slate-800">Recent Pending Orders</h3>
            <Link to="/admin/orders" className="text-sm text-brand-600 hover:text-brand-500 font-bold">View All</Link>
          </div>
          <div className="space-y-3">
             {orders.filter(o => o.status === 'pending').slice(0, 5).map(order => (
               <div key={order.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <p className="font-bold text-sm text-slate-800">{order.productName}</p>
                    <p className="text-xs text-slate-500">{order.userEmail}</p>
                  </div>
                  <span className="text-brand-600 font-bold text-sm">৳ {order.price}</span>
               </div>
             ))}
             {orders.filter(o => o.status === 'pending').length === 0 && <p className="text-slate-400 text-sm italic text-center py-4">No pending orders.</p>}
          </div>
        </div>
        
        <div className="liquid-card p-6 rounded-2xl">
          <h3 className="font-bold text-lg text-slate-800 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/admin/users" className="p-6 border border-slate-200 rounded-xl hover:bg-slate-50 transition text-center group bg-white shadow-sm">
              <span className="font-bold text-slate-600 group-hover:text-brand-600 block">Manage Users</span>
            </Link>
            <Link to="/admin/products" className="p-6 border border-slate-200 rounded-xl hover:bg-slate-50 transition text-center group bg-white shadow-sm">
              <span className="font-bold text-slate-600 group-hover:text-brand-600 block">Add Products</span>
            </Link>
            <Link to="/admin/settings" className="p-6 border border-slate-200 rounded-xl hover:bg-slate-50 transition text-center group bg-white shadow-sm col-span-2">
               <span className="font-bold text-slate-600 group-hover:text-brand-600 block">Website Settings</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
