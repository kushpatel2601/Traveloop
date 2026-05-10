import { useNavigate } from 'react-router-dom';
import { useTravel } from '../store/TravelContext';
import { PlusCircle, MapPin, Calendar, DollarSign, TrendingUp, ArrowRight, Compass, Star } from 'lucide-react';
import './Dashboard.css';

export default function Dashboard() {
  const { state } = useTravel();
  const navigate = useNavigate();
  const { user, trips, cities } = state;
  const upcoming = trips.filter(t => new Date(t.endDate) >= new Date()).slice(0, 3);
  const totalBudget = trips.reduce((sum, t) => sum + (t.stops || []).reduce((s, stop) => s + (stop.activities || []).reduce((a, act) => a + (act.cost || 0), 0), 0), 0);
  const totalStops = trips.reduce((sum, t) => sum + (t.stops?.length || 0), 0);
  const recommendedCities = cities.sort((a, b) => b.popularity - a.popularity).slice(0, 6);

  return (
    <div className="page-container content-wrapper">
      <div className="orb orb-1" /><div className="orb orb-2" />
      <section className="dash-hero animate-fade-in-up">
        <div className="dash-hero-content">
          <h1>Welcome back, {user?.name || 'Explorer'} 👋</h1>
          <p>Plan your next adventure. Your world awaits.</p>
          <button className="btn-primary" onClick={() => navigate('/create-trip')} id="dash-new-trip">
            <PlusCircle size={18} /> Plan New Trip
          </button>
        </div>
        <div className="dash-hero-visual">
          <div className="globe-emoji">🌏</div>
        </div>
      </section>

      <section className="dash-stats stagger-children">
        {[
          { icon: <MapPin size={22} />, label: 'Total Trips', value: trips.length, color: 'accent' },
          { icon: <Compass size={22} />, label: 'Destinations', value: totalStops, color: 'emerald' },
          { icon: <DollarSign size={22} />, label: 'Est. Budget', value: `$${totalBudget.toLocaleString()}`, color: 'warm' },
          { icon: <TrendingUp size={22} />, label: 'Activities', value: trips.reduce((s, t) => s + (t.stops || []).reduce((a, st) => a + (st.activities?.length || 0), 0), 0), color: 'violet' },
        ].map((s, i) => (
          <div key={i} className={`stat-card glass-card stat-${s.color}`}>
            <div className={`stat-icon bg-${s.color}`}>{s.icon}</div>
            <div className="stat-info"><span className="stat-value">{s.value}</span><span className="stat-label">{s.label}</span></div>
          </div>
        ))}
      </section>

      {upcoming.length > 0 && (
        <section className="dash-section animate-fade-in-up">
          <div className="section-header">
            <h2><Calendar size={22} /> Upcoming Trips</h2>
            <button className="btn-secondary" onClick={() => navigate('/trips')}>View All <ArrowRight size={16} /></button>
          </div>
          <div className="trip-cards-grid">
            {upcoming.map(trip => (
              <div key={trip.id} className="trip-card glass-card" onClick={() => navigate(`/trip/${trip.id}/itinerary`)}>
                <div className="trip-card-cover" style={{ background: `linear-gradient(135deg, hsl(${trip.id.charCodeAt(0) * 30}, 70%, 40%), hsl(${trip.id.charCodeAt(1) * 25}, 60%, 50%))` }}>
                  <span className="trip-card-emoji">✈️</span>
                </div>
                <div className="trip-card-body">
                  <h3>{trip.name}</h3>
                  <div className="trip-card-meta">
                    <span><Calendar size={14} /> {new Date(trip.startDate).toLocaleDateString('en', { month: 'short', day: 'numeric' })} - {new Date(trip.endDate).toLocaleDateString('en', { month: 'short', day: 'numeric' })}</span>
                    <span><MapPin size={14} /> {trip.stops?.length || 0} stops</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="dash-section animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="section-header">
          <h2><Star size={22} /> Recommended Destinations</h2>
          <button className="btn-secondary" onClick={() => navigate('/cities')}>Explore All <ArrowRight size={16} /></button>
        </div>
        <div className="city-cards-grid">
          {recommendedCities.map(city => (
            <div key={city.id} className="city-card glass-card" onClick={() => navigate('/cities')}>
              <div className="city-card-emoji">{city.image}</div>
              <div className="city-card-info">
                <h4>{city.name}</h4>
                <span className="city-country">{city.country}</span>
                <div className="city-cost">{'$'.repeat(city.costIndex)}<span className="cost-empty">{'$'.repeat(5 - city.costIndex)}</span></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
