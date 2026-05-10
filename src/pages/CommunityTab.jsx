import { useState } from 'react';
import { useTravel } from '../store/TravelContext';
import { Share2, Heart, MessageSquare, Compass, MapPin, Search, Filter, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CommunityTab() {
  const { state, dispatch } = useTravel();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filteredPosts = state.communityPosts.filter(p => {
    const matchesSearch = p.tripName.toLowerCase().includes(search.toLowerCase()) || 
                         p.userName.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || p.cities.includes(filter);
    return matchesSearch && matchesFilter;
  });

  const popularCities = [...new Set(state.communityPosts.flatMap(p => p.cities))].slice(0, 5);

  return (
    <div className="page-container content-wrapper">
      <div className="orb orb-1" />
      
      <div className="page-header animate-fade-in-up">
        <div className="flex justify-between items-center w-full">
          <div>
            <h1><Globe size={28} /> Community Feed</h1>
            <p>Explore trip plans shared by fellow explorers</p>
          </div>
          <button className="btn-primary" onClick={() => navigate('/trips')}>
            <Share2 size={18} /> Share Your Trip
          </button>
        </div>
      </div>

      <div className="community-layout">
        <div className="feed-col">
          <div className="feed-filters mb-6 flex gap-4">
            <div className="search-pill flex-1">
              <Search size={18} />
              <input 
                type="text" 
                placeholder="Search trips or travelers..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select className="filter-select" value={filter} onChange={e => setFilter(e.target.value)}>
              <option value="All">All Regions</option>
              {popularCities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="posts-list stagger-children">
            {filteredPosts.map(post => (
              <div key={post.id} className="glass-card post-card animate-fade-in">
                <div className="post-header">
                  <div className="post-user">
                    <div className="post-avatar">{post.avatar}</div>
                    <div>
                      <h4 className="post-username">{post.userName}</h4>
                      <span className="post-date">{post.createdAt}</span>
                    </div>
                  </div>
                  <div className="post-tags">
                    {post.cities.map(c => <span key={c} className="post-city-badge">{c}</span>)}
                  </div>
                </div>
                
                <div className="post-content">
                  <h3 className="post-trip-name">{post.tripName}</h3>
                  <p className="post-desc">{post.description}</p>
                </div>

                <div className="post-footer">
                  <button className="post-action" onClick={() => dispatch({ type: 'LIKE_POST', payload: post.id })}>
                    <Heart size={18} /> {post.likes}
                  </button>
                  <button className="post-action">
                    <MessageSquare size={18} /> {post.comments}
                  </button>
                  <button className="btn-glass sm ml-auto">View Full Itinerary</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="trending-col">
          <section className="glass-card trending-card">
            <h3><Compass size={18} className="text-emerald" /> Trending Destinations</h3>
            <div className="trending-list">
              {state.cities.slice(0, 5).map(city => (
                <div key={city.id} className="trending-item" onClick={() => navigate('/cities')}>
                  <span className="trending-emoji">{city.image}</span>
                  <div className="trending-info">
                    <h4>{city.name}</h4>
                    <span>{city.popularity}% explorer match</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="glass-card featured-explorer-card">
            <h3>Featured Explorer</h3>
            <div className="explorer-profile">
              <div className="explorer-avatar">👨‍🚀</div>
              <h4>Alex Traveler</h4>
              <p>Top contributor with 12 shared trips</p>
              <button className="btn-secondary sm w-full mt-2">Follow</button>
            </div>
          </section>
        </div>
      </div>

      <style>{`
        .community-layout { display: grid; grid-template-columns: 1fr 320px; gap: 32px; margin-top: 32px; }
        .feed-col { display: flex; flex-direction: column; }
        .trending-col { display: flex; flex-direction: column; gap: 24px; position: sticky; top: 32px; height: fit-content; }
        
        .search-pill { background: var(--bg-glass); border: 1px solid var(--border-glass); border-radius: 30px; padding: 0 20px; display: flex; align-items: center; gap: 12px; height: 48px; }
        .search-pill input { background: none; border: none; color: white; width: 100%; outline: none; }
        .filter-select { background: var(--bg-glass); border: 1px solid var(--border-glass); border-radius: 30px; padding: 0 20px; color: white; height: 48px; outline: none; }

        .post-card { padding: 24px; margin-bottom: 24px; transition: all 0.3s; }
        .post-card:hover { transform: translateY(-4px); background: var(--bg-glass-hover); }
        .post-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
        .post-user { display: flex; gap: 12px; align-items: center; }
        .post-avatar { width: 44px; height: 44px; border-radius: 50%; background: var(--gradient-primary); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; }
        .post-username { font-size: 1rem; font-weight: 700; }
        .post-date { font-size: 0.75rem; color: var(--text-muted); }
        .post-tags { display: flex; gap: 6px; flex-wrap: wrap; }
        .post-city-badge { font-size: 0.7rem; background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.2); padding: 4px 10px; border-radius: 20px; color: var(--accent-primary); font-weight: 600; }

        .post-trip-name { font-size: 1.25rem; font-weight: 800; margin-bottom: 8px; letter-spacing: -0.5px; }
        .post-desc { color: var(--text-secondary); line-height: 1.6; margin-bottom: 20px; }

        .post-footer { display: flex; align-items: center; gap: 20px; border-top: 1px solid var(--border-glass); padding-top: 16px; }
        .post-action { background: none; border: none; color: var(--text-muted); display: flex; align-items: center; gap: 6px; cursor: pointer; transition: all 0.2s; font-weight: 600; }
        .post-action:hover { color: var(--accent-primary); }
        
        .trending-card, .featured-explorer-card { padding: 24px; }
        .trending-card h3, .featured-explorer-card h3 { font-size: 1rem; margin-bottom: 20px; font-weight: 700; }
        .trending-list { display: flex; flex-direction: column; gap: 16px; }
        .trending-item { display: flex; gap: 12px; align-items: center; cursor: pointer; padding: 8px; border-radius: 12px; transition: all 0.2s; }
        .trending-item:hover { background: rgba(255,255,255,0.05); }
        .trending-emoji { font-size: 1.5rem; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.04); border-radius: 10px; }
        .trending-info h4 { font-size: 0.9rem; font-weight: 700; }
        .trending-info span { font-size: 0.75rem; color: var(--text-muted); }

        .explorer-profile { text-align: center; }
        .explorer-avatar { font-size: 3rem; margin-bottom: 12px; }
        .explorer-profile h4 { font-size: 1.1rem; margin-bottom: 4px; }
        .explorer-profile p { font-size: 0.8rem; color: var(--text-muted); margin-bottom: 16px; }

        @media (max-width: 900px) {
          .community-layout { grid-template-columns: 1fr; }
          .trending-col { display: none; }
        }
      `}</style>
    </div>
  );
}
