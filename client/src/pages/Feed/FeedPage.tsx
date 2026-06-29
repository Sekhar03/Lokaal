import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useFeedStore, Post, Story } from '../../store/feedStore';

export default function FeedPage() {
  const user = useAuthStore((s) => s.user);
  const { posts, stories, likePost, addComment, addStory } = useFeedStore();
  
  // Story viewer states
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [showAddStory, setShowAddStory] = useState(false);
  
  // Add story form states
  const [storyType, setStoryType] = useState<'text' | 'photo'>('text');
  const [storyText, setStoryText] = useState('');
  const [storyImageUrl, setStoryImageUrl] = useState('');
  const [selectedGradient, setSelectedGradient] = useState('from-orange-400 via-red-500 to-pink-500');

  const gradients = [
    { name: 'Sunset', value: 'from-orange-400 via-red-500 to-pink-500' },
    { name: 'Ocean', value: 'from-blue-400 via-indigo-500 to-purple-600' },
    { name: 'Aurora', value: 'from-teal-400 via-emerald-500 to-cyan-600' },
    { name: 'Carbon', value: 'from-slate-700 via-slate-800 to-slate-900' }
  ];

  // Story autoplay timer
  useEffect(() => {
    if (activeStoryIndex === null) return;
    
    const timer = setTimeout(() => {
      if (activeStoryIndex < stories.length - 1) {
        setActiveStoryIndex(activeStoryIndex + 1);
      } else {
        setActiveStoryIndex(null);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [activeStoryIndex, stories.length]);

  const handleAddStorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (storyType === 'text' && !storyText.trim()) return;
    if (storyType === 'photo' && !storyImageUrl.trim()) return;

    addStory({
      name: user?.name || 'You',
      avatar: user?.avatar || 'https://i.pravatar.cc/150?img=33',
      text: storyType === 'text' ? storyText : undefined,
      image: storyType === 'photo' ? storyImageUrl : undefined,
      gradient: storyType === 'text' ? selectedGradient : undefined
    });

    setStoryText('');
    setStoryImageUrl('');
    setShowAddStory(false);
  };

  return (
    <div className="flex flex-col pb-20 md:pb-8 w-full max-w-2xl mx-auto relative">
      {/* Story Row */}
      <div className="flex gap-4 p-5 overflow-x-auto no-scrollbar bg-white border-b md:border md:rounded-2xl md:mt-6 border-slate-100 shadow-sm md:mx-4">
        {/* Add Story Button */}
        <div className="flex flex-col items-center gap-1.5 min-w-[72px]">
          <button 
            onClick={() => setShowAddStory(true)}
            className="w-16 h-16 rounded-full border-2 border-dashed border-orange-300 flex items-center justify-center text-orange-500 text-2xl hover:bg-orange-50 cursor-pointer transition-all hover:scale-105 active:scale-95"
          >
            +
          </button>
          <span className="text-xs font-semibold text-slate-600">Add Story</span>
        </div>

        {/* Stories list */}
        {stories.map((story, idx) => (
          <div 
            key={story.id} 
            onClick={() => setActiveStoryIndex(idx)}
            className="flex flex-col items-center gap-1.5 min-w-[72px] cursor-pointer group"
          >
            <div className="w-16 h-16 rounded-full p-[3px] bg-gradient-to-tr from-orange-400 via-red-500 to-pink-500 group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-full bg-white border-[3px] border-white overflow-hidden">
                <img 
                  src={story.avatar || `https://i.pravatar.cc/150?img=${parseInt(story.id) + 10}`} 
                  alt="avatar" 
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://i.pravatar.cc/150?img=33';
                  }}
                />
              </div>
            </div>
            <span className="text-xs font-semibold text-slate-700 truncate w-16 text-center">{story.name}</span>
          </div>
        ))}
      </div>

      {/* Feed Posts */}
      <div className="flex flex-col gap-6 p-4">
        {posts.map(post => (
          <PostCard 
            key={post.id} 
            post={post} 
            onLike={() => likePost(post.id)}
            onComment={(content) => addComment(post.id, content, user?.name || 'Anonymous Resident', user?.avatar || null)}
          />
        ))}
      </div>

      {/* --- ADD STORY MODAL --- */}
      {showAddStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Add a New Story</h3>
            
            {/* Story Type Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
              <button 
                onClick={() => setStoryType('text')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${storyType === 'text' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500'}`}
              >
                Text Card
              </button>
              <button 
                onClick={() => setStoryType('photo')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${storyType === 'photo' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500'}`}
              >
                Photo Story
              </button>
            </div>

            <form onSubmit={handleAddStorySubmit} className="flex flex-col gap-4">
              {storyType === 'text' ? (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Story Text</label>
                    <textarea 
                      required
                      placeholder="Write your story message..."
                      value={storyText}
                      onChange={(e) => setStoryText(e.target.value)}
                      maxLength={100}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500 transition-colors resize-none h-24"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Background Style</label>
                    <div className="grid grid-cols-2 gap-2">
                      {gradients.map((grad) => (
                        <button
                          key={grad.name}
                          type="button"
                          onClick={() => setSelectedGradient(grad.value)}
                          className={`py-3 rounded-xl text-white font-bold text-xs bg-gradient-to-tr ${grad.value} border-2 ${selectedGradient === grad.value ? 'border-orange-600 scale-[1.02]' : 'border-transparent opacity-80'} hover:opacity-100 transition-all`}
                        >
                          {grad.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Photo URL</label>
                  <input 
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/..."
                    value={storyImageUrl}
                    onChange={(e) => setStoryImageUrl(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500 transition-colors"
                  />
                  <p className="text-[10px] text-slate-400">Paste any public web image address to preview.</p>
                </div>
              )}

              <div className="flex gap-3 mt-4 border-t pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowAddStory(false)}
                  className="flex-1 py-3 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-[#E85D2B] text-white font-bold rounded-xl hover:bg-orange-600 transition-colors text-sm"
                >
                  Post Story
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- STORY VIEW ROW OVERLAY --- */}
      {activeStoryIndex !== null && (
        <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col justify-center items-center select-none">
          {/* Progress Indicators */}
          <div className="absolute top-4 left-4 right-4 z-10 flex gap-1.5">
            {stories.map((_, idx) => (
              <div key={idx} className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-white transition-all rounded-full ${
                    idx < activeStoryIndex 
                      ? 'w-full' 
                      : idx === activeStoryIndex 
                        ? 'w-full animate-[progress_5s_linear_forwards]' 
                        : 'w-0'
                  }`}
                />
              </div>
            ))}
          </div>

          {/* Header Info */}
          <div className="absolute top-8 left-4 right-4 z-10 flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-slate-800">
                <img 
                  src={stories[activeStoryIndex].avatar || `https://i.pravatar.cc/150?img=${parseInt(stories[activeStoryIndex].id) + 10}`} 
                  alt="avatar" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <span className="font-bold text-sm shadow-sm">{stories[activeStoryIndex].name}</span>
            </div>
            <button 
              onClick={() => setActiveStoryIndex(null)}
              className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white hover:bg-black/60 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="w-full max-w-lg h-[80vh] flex items-center justify-center p-4">
            {stories[activeStoryIndex].image ? (
              <img 
                src={stories[activeStoryIndex].image} 
                alt="Story content" 
                className="w-full h-full object-contain rounded-3xl" 
              />
            ) : (
              <div className={`w-full h-full rounded-3xl bg-gradient-to-tr ${stories[activeStoryIndex].gradient || 'from-orange-400 via-red-500 to-pink-500'} flex items-center justify-center p-8 text-center text-white`}>
                <p className="text-2xl font-extrabold tracking-wide leading-relaxed drop-shadow-sm">
                  {stories[activeStoryIndex].text}
                </p>
              </div>
            )}
          </div>

          {/* Navigation Overlay Zones */}
          <div className="absolute inset-0 flex">
            {/* Left Tap Zone */}
            <div 
              onClick={() => {
                if (activeStoryIndex > 0) {
                  setActiveStoryIndex(activeStoryIndex - 1);
                } else {
                  setActiveStoryIndex(null);
                }
              }}
              className="w-1/3 h-full cursor-w-resize"
            />
            {/* Center Spacer */}
            <div className="w-1/3 h-full" />
            {/* Right Tap Zone */}
            <div 
              onClick={() => {
                if (activeStoryIndex < stories.length - 1) {
                  setActiveStoryIndex(activeStoryIndex + 1);
                } else {
                  setActiveStoryIndex(null);
                }
              }}
              className="w-1/3 h-full cursor-e-resize"
            />
          </div>
        </div>
      )}
    </div>
  );
}

interface PostCardProps {
  post: Post;
  onLike: () => void;
  onComment: (text: string) => void;
}

function PostCard({ post, onLike, onComment }: PostCardProps) {
  const isAlert = post.type === 'ALERT';
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onComment(commentText);
    setCommentText('');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Lokaal Post by ${post.author.name}`,
        text: post.content,
        url: window.location.href
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(post.content);
      alert('Post content copied to clipboard! 📋');
    }
  };

  return (
    <div className={`p-5 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] ${isAlert ? 'bg-red-50/50 border-red-100' : 'bg-white border-slate-100'}`}>
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
      
      {/* Action Buttons */}
      <div className="flex items-center gap-6 pt-3.5 border-t border-slate-100">
        {/* Like */}
        <button 
          onClick={onLike}
          className={`flex items-center gap-1.5 transition-colors group ${post.hasLiked ? 'text-orange-600 font-bold' : 'text-slate-500 hover:text-orange-600'}`}
        >
          <div className={`p-1.5 rounded-full ${post.hasLiked ? 'bg-orange-50' : 'group-hover:bg-orange-50'}`}>
            <svg 
              className="w-5 h-5" 
              fill={post.hasLiked ? 'currentColor' : 'none'} 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
          </div>
          <span className="text-[13px]">{post.likesCount}</span>
        </button>

        {/* Comment */}
        <button 
          onClick={() => setShowComments(!showComments)}
          className={`flex items-center gap-1.5 transition-colors group ${showComments ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-blue-600'}`}
        >
          <div className={`p-1.5 rounded-full ${showComments ? 'bg-blue-50' : 'group-hover:bg-blue-50'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
          </div>
          <span className="text-[13px]">{post.comments.length > 0 ? post.comments.length : 'Comment'}</span>
        </button>

        {/* Share */}
        <button 
          onClick={handleShare}
          className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 ml-auto transition-colors group"
        >
          <div className="p-1.5 rounded-full group-hover:bg-slate-100">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
          </div>
        </button>
      </div>

      {/* Comments Panel */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-slate-50 flex flex-col gap-4 animate-in slide-in-from-top-4 duration-250">
          {/* Comments List */}
          {post.comments.length > 0 ? (
            <div className="flex flex-col gap-3 max-h-48 overflow-y-auto pr-1">
              {post.comments.map((comm) => (
                <div key={comm.id} className="flex gap-2.5 items-start bg-slate-50 p-3 rounded-2xl text-[13px]">
                  <div className="w-7 h-7 rounded-full bg-slate-200 overflow-hidden shrink-0">
                    {comm.authorAvatar ? (
                      <img src={comm.authorAvatar} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-xs">
                        {comm.authorName[0]}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="font-bold text-slate-800">{comm.authorName}</span>
                      <span className="text-[10px] text-slate-400">just now</span>
                    </div>
                    <p className="text-slate-650 leading-relaxed">{comm.content}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center py-2">No comments yet. Be the first to reply!</p>
          )}

          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="flex gap-2">
            <input 
              type="text" 
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-blue-500 focus:bg-white transition-colors"
            />
            <button 
              type="submit" 
              disabled={!commentText.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 rounded-xl text-xs disabled:opacity-50 transition-colors"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
