import { useNavigate } from 'react-router-dom';
import { useTravel } from '../store/TravelContext';
import { Map, Calendar, MapPin, Trash2, Edit3, PlusCircle, Globe } from 'lucide-react';
import './TripList.css';

export default function TripList() {
  const { state, dispatch } = useTravel();
  const navigate = useNavigate();

  const deleteTrip = (e, id) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this trip?')) {
      dispatch({ type: 'DELETE_TRIP', payload: id });
    }
  };

  return (
    <div className="page-container content-wrapper">
      <div className="orb orb-2" />
      <div className="page-header animate-fade-in-up">
        <div className="header-actions">
          <div>
            <h1><Map size={28} /> My Trips</h1>
            <p>Your upcoming and past adventures</p>
          </div>
          <button className="btn-primary" onClick={() => navigate('/create-trip')} id="trip-list-new">
            <PlusCircle size={18} /> New Trip
          </button>
        </div>
      </div>

      {state.trips.length === 0 ? (
        <div className="empty-state glass-card animate-fade-in">
          <div className="empty-icon"><Globe size={64} /></div>
          <h3>No trips yet</h3>
          <p>Start planning your first adventure to see it here.</p>
          <button className="btn-primary" onClick={() => navigate('/create-trip')}>Plan a Trip</button>
        </div>
      ) : (
        <div className="trip-list-grid stagger-children">
          {state.trips.map(trip => {
            const startDate = new Date(trip.startDate);
            const endDate = new Date(trip.endDate);
            const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
            const isPast = endDate < new Date();

            return (
              <div key={trip.id} className={`trip-card-lg glass-card ${isPast ? 'past-trip' : ''}`} onClick={() => navigate(`/trip/${trip.id}/itinerary`)} id={`trip-${trip.id}`}>
                <div className="trip-cover" style={{ background: `linear-gradient(135deg, hsl(${trip.id.charCodeAt(0) * 40}, 70%, 30%), hsl(${trip.id.charCodeAt(1) * 35}, 60%, 40%))` }}>
                  <div className="trip-status">
                    {isPast ? <span className="badge badge-muted">Completed</span> : <span className="badge badge-emerald">Upcoming</span>}
                  </div>
                  <div className="trip-emoji">✈️</div>
                </div>
                <div className="trip-content">
                  <div className="trip-header-row">
                    <h3>{trip.name}</h3>
                    <div className="trip-actions">
                      <button className="btn-icon" onClick={(e) => { e.stopPropagation(); navigate(`/trip/${trip.id}/itinerary`); }} title="Edit"><Edit3 size={16} /></button>
                      <button className="btn-icon btn-danger" onClick={(e) => deleteTrip(e, trip.id)} title="Delete"><Trash2 size={16} /></button>
                    </div>
                  </div>
                  <p className="trip-desc">{trip.description || 'No description provided.'}</p>
                  <div className="trip-meta-grid">
                    <div className="meta-item"><Calendar size={14} /> <span>{startDate.toLocaleDateString('en', { month: 'short', day: 'numeric' })} - {endDate.toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}</span></div>
                    <div className="meta-item"><MapPin size={14} /> <span>{trip.stops?.length || 0} destinations</span></div>
                    <div className="meta-item"><span>⏱️</span> <span>{duration} days</span></div>
                  </div>
                  <div className="trip-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${Math.min(100, ((trip.stops?.length || 0) / duration) * 100)}%` }} />
                    </div>
                    <span className="progress-text">{trip.stops?.length || 0} / {duration} days planned</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
