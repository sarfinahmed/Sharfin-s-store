
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Home, User, Gift, Phone, ShieldCheck, Gamepad2 } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { config, user } = useStore();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path ? "text-brand-600 font-bold" : "text-slate-400";

  return (
    <div className="min-h-screen flex flex-col pb-24 md:pb-0 w-full relative overflow-x-hidden max-w-[100vw]">
      {/* Top Navigation - Desktop/Web */}
      <nav className="glass sticky top-0 z-50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center min-w-0 flex-1 md:flex-none">
              <Link to="/" className="flex-shrink-0 flex items-center gap-2 md:gap-3 group min-w-0">
                {config.appLogo ? (
                  <img src={config.appLogo} alt="Logo" className="w-10 h-10 object-contain" />
                ) : (
                  <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-tr from-brand-600 to-brand-400 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-brand-500/30 group-hover:scale-105 transition-all duration-300 flex-shrink-0">
                    <Gamepad2 size={22} className="md:w-6 md:h-6" />
                  </div>
                )}
                <div className="truncate flex-1">
                  <span className="font-black text-lg md:text-xl text-slate-800 tracking-tight block leading-none truncate">{config.appName}</span>
                  <span className="text-[9px] md:text-[10px] text-brand-500 font-bold tracking-widest uppercase">Premium Store</span>
                </div>
              </Link>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-sm font-semibold text-slate-500 hover:text-brand-600 transition">Home</Link>
              <Link to="/offers" className="text-sm font-semibold text-slate-500 hover:text-brand-600 transition">Offers</Link>
              <Link to="/contact" className="text-sm font-semibold text-slate-500 hover:text-brand-600 transition">Support</Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className="text-sm font-bold text-brand-600 bg-brand-50 px-3 py-1 rounded-lg border border-brand-200 hover:bg-brand-100 transition flex items-center gap-2">
                  <ShieldCheck size={16} /> Admin Panel
                </Link>
              )}
            </div>

            <div className="flex items-center gap-3 md:gap-4 flex-shrink-0 ml-2">
              {user ? (
                 <div className="flex items-center gap-2 md:gap-3 pl-2 md:pl-4 border-l border-slate-200">
                   <div className="flex flex-col items-end">
                      <span className="hidden md:inline text-sm font-bold text-slate-700">{user.name}</span>
                      <span className="text-xs md:text-sm text-brand-600 font-mono font-black bg-brand-50 px-2 py-0.5 rounded-md md:bg-transparent md:p-0 border border-brand-100 md:border-none">
                        ৳ {user.balance.toFixed(2)}
                      </span>
                   </div>
                   <Link to="/profile" className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200 transition-all shadow-md">
                      <User size={18} />
                   </Link>
                 </div>
              ) : (
                <div className="flex items-center gap-2 md:gap-3">
                  <Link to="/login" className="text-slate-500 hover:text-brand-600 font-bold px-2 py-2 text-sm transition">Login</Link>
                  <Link to="/register" className="bg-brand-600 text-white font-bold px-4 py-2 text-sm rounded-xl hover:bg-brand-500 transition shadow-lg shadow-brand-500/30 hover:-translate-y-0.5 whitespace-nowrap">Register</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative overflow-hidden">
        {children}
      </main>

      {/* Bottom Navigation - Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-slate-200/60 px-6 py-4 flex justify-between items-center z-50 w-full">
        <Link to="/" className={`flex flex-col items-center gap-1.5 transition ${isActive('/')}`}>
          <Home size={20} className={location.pathname === '/' ? 'drop-shadow-md text-brand-600' : ''} />
          <span className="text-[10px] font-medium tracking-wide">Home</span>
        </Link>
        <Link to="/offers" className={`flex flex-col items-center gap-1.5 transition ${isActive('/offers')}`}>
          <Gift size={20} className={location.pathname === '/offers' ? 'drop-shadow-md text-brand-600' : ''} />
          <span className="text-[10px] font-medium tracking-wide">Offers</span>
        </Link>
        
        {user?.role === 'admin' ? (
           <Link to="/admin" className={`flex flex-col items-center gap-1 ${isActive('/admin')}`}>
             <div className="w-14 h-14 -mt-10 bg-gradient-to-br from-brand-500 to-brand-700 rounded-full flex items-center justify-center text-white shadow-xl shadow-brand-500/40 border-4 border-white relative z-10">
               <ShieldCheck size={26} />
             </div>
             <span className="text-[10px] font-medium tracking-wide mt-1">Admin</span>
           </Link>
        ) : (
           <Link to="/contact" className={`flex flex-col items-center gap-1 ${isActive('/contact')}`}>
             <div className="w-14 h-14 -mt-10 bg-gradient-to-br from-brand-500 to-brand-700 rounded-full flex items-center justify-center text-white shadow-xl shadow-brand-500/40 border-4 border-white relative z-10">
                <Phone size={26} />
             </div>
             <span className="text-[10px] font-medium tracking-wide mt-1">Support</span>
           </Link>
        )}

        <Link to="/profile" className={`flex flex-col items-center gap-1.5 transition ${isActive('/profile')}`}>
          <User size={20} className={location.pathname === '/profile' ? 'drop-shadow-md text-brand-600' : ''} />
          <span className="text-[10px] font-medium tracking-wide">Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default Layout;
