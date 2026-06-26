import { useState } from 'react';

export default function GroupsDirectory() {
  const [activeTab, setActiveTab] = useState('Explore');

  const groups = [
    { name: 'Ward 4 RWA', members: 1245, category: 'Civic', color: 'from-blue-400 to-indigo-600', icon: '🏛️', joined: true },
    { name: 'Weekend Football', members: 845, category: 'Sports', color: 'from-green-400 to-emerald-600', icon: '⚽', joined: false },
    { name: 'Women Empowerment', members: 489, category: 'Women', color: 'from-purple-400 to-pink-500', icon: '👩🏽', joined: false },
    { name: 'Senior Citizens Forum', members: 210, category: 'Seniors', color: 'from-amber-400 to-orange-500', icon: '🧓', joined: true },
    { name: 'Local Business Owners', members: 356, category: 'Business', color: 'from-cyan-400 to-blue-500', icon: '🏪', joined: false },
    { name: 'Green Environment', members: 1178, category: 'Agriculture', color: 'from-rose-400 to-red-500', icon: '🌱', joined: false },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-lg px-5 pt-6 pb-5 border-b border-slate-100 shadow-sm sticky top-[68px] z-40 md:rounded-b-3xl md:mx-4 md:mt-0 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h1 className="text-2xl md:text-3xl font-black text-slate-900">Local <span className="bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">Groups</span></h1>
          
          <div className="flex bg-slate-100/80 p-1.5 rounded-xl shadow-inner md:w-80">
            <button 
              onClick={() => setActiveTab('Explore')}
              className={`flex-1 py-2.5 text-[14px] font-bold rounded-lg transition-all ${activeTab === 'Explore' ? 'bg-white shadow-md text-orange-700' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Explore
            </button>
            <button 
              onClick={() => setActiveTab('My Groups')}
              className={`flex-1 py-2.5 text-[14px] font-bold rounded-lg transition-all ${activeTab === 'My Groups' ? 'bg-white shadow-md text-orange-700' : 'text-slate-500 hover:text-slate-700'}`}
            >
              My Groups
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="p-5 md:p-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {groups.filter(g => activeTab === 'Explore' || g.joined).map((group, i) => (
            <div key={i} className="bg-white rounded-3xl p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col items-center text-center transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${group.color} flex items-center justify-center text-3xl shadow-lg mb-4 transform transition-transform hover:scale-110`}>
                {group.icon}
              </div>
              
              <span className="text-[10px] font-bold text-orange-600/80 uppercase tracking-widest mb-1.5">{group.category}</span>
              <h3 className="font-bold text-slate-900 text-[14px] leading-tight mb-3 h-10 flex items-center justify-center">{group.name}</h3>
              
              <div className="flex items-center gap-1.5 text-[12px] text-slate-500 font-semibold mb-5 bg-slate-50 px-3 py-1 rounded-full">
                <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/></svg>
                {group.members.toLocaleString()} 
              </div>
              
              <button className={`w-full py-2.5 rounded-xl text-[13px] font-bold transition-all mt-auto ${group.joined ? 'bg-orange-50 text-orange-700 border border-orange-200' : 'bg-slate-900 text-white hover:bg-orange-600 shadow-md'}`}>
                {group.joined ? 'Member ✓' : 'Join Group'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
