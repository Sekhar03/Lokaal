import { useState } from 'react';

export type ModalType = 'announcement' | 'sale' | 'lost' | 'event' | 'notice' | null;

interface CreateActionModalsProps {
  activeModal: ModalType;
  onClose: () => void;
}

export default function CreateActionModals({ activeModal, onClose }: CreateActionModalsProps) {
  if (!activeModal) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] trek-backdrop-enter"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-4 sm:p-6 pointer-events-none">
        <div className="bg-white w-full max-w-lg rounded-[2rem] sm:rounded-3xl shadow-2xl pointer-events-auto flex flex-col max-h-[90vh] trek-modal-enter">
          
          {/* Header */}
          <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100">
            <h2 className="text-xl font-black text-slate-900">
              {activeModal === 'announcement' && 'Make Announcement'}
              {activeModal === 'sale' && 'List for Sale'}
              {activeModal === 'lost' && 'Report Lost & Found'}
              {activeModal === 'event' && 'Host Event'}
              {activeModal === 'notice' && 'Post Society Notice'}
            </h2>
            <button 
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="p-5 sm:p-6 overflow-y-auto">
            {activeModal === 'announcement' && <CreateAnnouncementForm onClose={onClose} />}
            {activeModal === 'sale' && <CreateSaleForm onClose={onClose} />}
            {activeModal === 'lost' && <CreateLostFoundForm onClose={onClose} />}
            {activeModal === 'event' && <HostEventForm onClose={onClose} />}
            {activeModal === 'notice' && <CreateNoticeForm onClose={onClose} />}
          </div>

        </div>
      </div>
    </>
  );
}

function CreateAnnouncementForm({ onClose }: { onClose: () => void }) {
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState('Ward');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => onClose(), 300);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold shrink-0">L</div>
        <textarea 
          placeholder="What's happening in your neighborhood?"
          className="w-full bg-transparent border-none outline-none resize-none min-h-[120px] text-[15px] placeholder-slate-400"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          autoFocus
        />
      </div>
      
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Visibility Scope</label>
        <div className="flex flex-wrap gap-2">
          {['Ward', 'Block', 'Society'].map(cat => (
            <button
              type="button"
              key={cat}
              onClick={() => setVisibility(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${visibility === cat ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-2">
        <button type="button" className="text-orange-600 font-bold text-sm flex items-center gap-2 hover:bg-orange-50 px-3 py-2 rounded-xl transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
          Add Photo
        </button>
        <button 
          type="submit" 
          disabled={!content.trim()}
          className="bg-orange-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-700 transition-colors shadow-md"
        >
          Post
        </button>
      </div>
    </form>
  );
}

function CreateSaleForm({ onClose }: { onClose: () => void }) {
  const [isFree, setIsFree] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => onClose(), 300);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Item Title</label>
        <input type="text" required placeholder="e.g. Wooden Dining Table" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Price (₹)</label>
          <input type="number" disabled={isFree} required={!isFree} placeholder={isFree ? "Free" : "e.g. 5000"} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all disabled:opacity-50" />
          <label className="flex items-center gap-2 mt-2 text-sm text-slate-600 cursor-pointer">
            <input type="checkbox" checked={isFree} onChange={(e) => setIsFree(e.target.checked)} className="rounded text-orange-600 focus:ring-orange-500" />
            Give for Free
          </label>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Condition</label>
          <select required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-slate-700 appearance-none">
            <option value="New">New</option>
            <option value="Like New">Like New</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Category</label>
        <select required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-slate-700 appearance-none">
          <option value="Electronics">Electronics</option>
          <option value="Furniture">Furniture</option>
          <option value="Books">Books</option>
          <option value="Vehicles">Vehicles</option>
          <option value="Services">Services</option>
          <option value="Clothing">Clothing</option>
        </select>
      </div>
      <button type="button" className="w-full border-2 border-dashed border-slate-200 rounded-xl py-6 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-orange-300 transition-colors mt-2">
        <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
        <span className="text-xs font-bold">Upload Photos (Max 6)</span>
      </button>
      <button type="submit" className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold mt-2 shadow-md hover:bg-orange-600 transition-colors">
        List Item
      </button>
    </form>
  );
}

function CreateLostFoundForm({ onClose }: { onClose: () => void }) {
  const [type, setType] = useState<'Lost' | 'Found'>('Lost');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => onClose(), 300);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex bg-slate-100 p-1 rounded-xl">
        <button type="button" onClick={() => setType('Lost')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${type === 'Lost' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-500'}`}>Lost Something</button>
        <button type="button" onClick={() => setType('Found')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${type === 'Found' ? 'bg-white text-green-600 shadow-sm' : 'text-slate-500'}`}>Found Something</button>
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Title</label>
        <input type="text" required placeholder={type === 'Lost' ? "e.g. Lost Brown Wallet" : "e.g. Found Set of Keys"} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all" />
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</label>
        <textarea required placeholder="Add identifying details..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all min-h-[80px]" />
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Last Seen / Found Location</label>
        <input type="text" required placeholder="e.g. Near Central Park Gate 2" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all" />
      </div>
      <button type="button" className="w-full border-2 border-dashed border-slate-200 rounded-xl py-6 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-orange-300 transition-colors mt-2">
        <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
        <span className="text-xs font-bold">Upload Photo (Optional)</span>
      </button>
      <button type="submit" className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold mt-2 shadow-md hover:bg-orange-600 transition-colors">
        Post {type} Alert
      </button>
    </form>
  );
}

function HostEventForm({ onClose }: { onClose: () => void }) {
  const [isFree, setIsFree] = useState(true);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => onClose(), 300);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Event Title</label>
        <input type="text" required placeholder="e.g. Sunday Ward Cleanup" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all" />
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Venue / Location</label>
        <input type="text" required placeholder="e.g. Community Hall" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Date</label>
          <input type="date" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-slate-700" />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Time</label>
          <input type="time" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-slate-700" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Price (₹)</label>
          <input type="number" disabled={isFree} required={!isFree} placeholder={isFree ? "Free Event" : "e.g. 500"} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all disabled:opacity-50" />
          <label className="flex items-center gap-2 mt-2 text-sm text-slate-600 cursor-pointer">
            <input type="checkbox" checked={isFree} onChange={(e) => setIsFree(e.target.checked)} className="rounded text-orange-600 focus:ring-orange-500" />
            Free Event
          </label>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Max Capacity</label>
          <input type="number" placeholder="e.g. 50" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all" />
        </div>
      </div>
      <button type="submit" className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold mt-4 shadow-md hover:bg-orange-600 transition-colors">
        Create Event
      </button>
    </form>
  );
}

function CreateNoticeForm({ onClose }: { onClose: () => void }) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => onClose(), 300);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="bg-slate-100 p-4 rounded-xl text-sm text-slate-600 flex items-start gap-3">
        <svg className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <p>Notices are pinned to the top of the feed for all society residents. Only Society Admins can post notices.</p>
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Notice Title</label>
        <input type="text" required placeholder="e.g. Scheduled Power Outage" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all" />
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Details</label>
        <textarea required placeholder="Enter the full notice details here..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all min-h-[120px]" />
      </div>
      <button type="button" className="w-full border-2 border-dashed border-slate-200 rounded-xl py-6 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-orange-300 transition-colors mt-2">
        <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
        <span className="text-xs font-bold">Attach PDF (Optional)</span>
      </button>
      <button type="submit" className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold mt-2 shadow-md hover:bg-orange-600 transition-colors">
        Post Notice
      </button>
    </form>
  );
}
