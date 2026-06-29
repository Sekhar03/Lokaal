import { create } from 'zustand';

export type Comment = {
  id: string;
  authorName: string;
  authorAvatar: string | null;
  content: string;
  createdAt: string;
};

export type Post = {
  id: string;
  type: string;
  content: string;
  author: { name: string; avatar: string | null };
  createdAt: string;
  likesCount: number;
  image?: string;
  location?: string;
  hasLiked?: boolean;
  comments: Comment[];
};

export type Story = {
  id: string;
  name: string;
  avatar: string | null;
  image?: string;
  text?: string;
  gradient?: string;
  createdAt: string;
};

interface FeedState {
  posts: Post[];
  stories: Story[];
  addPost: (post: Omit<Post, 'id' | 'createdAt' | 'likesCount' | 'hasLiked' | 'comments'> & { id?: string }) => void;
  likePost: (id: string) => void;
  addComment: (postId: string, commentContent: string, authorName: string, authorAvatar: string | null) => void;
  addStory: (story: Omit<Story, 'id' | 'createdAt'>) => void;
}

export const useFeedStore = create<FeedState>((set) => ({
  posts: [
    {
      id: '1',
      type: 'ALERT',
      content: 'Water supply will be disrupted tomorrow from 10 AM to 4 PM in Sector 4 due to pipeline maintenance. Please store water accordingly.',
      author: { name: 'Ward 4 RWA', avatar: 'https://i.pravatar.cc/150?img=11' },
      createdAt: new Date().toISOString(),
      likesCount: 12,
      location: 'Sector 4 Main',
      comments: [
        {
          id: 'c1',
          authorName: 'Ravi Verma',
          authorAvatar: 'https://i.pravatar.cc/150?img=12',
          content: 'Thanks for the timely update!',
          createdAt: new Date(Date.now() - 1800000).toISOString()
        }
      ]
    },
    {
      id: '2',
      type: 'ANNOUNCEMENT',
      content: 'Just opened a new street food stall near the community park! We are serving hot samosas and jalebis. First 50 customers get a free chai! ☕',
      author: { name: 'Ramesh Chaat Bhandar', avatar: 'https://i.pravatar.cc/150?img=15' },
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      likesCount: 145,
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800',
      location: 'Community Park Gate',
      comments: []
    },
    {
      id: '3',
      type: 'LOST & FOUND',
      content: 'Lost a set of house keys with a blue Honda keychain near the grocery market yesterday evening. Please DM if found!',
      author: { name: 'Anjali Gupta', avatar: 'https://i.pravatar.cc/150?img=5' },
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      likesCount: 24,
      location: 'Main Market',
      comments: []
    }
  ],
  stories: [
    { id: '1', name: 'Rahul', avatar: 'https://i.pravatar.cc/150?img=30', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800', createdAt: new Date().toISOString() },
    { id: '2', name: 'Priya', avatar: 'https://i.pravatar.cc/150?img=32', image: 'https://images.unsplash.com/photo-1542224566-6e85f2e6772f?auto=format&fit=crop&q=80&w=800', createdAt: new Date().toISOString() },
    { id: '3', name: 'Amit', avatar: 'https://i.pravatar.cc/150?img=12', image: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&q=80&w=800', createdAt: new Date().toISOString() },
    { id: '4', name: 'Sneha', avatar: 'https://i.pravatar.cc/150?img=47', image: 'https://images.unsplash.com/photo-1472214222555-d404758b1c42?auto=format&fit=crop&q=80&w=800', createdAt: new Date().toISOString() }
  ],
  addPost: (newPost) => set((state) => ({
    posts: [
      {
        ...newPost,
        id: newPost.id || `post_${Date.now()}`,
        createdAt: new Date().toISOString(),
        likesCount: 0,
        hasLiked: false,
        comments: []
      },
      ...state.posts
    ]
  })),
  likePost: (id) => set((state) => ({
    posts: state.posts.map((post) => {
      if (post.id === id) {
        const hasLiked = !post.hasLiked;
        return {
          ...post,
          hasLiked,
          likesCount: hasLiked ? post.likesCount + 1 : post.likesCount - 1
        };
      }
      return post;
    })
  })),
  addComment: (postId, commentContent, authorName, authorAvatar) => set((state) => ({
    posts: state.posts.map((post) => {
      if (post.id === postId) {
        const newComment: Comment = {
          id: `comment_${Date.now()}`,
          authorName,
          authorAvatar,
          content: commentContent,
          createdAt: new Date().toISOString()
        };
        return {
          ...post,
          comments: [...post.comments, newComment]
        };
      }
      return post;
    })
  })),
  addStory: (newStory) => set((state) => ({
    stories: [
      {
        ...newStory,
        id: `story_${Date.now()}`,
        createdAt: new Date().toISOString()
      },
      ...state.stories
    ]
  }))
}));
