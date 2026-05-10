import { useState } from 'react';
import { useTravel } from '../store/TravelContext';
import { Users, Heart, MessageSquare, Share2, Search, Filter } from 'lucide-react';

export default function CommunityTab() {
  const { state, dispatch } = useTravel();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPosts = state.communityPosts.filter(p => 
    p.tripName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container content-wrapper">
      <div className="orb orb-1" />
      <div className="page-header animate-fade-in-up">
        <h1><Users size={28} /> Community</h1>
        <p>Get inspired by fellow travelers</p>
      </div>

      <div className="flex gap-4 mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={20} />
          <input 
            type="text" 
            placeholder="Search trips or descriptions..." 
            className="w-full h-12 pl-12 rounded-full bg-glass border border-glass text-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn-secondary rounded-full h-12 px-6"><Filter size={18} /> Filter</button>
      </div>

      <div className="flex flex-col gap-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        {filteredPosts.map(post => (
          <div key={post.id} className="glass-card p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-2xl">
                {post.avatar}
              </div>
              <div>
                <h4 className="font-semibold">{post.userName}</h4>
                <span className="text-sm text-secondary">{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            
            <h3 className="text-xl font-bold mb-2 text-indigo-300">{post.tripName}</h3>
            <p className="text-secondary mb-4 leading-relaxed">{post.description}</p>
            
            <div className="flex gap-2 mb-6">
              {post.cities.map(city => (
                <span key={city} className="text-xs font-semibold bg-indigo-900/40 text-indigo-300 px-3 py-1 rounded-full border border-indigo-500/30">
                  {city}
                </span>
              ))}
            </div>
            
            <div className="flex items-center gap-6 border-t border-glass pt-4">
              <button 
                className="flex items-center gap-2 text-secondary hover:text-rose-400 transition"
                onClick={() => dispatch({ type: 'LIKE_POST', payload: post.id })}
              >
                <Heart size={18} /> <span>{post.likes}</span>
              </button>
              <button className="flex items-center gap-2 text-secondary hover:text-primary transition">
                <MessageSquare size={18} /> <span>{post.comments}</span>
              </button>
              <button className="flex items-center gap-2 text-secondary hover:text-primary transition ml-auto">
                <Share2 size={18} /> Share
              </button>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .mb-8 { margin-bottom: 32px; } .mb-6 { margin-bottom: 24px; } .mb-4 { margin-bottom: 16px; } .mb-2 { margin-bottom: 8px; }
        .p-6 { padding: 24px; } .pt-4 { padding-top: 16px; } .pl-12 { padding-left: 48px; } .px-6 { padding-left: 24px; padding-right: 24px; } .px-3 { padding-left: 12px; padding-right: 12px; } .py-1 { padding-top: 4px; padding-bottom: 4px; }
        .flex { display: flex; } .flex-col { flex-direction: column; } .flex-1 { flex: 1; }
        .items-center { align-items: center; } .justify-center { justify-content: center; }
        .gap-6 { gap: 24px; } .gap-4 { gap: 16px; } .gap-2 { gap: 8px; }
        .relative { position: relative; } .absolute { position: absolute; } .left-4 { left: 16px; } .top-1\/2 { top: 50%; } .-translate-y-1\/2 { transform: translateY(-50%); }
        .w-full { width: 100%; } .h-12 { height: 48px; } .w-12 { width: 48px; }
        .rounded-full { border-radius: 9999px; } .border { border: 1px solid var(--border-glass); } .border-t { border-top: 1px solid var(--border-glass); }
        .bg-glass { background: var(--bg-glass); } .bg-gradient-to-br { background: linear-gradient(to bottom right, #6366f1, #a855f7); } .bg-indigo-900\/40 { background: rgba(49, 46, 129, 0.4); } .border-indigo-500\/30 { border-color: rgba(99, 102, 241, 0.3); }
        .text-primary { color: var(--text-primary); } .text-secondary { color: var(--text-secondary); } .text-muted { color: var(--text-muted); } .text-indigo-300 { color: #a5b4fc; }
        .text-2xl { font-size: 1.5rem; } .text-xl { font-size: 1.25rem; } .text-sm { font-size: 0.875rem; } .text-xs { font-size: 0.75rem; }
        .font-semibold { font-weight: 600; } .font-bold { font-weight: 700; }
        .leading-relaxed { line-height: 1.625; }
        .transition { transition: all 0.2s; }
        .hover\\:text-rose-400:hover { color: #fb7185; } .hover\\:text-primary:hover { color: var(--text-primary); }
        .ml-auto { margin-left: auto; }
      `}</style>
    </div>
  );
}
