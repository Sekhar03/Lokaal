export default function SocietyDashboard() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto w-full">
        {/* Premium Header Profile */}
        <div className="bg-white px-5 pt-6 pb-6 shadow-sm z-10 sticky top-[68px] md:rounded-b-3xl md:mx-4 md:mt-0">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center text-3xl shadow-inner border-2 border-orange-50 shrink-0">🏢</div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900">Greenwood Society</h1>
              <p className="text-[13px] md:text-[14px] font-semibold text-slate-500">Flat B-402 • <span className="text-orange-500">Society Pro ✓</span></p>
            </div>
          </div>
        </div>

        <div className="p-5 md:p-8 flex flex-col lg:grid lg:grid-cols-12 gap-6">
          {/* Main Column */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Stats Card (Glassmorphic) */}
            <div className="relative bg-gradient-to-br from-[#0f172a] to-slate-800 text-white rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden">
              <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-orange-500 rounded-full filter blur-[50px] opacity-40"></div>
              
              <div className="relative z-10 flex justify-between items-start mb-8">
                <div>
                  <p className="text-[13px] md:text-[15px] text-slate-300 font-medium mb-1 tracking-wide uppercase">Maintenance Dues</p>
                  <h2 className="text-4xl md:text-5xl font-black tracking-tight"><span className="text-lg md:text-xl text-slate-400 font-medium mr-1">₹</span>2,500</h2>
                </div>
                <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-[11px] md:text-[12px] font-black uppercase tracking-wider">
                  Overdue
                </div>
              </div>
              
              <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-2xl p-4 md:p-5 flex items-center justify-between border border-white/10">
                <div>
                  <p className="text-[11px] md:text-[12px] text-slate-300 font-bold uppercase tracking-wider mb-0.5">Billing Cycle</p>
                  <p className="font-bold text-[14px] md:text-[16px]">June 2026</p>
                </div>
                <button className="bg-orange-500 text-white px-6 py-2.5 md:py-3 rounded-xl text-[13px] md:text-[14px] font-bold shadow-[0_4px_15px_rgba(234,88,12,0.4)] hover:bg-orange-600 transition-all active:scale-95">
                  Pay Now
                </button>
              </div>
            </div>

            {/* Notice Widget */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-orange-100 rounded-3xl p-5 md:p-6 relative overflow-hidden shadow-sm hidden lg:block">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-200 rounded-full filter blur-[30px] opacity-40"></div>
              <div className="relative z-10 flex gap-4 items-start">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-xl shrink-0 border border-amber-50">
                  📌
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <h4 className="font-bold text-slate-900 text-[15px] md:text-[16px]">Water Tank Cleaning</h4>
                    <span className="bg-orange-100 text-orange-700 text-[10px] font-black px-2 py-0.5 rounded-md tracking-wider">NOTICE</span>
                  </div>
                  <p className="text-[13px] md:text-[14px] text-slate-600 leading-relaxed font-medium">Scheduled water tank cleaning on Sunday, 28th June. Water supply will be disrupted from 9 AM to 1 PM. Please store water.</p>
                  <p className="text-[11px] text-slate-400 mt-2 font-bold tracking-wide uppercase">Posted by Society Admin</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Quick Actions Grid */}
            <div className="bg-white p-5 md:p-6 rounded-3xl shadow-sm border border-slate-100 h-full">
              <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-4 px-1">Services</h3>
              <div className="grid grid-cols-2 gap-3.5 md:gap-4">
                {[
                  { name: 'File Complaint', icon: '📝', color: 'bg-red-50 text-red-600' },
                  { name: 'Visitor Log', icon: '👤', color: 'bg-blue-50 text-blue-600' },
                  { name: 'Book Facility', icon: '🎾', color: 'bg-green-50 text-green-600' },
                  { name: 'Directory', icon: '📞', color: 'bg-purple-50 text-purple-600' }
                ].map((action, i) => (
                  <div key={i} className="bg-slate-50 p-5 md:p-6 rounded-2xl border border-slate-100 flex flex-col items-center justify-center gap-3 transition-transform hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] cursor-pointer hover:bg-white">
                    <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl ${action.color} flex items-center justify-center text-2xl md:text-3xl shadow-inner`}>
                      {action.icon}
                    </div>
                    <span className="text-[13px] md:text-[14px] font-bold text-slate-900 text-center">{action.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Notice Widget for Mobile (Hidden on LG) */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-orange-100 rounded-3xl p-5 relative overflow-hidden shadow-sm lg:hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-200 rounded-full filter blur-[30px] opacity-40"></div>
              <div className="relative z-10 flex gap-4 items-start">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-xl shrink-0 border border-amber-50">
                  📌
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <h4 className="font-bold text-slate-900 text-[15px]">Water Tank Cleaning</h4>
                    <span className="bg-orange-100 text-orange-700 text-[10px] font-black px-2 py-0.5 rounded-md tracking-wider">NOTICE</span>
                  </div>
                  <p className="text-[13px] text-slate-600 leading-relaxed font-medium">Scheduled water tank cleaning on Sunday, 28th June. Water supply will be disrupted from 9 AM to 1 PM. Please store water.</p>
                  <p className="text-[11px] text-slate-400 mt-2 font-bold tracking-wide uppercase">Posted by Society Admin</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
