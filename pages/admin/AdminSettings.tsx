
import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Save, Lock, Shield, Plus, Trash2, Layout, Tag, Image as ImageIcon, Phone, MapPin, Globe, Gift, Sparkles, Key } from 'lucide-react';
import { HomeSection, ProductType } from '../../types';

const AdminSettings: React.FC = () => {
  const { config, updateConfig, user } = useStore();
  const [formData, setFormData] = useState(config);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // New Section State
  const [newSection, setNewSection] = useState<Partial<HomeSection>>({
    title: '',
    subtitle: '',
    productType: 'game',
    icon: 'game',
    categoryFilter: ''
  });

  // New Type State
  const [newType, setNewType] = useState('');
  
  // New Banner State
  const [newBanner, setNewBanner] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddType = () => {
    if (!newType.trim()) return;
    const cleanType = newType.toLowerCase().trim();
    if (formData.productTypes.includes(cleanType)) return;
    
    setFormData(prev => ({
        ...prev,
        productTypes: [...prev.productTypes, cleanType]
    }));
    setNewType('');
  };

  const handleDeleteType = (typeToRemove: string) => {
    setFormData(prev => ({
        ...prev,
        productTypes: prev.productTypes.filter(t => t !== typeToRemove)
    }));
  };
  
  const handleAddBanner = () => {
      if (!newBanner.trim()) return;
      setFormData(prev => ({
          ...prev,
          banners: [...prev.banners, newBanner]
      }));
      setNewBanner('');
  };
  
  const handleDeleteBanner = (idx: number) => {
      setFormData(prev => ({
          ...prev,
          banners: prev.banners.filter((_, i) => i !== idx)
      }));
  };

  const handleAddSection = () => {
    if (!newSection.title) return;
    const section: HomeSection = {
        id: Math.random().toString(36).substr(2, 9),
        title: newSection.title!,
        subtitle: newSection.subtitle || '',
        productType: (newSection.productType || 'game') as ProductType,
        icon: (newSection.icon || 'game') as any,
        categoryFilter: newSection.categoryFilter
    };
    
    setFormData(prev => ({
        ...prev,
        homeSections: [...(prev.homeSections || []), section]
    }));
    setNewSection({ title: '', subtitle: '', productType: 'game', icon: 'game', categoryFilter: '' });
  };

  const handleDeleteSection = (id: string) => {
    setFormData(prev => ({
        ...prev,
        homeSections: prev.homeSections.filter(s => s.id !== id)
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    await updateConfig(formData);
    setLoading(false);
    setMsg('Settings saved successfully!');
    setTimeout(() => setMsg(''), 2000);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-3xl font-black text-white">Website Settings</h1>
      
      {/* Basic Settings */}
      <div className="bg-slate-900 p-8 rounded-2xl shadow-lg border border-white/5 space-y-6">
        <h2 className="font-bold text-xl text-white flex items-center gap-2">
            <Globe size={20} className="text-brand-500" /> General Info
        </h2>
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Website Name</label>
          <input 
            type="text" 
            name="appName" 
            value={formData.appName} 
            onChange={handleChange}
            className="w-full bg-dark-950 text-white rounded-xl border border-slate-700 px-4 py-3 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Logo URL (Optional)</label>
          <input 
            type="text" 
            name="appLogo" 
            value={formData.appLogo} 
            onChange={handleChange}
            placeholder="https://example.com/logo.png"
            className="w-full bg-dark-950 text-white rounded-xl border border-slate-700 px-4 py-3 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Notice Text</label>
          <textarea 
            name="notice" 
            value={formData.notice} 
            onChange={handleChange}
            className="w-full bg-dark-950 text-white rounded-xl border border-slate-700 px-4 py-3 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition"
            rows={3}
          />
        </div>
      </div>

      {/* AI Settings */}
      <div className="bg-slate-900 p-8 rounded-2xl shadow-lg border border-white/5 space-y-6">
        <h2 className="font-bold text-xl text-white flex items-center gap-2">
            <Sparkles size={20} className="text-brand-500" /> AI Assistant Settings
        </h2>
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Gemini API Key</label>
          <div className="relative">
            <input 
              type="password" 
              name="aiApiKey" 
              value={formData.aiApiKey || ''} 
              onChange={handleChange}
              placeholder="AIzaSy..."
              className="w-full bg-dark-950 text-white rounded-xl border border-slate-700 px-4 py-3 pl-10 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition font-mono"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600">
               <Key size={16} />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3">
            Required for the Support Chatbot. Get your key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-brand-400 hover:text-brand-300 font-bold hover:underline transition">Google AI Studio</a>.
          </p>
        </div>
      </div>
      
      {/* Offers Page Settings */}
      <div className="bg-slate-900 p-8 rounded-2xl shadow-lg border border-white/5 space-y-6">
        <h2 className="font-bold text-xl text-white flex items-center gap-2">
            <Gift size={20} className="text-brand-500" /> Offers Page Settings
        </h2>
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Page Title</label>
          <input 
            type="text" 
            name="offersPage.title" 
            value={formData.offersPage?.title} 
            onChange={handleChange}
            className="w-full bg-dark-950 text-white rounded-xl border border-slate-700 px-4 py-3 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Page Subtitle</label>
          <textarea 
            name="offersPage.subtitle" 
            value={formData.offersPage?.subtitle} 
            onChange={handleChange}
            className="w-full bg-dark-950 text-white rounded-xl border border-slate-700 px-4 py-3 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition"
            rows={2}
          />
        </div>
      </div>

      {/* Contact Info Manager */}
      <div className="bg-slate-900 p-8 rounded-2xl shadow-lg border border-white/5 space-y-6">
          <h2 className="font-bold text-xl text-white flex items-center gap-2">
            <Phone size={20} className="text-brand-500" /> Contact & Support Info
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Support Phone</label>
                  <input type="text" name="contactInfo.phone" value={formData.contactInfo?.phone} onChange={handleChange} className="w-full bg-dark-950 text-white rounded-lg border border-slate-700 px-3 py-2" />
              </div>
              <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Support Email</label>
                  <input type="text" name="contactInfo.email" value={formData.contactInfo?.email} onChange={handleChange} className="w-full bg-dark-950 text-white rounded-lg border border-slate-700 px-3 py-2" />
              </div>
              <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">WhatsApp Link</label>
                  <input type="text" name="contactInfo.whatsapp" value={formData.contactInfo?.whatsapp} onChange={handleChange} className="w-full bg-dark-950 text-white rounded-lg border border-slate-700 px-3 py-2" />
              </div>
              <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Support Hours</label>
                  <input type="text" name="contactInfo.hours" value={formData.contactInfo?.hours} onChange={handleChange} className="w-full bg-dark-950 text-white rounded-lg border border-slate-700 px-3 py-2" />
              </div>
              <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Address</label>
                  <input type="text" name="contactInfo.address" value={formData.contactInfo?.address} onChange={handleChange} className="w-full bg-dark-950 text-white rounded-lg border border-slate-700 px-3 py-2" />
              </div>
          </div>
      </div>

      {/* Banner Manager */}
      <div className="bg-slate-900 p-8 rounded-2xl shadow-lg border border-white/5 space-y-6">
        <h2 className="font-bold text-xl text-white flex items-center gap-2">
            <ImageIcon size={20} className="text-brand-500" /> Homepage Banners
        </h2>
        <div className="space-y-3">
            {formData.banners.map((url, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-dark-950 p-2 rounded-lg border border-slate-700">
                    <img src={url} alt="Banner" className="w-16 h-8 object-cover rounded" />
                    <span className="flex-1 text-xs text-slate-400 truncate">{url}</span>
                    <button onClick={() => handleDeleteBanner(idx)} className="text-red-500 hover:text-red-400"><Trash2 size={16} /></button>
                </div>
            ))}
        </div>
        <div className="flex gap-2">
            <input 
                type="text" 
                placeholder="Image URL"
                value={newBanner}
                onChange={e => setNewBanner(e.target.value)}
                className="flex-1 bg-dark-950 text-white rounded-lg border border-slate-700 px-3 py-2 text-sm"
            />
            <button onClick={handleAddBanner} className="bg-brand-600 text-white px-4 py-2 rounded-lg font-bold text-sm">Add</button>
        </div>
      </div>

      {/* Product Types Manager */}
      <div className="bg-slate-900 p-8 rounded-2xl shadow-lg border border-white/5 space-y-6">
        <h2 className="font-bold text-xl text-white flex items-center gap-2">
            <Tag size={20} className="text-brand-500" /> Manage Product Types
        </h2>
        <div className="flex flex-wrap gap-2">
            {formData.productTypes.map(type => (
                <div key={type} className="flex items-center gap-2 bg-dark-950 border border-slate-700 px-3 py-1.5 rounded-lg text-sm text-white capitalize">
                    {type}
                    <button onClick={() => handleDeleteType(type)} className="text-slate-500 hover:text-red-500">
                        <Trash2 size={14} />
                    </button>
                </div>
            ))}
        </div>
        <div className="flex gap-2">
            <input 
                type="text" 
                placeholder="New Type (e.g. software)"
                value={newType}
                onChange={e => setNewType(e.target.value)}
                className="flex-1 bg-dark-950 text-white rounded-lg border border-slate-700 px-3 py-2 text-sm"
            />
            <button onClick={handleAddType} className="bg-brand-600 text-white px-4 py-2 rounded-lg font-bold text-sm">Add</button>
        </div>
      </div>

      {/* Homepage Sections Manager */}
      <div className="bg-slate-900 p-8 rounded-2xl shadow-lg border border-white/5 space-y-6">
        <h2 className="font-bold text-xl text-white flex items-center gap-2">
            <Layout size={20} className="text-brand-500" /> Homepage Sections
        </h2>
        
        <div className="space-y-4">
           {formData.homeSections?.map(section => (
               <div key={section.id} className="flex items-center justify-between bg-dark-950 p-4 rounded-xl border border-white/5">
                   <div>
                       <h4 className="font-bold text-white">{section.title}</h4>
                       <p className="text-xs text-slate-500">
                           Type: <span className="text-brand-400 uppercase">{section.productType}</span> 
                           {section.categoryFilter && <span> • Category: {section.categoryFilter}</span>}
                       </p>
                   </div>
                   <button onClick={() => handleDeleteSection(section.id)} className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition">
                       <Trash2 size={18} />
                   </button>
               </div>
           ))}
        </div>

        <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5 space-y-3">
            <h4 className="text-sm font-bold text-slate-300">Add New Section</h4>
            <div className="grid grid-cols-2 gap-3">
                <input 
                    type="text" 
                    placeholder="Section Title"
                    value={newSection.title}
                    onChange={e => setNewSection({...newSection, title: e.target.value})}
                    className="bg-dark-950 text-white rounded-lg border border-slate-700 px-3 py-2 text-sm"
                />
                <input 
                    type="text" 
                    placeholder="Subtitle (Optional)"
                    value={newSection.subtitle}
                    onChange={e => setNewSection({...newSection, subtitle: e.target.value})}
                    className="bg-dark-950 text-white rounded-lg border border-slate-700 px-3 py-2 text-sm"
                />
                <select 
                    value={newSection.productType}
                    onChange={e => setNewSection({...newSection, productType: e.target.value as any})}
                    className="bg-dark-950 text-white rounded-lg border border-slate-700 px-3 py-2 text-sm capitalize"
                >
                    {formData.productTypes.map(t => (
                        <option key={t} value={t}>{t}</option>
                    ))}
                </select>
                <select 
                    value={newSection.icon}
                    onChange={e => setNewSection({...newSection, icon: e.target.value as any})}
                    className="bg-dark-950 text-white rounded-lg border border-slate-700 px-3 py-2 text-sm"
                >
                    <option value="game">Icon: Gamepad</option>
                    <option value="zap">Icon: Zap</option>
                    <option value="star">Icon: Star</option>
                    <option value="flame">Icon: Flame</option>
                    <option value="gift">Icon: Gift</option>
                    <option value="trophy">Icon: Trophy</option>
                </select>
                 <input 
                    type="text" 
                    placeholder="Category Filter (e.g. Action)"
                    value={newSection.categoryFilter}
                    onChange={e => setNewSection({...newSection, categoryFilter: e.target.value})}
                    className="col-span-2 bg-dark-950 text-white rounded-lg border border-slate-700 px-3 py-2 text-sm"
                />
            </div>
            <button onClick={handleAddSection} className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 rounded-lg text-sm flex items-center justify-center gap-2">
                <Plus size={16} /> Add Section
            </button>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-slate-900 p-8 rounded-2xl shadow-lg border border-white/5 space-y-6">
        <h2 className="font-bold text-xl text-white">Payment Methods</h2>
        <div className="grid grid-cols-2 gap-6">
           <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Bkash Number</label>
            <input 
              type="text" 
              name="paymentMethods.bkash" 
              value={formData.paymentMethods.bkash} 
              onChange={handleChange}
              className="w-full bg-dark-950 text-white rounded-xl border border-slate-700 px-4 py-3 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition font-mono"
            />
           </div>
           <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Nagad Number</label>
            <input 
              type="text" 
              name="paymentMethods.nagad" 
              value={formData.paymentMethods.nagad} 
              onChange={handleChange}
              className="w-full bg-dark-950 text-white rounded-xl border border-slate-700 px-4 py-3 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition font-mono"
            />
           </div>
        </div>
      </div>

      {msg && <p className="text-green-400 font-bold bg-green-500/10 p-3 rounded-lg border border-green-500/20 text-center animate-fade-in">{msg}</p>}

      <button onClick={handleSave} disabled={loading} className="flex items-center justify-center gap-2 bg-brand-600 text-white font-bold py-4 px-8 rounded-xl hover:bg-brand-500 transition w-full shadow-lg shadow-brand-900/50 disabled:opacity-50">
        <Save size={20} /> {loading ? 'Saving...' : 'Save All Changes'}
      </button>
    </div>
  );
};

export default AdminSettings;
