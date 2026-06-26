import { useState } from 'react';

export default function EventsList() {
  const [activeTab, setActiveTab] = useState('All');
  
  const events = [
    { title: 'Blood Donation Camp', date: '15 Dec', time: '09:00 AM', venue: 'Community Hall, Ward 4', rsvps: 45, category: 'CIVIC', image: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&q=80&w=400', free: true },
    { title: 'Morning Yoga in the Park', date: '20 Jul', time: '06:30 AM', venue: 'Central Park', rsvps: 112, category: 'FITNESS', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=400', free: true },
    { title: 'Diwali Mela 2026', date: '25 Oct', time: '05:00 PM', venue: 'Exhibition Grounds', rsvps: 432, category: 'FESTIVAL', image: 'https://images.unsplash.com/photo-1542840410-3092f99611a3?auto=format&fit=crop&q=80&w=400', free: false, price: 50 },
    { title: 'Kids Art Competition', date: '02 Sep', time: '10:00 AM', venue: 'Lions Club Hall', rsvps: 68, category: 'KIDS', image: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&q=80&w=400', free: false, price: 100 },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-24 md:pb-8">
      {/* Premium Hero Section */}
      <div className="relative pt-6 pb-12 md:py-16 px-5 md:px-12 bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white rounded-b-[2.5rem] md:rounded-b-[4rem] shadow-xl overflow-hidden md:mx-4 md:mt-4">
        <div className="absolute top-0 right-0 w-72 h-72 bg-orange-500 rounded-full filter blur-[100px] opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500 rounded-full filter blur-[100px] opacity-20 transform -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="max-w-4xl mx-auto relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-2 md:mb-4 tracking-tight">Discover<br className="md:hidden"/><span className="hidden md:inline"> </span><span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">Local Events</span></h1>
            <p className="text-slate-300 text-[15px] md:text-lg mb-4 md:mb-0 font-medium">Connect with your neighborhood</p>
          </div>
          
          {/* Glassmorphic Search */}
          <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.1)] w-full md:w-96">
            <svg className="w-5 h-5 text-white/70 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input type="text" placeholder="Search events, workshops, melas..." className="w-full bg-transparent border-none outline-none text-white placeholder-white/60 px-3 py-2.5 text-[15px]" />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full px-5 md:px-8 mt-6">
        {/* Filter Tabs */}
        <div className="flex gap-2.5 overflow-x-auto no-scrollbar py-6 md:flex-wrap">
          {['All', 'Today', 'This Week', 'Civic', 'Fitness', 'Kids'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 text-[14px] font-bold rounded-xl shrink-0 transition-all shadow-sm ${activeTab === tab ? 'bg-orange-600 text-white shadow-orange-600/30' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Event Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {events.map((ev, i) => (
            <div key={i} className="group bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 transition-all hover:-translate-y-1 hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] flex flex-col">
              <div className="h-48 w-full relative shrink-0">
                <img src={ev.image} alt={ev.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3.5 py-1.5 rounded-lg text-[11px] font-black text-slate-900 shadow-sm uppercase tracking-wider">
                  {ev.category}
                </div>
                {!ev.free && (
                  <div className="absolute top-4 right-4 bg-orange-500 px-3.5 py-1.5 rounded-lg text-[13px] font-black text-white shadow-sm">
                    ₹{ev.price}
                  </div>
                )}
              </div>
              
              <div className="p-5 flex gap-5 relative flex-1">
                {/* Floating Date Badge */}
                <div className="absolute -top-10 right-6 bg-white shadow-xl rounded-2xl p-2 min-w-[64px] flex flex-col items-center justify-center border border-slate-50">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{ev.date.split(' ')[1]}</span>
                  <span className="text-2xl font-black text-orange-600 leading-none mt-1">{ev.date.split(' ')[0]}</span>
                </div>
                
                <div className="flex-1 flex flex-col">
                  <h3 className="font-bold text-slate-900 text-lg leading-tight mb-2 group-hover:text-orange-700 transition-colors pr-14">{ev.title}</h3>
                  <p className="text-[13px] text-slate-500 font-medium mb-5 flex items-start gap-1.5 flex-1">
                    <svg className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    <span>{ev.venue} <br className="hidden md:block lg:hidden"/>• {ev.time}</span>
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex -space-x-2.5">
                      {[1,2,3].map(avatar => (
                        <img key={avatar} src={`https://i.pravatar.cc/100?img=${avatar + i * 5}`} className="w-9 h-9 rounded-full border-2 border-white shadow-sm" alt="attendee" />
                      ))}
                      <div className="w-9 h-9 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[11px] font-bold text-slate-600 shadow-sm">
                        +{ev.rsvps}
                      </div>
                    </div>
                    <button className="px-6 py-2.5 bg-slate-900 text-white text-[13px] font-bold rounded-xl hover:bg-orange-600 transition-colors shadow-md">
                      Going
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
