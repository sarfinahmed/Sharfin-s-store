
import React, { useState } from 'react';
import { Phone, Mail, MessageCircle, Send, MapPin, Clock } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const Contact: React.FC = () => {
  const { config } = useStore();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setFormData({ name: '', email: '', message: '' });
    }, 3000);
  };

  const { contactInfo } = config;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-slate-800 mb-4">Contact Support</h1>
        <p className="text-slate-500 max-w-lg mx-auto font-medium">Having trouble with your order? Our team is available to assist you. Reach out via any channel below.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Contact Cards */}
        <div className="liquid-card p-6 rounded-3xl text-center hover:border-brand-300 transition group">
           <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 mx-auto mb-4 group-hover:scale-110 transition shadow-sm border border-brand-100">
             <Phone size={28} />
           </div>
           <h3 className="text-slate-800 font-bold text-lg">Call Us</h3>
           <p className="text-slate-500 text-sm mt-2 mb-4">{contactInfo?.hours || '10 AM - 10 PM'}</p>
           <a href={`tel:${contactInfo?.phone}`} className="text-brand-600 font-bold hover:underline">{contactInfo?.phone}</a>
        </div>

        <div className="liquid-card p-6 rounded-3xl text-center hover:border-green-300 transition group">
           <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mx-auto mb-4 group-hover:scale-110 transition shadow-sm border border-green-100">
             <MessageCircle size={28} />
           </div>
           <h3 className="text-slate-800 font-bold text-lg">WhatsApp</h3>
           <p className="text-slate-500 text-sm mt-2 mb-4">Instant Chat Support</p>
           <a href={contactInfo?.whatsapp} target="_blank" rel="noreferrer" className="text-green-600 font-bold hover:underline">Chat Now</a>
        </div>

        <div className="liquid-card p-6 rounded-3xl text-center hover:border-blue-300 transition group">
           <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-4 group-hover:scale-110 transition shadow-sm border border-blue-100">
             <Mail size={28} />
           </div>
           <h3 className="text-slate-800 font-bold text-lg">Email Us</h3>
           <p className="text-slate-500 text-sm mt-2 mb-4">Response within 24 hours</p>
           <a href={`mailto:${contactInfo?.email}`} className="text-blue-600 font-bold hover:underline">{contactInfo?.email}</a>
        </div>
      </div>

      {/* Message Form */}
      <div className="grid md:grid-cols-2 gap-8 mt-12 bg-white rounded-3xl p-8 shadow-xl shadow-slate-200 border border-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-50 rounded-full blur-[60px] pointer-events-none"></div>
        
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Send us a Message</h2>
          <p className="text-slate-500 text-sm mb-6">Fill out the form and we will get back to you regarding your issue or query.</p>
          
          <div className="space-y-4">
             <div className="flex items-center gap-3 text-slate-600 font-medium">
               <MapPin size={18} className="text-brand-600" />
               <span className="text-sm">{contactInfo?.address}</span>
             </div>
             <div className="flex items-center gap-3 text-slate-600 font-medium">
               <Clock size={18} className="text-brand-600" />
               <span className="text-sm">Avg. Response Time: 30 Mins</span>
             </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <input 
            type="text" 
            placeholder="Your Name" 
            required
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full bg-slate-50 text-slate-800 rounded-xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition shadow-inner"
          />
          <input 
            type="email" 
            placeholder="Email Address" 
            required
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full bg-slate-50 text-slate-800 rounded-xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition shadow-inner"
          />
          <textarea 
            placeholder="How can we help?" 
            required
            rows={4}
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            className="w-full bg-slate-50 text-slate-800 rounded-xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition resize-none shadow-inner"
          />
          
          <button type="submit" className="w-full bg-brand-600 text-white font-bold py-3 rounded-xl hover:bg-brand-500 transition shadow-lg shadow-brand-500/30 flex items-center justify-center gap-2">
             {sent ? 'Message Sent!' : <><Send size={18} /> Send Message</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
