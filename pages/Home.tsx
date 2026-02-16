import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Bell, Gamepad2, ChevronRight, Zap, Flame, Gift, Trophy, Star } from 'lucide-react';

const IconMap = {
  game: Gamepad2,
  zap: Zap,
  star: Star,
  flame: Flame,
  gift: Gift,
  trophy: Trophy
};

const Home: React.FC = () => {
  const { config, products } = useStore();

  return (
    <div className="space-y-10">
      {/* Notice Banner */}
      <div className="liquid-card border-l-4 border-brand-500 text-slate-700 px-6 py-4 rounded-2xl flex items-start gap-4 animate-fade-in relative overflow-hidden group">
        <div className="absolute inset-0 bg-brand-50/50 group-hover:bg-brand-50 transition-colors"></div>
        <Bell className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5 animate-pulse relative z-10" />
        <p className="text-sm font-semibold leading-relaxed relative z-10">{config.notice}</p>
      </div>

      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-brand-900/10 aspect-[16/8] md:aspect-[3/1] group border border-white">
        <div className="absolute inset-0 bg-slate-200 animate-pulse"></div>
        <img 
          src={config.banners[0]} 
          alt="Promo" 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end p-6 md:p-10">
          <div className="max-w-2xl">
            <span className="bg-white/90 backdrop-blur-md text-brand-700 text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block shadow-lg">
              FEATURED EVENT
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-2 drop-shadow-lg">Level Up Instantly</h2>
            <p className="text-white/90 text-sm md:text-base mb-4 font-medium drop-shadow-md">Get the best deals on diamonds, UC, and subscriptions.</p>
            <Link to="/offers" className="inline-flex items-center gap-2 bg-brand-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-brand-500 transition shadow-lg shadow-brand-600/30">
              Today's Offer <Flame size={18} className="text-orange-300" />
            </Link>
          </div>
        </div>
      </div>

      {/* Dynamic Sections */}
      {config.homeSections.map((section) => {
        // Filter products for this section
        const sectionProducts = products.filter(p => {
          const typeMatch = p.type === section.productType;
          const categoryMatch = section.categoryFilter ? p.category === section.categoryFilter : true;
          return typeMatch && categoryMatch;
        });

        if (sectionProducts.length === 0) return null;

        const Icon = IconMap[section.icon] || Gamepad2;
        const isGrid = section.productType === 'game' || section.productType === 'offer';

        return (
          <div key={section.id} className="relative animate-fade-in">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h3 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                  <Icon className="text-brand-600" size={28} />
                  {section.title}
                </h3>
                <p className="text-slate-500 text-sm mt-1">{section.subtitle}</p>
              </div>
              <Link to="/products" className="text-xs font-bold text-brand-600 hover:text-brand-500 flex items-center uppercase tracking-wider transition bg-brand-50 px-3 py-1 rounded-full">
                View All <ChevronRight size={16} />
              </Link>
            </div>
            
            <div className={isGrid ? "grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6" : "grid grid-cols-1 md:grid-cols-3 gap-4"}>
              {sectionProducts.map(product => (
                 isGrid ? (
                    <Link key={product.id} to={`/product/${product.id}`} className="group liquid-card rounded-2xl p-3 hover:border-brand-300 hover:shadow-xl hover:shadow-brand-500/10 transition-all duration-300 relative flex flex-col">
                      <div className="aspect-[3/3.5] md:aspect-square relative overflow-hidden rounded-xl shadow-inner">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60"></div>
                        <div className="absolute bottom-3 left-3 right-3">
                          <h4 className="font-bold text-white text-lg leading-tight truncate drop-shadow-md">{product.name}</h4>
                        </div>
                      </div>
                      <div className="mt-3 flex justify-between items-center px-1">
                         <p className="text-[10px] font-bold text-brand-600 uppercase tracking-widest bg-brand-50 px-2 py-1 rounded-md">
                           {product.packages.length > 0 ? `From ৳${Math.min(...product.packages.map(pkg => pkg.price))}` : 'View'}
                         </p>
                         <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-brand-600 group-hover:text-white transition-colors shadow-sm">
                            <ChevronRight size={16} />
                         </div>
                      </div>
                    </Link>
                 ) : (
                    <Link key={product.id} to={`/product/${product.id}`} className="flex items-center gap-4 liquid-card p-4 rounded-2xl hover:border-brand-300 hover:shadow-lg transition-all group">
                      <img src={product.image} alt={product.name} className="w-16 h-16 rounded-xl object-cover shadow-md group-hover:scale-105 transition-transform" />
                      <div>
                        <h4 className="font-bold text-slate-800 text-lg">{product.name}</h4>
                        <p className="text-xs text-brand-600 font-bold tracking-wide uppercase mt-1">Best Price</p>
                      </div>
                      <div className="ml-auto w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-brand-600 group-hover:text-white transition-colors shadow-sm">
                        <ChevronRight size={20} />
                      </div>
                   </Link>
                 )
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Home;