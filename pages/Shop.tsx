import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Search, Filter, Gamepad2, Zap, Tag } from 'lucide-react';

const Shop: React.FC = () => {
  const { products, config } = useStore();
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(p => {
    const matchesFilter = filter === 'all' || p.type === filter;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-center liquid-card p-6 rounded-3xl">
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-black text-slate-800">Store Catalog</h1>
          <p className="text-slate-500 mt-1">Browse all our premium services</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto items-center">
           {/* Search */}
           <div className="relative group w-full md:w-auto">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition" size={20} />
             <input 
               type="text" 
               placeholder="Search..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full md:w-64 bg-slate-50 text-slate-800 rounded-xl border border-slate-200 pl-10 pr-4 py-3 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition shadow-inner"
             />
           </div>

           {/* Filter Toggles - Scrollable on mobile */}
           <div className="w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
             <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200 shadow-inner whitespace-nowrap min-w-max mx-auto md:mx-0">
               <button 
                 onClick={() => setFilter('all')}
                 className={`px-4 py-2 rounded-lg text-sm font-bold transition ${filter === 'all' ? 'bg-white text-brand-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:text-slate-700'}`}
               >
                 All
               </button>
               {config.productTypes.map(t => (
                  <button 
                    key={t}
                    onClick={() => setFilter(t)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2 capitalize ${filter === t ? 'bg-white text-brand-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    {t === 'game' ? <Gamepad2 size={16} /> : t === 'subscription' ? <Zap size={16} /> : <Tag size={16} />}
                    {t}
                  </button>
               ))}
             </div>
           </div>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map(product => (
            <Link key={product.id} to={`/product/${product.id}`} className="group liquid-card rounded-2xl overflow-hidden hover:border-brand-300 hover:shadow-xl hover:shadow-brand-500/10 transition-all duration-300 flex flex-col">
              <div className="aspect-square relative overflow-hidden m-2 rounded-xl">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80"></div>
                
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg shadow-sm">
                  {product.type === 'game' ? <Gamepad2 size={14} className="text-brand-600"/> : <Tag size={14} className="text-slate-500"/>}
                </div>
              </div>
              
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                   <h3 className="font-bold text-slate-800 text-lg leading-tight mb-1">{product.name}</h3>
                   <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{product.type}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
                   <span className="text-brand-600 font-black text-sm">From ৳ {Math.min(...product.packages.map(p => p.price))}</span>
                   <span className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-lg transition font-bold">Buy</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 liquid-card rounded-3xl border-dashed">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Filter size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-800">No products found</h3>
          <p className="text-slate-500 mt-2">Try adjusting your search or filters</p>
          <button onClick={() => {setSearchTerm(''); setFilter('all');}} className="mt-6 text-brand-600 font-bold hover:underline">
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Shop;