import { useState, useEffect } from 'react';

export default function GroupsDirectory() {
  const [activeTab, setActiveTab] = useState<'Users' | 'Societies'>('Users');
  const [users, setUsers] = useState<any[]>([]);
  const [societies, setSocieties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('lokaal_token');
        const headers = { 'Authorization': `Bearer ${token}` };
        
        const [usersRes, societiesRes] = await Promise.all([
          fetch('http://localhost:3001/api/directory/users', { headers }),
          fetch('http://localhost:3001/api/directory/societies', { headers })
        ]);
        
        const usersData = await usersRes.json();
        const societiesData = await societiesRes.json();
        
        setUsers(Array.isArray(usersData) ? usersData : []);
        setSocieties(Array.isArray(societiesData) ? societiesData : []);
      } catch (err) {
        console.error('Failed to fetch directory data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-lg px-5 pt-6 pb-5 border-b border-slate-100 shadow-sm sticky top-[68px] z-40 md:rounded-b-3xl md:mx-4 md:mt-0 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h1 className="text-2xl md:text-3xl font-black text-slate-900">Pincode <span className="bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">Directory</span></h1>
          
          <div className="flex bg-slate-100/80 p-1.5 rounded-xl shadow-inner md:w-80">
            <button 
              onClick={() => setActiveTab('Users')}
              className={`flex-1 py-2.5 text-[14px] font-bold rounded-lg transition-all ${activeTab === 'Users' ? 'bg-white shadow-md text-orange-700' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Users ({users.length})
            </button>
            <button 
              onClick={() => setActiveTab('Societies')}
              className={`flex-1 py-2.5 text-[14px] font-bold rounded-lg transition-all ${activeTab === 'Societies' ? 'bg-white shadow-md text-orange-700' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Societies ({societies.length})
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 md:p-8">
          {isLoading ? (
            <div className="flex justify-center items-center py-20 text-orange-500 font-bold">Loading Directory...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {activeTab === 'Users' ? (
                users.length > 0 ? users.map((user, i) => (
                  <div key={i} className="bg-white rounded-3xl p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col items-center text-center transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-3xl shadow-lg mb-4 text-white font-bold">
                      {user.name?.charAt(0) || 'U'}
                    </div>
                    <span className="text-[10px] font-bold text-orange-600/80 uppercase tracking-widest mb-1.5">Pincode: {user.pinCode}</span>
                    <h3 className="font-bold text-slate-900 text-[16px] leading-tight mb-2">{user.name}</h3>
                    <p className="text-sm text-slate-500">{user.role}</p>
                    <button className="w-full py-2.5 mt-4 rounded-xl text-[13px] font-bold bg-slate-900 text-white hover:bg-orange-600 shadow-md transition-all">
                      View Profile
                    </button>
                  </div>
                )) : (
                  <div className="col-span-full text-center py-10 text-slate-500 font-medium">No users found in your pincode area.</div>
                )
              ) : (
                societies.length > 0 ? societies.map((society, i) => (
                  <div key={i} className="bg-white rounded-3xl p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col items-center text-center transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-3xl shadow-lg mb-4 text-white">
                      🏢
                    </div>
                    <span className="text-[10px] font-bold text-orange-600/80 uppercase tracking-widest mb-1.5">Pincode: {society.pinCode}</span>
                    <h3 className="font-bold text-slate-900 text-[16px] leading-tight mb-2">{society.name}</h3>
                    <p className="text-sm text-slate-500 line-clamp-2">{society.address}</p>
                    <button className="w-full py-2.5 mt-4 rounded-xl text-[13px] font-bold bg-slate-900 text-white hover:bg-orange-600 shadow-md transition-all">
                      Join Society
                    </button>
                  </div>
                )) : (
                  <div className="col-span-full text-center py-10 text-slate-500 font-medium">No societies found in your pincode area.</div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
