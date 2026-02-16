import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { generateSupportResponse } from '../services/geminiService';

const SupportChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    { role: 'bot', text: 'Hi! Need help with top-up?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { config, products } = useStore();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    const botResponse = await generateSupportResponse(userMsg, config, products);
    
    setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
    setLoading(false);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 md:bottom-8 right-6 w-14 h-14 bg-brand-600 hover:bg-brand-500 text-white rounded-full shadow-[0_0_20px_rgba(124,58,237,0.5)] flex items-center justify-center transition-all z-40 hover:scale-110 active:scale-90"
      >
        <MessageCircle size={28} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-24 md:bottom-8 right-6 w-80 bg-slate-900 rounded-2xl shadow-2xl border border-white/10 flex flex-col z-50 overflow-hidden ring-1 ring-white/10">
      <div className="bg-brand-600 p-4 flex justify-between items-center text-white bg-gradient-to-r from-brand-700 to-brand-600">
        <h3 className="font-bold flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
          AI Support
        </h3>
        <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 rounded-lg p-1 transition"><X size={20} /></button>
      </div>
      
      <div ref={scrollRef} className="h-80 overflow-y-auto p-4 bg-dark-950 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-brand-600 text-white rounded-tr-none' : 'bg-slate-800 border border-white/5 text-slate-200 rounded-tl-none'}`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
             <div className="bg-slate-800 text-xs text-slate-400 px-3 py-2 rounded-xl rounded-tl-none border border-white/5 flex gap-1 items-center">
               <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></span>
               <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-75"></span>
               <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-150"></span>
             </div>
          </div>
        )}
      </div>

      <div className="p-3 bg-slate-900 border-t border-white/5 flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          className="flex-1 text-sm bg-dark-950 text-white border-slate-700 rounded-lg focus:ring-1 focus:ring-brand-500 focus:border-brand-500 placeholder:text-slate-600"
        />
        <button onClick={handleSend} disabled={loading} className="p-2 bg-brand-600 text-white rounded-lg hover:bg-brand-500 transition disabled:opacity-50">
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default SupportChat;