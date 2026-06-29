import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

type Complaint = {
  id: string;
  title: string;
  category: string;
  status: 'PENDING' | 'IN PROGRESS' | 'RESOLVED';
  date: string;
};

type Visitor = {
  id: string;
  name: string;
  type: string;
  time: string;
  status: 'APPROVED' | 'PRE-APPROVED' | 'IN_OUT';
};

type Booking = {
  id: string;
  facility: string;
  date: string;
  time: string;
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function SocietyDashboard() {
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);

  // Maintenance dues states
  const [duesAmount, setDuesAmount] = useState(2500);
  const [duesStatus, setDuesStatus] = useState<'Overdue' | 'Paid'>('Overdue');
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Active Service Modal states
  const [activeModal, setActiveModal] = useState<'COMPLAINT' | 'VISITOR' | 'FACILITY' | null>(null);

  // Complaints state
  const [complaints, setComplaints] = useState<Complaint[]>([
    { id: '1', title: 'Lift B not working since morning', category: 'Common Area', status: 'PENDING', date: '29 Jun' },
    { id: '2', title: 'Low pressure water supply in washrooms', category: 'Plumbing', status: 'IN PROGRESS', date: '28 Jun' }
  ]);
  const [complaintTitle, setComplaintTitle] = useState('');
  const [complaintCategory, setComplaintCategory] = useState('Plumbing');

  // Visitors state
  const [visitors, setVisitors] = useState<Visitor[]>([
    { id: '1', name: 'Zomato Delivery', type: 'Delivery', time: '12:30 PM', status: 'APPROVED' },
    { id: '2', name: 'Raju Sharma (Maid)', type: 'Domestic Helper', time: '08:00 AM', status: 'IN_OUT' }
  ]);
  const [visitorName, setVisitorName] = useState('');
  const [visitorType, setVisitorType] = useState('Delivery');

  // Facility Bookings state
  const [bookings, setBookings] = useState<Booking[]>([
    { id: '1', facility: 'Tennis Court', date: '30 Jun', time: '06:00 PM - 07:00 PM' }
  ]);
  const [bookingFacility, setBookingFacility] = useState('Tennis Court');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('06:00 PM - 07:00 PM');

  // Payment triggers order creation from backend
  const handlePayClick = async () => {
    setShowPaymentGateway(true);
    try {
      const token = localStorage.getItem('lokaal_token');
      // Attempt backend order generation
      await fetch(`${API_URL}/api/razorpay/order`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount: duesAmount * 100, receipt: `rec_${Date.now()}` })
      });
    } catch (e) {
      console.warn('Backend order generation failed, proceeding with client-side Razorpay simulation.');
    }
  };

  const completePayment = () => {
    setPaymentSuccess(true);
    setTimeout(() => {
      setDuesAmount(0);
      setDuesStatus('Paid');
      setShowPaymentGateway(false);
      setPaymentSuccess(false);
    }, 1800);
  };

  // Service submit handlers
  const handleAddComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintTitle.trim()) return;
    const newComplaint: Complaint = {
      id: `C-${Math.floor(1000 + Math.random() * 9000)}`,
      title: complaintTitle,
      category: complaintCategory,
      status: 'PENDING',
      date: 'Today'
    };
    setComplaints([newComplaint, ...complaints]);
    setComplaintTitle('');
    alert('Complaint successfully filed!');
  };

  const handleAddVisitor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim()) return;
    const newVisitor: Visitor = {
      id: `V-${Date.now()}`,
      name: visitorName,
      type: visitorType,
      time: 'Pre-approved',
      status: 'PRE-APPROVED'
    };
    setVisitors([newVisitor, ...visitors]);
    setVisitorName('');
    alert('Visitor entry pre-approved successfully!');
  };

  const handleAddBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingDate) {
      alert('Please select a booking date.');
      return;
    }
    const newBooking: Booking = {
      id: `B-${Date.now()}`,
      facility: bookingFacility,
      date: bookingDate,
      time: bookingTime
    };
    setBookings([newBooking, ...bookings]);
    alert(`${bookingFacility} booked successfully!`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto w-full">
        {/* Premium Header Profile */}
        <div className="bg-white px-5 pt-6 pb-6 shadow-sm z-10 sticky top-[68px] md:rounded-b-3xl md:mx-4 md:mt-0">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center text-3xl shadow-inner border-2 border-orange-50 shrink-0">🏢</div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900">Greenwood Society</h1>
              <p className="text-[13px] md:text-[14px] font-semibold text-slate-500">
                Flat {user?.flatNumber || 'B-402'} • <span className="text-orange-500">Society Pro ✓</span>
              </p>
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
                  <h2 className="text-4xl md:text-5xl font-black tracking-tight">
                    <span className="text-lg md:text-xl text-slate-400 font-medium mr-1">₹</span>
                    {duesAmount.toLocaleString()}
                  </h2>
                </div>
                <div className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-[11px] md:text-[12px] font-black uppercase tracking-wider ${duesStatus === 'Paid' ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300' : 'bg-red-500/20 border border-red-500/50 text-red-200'}`}>
                  {duesStatus === 'Paid' ? 'Paid ✓' : 'Overdue'}
                </div>
              </div>
              
              <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-2xl p-4 md:p-5 flex items-center justify-between border border-white/10">
                <div>
                  <p className="text-[11px] md:text-[12px] text-slate-300 font-bold uppercase tracking-wider mb-0.5">Billing Cycle</p>
                  <p className="font-bold text-[14px] md:text-[16px]">June 2026</p>
                </div>
                {duesAmount > 0 && (
                  <button 
                    onClick={handlePayClick}
                    className="bg-orange-500 text-white px-6 py-2.5 md:py-3 rounded-xl text-[13px] md:text-[14px] font-bold shadow-[0_4px_15px_rgba(234,88,12,0.4)] hover:bg-orange-600 transition-all active:scale-95"
                  >
                    Pay Now
                  </button>
                )}
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
                  { name: 'File Complaint', icon: '📝', color: 'bg-red-50 text-red-600', action: () => setActiveModal('COMPLAINT') },
                  { name: 'Visitor Log', icon: '👤', color: 'bg-blue-50 text-blue-600', action: () => setActiveModal('VISITOR') },
                  { name: 'Book Facility', icon: '🎾', color: 'bg-green-50 text-green-600', action: () => setActiveModal('FACILITY') },
                  { name: 'Directory', icon: '📞', color: 'bg-purple-50 text-purple-600', action: () => navigate('/groups') }
                ].map((action, i) => (
                  <div 
                    key={i} 
                    onClick={action.action}
                    className="bg-slate-50 p-5 md:p-6 rounded-2xl border border-slate-100 flex flex-col items-center justify-center gap-3 transition-transform hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] cursor-pointer hover:bg-white"
                  >
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

      {/* --- MOCK RAZORPAY MODAL --- */}
      {showPaymentGateway && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-[#1C2039] text-white w-full max-w-sm rounded-[2.5rem] p-6 shadow-2xl relative flex flex-col items-center">
            {/* Razorpay Brand Header */}
            <div className="flex items-center gap-1.5 mb-6">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-black text-[15px]">R</div>
              <span className="font-black tracking-wide text-lg text-blue-400">Razorpay</span>
            </div>

            {paymentSuccess ? (
              <div className="py-8 flex flex-col items-center gap-4 text-center animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-3xl text-white shadow-lg shadow-emerald-500/20">✓</div>
                <h3 className="text-xl font-bold">Payment Successful</h3>
                <p className="text-sm text-slate-400">Dues updated successfully.</p>
              </div>
            ) : (
              <div className="w-full flex flex-col gap-6 text-center">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Paying To</p>
                  <h4 className="font-extrabold text-base">Greenwood Society Maintenance</h4>
                </div>
                <div className="bg-[#24294d] py-5 rounded-2xl border border-white/5 shadow-inner">
                  <p className="text-xs text-slate-400 mb-1">Total Dues Amount</p>
                  <h3 className="text-3xl font-black">₹{duesAmount.toLocaleString()}</h3>
                </div>

                <div className="flex flex-col gap-2 w-full mt-2">
                  <button 
                    onClick={completePayment}
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl transition-all shadow-md active:scale-[0.98]"
                  >
                    Simulate Payment Success
                  </button>
                  <button 
                    onClick={() => setShowPaymentGateway(false)}
                    className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-350 font-bold rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- SERVICES MODALS --- */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 max-h-[85vh] overflow-y-auto">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200"
            >
              ✕
            </button>

            {/* COMPLAINT MODAL */}
            {activeModal === 'COMPLAINT' && (
              <div className="flex flex-col gap-4">
                <h3 className="text-xl font-bold text-slate-900 border-b pb-3">📝 File a Complaint</h3>
                
                <form onSubmit={handleAddComplaint} className="flex flex-col gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Title</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. Garbage not collected in Block B"
                      value={complaintTitle}
                      onChange={(e) => setComplaintTitle(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Category</label>
                    <select 
                      value={complaintCategory}
                      onChange={(e) => setComplaintCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none"
                    >
                      <option value="Plumbing">Plumbing</option>
                      <option value="Security">Security</option>
                      <option value="Electrical">Electrical</option>
                      <option value="Common Area">Common Area</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full py-3 bg-red-600 text-white rounded-xl font-bold text-xs hover:bg-red-700 mt-2">
                    Submit Complaint
                  </button>
                </form>

                <div className="mt-4">
                  <h4 className="font-bold text-slate-900 text-xs mb-2">Complaint Status Log</h4>
                  <div className="flex flex-col gap-2.5">
                    {complaints.map(comp => (
                      <div key={comp.id} className="bg-slate-50 border p-3 rounded-xl flex justify-between items-center text-xs">
                        <div>
                          <p className="font-bold text-slate-800">{comp.title}</p>
                          <span className="text-[10px] text-slate-400">{comp.category} • {comp.id}</span>
                        </div>
                        <span className={`text-[9px] font-black px-2 py-1 rounded ${comp.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : comp.status === 'RESOLVED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                          {comp.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* VISITOR LOG MODAL */}
            {activeModal === 'VISITOR' && (
              <div className="flex flex-col gap-4">
                <h3 className="text-xl font-bold text-slate-900 border-b pb-3">👤 Visitor Logs</h3>
                
                <form onSubmit={handleAddVisitor} className="flex flex-col gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Visitor Name</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. Swiggy Courier"
                      value={visitorName}
                      onChange={(e) => setVisitorName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Visitor Category</label>
                    <select 
                      value={visitorType}
                      onChange={(e) => setVisitorType(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none"
                    >
                      <option value="Delivery">Delivery / Courier</option>
                      <option value="Guest">Personal Guest</option>
                      <option value="Domestic Helper">Maid / Driver</option>
                      <option value="Maintenance">Electrician / Plumber</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-700 mt-2">
                    Pre-Approve Visitor
                  </button>
                </form>

                <div className="mt-4">
                  <h4 className="font-bold text-slate-900 text-xs mb-2">Today's Visitors</h4>
                  <div className="flex flex-col gap-2.5">
                    {visitors.map(vis => (
                      <div key={vis.id} className="bg-slate-50 border p-3 rounded-xl flex justify-between items-center text-xs">
                        <div>
                          <p className="font-bold text-slate-800">{vis.name}</p>
                          <span className="text-[10px] text-slate-400">{vis.type} • {vis.time}</span>
                        </div>
                        <span className={`text-[9px] font-black px-2 py-1 rounded ${vis.status === 'PRE-APPROVED' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                          {vis.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* FACILITY BOOKING MODAL */}
            {activeModal === 'FACILITY' && (
              <div className="flex flex-col gap-4">
                <h3 className="text-xl font-bold text-slate-900 border-b pb-3">🎾 Facility Booking</h3>
                
                <form onSubmit={handleAddBooking} className="flex flex-col gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Select Facility</label>
                    <select 
                      value={bookingFacility}
                      onChange={(e) => setBookingFacility(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none"
                    >
                      <option value="Tennis Court">Tennis Court</option>
                      <option value="Clubhouse Hall">Clubhouse Hall</option>
                      <option value="Swimming Pool Lane">Swimming Pool Lane</option>
                      <option value="Mini Theater">Mini Theater</option>
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Date</label>
                      <input 
                        type="date" 
                        required
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Time Slot</label>
                      <select 
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none"
                      >
                        <option value="06:00 AM - 07:00 AM">06:00 AM - 07:00 AM</option>
                        <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
                        <option value="04:00 PM - 05:00 PM">04:00 PM - 05:00 PM</option>
                        <option value="06:00 PM - 07:00 PM">06:00 PM - 07:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="w-full py-3 bg-green-600 text-white rounded-xl font-bold text-xs hover:bg-green-700 mt-2">
                    Confirm Reservation
                  </button>
                </form>

                <div className="mt-4">
                  <h4 className="font-bold text-slate-900 text-xs mb-2">My Bookings</h4>
                  <div className="flex flex-col gap-2.5">
                    {bookings.map(book => (
                      <div key={book.id} className="bg-slate-50 border p-3 rounded-xl flex justify-between items-center text-xs">
                        <div>
                          <p className="font-bold text-slate-800">{book.facility}</p>
                          <span className="text-[10px] text-slate-400">Slot: {book.time}</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-500">
                          {book.date}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
