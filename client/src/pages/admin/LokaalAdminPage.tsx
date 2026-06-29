import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

type Tab = 'PENDING' | 'USERS' | 'MODERATION' | 'SOCIETIES' | 'BUSINESSES';

export default function LokaalAdminPage() {
  const [data, setData] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('PENDING');
  const [isLoading, setIsLoading] = useState(true);

  const authUser = useAuthStore(s => s.user);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('lokaal_token');
      let endpoint = '';
      
      switch (activeTab) {
        case 'PENDING': endpoint = 'pending-verifications'; break;
        case 'USERS': endpoint = 'users'; break;
        case 'MODERATION': endpoint = 'posts'; break;
        case 'SOCIETIES': endpoint = 'societies'; break;
        case 'BUSINESSES': endpoint = 'businesses'; break;
      }
        
      const res = await fetch(`${API_URL}/api/admin/${endpoint}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      setData(Array.isArray(result) ? result : []);
    } catch (err) {
      console.warn('API failed, falling back to mock Admin data.', err);
      if (activeTab === 'PENDING') {
        setData([
          {
            id: 'mock-user-pending-1',
            name: 'Karan Sharma',
            phone: '+919876543210',
            role: 'BUSINESS_OWNER',
            pinCode: '462001',
            verificationDoc: 'https://mock-storage.lokaal.app/doc_karan.pdf'
          },
          {
            id: 'mock-user-pending-2',
            name: 'Sunita Rao',
            phone: '+918765432109',
            role: 'SOCIETY_ADMIN',
            pinCode: '462002',
            verificationDoc: 'https://mock-storage.lokaal.app/doc_sunita.pdf'
          }
        ]);
      } else if (activeTab === 'USERS') {
        setData([
          { id: 'mock-u-1', name: 'Karan Sharma', phone: '+919876543210', role: 'BUSINESS_OWNER', pinCode: '462001', isVerified: false },
          { id: 'mock-u-2', name: 'Sunita Rao', phone: '+918765432109', role: 'SOCIETY_ADMIN', pinCode: '462002', isVerified: false },
          { id: 'mock-u-3', name: 'Ravi Kumar', phone: '+919988776655', role: 'RESIDENT', pinCode: '462001', isVerified: true }
        ]);
      } else if (activeTab === 'MODERATION') {
        setData([
          { id: 'mock-p-1', type: 'ALERT', content: 'Water supply cut tomorrow.', author: { name: 'Ward 4 RWA' }, locality: '462001' },
          { id: 'mock-p-2', type: 'ANNOUNCEMENT', content: 'New Samosa shop opened!', author: { name: 'Ramesh Chaat' }, locality: '462001' }
        ]);
      } else if (activeTab === 'SOCIETIES') {
        setData([
          { id: 'mock-s-1', name: 'Gokuldham Cooperative Society', pinCode: '400063', createdAt: new Date().toISOString() },
          { id: 'mock-s-2', name: 'Greenwood Apartments', pinCode: '462001', createdAt: new Date().toISOString() }
        ]);
      } else if (activeTab === 'BUSINESSES') {
        setData([
          { id: 'mock-b-1', name: 'Ramesh Chaat Bhandar', category: 'Food & Beverage', locality: '462001', createdAt: new Date().toISOString() },
          { id: 'mock-b-2', name: 'Apex Grocery Store', category: 'Retail', locality: '462001', createdAt: new Date().toISOString() }
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (action: 'verify' | 'deleteUser' | 'deletePost', id: string) => {
    if (action.includes('delete') && !window.confirm('Are you sure you want to delete this?')) return;
    
    try {
      const token = localStorage.getItem('lokaal_token');
      let url = '';
      let method = 'DELETE';
      
      if (action === 'verify') {
        url = `${API_URL}/api/admin/verify-user/${id}`;
        method = 'POST';
      } else if (action === 'deleteUser') {
        url = `${API_URL}/api/admin/users/${id}`;
      } else if (action === 'deletePost') {
        url = `${API_URL}/api/admin/posts/${id}`;
      }

      const res = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      
      if (result.success) {
        fetchData();
      } else {
        alert(result.error || 'Action failed');
      }
    } catch (err) {
      console.warn('API failed, falling back to mock Action success.');
      setData(prev => prev.filter(item => item.id !== id));
      alert(`${action.toUpperCase()} action successfully simulated!`);
    }
  };

  if (authUser?.role !== 'PLATFORM_ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
          <p className="text-gray-500">You must be a Platform Admin to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1A1A2E]">Platform Admin</h1>
          <p className="text-gray-500">Manage Lokaal platform, content, and entities.</p>
        </div>
        <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-lg font-bold text-sm">
          Super Admin Mode
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-gray-200 mb-6 scrollbar-hide">
        {[
          { id: 'PENDING', label: 'Pending Verifications' },
          { id: 'USERS', label: 'Users' },
          { id: 'MODERATION', label: 'Moderation (Posts)' },
          { id: 'SOCIETIES', label: 'Societies' },
          { id: 'BUSINESSES', label: 'Businesses' },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={`px-6 py-3 font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-gray-500 font-bold animate-pulse">Loading data...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          
          {activeTab === 'PENDING' && (
            <div className="divide-y divide-gray-100">
              {data.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No pending verifications! 🎉</div>
              ) : (
                data.map(user => (
                  <div key={user.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-lg text-[#1A1A2E]">{user.name} <span className="text-sm font-normal text-gray-500">({user.phone})</span></h3>
                      <div className="flex gap-3 mt-2">
                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold">{user.role}</span>
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-bold">Pincode: {user.pinCode}</span>
                      </div>
                      <div className="mt-3 text-sm flex items-center gap-2">
                        <span className="text-gray-500">Document:</span>
                        <a href={user.verificationDoc} target="_blank" rel="noreferrer" className="text-orange-600 font-bold hover:underline flex items-center gap-1">
                          📄 {user.verificationDoc.split('/').pop()}
                        </a>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleAction('verify', user.id)}
                      className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Approve & Verify
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'USERS' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-sm">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Name</th>
                    <th className="px-6 py-4 font-semibold">Phone</th>
                    <th className="px-6 py-4 font-semibold">Role</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-bold text-[#1A1A2E]">{user.name}</td>
                      <td className="px-6 py-4 text-gray-600">{user.phone}</td>
                      <td className="px-6 py-4">
                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold">{user.role}</span>
                      </td>
                      <td className="px-6 py-4">
                        {user.isVerified ? (
                          <span className="text-green-600 font-bold text-sm flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Verified</span>
                        ) : (
                          <span className="text-gray-400 font-bold text-sm">Unverified</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleAction('deleteUser', user.id)}
                          className="text-red-500 hover:text-red-700 font-bold text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'MODERATION' && (
            <div className="divide-y divide-gray-100">
              {data.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No posts found.</div>
              ) : (
                data.map(post => (
                  <div key={post.id} className="p-6 flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs font-bold">{post.type}</span>
                        <span className="text-xs text-gray-400 font-medium">By {post.author?.name || 'Unknown'} • Pin: {post.locality}</span>
                      </div>
                      <p className="text-[#1A1A2E] mb-3">{post.content}</p>
                      {post.imageUrls && post.imageUrls.length > 0 && (
                        <div className="flex gap-2 mt-2">
                          {post.imageUrls.map((url: string, i: number) => (
                            <img key={i} src={url} alt="post" className="w-20 h-20 object-cover rounded-lg border" />
                          ))}
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={() => handleAction('deletePost', post.id)}
                      className="px-4 py-2 bg-red-50 text-red-600 font-bold rounded-lg hover:bg-red-100 transition-colors whitespace-nowrap border border-red-100"
                    >
                      Delete Post
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {(activeTab === 'SOCIETIES' || activeTab === 'BUSINESSES') && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-sm">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Name</th>
                    <th className="px-6 py-4 font-semibold">Pincode / Locality</th>
                    <th className="px-6 py-4 font-semibold">Created At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-gray-500">No records found.</td>
                    </tr>
                  ) : (
                    data.map(entity => (
                      <tr key={entity.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-bold text-[#1A1A2E]">{entity.name}</td>
                        <td className="px-6 py-4 text-gray-600">{entity.pinCode || entity.locality}</td>
                        <td className="px-6 py-4 text-gray-500 text-sm">{new Date(entity.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
