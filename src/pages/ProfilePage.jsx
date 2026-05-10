import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTravel } from '../store/TravelContext';
import { User, MapPin, Calendar, Globe, Edit3, Camera, Star, TrendingUp, Award, ArrowRight, Plane, Clock, CheckCircle } from 'lucide-react';

export default function ProfilePage() {
  const { state, dispatch } = useTravel();
  const navigate = useNavigate();
  const { user, trips, communityPosts } = state;
  const [editMode, setEditMode] = useState(false);
  const [bio, setBio] = useState(user?.bio || 'Adventure seeker. World explorer. Collecting moments, not things. ✈️');
  const [tempBio, setTempBio] = useState(bio);

  const totalStops = trips.reduce((s, t) => s + (t.stops?.length || 0), 0);
  const totalActivities = trips.reduce((s, t) => s + (t.stops || []).reduce((a, st) => a + (st.activities?.length || 0), 0), 0);
  const totalDays = trips.reduce((s, t) => {
    const start = new Date(t.startDate);
    const end = new Date(t.endDate);
    return s + (isNaN(end - start) ? 0 : Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1);
  }, 0);
  const myPosts = communityPosts.filter(p => p.userId === 'me' || p.userName === user?.name);
  const upcomingTrips = trips.filter(t => new Date(t.startDate) >= new Date());
  const pastTrips = trips.filter(t => new Date(t.startDate) < new Date());

  const neighborTrips = communityPosts.slice(0, 3);

  const handleSave = () => {
    setBio(tempBio);
    dispatch({ type: 'UPDATE_USER', payload: { ...user, bio: tempBio } });
    setEditMode(false);
  };

  const achievements = [
    { icon: '🌍', label: 'World Traveler', desc: `${totalStops} cities visited`, unlocked: totalStops >= 5 },
    { icon: '🎯', label: 'Planner', desc: `${trips.length} trips created`, unlocked: trips.length >= 2 },
    { icon: '⚡', label: 'Explorer', desc: `${totalActivities} activities done`, unlocked: totalActivities >= 10 },
    { icon: '📅', label: 'Wanderer', desc: `${totalDays} days traveled`, unlocked: totalDays >= 7 },
  ];

  return (
    <div className="page-container content-wrapper">
      <div className="orb orb-1" /><div className="orb orb-2" />

      {/* Profile Header Card */}
      <section className="profile-hero glass-card animate-fade-in-up">
        <div className="profile-banner">
          <div className="profile-banner-gradient" />
          <div className="profile-banner-icons">
            {['✈️','🗺️','🏔️','🌊','🏝️'].map((e,i) => (
              <span key={i} className="banner-float-icon" style={{ animationDelay: `${i * 0.4}s` }}>{e}</span>
            ))}
          </div>
        </div>

        <div className="profile-info-row">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar-lg">{user?.avatar || user?.name?.[0]?.toUpperCase() || '✈️'}</div>
            <button className="profile-avatar-edit"><Camera size={14} /></button>
          </div>
          <div className="profile-details">
            <div className="profile-name-row">
              <h1 className="profile-username">{user?.name || 'Explorer'}</h1>
              <button className="btn-secondary sm" onClick={() => setEditMode(!editMode)}>
                <Edit3 size={14} /> {editMode ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
            <span className="profile-email">{user?.email}</span>
            {editMode ? (
              <div className="profile-bio-edit">
                <textarea className="bio-textarea" value={tempBio} onChange={e => setTempBio(e.target.value)} rows={2} />
                <button className="btn-primary sm" onClick={handleSave}>Save</button>
              </div>
            ) : (
              <p className="profile-bio">{bio}</p>
            )}
            <div className="profile-join-badge">
              <Calendar size={13} />
              <span>Joined {user?.joinedAt ? new Date(user.joinedAt).toLocaleDateString('en', { month: 'long', year: 'numeric' }) : 'recently'}</span>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="profile-stats-bar">
          <div className="pstat">
            <span className="pstat-num">{trips.length}</span>
            <span className="pstat-lbl">Trips</span>
          </div>
          <div className="pstat-divider" />
          <div className="pstat">
            <span className="pstat-num">{totalStops}</span>
            <span className="pstat-lbl">Cities</span>
          </div>
          <div className="pstat-divider" />
          <div className="pstat">
            <span className="pstat-num">{totalDays}</span>
            <span className="pstat-lbl">Days</span>
          </div>
          <div className="pstat-divider" />
          <div className="pstat">
            <span className="pstat-num">{totalActivities}</span>
            <span className="pstat-lbl">Activities</span>
          </div>
        </div>
      </section>

      <div className="profile-main-grid">
        {/* Left column */}
        <div className="profile-left-col">
          {/* Achievements */}
          <section className="glass-card profile-section animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="section-header">
              <h2><Award size={18} style={{ color: '#fbbf24' }} /> Achievements</h2>
            </div>
            <div className="achievements-grid">
              {achievements.map(a => (
                <div key={a.label} className={`achievement-card ${a.unlocked ? 'unlocked' : 'locked'}`}>
                  <span className="ach-icon">{a.icon}</span>
                  <span className="ach-label">{a.label}</span>
                  <span className="ach-desc">{a.desc}</span>
                  {!a.unlocked && <span className="ach-lock">🔒</span>}
                </div>
              ))}
            </div>
          </section>

          {/* Neighbours Trips */}
          <section className="glass-card profile-section animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="section-header">
              <h2><Globe size={18} style={{ color: '#34d399' }} /> Neighbours Trips</h2>
              <button className="btn-link" onClick={() => navigate('/community')}>See All</button>
            </div>
            <div className="neighbour-list">
              {neighborTrips.map(post => (
                <div key={post.id} className="neighbour-card">
                  <div className="neighbour-avatar">{post.avatar}</div>
                  <div className="neighbour-info">
                    <h4>{post.tripName}</h4>
                    <span>{post.userName} · {post.cities.join(', ')}</span>
                  </div>
                  <div className="neighbour-meta">
                    <span className="neighbour-likes">❤️ {post.likes}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right column */}
        <div className="profile-right-col">
          {/* Upcoming Trips */}
          {upcomingTrips.length > 0 && (
            <section className="glass-card profile-section animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
              <div className="section-header">
                <h2><Plane size={18} style={{ color: '#818cf8' }} /> Upcoming Trips</h2>
                <button className="btn-link" onClick={() => navigate('/trips')}>View All</button>
              </div>
              <div className="profile-trips-list">
                {upcomingTrips.slice(0,3).map(trip => (
                  <div key={trip.id} className="profile-trip-row" onClick={() => navigate(`/trip/${trip.id}/itinerary`)}>
                    <div className="ptr-emoji">🏔️</div>
                    <div className="ptr-info">
                      <h4>{trip.name}</h4>
                      <span><Calendar size={12} /> {new Date(trip.startDate).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="ptr-meta">
                      <span className="badge-emerald">{trip.stops?.length || 0} stops</span>
                      <ArrowRight size={16} className="arrow-icon" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Previous Trips Timeline */}
          <section className="glass-card profile-section animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
            <div className="section-header">
              <h2><TrendingUp size={18} style={{ color: '#a78bfa' }} /> Travel History</h2>
              <button className="btn-link" onClick={() => navigate('/trips')}>View All</button>
            </div>
            {pastTrips.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                <MapPin size={32} style={{ opacity: 0.3, margin: '0 auto 12px' }} />
                <p>Completed trips appear here</p>
              </div>
            ) : (
              <div className="travel-timeline">
                {pastTrips.map((trip, i) => (
                  <div key={trip.id} className="timeline-entry" onClick={() => navigate(`/trip/${trip.id}/itinerary`)}>
                    <div className="te-marker">
                      <div className="te-dot" />
                      {i < pastTrips.length - 1 && <div className="te-line" />}
                    </div>
                    <div className="te-card">
                      <div className="te-header">
                        <h4>{trip.name}</h4>
                        <span className="badge badge-muted">Completed</span>
                      </div>
                      <div className="te-meta">
                        <span><Calendar size={12} /> {new Date(trip.startDate).toLocaleDateString('en', { month: 'short', year: 'numeric' })}</span>
                        <span><MapPin size={12} /> {trip.stops?.length || 0} cities</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      <style>{`
        .profile-hero { padding: 0; overflow: hidden; margin-bottom: 28px; }
        .profile-banner { height: 140px; position: relative; overflow: hidden; }
        .profile-banner-gradient { position: absolute; inset: 0; background: linear-gradient(135deg, #4f46e5, #7c3aed, #0891b2); opacity: 0.8; }
        .profile-banner-icons { position: absolute; inset: 0; display: flex; align-items: center; justify-content: space-around; pointer-events: none; }
        .banner-float-icon { font-size: 2rem; opacity: 0.3; animation: float 3s ease-in-out infinite; }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        
        .profile-info-row { padding: 0 32px 24px; display: flex; gap: 24px; align-items: flex-start; margin-top: -40px; }
        .profile-avatar-wrap { position: relative; flex-shrink: 0; }
        .profile-avatar-lg { width: 90px; height: 90px; border-radius: 50%; background: var(--gradient-primary); border: 4px solid var(--bg-secondary); display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: 800; }
        .profile-avatar-edit { position: absolute; bottom: 0; right: 0; width: 28px; height: 28px; border-radius: 50%; background: var(--accent-primary); border: 2px solid var(--bg-secondary); display: flex; align-items: center; justify-content: center; cursor: pointer; color: white; }
        
        .profile-details { flex: 1; padding-top: 44px; }
        .profile-name-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 4px; }
        .profile-username { font-size: 1.6rem; font-weight: 800; }
        .profile-email { font-size: 0.85rem; color: var(--text-muted); display: block; margin-bottom: 8px; }
        .profile-bio { color: var(--text-secondary); font-size: 0.9rem; line-height: 1.5; margin-bottom: 10px; }
        .profile-bio-edit { display: flex; flex-direction: column; gap: 8px; margin-bottom: 10px; }
        .bio-textarea { background: var(--bg-glass); border: 1px solid var(--border-glass); color: var(--text-primary); border-radius: var(--radius-md); padding: 10px; font-size: 0.9rem; resize: none; font-family: var(--font-body); }
        .profile-join-badge { display: inline-flex; align-items: center; gap: 6px; font-size: 0.78rem; color: var(--text-muted); background: rgba(255,255,255,0.04); padding: 4px 10px; border-radius: 20px; border: 1px solid var(--border-glass); }
        
        .profile-stats-bar { display: flex; align-items: center; justify-content: center; padding: 20px; border-top: 1px solid var(--border-glass); gap: 0; }
        .pstat { flex: 1; text-align: center; }
        .pstat-num { display: block; font-size: 1.6rem; font-weight: 800; letter-spacing: -0.5px; }
        .pstat-lbl { font-size: 0.78rem; color: var(--text-muted); font-weight: 500; }
        .pstat-divider { width: 1px; height: 40px; background: var(--border-glass); }

        .profile-main-grid { display: grid; grid-template-columns: 1fr 1.4fr; gap: 28px; }
        .profile-left-col, .profile-right-col { display: flex; flex-direction: column; gap: 28px; }
        .profile-section { padding: 24px; }

        .achievements-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 16px; }
        .achievement-card { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 16px 12px; border-radius: 16px; border: 1px solid var(--border-glass); text-align: center; position: relative; transition: all 0.2s; cursor: default; }
        .achievement-card.unlocked { background: rgba(99,102,241,0.06); border-color: rgba(99,102,241,0.2); }
        .achievement-card.locked { opacity: 0.45; }
        .achievement-card.unlocked:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(99,102,241,0.15); }
        .ach-icon { font-size: 1.8rem; }
        .ach-label { font-size: 0.8rem; font-weight: 700; }
        .ach-desc { font-size: 0.7rem; color: var(--text-muted); }
        .ach-lock { position: absolute; top: 8px; right: 8px; font-size: 0.7rem; }

        .neighbour-list { display: flex; flex-direction: column; gap: 12px; margin-top: 16px; }
        .neighbour-card { display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: rgba(255,255,255,0.02); border-radius: 14px; border: 1px solid var(--border-glass); cursor: pointer; transition: all 0.2s; }
        .neighbour-card:hover { background: rgba(255,255,255,0.05); }
        .neighbour-avatar { font-size: 1.6rem; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: rgba(99,102,241,0.1); border-radius: 50%; flex-shrink: 0; }
        .neighbour-info { flex: 1; }
        .neighbour-info h4 { font-size: 0.9rem; font-weight: 700; margin-bottom: 2px; }
        .neighbour-info span { font-size: 0.75rem; color: var(--text-muted); }
        .neighbour-likes { font-size: 0.8rem; color: var(--text-muted); }

        .profile-trips-list { display: flex; flex-direction: column; gap: 10px; margin-top: 16px; }
        .profile-trip-row { display: flex; align-items: center; gap: 14px; padding: 14px 18px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.04); border-radius: 14px; cursor: pointer; transition: all 0.2s; }
        .profile-trip-row:hover { background: rgba(255,255,255,0.05); border-color: rgba(99,102,241,0.2); transform: translateX(4px); }
        .ptr-emoji { font-size: 1.4rem; background: rgba(99,102,241,0.08); width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .ptr-info { flex: 1; }
        .ptr-info h4 { font-size: 0.95rem; font-weight: 700; margin-bottom: 3px; }
        .ptr-info span { font-size: 0.78rem; color: var(--text-muted); display: flex; align-items: center; gap: 4px; }
        .ptr-meta { display: flex; align-items: center; gap: 10px; }

        .travel-timeline { display: flex; flex-direction: column; gap: 0; margin-top: 16px; }
        .timeline-entry { display: flex; gap: 16px; cursor: pointer; }
        .te-marker { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; }
        .te-dot { width: 12px; height: 12px; border-radius: 50%; background: var(--accent-primary); border: 2px solid rgba(99,102,241,0.3); flex-shrink: 0; margin-top: 6px; }
        .te-line { width: 2px; flex: 1; background: rgba(255,255,255,0.05); min-height: 24px; margin-bottom: -4px; }
        .te-card { flex: 1; padding: 12px 16px; background: rgba(255,255,255,0.02); border-radius: 12px; border: 1px solid var(--border-glass); margin-bottom: 12px; transition: all 0.2s; }
        .te-card:hover { background: rgba(255,255,255,0.05); }
        .te-header { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 6px; }
        .te-header h4 { font-size: 0.9rem; font-weight: 700; }
        .te-meta { display: flex; gap: 16px; font-size: 0.75rem; color: var(--text-muted); }
        .te-meta span { display: flex; align-items: center; gap: 4px; }

        .btn-secondary.sm { padding: 7px 14px; font-size: 0.82rem; border-radius: 10px; }
        .btn-primary.sm { padding: 8px 16px; font-size: 0.82rem; }

        @media (max-width: 900px) { .profile-main-grid { grid-template-columns: 1fr; } }
        @media (max-width: 640px) { .profile-info-row { flex-direction: column; } .profile-details { padding-top: 0; } }
      `}</style>
    </div>
  );
}
