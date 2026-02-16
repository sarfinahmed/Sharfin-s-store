
import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Gift, Percent, Flame } from 'lucide-react';

const Offers: React.FC = () => {
  const { products, config } = useStore();
  const offers = products.filter(p => p.type === 'offer');

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-gradient-to-r from-brand-600 to-purple-600 p-8 rounded-3xl shadow-xl shadow-brand-900/10 relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] pointer-events-none -mr-16 -mt-16"></div>
        <div className="relative z-10">
           <h1 className="text-4xl font-black text-white mb-2 flex items-center gap-3">
             <Gift size={36} className="text-yellow-300" />
             {config.offersPage?.title || 'Special Offers'}
           </h1>
           <p className="text-brand-100 max-w-xl font-medium text-lg">
             {config.offersPage?.subtitle || 'Exclusive bundles, limited-time discounts, and special event packages.'}
           </p>
        </div>
      </div>

      {offers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {offers.map(offer => (
            <Link key={offer.id} to={`/product/${offer.id}`} className="group liquid-card rounded-2xl overflow-hidden hover:border-brand-300 hover:shadow-xl hover:shadow-brand-500/10 transition-all duration-300 flex flex-col relative">
              <div className="absolute top-4 right-4 z-10 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                <Flame size={12} /> HOT DEAL
              </div>
              
              <div className="aspect-video relative overflow-hidden m-2 rounded-xl">
                <img src={offer.image} alt={offer.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                   <h3 className="font-bold text-slate-800 text-xl leading-tight mb-2">{offer.name}</h3>
                   <div className="flex flex-wrap gap-2 mb-4">
                     {offer.packages.slice(0, 2).map(pkg => (
                       <span key={pkg.id} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200 font-semibold">
                         {pkg.name}
                       </span>
                     ))}
                     {offer.packages.length > 2 && <span className="text-xs text-slate-400 font-semibold">+{offer.packages.length - 2} more</span>}
                   </div>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                   <div className="flex flex-col">
                     <span className="text-xs text-slate-500 uppercase tracking-wide font-bold">Starting from</span>
                     <span className="text-brand-600 font-black text-lg">৳ {Math.min(...offer.packages.map(p => p.price))}</span>
                   </div>
                   <span className="bg-brand-600 text-white px-4 py-2 rounded-lg font-bold text-sm group-hover:bg-brand-500 transition shadow-md shadow-brand-500/20">
                     View Offer
                   </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 liquid-card rounded-3xl border-dashed">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Percent size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-800">No active offers</h3>
          <p className="text-slate-500 mt-2">Check back later for new deals!</p>
        </div>
      )}
    </div>
  );
};

export default Offers;
