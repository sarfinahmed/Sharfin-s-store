
import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product, ProductType, HomeSection } from '../../types';
import { Plus, Trash2, Package as PackageIcon, Settings, X, Check, ListPlus, Edit3, Save, FileText, MessageSquarePlus } from 'lucide-react';

const AdminProducts: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, config, updateConfig } = useStore();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Edit Mode State
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Refs
  const customInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    type: 'game',
    category: '',
    image: 'https://picsum.photos/400/400?random=' + Math.floor(Math.random() * 100),
    inputs: [{ name: 'uid', label: 'User ID', placeholder: 'Enter ID' }],
    packages: [],
    rules: ''
  });
  
  // Package Form State
  const [pkgName, setPkgName] = useState('');
  const [pkgPrice, setPkgPrice] = useState('');

  // Input Field Form State
  const [inputLabel, setInputLabel] = useState('');
  const [inputPlaceholder, setInputPlaceholder] = useState('');

  // Custom Type State
  const [isAddingType, setIsAddingType] = useState(false);
  const [customType, setCustomType] = useState('');

  const filteredProducts = products.filter(p => activeTab === 'all' || p.type === activeTab);

  // Common input presets
  const commonInputs = [
    { label: 'Player ID', name: 'uid', placeholder: 'Enter Player ID' },
    { label: 'Email', name: 'email', placeholder: 'Enter Email Address' },
    { label: 'Password', name: 'password', placeholder: 'Enter Password' },
    { label: 'WhatsApp', name: 'whatsapp', placeholder: 'Enter WhatsApp Number' },
    { label: 'Facebook', name: 'facebook', placeholder: 'Enter Profile Link' },
    { label: 'Instagram', name: 'instagram', placeholder: 'Enter Instagram Username' },
    { label: 'Zone ID', name: 'zone_id', placeholder: 'Enter Zone ID' },
    { label: 'Account Name', name: 'acc_name', placeholder: 'Enter Account Name' }
  ];

  // Quick Rules Presets
  const quickRules = [
    "সঠিক Player ID (UID) দিন।",
    "ডেলিভারি টাইম: ৫-১০ মিনিট।",
    "ভুল আইডিতে টপ-আপ হলে কর্তৃপক্ষ দায়ী নয়।",
    "সার্ভার জ্যাম থাকলে ৩০ মিনিট পর্যন্ত সময় লাগতে পারে।",
    "অর্ডার কনফার্ম করার পর অপেক্ষা করুন।",
    "আইডি কোড ভুল দিলে অর্ডার ক্যানসেল হবে।"
  ];

  // Auto-set default inputs based on type only when adding new
  useEffect(() => {
    if (editingId) return; // Don't auto-reset if editing
    
    if (!newProduct.inputs || newProduct.inputs.length === 0) {
        if (newProduct.type === 'game') {
            setNewProduct(prev => ({ ...prev, inputs: [{ name: 'uid', label: 'Player ID', placeholder: 'Enter Player ID' }] }));
        } else if (newProduct.type === 'subscription') {
            setNewProduct(prev => ({ ...prev, inputs: [{ name: 'email', label: 'Email', placeholder: 'Enter Email' }] }));
        }
    }
  }, [newProduct.type, editingId]);

  const handleAddPackage = () => {
    if (!pkgName || !pkgPrice) return;
    const newPkg = {
      id: Math.random().toString(36).substr(2, 9),
      name: pkgName,
      price: Number(pkgPrice)
    };
    setNewProduct(prev => ({ ...prev, packages: [...(prev.packages || []), newPkg] }));
    setPkgName('');
    setPkgPrice('');
  };

  const addCommonInput = (template: typeof commonInputs[0]) => {
      const exists = newProduct.inputs?.some(i => i.name === template.name);
      if (exists) return;
      
      setNewProduct(prev => ({ 
          ...prev, 
          inputs: [...(prev.inputs || []), template] 
      }));
  };

  const handleAddInput = () => {
      if (!inputLabel) return;
      const newInput = {
          name: inputLabel.toLowerCase().replace(/\s/g, '_'),
          label: inputLabel,
          placeholder: inputPlaceholder || `Enter ${inputLabel}`
      };
      setNewProduct(prev => ({ ...prev, inputs: [...(prev.inputs || []), newInput] }));
      setInputLabel('');
      setInputPlaceholder('');
  };

  const removeInput = (idx: number) => {
      setNewProduct(prev => ({ 
          ...prev, 
          inputs: prev.inputs?.filter((_, i) => i !== idx) 
      }));
  };

  const removePackage = (idx: number) => {
      setNewProduct(prev => ({ 
          ...prev, 
          packages: prev.packages?.filter((_, i) => i !== idx) 
      }));
  };

  const handleAddCustomType = async () => {
    if (!customType.trim()) return;
    const cleanType = customType.toLowerCase().trim();
    
    // Update config to include new type if not exists
    if (!config.productTypes.includes(cleanType)) {
        // Automatically create a new Home Section for this type
        const newSection: HomeSection = {
            id: `sec_${Math.random().toString(36).substr(2, 9)}`,
            title: customType.charAt(0).toUpperCase() + customType.slice(1), 
            subtitle: 'New arrivals',
            productType: cleanType,
            icon: 'star' 
        };

        await updateConfig({
            productTypes: [...config.productTypes, cleanType],
            homeSections: [...config.homeSections, newSection]
        });
    }
    
    // Set new product type
    setNewProduct({ ...newProduct, type: cleanType });
    setIsAddingType(false);
    setCustomType('');
  };

  const resetForm = () => {
    setNewProduct({
      name: '',
      type: config.productTypes[0] || 'game',
      category: '',
      image: 'https://picsum.photos/400/400?random=' + Math.floor(Math.random() * 100),
      inputs: [{ name: 'uid', label: 'User ID', placeholder: 'Enter ID' }],
      packages: [],
      rules: ''
    });
    setEditingId(null);
    setShowForm(false);
    setLoading(false);
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setNewProduct({
        name: product.name,
        type: product.type,
        category: product.category,
        image: product.image,
        inputs: [...product.inputs], // Copy array to avoid reference issues
        packages: [...product.packages], // Copy array to avoid reference issues
        rules: product.rules || ''
    });
    setShowForm(true);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.packages?.length) {
      alert('Please fill name and add at least one package');
      return;
    }
    setLoading(true);

    if (editingId) {
        // Update existing product
        const updatedProduct: Product = {
            id: editingId,
            name: newProduct.name!,
            type: newProduct.type as ProductType,
            category: newProduct.category,
            image: newProduct.image!,
            inputs: newProduct.inputs || [],
            packages: newProduct.packages!,
            rules: newProduct.rules
        };
        await updateProduct(editingId, updatedProduct);
    } else {
        // Add new product
        const productToAdd: Product = {
            id: Math.random().toString(36).substr(2, 9),
            name: newProduct.name!,
            type: newProduct.type as ProductType,
            category: newProduct.category,
            image: newProduct.image!,
            inputs: newProduct.inputs || [],
            packages: newProduct.packages!,
            rules: newProduct.rules
        };
        await addProduct(productToAdd);
    }

    resetForm();
  };

  const handleDelete = async (id: string) => {
      if(window.confirm("Delete this product?")) {
          await deleteProduct(id);
      }
  };

  const focusCustomInput = () => {
    if (customInputRef.current) {
        customInputRef.current.focus();
        customInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const addQuickRule = (rule: string) => {
    setNewProduct(prev => ({
      ...prev,
      rules: prev.rules ? `${prev.rules}\n${rule}` : rule
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-white">Product Management</h1>
        <button 
          onClick={() => {
              if(showForm) resetForm();
              else setShowForm(true);
          }} 
          className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition"
        >
          {showForm ? 'Cancel' : <><Plus size={20} /> Add New</>}
        </button>
      </div>

      {showForm && (
        <div className="bg-slate-900 p-6 rounded-2xl border border-white/10 animate-fade-in">
          <h2 className="text-xl font-bold text-white mb-4">
              {editingId ? 'Edit Product' : 'Add New Item'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Name</label>
                <input 
                  type="text" 
                  value={newProduct.name}
                  onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                  className="w-full bg-dark-950 text-white rounded-lg border border-slate-700 px-3 py-2"
                  placeholder="e.g. Free Fire"
                />
              </div>
              
              {/* Dynamic Type Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1 flex justify-between items-center">
                    Type
                    {!isAddingType && (
                        <button 
                            type="button"
                            onClick={() => setIsAddingType(true)}
                            className="text-[10px] text-brand-400 hover:text-brand-300 flex items-center gap-1 transition"
                        >
                            <Plus size={12} /> Add Custom
                        </button>
                    )}
                </label>
                
                {isAddingType ? (
                    <div className="flex gap-2 animate-fade-in">
                        <input 
                            type="text"
                            value={customType}
                            onChange={(e) => setCustomType(e.target.value)}
                            placeholder="e.g. software"
                            className="flex-1 bg-dark-950 text-white rounded-lg border border-slate-700 px-3 py-2 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
                            autoFocus
                        />
                        <button 
                            type="button" 
                            onClick={handleAddCustomType}
                            className="bg-brand-600 hover:bg-brand-500 text-white px-3 py-2 rounded-lg transition"
                        >
                            <Check size={16} />
                        </button>
                        <button 
                            type="button" 
                            onClick={() => setIsAddingType(false)}
                            className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-lg transition"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ) : (
                    <select 
                      value={newProduct.type}
                      onChange={e => setNewProduct({...newProduct, type: e.target.value as ProductType})}
                      className="w-full bg-dark-950 text-white rounded-lg border border-slate-700 px-3 py-2 capitalize"
                    >
                      {config.productTypes.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Category (Optional)</label>
                <input 
                  type="text" 
                  value={newProduct.category}
                  onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                  className="w-full bg-dark-950 text-white rounded-lg border border-slate-700 px-3 py-2"
                  placeholder="e.g. Battle Royale, FPS, Streaming"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Image URL</label>
                <input 
                  type="text" 
                  value={newProduct.image}
                  onChange={e => setNewProduct({...newProduct, image: e.target.value})}
                  className="w-full bg-dark-950 text-white rounded-lg border border-slate-700 px-3 py-2"
                />
              </div>
            </div>

            {/* Rules Section */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-1">
                  <FileText size={14} /> Rules & Conditions (Bangla)
              </label>
              
              {/* Quick Rule Buttons */}
              <div className="flex flex-wrap gap-2 mb-2">
                {quickRules.map((rule, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => addQuickRule(rule)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] px-2 py-1 rounded border border-slate-700 transition flex items-center gap-1"
                  >
                    <MessageSquarePlus size={10} /> {rule}
                  </button>
                ))}
              </div>

              <textarea
                value={newProduct.rules || ''}
                onChange={e => setNewProduct({...newProduct, rules: e.target.value})}
                className="w-full bg-dark-950 text-white rounded-lg border border-slate-700 px-3 py-2 h-24 text-sm"
                placeholder="Enter specific rules for this product. Click the buttons above to add quick rules."
              />
            </div>

            {/* Input Fields Manager */}
            <div className="border-t border-white/5 pt-4">
                <h3 className="text-sm font-bold text-slate-300 mb-2 flex items-center gap-2"><Settings size={16} /> User Input Fields</h3>
                <p className="text-xs text-slate-500 mb-3">What information do you need from the user?</p>
                
                {/* Quick Add Buttons */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {commonInputs.map(input => (
                        <button 
                            key={input.name}
                            type="button"
                            onClick={() => addCommonInput(input)}
                            disabled={newProduct.inputs?.some(i => i.name === input.name)}
                            className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-xs text-slate-300 border border-slate-700 px-3 py-1.5 rounded-lg transition flex items-center gap-1"
                        >
                            <Plus size={12} /> {input.label}
                        </button>
                    ))}
                    <button 
                        type="button"
                        onClick={focusCustomInput}
                        className="bg-brand-900/40 hover:bg-brand-900/60 text-brand-300 border border-brand-500/30 px-3 py-1.5 rounded-lg transition flex items-center gap-1 text-xs font-bold"
                    >
                        <Edit3 size={12} /> Custom Option
                    </button>
                </div>

                <div className="flex flex-col gap-2 mb-3">
                   {newProduct.inputs?.map((input, idx) => (
                       <div key={idx} className="flex items-center justify-between bg-slate-800 px-3 py-2 rounded-lg border border-slate-700">
                           <div className="text-sm text-slate-300">
                               <span className="font-bold text-white">{input.label}</span> <span className="text-slate-500 text-xs">({input.placeholder})</span>
                           </div>
                           <button type="button" onClick={() => removeInput(idx)} className="text-red-400 hover:text-red-300">
                               <X size={16} />
                           </button>
                       </div>
                   ))}
                   {newProduct.inputs?.length === 0 && (
                       <p className="text-xs text-red-400 italic">No input fields added. User won't be asked for any details.</p>
                   )}
                </div>

                <div className="flex gap-2 bg-slate-800/50 p-3 rounded-xl border border-white/5">
                    <input 
                        ref={customInputRef}
                        type="text" 
                        placeholder="Custom Field Name (e.g. Region)"
                        value={inputLabel}
                        onChange={e => setInputLabel(e.target.value)}
                        className="flex-1 bg-dark-950 text-white rounded-lg border border-slate-700 px-3 py-2 text-sm"
                    />
                    <input 
                        type="text" 
                        placeholder="Placeholder (e.g. Enter Region)"
                        value={inputPlaceholder}
                        onChange={e => setInputPlaceholder(e.target.value)}
                        className="flex-1 bg-dark-950 text-white rounded-lg border border-slate-700 px-3 py-2 text-sm"
                    />
                    <button type="button" onClick={handleAddInput} className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap flex items-center gap-1">
                        <ListPlus size={16} /> Add Custom
                    </button>
                </div>
            </div>

            {/* Packages Manager */}
            <div className="border-t border-white/5 pt-4">
               <h3 className="text-sm font-bold text-slate-300 mb-2 flex items-center gap-2"><PackageIcon size={16} /> Packages</h3>
               <div className="flex flex-wrap gap-2 mb-3">
                 {newProduct.packages?.map((p, idx) => (
                   <span key={idx} className="bg-brand-900/50 text-brand-100 text-xs px-3 py-1.5 rounded-lg border border-brand-500/30 flex items-center gap-2">
                     <span>{p.name} - ৳{p.price}</span>
                     <button type="button" onClick={() => removePackage(idx)} className="text-red-300 hover:text-white"><X size={12} /></button>
                   </span>
                 ))}
               </div>

               <div className="flex gap-2">
                 <input 
                   type="text" 
                   placeholder="Package Name (e.g. 100 Diamonds)"
                   value={pkgName}
                   onChange={e => setPkgName(e.target.value)}
                   className="flex-1 bg-dark-950 text-white rounded-lg border border-slate-700 px-3 py-2 text-sm"
                 />
                 <input 
                   type="number" 
                   placeholder="Price"
                   value={pkgPrice}
                   onChange={e => setPkgPrice(e.target.value)}
                   className="w-24 bg-dark-950 text-white rounded-lg border border-slate-700 px-3 py-2 text-sm"
                 />
                 <button type="button" onClick={handleAddPackage} className="bg-green-600 text-white px-3 py-2 rounded-lg font-bold text-sm whitespace-nowrap">Add Package</button>
               </div>
            </div>

            <div className="flex gap-3">
                <button 
                    type="button"
                    onClick={resetForm}
                    disabled={loading}
                    className="flex-1 bg-slate-700 text-white font-bold py-3 rounded-xl hover:bg-slate-600 mt-4 disabled:opacity-50"
                >
                    Cancel
                </button>
                <button 
                    type="submit" 
                    disabled={loading}
                    className="flex-[2] bg-brand-600 text-white font-bold py-3 rounded-xl hover:bg-brand-500 mt-4 shadow-lg shadow-brand-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {loading ? 'Saving...' : editingId ? <><Save size={20} /> Update Product</> : <><Plus size={20} /> Create Product</>}
                </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <div className="bg-slate-900 rounded-2xl border border-white/5 overflow-hidden">
         <div className="flex gap-2 p-4 border-b border-white/5 bg-dark-950/50 overflow-x-auto no-scrollbar">
            <button 
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1 rounded-lg text-xs font-bold uppercase whitespace-nowrap ${activeTab === 'all' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                All
            </button>
            {config.productTypes.map(t => (
              <button 
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-3 py-1 rounded-lg text-xs font-bold uppercase whitespace-nowrap ${activeTab === t ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                {t}
              </button>
            ))}
         </div>
         <div className="divide-y divide-white/5">
            {filteredProducts.map(p => (
              <div key={p.id} className="p-4 flex items-center justify-between hover:bg-slate-800/30">
                 <div className="flex items-center gap-4">
                   <img src={p.image} alt={p.name} className="w-12 h-12 rounded-lg object-cover" />
                   <div>
                     <h4 className="font-bold text-white flex items-center gap-2">
                       {p.name} 
                       {p.category && <span className="text-[10px] bg-slate-700 px-1.5 rounded text-slate-300">{p.category}</span>}
                     </h4>
                     <p className="text-xs text-slate-500 uppercase">{p.type} • {p.packages.length} packages</p>
                   </div>
                 </div>
                 <div className="flex items-center gap-2">
                     <button 
                       onClick={() => handleEdit(p)}
                       className="text-brand-400 hover:bg-brand-500/10 p-2 rounded-lg transition"
                       title="Edit Product"
                     >
                       <Edit3 size={18} />
                     </button>
                     <button 
                       onClick={() => handleDelete(p.id)}
                       className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition"
                       title="Delete Product"
                     >
                       <Trash2 size={18} />
                     </button>
                 </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default AdminProducts;
