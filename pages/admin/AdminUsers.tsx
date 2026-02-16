
import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { User, UserRole } from '../../types';
import { Search, Edit2, Trash2, Check, X, Shield, Wallet } from 'lucide-react';

const AdminUsers: React.FC = () => {
  const { allUsers, updateUser, deleteUser } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<{balance: string, role: UserRole}>({ balance: '', role: 'user' });
  const [loading, setLoading] = useState(false);

  const filteredUsers = allUsers.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startEdit = (user: User) => {
    setEditingUser(user);
    setEditForm({ balance: user.balance.toString(), role: user.role });
  };

  const handleSave = async () => {
    if (!editingUser) return;
    setLoading(true);
    await updateUser(editingUser.id, {
        balance: Number(editForm.balance),
        role: editForm.role
    });
    setLoading(false);
    setEditingUser(null);
  };

  const handleDelete = async (id: string) => {
      if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
          await deleteUser(id);
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-white">User Management</h1>
        <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
             <input 
               type="text" 
               placeholder="Search Name or Email..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="bg-slate-900 text-white rounded-lg border border-slate-700 pl-10 pr-4 py-2 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition w-64"
             />
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl shadow-lg border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-dark-950 text-slate-400 text-xs uppercase tracking-wider">
                <th className="p-5 font-bold">User</th>
                <th className="p-5 font-bold">Email</th>
                <th className="p-5 font-bold">Role</th>
                <th className="p-5 font-bold">Balance</th>
                <th className="p-5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-slate-800/50 transition">
                  <td className="p-5 font-bold text-white flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-xs text-white uppercase">
                        {user.name.charAt(0)}
                    </div>
                    {user.name}
                  </td>
                  <td className="p-5 text-slate-400">{user.email}</td>
                  <td className="p-5">
                    {user.role === 'admin' ? (
                        <span className="text-xs bg-brand-500/20 text-brand-300 px-2 py-1 rounded border border-brand-500/30 flex items-center w-fit gap-1">
                            <Shield size={12} /> Admin
                        </span>
                    ) : (
                        <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">User</span>
                    )}
                  </td>
                  <td className="p-5 font-mono text-emerald-400 font-bold">৳ {user.balance.toFixed(2)}</td>
                  <td className="p-5 text-right flex justify-end gap-2">
                    <button onClick={() => startEdit(user)} className="p-2 text-brand-400 hover:bg-brand-500/10 rounded-lg transition" title="Edit">
                        <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(user.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition" title="Delete">
                        <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && <div className="p-10 text-center text-slate-500">No users found.</div>}
        </div>
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-md animate-fade-in">
                <h3 className="text-xl font-bold text-white mb-4">Edit User: {editingUser.name}</h3>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Balance (৳)</label>
                        <div className="relative">
                            <Wallet size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input 
                                type="number" 
                                value={editForm.balance}
                                onChange={e => setEditForm({...editForm, balance: e.target.value})}
                                className="w-full bg-dark-950 text-white rounded-lg border border-slate-700 pl-10 pr-4 py-2 focus:border-brand-500 outline-none"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Role</label>
                        <select 
                             value={editForm.role}
                             onChange={e => setEditForm({...editForm, role: e.target.value as UserRole})}
                             className="w-full bg-dark-950 text-white rounded-lg border border-slate-700 px-4 py-2 focus:border-brand-500 outline-none"
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                </div>

                <div className="flex gap-3 mt-6">
                    <button onClick={() => setEditingUser(null)} disabled={loading} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg font-bold">Cancel</button>
                    <button onClick={handleSave} disabled={loading} className="flex-1 bg-brand-600 hover:bg-brand-500 text-white py-2 rounded-lg font-bold">
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
