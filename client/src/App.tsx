import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { Suspense, lazy, useState } from 'react';
import { useAuthStore } from './store/authStore';
import CreateActionModals, { ModalType } from './components/CreateActionModals';

// Lazy loaded pages to simulate the PRD modules
const PhoneAuth = lazy(() => import('./pages/Onboarding/PhoneAuth'));
const FeedPage = lazy(() => import('./pages/Feed/FeedPage'));
const EventsList = lazy(() => import('./pages/Events/EventsList'));
const GroupsDirectory = lazy(() => import('./pages/Groups/GroupsDirectory'));
const SocietyDashboard = lazy(() => import('./pages/Society/SocietyDashboard'));
const Marketplace = lazy(() => import('./pages/Market/Marketplace'));
const BusinessDirectory = lazy(() => import('./pages/Business/BusinessDirectory'));
const LokaalAdminPage = lazy(() => import('./pages/Admin/LokaalAdminPage'));
const AdminLogin = lazy(() => import('./pages/Onboarding/AdminLogin'));

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 text-orange-600">
      <div className="animate-pulse font-bold text-xl">Lokaal Loading...</div>
    </div>
  );
}

function BottomNav() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="md:hidden fixed bottom-0 w-full bg-white border-t border-slate-100 flex justify-around p-3 z-50 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <Link to="/feed" className={`flex flex-col items-center transition-colors ${isActive('/feed') ? 'text-orange-600' : 'text-slate-400 hover:text-orange-600'}`}>
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2l8 8h-3v8H5v-8H2l8-8z"/></svg>
        <span className="text-[10px] mt-1 font-bold">Feed</span>
      </Link>
      <Link to="/events" className={`flex flex-col items-center transition-colors ${isActive('/events') ? 'text-orange-600' : 'text-slate-400 hover:text-orange-600'}`}>
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11v4h3v2h-5V7h2z"/></svg>
        <span className="text-[10px] mt-1 font-bold">Events</span>
      </Link>
      <Link to="/groups" className={`flex flex-col items-center transition-colors ${isActive('/groups') ? 'text-orange-600' : 'text-slate-400 hover:text-orange-600'}`}>
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M13 7a3 3 0 11-6 0 3 3 0 016 0zM5.5 16a6.5 6.5 0 0113 0H5.5z"/></svg>
        <span className="text-[10px] mt-1 font-bold">Clubs</span>
      </Link>
      <Link to="/society" className={`flex flex-col items-center transition-colors ${isActive('/society') ? 'text-orange-600' : 'text-slate-400 hover:text-orange-600'}`}>
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4v12h12V4H4zm2 2h8v8H6V6z"/></svg>
        <span className="text-[10px] mt-1 font-bold">Society</span>
      </Link>
      <Link to="/more" className={`flex flex-col items-center transition-colors ${isActive('/more') ? 'text-orange-600' : 'text-slate-400 hover:text-orange-600'}`}>
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/></svg>
        <span className="text-[10px] mt-1 font-bold">More</span>
      </Link>
    </div>
  );
}

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const user = useAuthStore(s => s.user);
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  return (
    <div className="w-full min-h-screen bg-slate-50 pb-[70px] md:pb-0 relative overflow-x-hidden">
        {isAuthenticated && (
          <header className="bg-white/90 backdrop-blur-lg px-5 py-3 md:py-4 border-b border-slate-100 sticky top-0 z-50 shadow-sm transition-all">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              {/* Brand */}
              <div className="flex items-center gap-2">
                <svg className="w-7 h-7 text-orange-600" fill="currentColor" viewBox="0 0 24 24"><path d="M14 6l-4 4-2-2-4 4h16l-6-6z"/><path d="M14 9l-4 4-2-2-4 4v2h16v-2l-6-6z" opacity="0.5"/></svg>
                <span className="bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent font-black text-2xl tracking-tight">Lokaal</span>
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-6 xl:gap-8">
                {[
                  { path: '/feed', label: 'Feed' },
                  { path: '/events', label: 'Events' },
                  { path: '/groups', label: 'Groups' },
                  { path: '/society', label: 'Society' },
                  { path: '/more', label: 'More' },
                  ...(user?.role === 'PLATFORM_ADMIN' ? [{ path: '/admin', label: 'Admin' }] : [])
                ].map(nav => (
                  <Link 
                    key={nav.path} 
                    to={nav.path} 
                    className={`text-[14px] font-bold transition-all hover:-translate-y-0.5 ${isActive(nav.path) ? 'text-orange-600 border-b-2 border-orange-600 pb-1' : 'text-slate-500 hover:text-orange-500 pb-1'}`}
                  >
                    {nav.label}
                  </Link>
                ))}
              </div>

              {/* Profile/Logout */}
              <div className="h-9 w-9 bg-orange-50 text-orange-600 rounded-full cursor-pointer hover:bg-orange-100 hover:scale-105 transition-all flex items-center justify-center font-bold text-sm border-2 border-orange-100 shadow-sm" onClick={() => useAuthStore.getState().logout()}>
                TR
              </div>
            </div>
          </header>
        )}

        <main className="w-full max-w-7xl mx-auto">
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/login" element={isAuthenticated ? <Navigate to="/feed" replace /> : <PhoneAuth />} />
              <Route path="/admin-login" element={isAuthenticated ? <Navigate to="/admin" replace /> : <AdminLogin />} />
              
              <Route path="/" element={<Navigate to="/feed" replace />} />
              <Route path="/feed" element={<PrivateRoute><FeedPage /></PrivateRoute>} />
              <Route path="/events" element={<PrivateRoute><EventsList /></PrivateRoute>} />
              <Route path="/groups" element={<PrivateRoute><GroupsDirectory /></PrivateRoute>} />
              <Route path="/society" element={<PrivateRoute><SocietyDashboard /></PrivateRoute>} />
              <Route path="/market" element={<PrivateRoute><Marketplace /></PrivateRoute>} />
              <Route path="/more" element={<PrivateRoute><Marketplace /></PrivateRoute>} />
              <Route path="/business" element={<PrivateRoute><BusinessDirectory /></PrivateRoute>} />
              <Route path="/admin" element={<PrivateRoute><LokaalAdminPage /></PrivateRoute>} />
            </Routes>
          </Suspense>
        </main>

        {isAuthenticated && <BottomNav />}

        {/* Create Action Menu Overlay */}
        {isAuthenticated && isCreateMenuOpen && (
          <>
            <div 
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-40 transition-opacity"
              onClick={() => setIsCreateMenuOpen(false)}
            />
            <div className="fixed bottom-[160px] md:bottom-[100px] right-6 md:right-8 z-50 flex flex-col gap-3 items-end animate-in slide-in-from-bottom-4 fade-in duration-200">
              {[
                { id: 'announcement', icon: '📢', label: 'Announcement', color: 'text-blue-600' },
                { id: 'sale', icon: '🏷️', label: 'For Sale', color: 'text-green-600' },
                { id: 'lost', icon: '🔍', label: 'Lost & Found', color: 'text-amber-600' },
                { id: 'event', icon: '📅', label: 'Host Event', color: 'text-orange-600' },
                { id: 'notice', icon: '📌', label: 'Notice (Admin)', color: 'text-slate-600' }
              ].map((action, i) => (
                <button 
                  key={i}
                  onClick={() => { setIsCreateMenuOpen(false); setActiveModal(action.id as ModalType); }}
                  className="flex items-center gap-4 bg-white pl-5 pr-2 py-2 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 hover:scale-105 transition-all group border border-slate-100"
                >
                  <span className="font-bold text-slate-700 text-[14px] group-hover:text-orange-600">{action.label}</span>
                  <div className={`w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-lg shadow-inner ${action.color} border border-slate-100`}>
                    {action.icon}
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Global Floating Action Button */}
        {isAuthenticated && (
          <button 
            onClick={() => setIsCreateMenuOpen(!isCreateMenuOpen)}
            className={`fixed bottom-[90px] md:bottom-8 right-6 md:right-8 w-14 h-14 rounded-full shadow-[0_8px_20px_rgba(16,185,129,0.4)] flex items-center justify-center text-white text-3xl transition-all z-50 duration-300 ${isCreateMenuOpen ? 'bg-slate-800 rotate-45 hover:bg-slate-700 hover:scale-110 shadow-slate-900/30' : 'bg-orange-600 hover:bg-orange-500 hover:scale-110'}`}
          >
            +
          </button>
        )}
        
        {/* Render Creation Modals */}
        <CreateActionModals activeModal={activeModal} onClose={() => setActiveModal(null)} />
      </div>
  );
}
