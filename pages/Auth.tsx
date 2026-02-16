
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { Gamepad2, AlertCircle } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const response = await login(email, password);
    setLoading(false);
    
    if (response.success) {
      if (email === 'admin@sharfin.com') {
        navigate('/admin');
      } else {
        navigate('/'); 
      }
    } else {
      setError(response.message || 'Invalid email or password');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-white rounded-2xl mx-auto flex items-center justify-center text-brand-600 shadow-xl shadow-brand-200 mb-4 border border-white">
          <Gamepad2 size={32} />
        </div>
        <h2 className="text-3xl font-black text-slate-800">Welcome Back</h2>
        <p className="text-slate-500 mt-2 font-medium">Login to manage your top-ups</p>
      </div>
      
      <div className="liquid-card p-8 rounded-3xl shadow-2xl shadow-brand-500/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 blur-[40px] rounded-full -mr-10 -mt-10 pointer-events-none"></div>
        
        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full bg-slate-50 text-slate-800 rounded-xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition shadow-inner"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Password</label>
            <input 
              type="password" 
              required
              className="w-full bg-slate-50 text-slate-800 rounded-xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition shadow-inner"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
            />
          </div>
          {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200 font-medium flex items-center gap-2"><AlertCircle size={16}/> {error}</div>}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-brand-600 text-white font-bold py-3.5 rounded-xl hover:bg-brand-500 transition shadow-lg shadow-brand-500/30 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login Now'}
          </button>
        </form>
      </div>
      <p className="text-center text-slate-500 mt-6 text-sm font-medium">
        Don't have an account? <span onClick={() => navigate('/register')} className="text-brand-600 font-bold cursor-pointer hover:underline">Register here</span>
      </p>
    </div>
  );
};

export const Register: React.FC = () => {
  const { register } = useStore();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    setError('');
    const response = await register(name, email, password);
    setLoading(false);
    
    if (response.success) {
      if (email === 'admin@sharfin.com') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } else {
      setError(response.message || 'Registration failed. Email may be in use.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-slate-800">Create Account</h2>
        <p className="text-slate-500 mt-2 font-medium">Join the premium gaming community</p>
      </div>

      <div className="liquid-card p-8 rounded-3xl shadow-2xl shadow-brand-500/10">
        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Full Name</label>
            <input 
              type="text" 
              required
              className="w-full bg-slate-50 text-slate-800 rounded-xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition shadow-inner"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full bg-slate-50 text-slate-800 rounded-xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition shadow-inner"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Password</label>
            <input 
              type="password" 
              required
              className="w-full bg-slate-50 text-slate-800 rounded-xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition shadow-inner"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
            />
          </div>
          {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200 font-medium flex items-center gap-2"><AlertCircle size={16}/> {error}</div>}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-brand-600 text-white font-bold py-3.5 rounded-xl hover:bg-brand-500 transition shadow-lg shadow-brand-500/30 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
      </div>
      <p className="text-center text-slate-500 mt-6 text-sm font-medium">
        Already a member? <span onClick={() => navigate('/login')} className="text-brand-600 font-bold cursor-pointer hover:underline">Login here</span>
      </p>
    </div>
  );
};
