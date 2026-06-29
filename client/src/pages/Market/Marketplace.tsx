import { useState } from 'react';

type Message = {
  sender: 'user' | 'seller';
  text: string;
  time: string;
};

type Item = {
  title: string;
  price: number;
  condition: string;
  category: string;
  time: string;
  image: string;
};

export default function Marketplace() {
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Chat state
  const [chattingItem, setChattingItem] = useState<Item | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const items = [
    { title: 'Wooden Dining Table (6 Seater)', price: 4500, condition: 'Good', category: 'Furniture', time: '2h ago', image: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&q=80&w=300' },
    { title: 'Samsung Washing Machine 6.5kg', price: 6500, condition: 'Like New', category: 'Electronics', time: '5h ago', image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&q=80&w=300' },
    { title: 'Old Textbooks (Class 10 CBSE)', price: 0, condition: 'Fair', category: 'Books', time: '1d ago', image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&q=80&w=300' },
    { title: 'Hero Honda Splendor 2018', price: 25000, condition: 'Good', category: 'Vehicles', time: '2d ago', image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=300' },
    { title: 'Plumbing Service Available', price: 0, condition: 'New', category: 'Services', time: '3d ago', image: 'https://images.unsplash.com/photo-1581141849291-1125c7b692b5?auto=format&fit=crop&q=80&w=300' },
  ];

  const categories = ['All', 'Electronics', 'Furniture', 'Books', 'Vehicles', 'Services', 'Clothing'];

  const startChat = (item: Item) => {
    setChattingItem(item);
    setChatMessages([
      { sender: 'seller', text: `Hi! Thanks for showing interest in "${item.title}". It is still available.`, time: 'Now' }
    ]);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: Message = { sender: 'user', text: inputText, time: 'Now' };
    setChatMessages(prev => [...prev, userMsg]);
    setInputText('');

    // Trigger mock automatic seller response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const sellerMsg: Message = { 
        sender: 'seller', 
        text: `Sure! I live in Greenwood Apartments (Block B, Flat 402). You can drop by tomorrow evening to inspect the item. Let me know if that works!`, 
        time: 'Just now' 
      };
      setChatMessages(prev => [...prev, sellerMsg]);
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-24 md:pb-8 relative">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-md px-5 pt-6 pb-4 border-b border-slate-100 sticky top-[68px] z-45 shadow-sm md:rounded-b-3xl md:mx-4 md:mt-0 md:px-8 md:py-6">
          <div className="flex justify-between items-center mb-5 md:mb-6">
            <h1 className="text-2xl md:text-3xl font-black text-slate-900">Local <span className="bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">Classifieds</span></h1>
            <button className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors shadow-inner border border-slate-100">
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </button>
          </div>
          
          {/* Category Filter */}
          <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1 md:flex-wrap">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 md:px-6 py-1.5 md:py-2.5 text-[13px] md:text-[14px] font-bold rounded-xl shrink-0 transition-all ${activeCategory === cat ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="p-5 md:p-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {items.filter(item => activeCategory === 'All' || item.category === activeCategory).map((item, i) => (
            <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 group cursor-pointer hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1 transition-all flex flex-col">
              <div className="h-36 md:h-48 w-full relative overflow-hidden bg-slate-100 shrink-0">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur px-2.5 py-1 rounded-md text-[10px] md:text-[11px] font-black text-slate-900 tracking-wide shadow-sm">
                  {item.condition}
                </div>
              </div>
              
              <div className="p-4 md:p-5 flex flex-col flex-1">
                <h3 className="font-bold text-slate-900 text-[13px] md:text-[15px] leading-snug mb-1.5 line-clamp-2 min-h-[38px] md:min-h-[44px] group-hover:text-orange-700 transition-colors">{item.title}</h3>
                <div className="flex justify-between items-end mb-3.5 mt-auto">
                  <span className={`font-black text-lg md:text-xl tracking-tight ${item.price === 0 ? 'text-green-600' : 'text-slate-900'}`}>
                    {item.price === 0 ? 'FREE' : `₹${item.price.toLocaleString()}`}
                  </span>
                </div>
                
                <div className="flex items-center justify-between border-t border-slate-100 pt-3.5">
                  <span className="text-[11px] md:text-[12px] text-slate-400 font-bold">{item.time}</span>
                  <button 
                    onClick={() => startChat(item)}
                    className="bg-orange-50 text-orange-700 text-[11px] md:text-[12px] font-bold px-3 py-1.5 md:px-4 md:py-2 rounded-lg hover:bg-orange-100 transition-colors flex items-center gap-1.5 border border-orange-100"
                  >
                    <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                    Chat
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- INBOX CHAT DRAWER / POPUP --- */}
      {chattingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-6 shadow-2xl relative flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setChattingItem(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200"
            >
              ✕
            </button>

            {/* Seller Header */}
            <div className="flex items-center gap-3 border-b pb-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-sm">
                S
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Neighbour Seller</h3>
                <span className="text-[10px] text-slate-450 truncate block max-w-[200px]">Listing: {chattingItem.title}</span>
              </div>
            </div>

            {/* Message Thread */}
            <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3.5 mb-4 max-h-64 min-h-[200px]">
              {chatMessages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex flex-col max-w-[75%] rounded-2xl px-4 py-2.5 text-xs ${
                    msg.sender === 'user' 
                      ? 'bg-orange-600 text-white self-end rounded-tr-none' 
                      : 'bg-slate-100 text-slate-800 self-start rounded-tl-none'
                  }`}
                >
                  <p className="leading-relaxed">{msg.text}</p>
                  <span className={`text-[8px] mt-1 self-end ${msg.sender === 'user' ? 'text-white/60' : 'text-slate-400'}`}>
                    {msg.time}
                  </span>
                </div>
              ))}
              
              {isTyping && (
                <div className="bg-slate-100 text-slate-500 self-start rounded-2xl rounded-tl-none px-4 py-3 text-xs italic flex items-center gap-1">
                  <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t">
              <input 
                type="text" 
                placeholder="Type your message..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-orange-500 focus:bg-white transition-colors"
              />
              <button 
                type="submit"
                disabled={!inputText.trim()}
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-4 rounded-xl text-xs disabled:opacity-50 transition-colors"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
