import { useState, useEffect } from 'react';

type Post = {
  id: string;
  type: string;
  content: string;
  author: { name: string; avatar: string | null };
  createdAt: string;
  likesCount: number;
  image?: string;
  location?: string;
};

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch from /api/feed
    setTimeout(() => {
      setPosts([
        {
          id: '1',
          type: 'ALERT',
          content: 'Water supply will be disrupted tomorrow from 10 AM to 4 PM in Sector 4 due to pipeline maintenance. Please store water accordingly.',
          author: { name: 'Ward 4 RWA', avatar: 'https://i.pravatar.cc/150?img=11' },
          createdAt: new Date().toISOString(),
          likesCount: 12,
          location: 'Sector 4 Main'
        },
        {
          id: '2',
          type: 'ANNOUNCEMENT',
          content: 'Just opened a new street food stall near the community park! We are serving hot samosas and jalebis. First 50 customers get a free chai! ☕',
          author: { name: 'Ramesh Chaat Bhandar', avatar: 'https://i.pravatar.cc/150?img=15' },
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          likesCount: 145,
          image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800',
          location: 'Community Park Gate'
        },
        {
          id: '3',
          type: 'LOST & FOUND',
          content: 'Lost a set of house keys with a blue Honda keychain near the grocery market yesterday evening. Please DM if found!',
          author: { name: 'Anjali Gupta', avatar: 'https://i.pravatar.cc/150?img=5' },
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          likesCount: 24,
          location: 'Main Market'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="flex flex-col pb-20 md:pb-8 w-full max-w-2xl mx-auto">
      {/* Story Row */}
      <div className="flex gap-4 p-5 overflow-x-auto no-scrollbar bg-white border-b md:border md:rounded-2xl md:mt-6 border-slate-100 shadow-sm md:mx-4">
        <div className="flex flex-col items-center gap-1.5 min-w-[72px]">
          <div className="w-16 h-16 rounded-full border-2 border-dashed border-orange-300 flex items-center justify-center text-orange-500 text-2xl hover:bg-orange-50 cursor-pointer transition-colors">
            +
          </div>
          <span className="text-xs font-semibold text-slate-600">Add Story</span>
        </div>
        {[
          { name: 'Rahul', img: 30 },
          { name: 'Priya', img: 32 },
          { name: 'Amit', img: 12 },
          { name: 'Sneha', img: 47 }
        ].map((story, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5 min-w-[72px] cursor-pointer group">
            <div className="w-16 h-16 rounded-full p-[3px] bg-gradient-to-tr from-orange-400 via-red-500 to-pink-500 group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-full bg-white border-[3px] border-white overflow-hidden">
                <img src={`https://i.pravatar.cc/150?img=${story.img}`} alt="avatar" className="w-full h-full object-cover" />
              </div>
            </div>
            <span className="text-xs font-semibold text-slate-700">{story.name}</span>
          </div>
        ))}
      </div>

      {/* Feed Posts */}
      <div className="flex flex-col gap-6 p-4">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-slate-200 rounded w-1/3 mb-2.5"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/4"></div>
                </div>
              </div>
              <div className="h-24 bg-slate-200 rounded-xl mb-3"></div>
            </div>
          ))
        ) : (
          posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>
    </div>
  );
}

function PostCard({ post }: { post: Post }) {
  const isAlert = post.type === 'ALERT';
  
  return (
    <div className={`p-5 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border transition-shadow hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] ${isAlert ? 'bg-red-50/50 border-red-100' : 'bg-white border-slate-100'}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-sm">
            {post.author.avatar ? (
              <img src={post.author.avatar} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-lg">
                {post.author.name[0]}
              </div>
            )}
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-[15px]">{post.author.name}</h4>
            <div className="flex items-center gap-1 mt-0.5">
              {post.location && (
                <span className="text-[11px] font-medium text-orange-600 flex items-center gap-0.5">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/></svg>
                  {post.location}
                </span>
              )}
              {post.location && <span className="text-slate-300">•</span>}
              <span className="text-[11px] text-slate-500 font-medium">2h ago</span>
            </div>
          </div>
        </div>
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wide ${isAlert ? 'bg-red-100 text-red-700' : post.type === 'LOST & FOUND' ? 'bg-amber-100 text-amber-700' : post.type === 'FOR SALE' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
          {post.type}
        </span>
      </div>
      
      <p className="text-[15px] leading-relaxed text-slate-700 mb-4">{post.content}</p>
      
      {post.image && (
        <div className="mb-4 -mx-1 rounded-2xl overflow-hidden shadow-sm">
          <img src={post.image} alt="Post content" className="w-full h-auto object-cover max-h-[400px]" />
        </div>
      )}
      
      <div className="flex items-center gap-6 pt-3.5 border-t border-slate-100">
        <button className="flex items-center gap-1.5 text-slate-500 hover:text-orange-600 transition-colors group">
          <div className="p-1.5 rounded-full group-hover:bg-orange-50">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
          </div>
          <span className="text-[13px] font-semibold">{post.likesCount}</span>
        </button>
        <button className="flex items-center gap-1.5 text-slate-500 hover:text-blue-600 transition-colors group">
          <div className="p-1.5 rounded-full group-hover:bg-blue-50">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
          </div>
          <span className="text-[13px] font-semibold">Comment</span>
        </button>
        <button className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 ml-auto transition-colors group">
          <div className="p-1.5 rounded-full group-hover:bg-slate-100">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
          </div>
        </button>
      </div>
    </div>
  );
}
