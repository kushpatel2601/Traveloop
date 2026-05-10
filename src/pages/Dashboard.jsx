import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTravel } from '../store/TravelContext';
import { PlusCircle, MapPin, Calendar, ArrowRight, Heart, Share2, Compass, Map, Activity, Check, Zap, TreePine, Moon, Flame, Utensils, User as UserIcon, TrendingUp, DollarSign, Globe, ChevronRight, Users } from 'lucide-react';
import './Dashboard.css';

const DESTINATION_IMAGES = [
  { city: 'Paris', url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80', label: 'Paris, France' },
  { city: 'Tokyo', url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80', label: 'Tokyo, Japan' },
  { city: 'Bali', url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80', label: 'Bali, Indonesia' },
  { city: 'New York', url: 'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=600&q=80', label: 'New York, USA' },
];

export default function Dashboard() {
  const { state } = useTravel();
  const navigate = useNavigate();
  const { user, trips } = state;
  const [copied, setCopied] = useState(false);
  const [activeDestIdx, setActiveDestIdx] = useState(0);

  const preplanned = trips.filter(t => new Date(t.startDate) >= new Date());
  const previous = trips.filter(t => new Date(t.startDate) < new Date());
  const totalActivities = trips.reduce((s, t) => s + (t.stops || []).reduce((a, st) => a + (st.activities?.length || 0), 0), 0);
  const totalBudget = trips.reduce((sum, t) => sum + (t.stops || []).reduce((s, stop) => s + (stop.activities || []).reduce((a, act) => a + (act.cost || 0), 0), 0), 0);
  const totalStops = trips.reduce((sum, t) => sum + (t.stops?.length || 0), 0);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTagClick = (tag) => navigate(`/cities?filter=${tag}`);

  const exploreCategories = [
    { name: 'Nature', icon: <TreePine size={20} />, color: '#10b981', count: state.cities.filter(c => c.tags?.includes('Nature')).length },
    { name: 'Historical', icon: <MapPin size={20} />, color: '#f59e0b', count: state.cities.filter(c => c.tags?.includes('Historical')).length },
    { name: 'BeachVibes', icon: <Flame size={20} />, color: '#f43f5e', count: state.cities.filter(c => c.tags?.includes('BeachVibes')).length },
    { name: 'Nightlife', icon: <Moon size={20} />, color: '#a855f7', count: state.cities.filter(c => c.tags?.includes('Nightlife')).length },
    { name: 'Adventure', icon: <Zap size={20} />, color: '#6366f1', count: state.cities.filter(c => c.tags?.includes('Adventure')).length },
    { name: 'Culinary', icon: <Utensils size={20} />, color: '#06b6d4', count: state.cities.filter(c => c.tags?.includes('Culinary')).length },
    { name: 'SoloTravel', icon: <UserIcon size={20} />, color: '#ec4899', count: state.cities.filter(c => c.tags?.includes('SoloTravel')).length },
  ];

  return (
    <div className="page-container content-wrapper">
      <div className="orb orb-1" /><div className="orb orb-2" />

      {/* ── BANNER IMAGE HERO ── */}
      <section className="dash-banner animate-fade-in-up">
        <div className="banner-image-wrap">
          <img
            src={DESTINATION_IMAGES[activeDestIdx].url}
            alt={DESTINATION_IMAGES[activeDestIdx].label}
            className="banner-img"
            onError={e => { e.target.style.display = 'none'; }}
          />
          <div className="banner-overlay" />
        </div>

        <div className="banner-content">
          <div className="banner-left">
            <span className="hero-greeting">Welcome back</span>
            <h1 className="hero-name">{user?.name || 'Explorer'}</h1>
            <p className="hero-sub">Track your journeys, plan new adventures, and explore the world.</p>
            <div className="hero-actions">
              <button className="btn-primary pulse" onClick={() => navigate('/create-trip')}>
                <PlusCircle size={18} /> Plan New Trip
              </button>
              <button className="btn-glass" onClick={handleShare}>
                {copied ? <Check size={18} /> : <Share2 size={18} />}
                {copied ? 'Copied!' : 'Share'}
              </button>
            </div>
          </div>

          <div className="banner-dest-switcher">
            {DESTINATION_IMAGES.map((d, i) => (
              <button key={d.city} className={`dest-thumb ${activeDestIdx === i ? 'active' : ''}`} onClick={() => setActiveDestIdx(i)}>
                <img src={d.url} alt={d.city} onError={e => { e.target.parentElement.style.background = 'rgba(99,102,241,0.2)'; }} />
                <span>{d.city}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Location pill */}
        <div className="banner-location-pill">
          <MapPin size={14} />
          <span>{DESTINATION_IMAGES[activeDestIdx].label}</span>
        </div>
      </section>

      {/* ── STATS ROW ── */}
      <section className="stats-row stagger-children">
        <div className="stat-card">
          <div className="stat-icon-wrap" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#818cf8' }}>
            <Map size={22} />
          </div>
          <div className="stat-data">
            <span className="stat-number">{trips.length}</span>
            <span className="stat-label">Total Trips</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#34d399' }}>
            <Globe size={22} />
          </div>
          <div className="stat-data">
            <span className="stat-number">{totalStops}</span>
            <span className="stat-label">Cities Visited</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrap" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#fbbf24' }}>
            <DollarSign size={22} />
          </div>
          <div className="stat-data">
            <span className="stat-number">${totalBudget.toLocaleString()}</span>
            <span className="stat-label">Est. Budget</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrap" style={{ background: 'rgba(244, 63, 94, 0.1)', color: '#fb7185' }}>
            <TrendingUp size={22} />
          </div>
          <div className="stat-data">
            <span className="stat-number">{totalActivities}</span>
            <span className="stat-label">Activities</span>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT GRID ── */}
      <div className="dash-main-layout">
        <div className="dash-left-content">
          {/* Trips Grid */}
          <section className="dash-trip-section animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="section-header">
              <h2><Compass size={20} className="sh-icon indigo" /> My Adventures</h2>
              <button className="btn-link" onClick={() => navigate('/trips')}>View All</button>
            </div>
            <div className="trip-grid-2x2">
              {trips.length === 0 ? (
                <div className="empty-section-msg col-span-2">
                  <PlusCircle size={32} opacity={0.3} />
                  <p>No trips planned yet</p>
                  <button className="btn-primary sm" onClick={() => navigate('/create-trip')}>Plan a Trip</button>
                </div>
              ) : (
                trips.slice(0, 4).map(trip => (
                  <div key={trip.id} className="trip-square-card glass-card" onClick={() => navigate(`/trip/${trip.id}/itinerary`)}>
                    <div className="tsc-cover" style={{ background: `linear-gradient(135deg, hsl(${trip.id.charCodeAt(0) * 40}, 60%, 40%), hsl(${trip.id.charCodeAt(1) * 35}, 50%, 30%))` }}>
                      <span className="tsc-emoji">✈️</span>
                    </div>
                    <div className="tsc-info">
                      <h3>{trip.name}</h3>
                      <span>{new Date(trip.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Map Section */}
          <section className="dash-map-section animate-fade-in-up glass-card" style={{ animationDelay: '0.2s' }}>
            <div className="section-header" style={{ marginBottom: '16px' }}>
              <h2><Globe size={20} className="sh-icon indigo" /> Destination Map</h2>
            </div>
            <div className="map-container">
              <iframe
                title="World Map"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-180,-85,180,85&amp;layer=mapnik"
                style={{ width: '100%', height: '240px', border: 'none', borderRadius: '16px', opacity: 0.85 }}
                loading="lazy"
              />
            </div>
          </section>
        </div>

        <div className="dash-right-sidebar">
          {/* Profile Summary Card (Screen 4 parity) */}
          <section className="glass-card dash-profile-card animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            <div className="dpc-header" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
              <div className="dpc-avatar overflow-hidden">
                {user?.name?.[0]?.toUpperCase() || '✈️'}
              </div>
              <div className="dpc-info">
                <h3>{user?.name || 'Explorer'}</h3>
                <span>{user?.email}</span>
              </div>
              <ChevronRight size={18} className="text-muted" />
            </div>
            <div className="dpc-stats">
              <div className="dpc-stat">
                <span className="dpc-num">{trips.length}</span>
                <span className="dpc-lbl">Trips</span>
              </div>
              <div className="dpc-stat">
                <span className="dpc-num">{totalStops}</span>
                <span className="dpc-lbl">Cities</span>
              </div>
            </div>
            <button className="btn-secondary sm w-full mt-4" onClick={() => navigate('/profile')}>Manage Profile</button>
          </section>

          {/* Neighbours Trips (Screen 4 parity) */}
          <section className="glass-card dash-neighbours-section animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
            <div className="section-header">
              <h3><Users size={18} className="sh-icon violet" /> Neighbours Trips</h3>
            </div>
            <div className="d-neighbour-list">
              {state.communityPosts.slice(0, 2).map(post => (
                <div key={post.id} className="d-neighbour-card" onClick={() => navigate('/community')}>
                  <div className="d-neighbour-avatar">{post.avatar}</div>
                  <div className="d-neighbour-info">
                    <h4>{post.tripName}</h4>
                    <span>By {post.userName}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn-link sm w-full mt-2" onClick={() => navigate('/community')}>View Social Feed</button>
          </section>
        </div>
      </div>

      {/* ── EXPLORE CATEGORIES ── */}
      <section className="explore-section animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        <div className="section-header">
          <h2><Activity size={20} className="sh-icon amber" /> Explore Categories</h2>
          <button className="btn-primary sm" onClick={() => navigate('/cities')}>Explore All</button>
        </div>
        <div className="explore-categories-grid">
          {exploreCategories.map(cat => (
            <div key={cat.name} className="explore-cat-card" onClick={() => handleTagClick(cat.name)}>
              <div className="cat-icon-wrap" style={{ background: `${cat.color}15`, color: cat.color }}>
                {cat.icon}
              </div>
              <div className="cat-info">
                <span className="cat-name">{cat.name}</span>
                <span className="cat-count">{cat.count} cities</span>
              </div>
              <ArrowRight size={16} className="cat-arrow" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
