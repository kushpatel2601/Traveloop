import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTravel } from '../store/TravelContext';
import { MapPin, Calendar, Clock, DollarSign, Plus, Trash2, ArrowLeft, GripVertical, Navigation } from 'lucide-react';
import './ItineraryBuilder.css';

export default function ItineraryBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useTravel();
  const trip = state.trips.find(t => t.id === id);
  const [activeTab, setActiveTab] = useState('itinerary');
  const [showAddCity, setShowAddCity] = useState(false);

  if (!trip) return <div className="page-container">Trip not found</div>;

  const handleAddStop = (city) => {
    dispatch({ type: 'ADD_STOP', payload: { tripId: trip.id, stop: { cityId: city.id, days: 2 } } });
    setShowAddCity(false);
  };

  return (
    <div className="page-container content-wrapper">
      <div className="orb orb-1" />
      <button className="btn-secondary back-btn" onClick={() => navigate('/trips')}><ArrowLeft size={16} /> Back to Trips</button>
      
      <div className="page-header mt-2 animate-fade-in-up">
        <h1>{trip.name}</h1>
        <div className="trip-meta-header">
          <span><Calendar size={14} /> {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</span>
          <span><MapPin size={14} /> {trip.stops?.length || 0} Stops</span>
        </div>
      </div>

      <div className="itinerary-tabs animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        {['itinerary', 'budget', 'packing', 'notes'].map(tab => (
          <button key={tab} className={`tab-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="itinerary-content animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        {activeTab === 'itinerary' && (
          <div className="itinerary-builder-grid">
            <div className="stops-sidebar glass-card">
              <div className="sidebar-header-sm">
                <h3>Route</h3>
                <button className="btn-icon" onClick={() => setShowAddCity(!showAddCity)}><Plus size={16} /></button>
              </div>

              {showAddCity && (
                <div className="city-selector">
                  <div className="city-search-mini">
                    {state.cities.map(city => (
                      <div key={city.id} className="city-search-item" onClick={() => handleAddStop(city)}>
                        <span>{city.image} {city.name}</span>
                        <Plus size={14} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="stops-list">
                {trip.stops?.length === 0 && <div className="empty-stops">No stops added yet. Click + to add a city.</div>}
                {trip.stops?.map((stop, index) => {
                  const city = state.cities.find(c => c.id === stop.cityId);
                  return (
                    <div key={stop.id} className="stop-item">
                      <div className="stop-number">{index + 1}</div>
                      <div className="stop-details">
                        <h4>{city?.name}</h4>
                        <span>{stop.days} days</span>
                      </div>
                      <button className="btn-icon btn-danger" onClick={() => dispatch({ type: 'REMOVE_STOP', payload: { tripId: trip.id, stopId: stop.id } })}><Trash2 size={14} /></button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="timeline-view glass-card">
              <h3>Itinerary Timeline</h3>
              {trip.stops?.length === 0 ? (
                <div className="empty-timeline">
                  <Navigation size={48} />
                  <p>Add stops to your route to start building your itinerary.</p>
                </div>
              ) : (
                <div className="timeline">
                  {trip.stops?.map(stop => {
                    const city = state.cities.find(c => c.id === stop.cityId);
                    const cityActivities = state.activities.filter(a => a.cityIds.includes(city.id));
                    
                    return (
                      <div key={stop.id} className="timeline-day">
                        <div className="day-marker">
                          <div className="day-dot"></div>
                          <div className="day-line"></div>
                        </div>
                        <div className="day-content">
                          <div className="day-header">
                            <h4>{city?.image} {city?.name}</h4>
                            <span className="badge badge-accent">{stop.days} Days</span>
                          </div>
                          
                          <div className="activities-list">
                            {stop.activities?.map(act => (
                              <div key={act.instanceId} className="activity-card">
                                <div className="act-info">
                                  <span className="act-emoji">{act.image}</span>
                                  <div>
                                    <h5>{act.name}</h5>
                                    <span className="act-meta"><Clock size={12}/> {act.duration}h • <DollarSign size={12}/>{act.cost}</span>
                                  </div>
                                </div>
                                <button className="btn-icon btn-danger sm" onClick={() => dispatch({ type: 'REMOVE_ACTIVITY_FROM_STOP', payload: { tripId: trip.id, stopId: stop.id, instanceId: act.instanceId } })}><Trash2 size={12} /></button>
                              </div>
                            ))}

                            <div className="add-activity-dropdown">
                              <select 
                                className="activity-select" 
                                onChange={(e) => {
                                  if(e.target.value) {
                                    const act = state.activities.find(a => a.id === e.target.value);
                                    dispatch({ type: 'ADD_ACTIVITY_TO_STOP', payload: { tripId: trip.id, stopId: stop.id, activity: act } });
                                    e.target.value = "";
                                  }
                                }}
                                defaultValue=""
                              >
                                <option value="" disabled>+ Add Activity</option>
                                {cityActivities.map(a => <option key={a.id} value={a.id}>{a.name} (${a.cost})</option>)}
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'budget' && (
          <div className="placeholder-tab glass-card">
            <h3>Budget Breakdown</h3>
            <p>Select activities to see your budget calculation here.</p>
            <button className="btn-primary mt-2 mx-auto" onClick={() => navigate(`/trip/${trip.id}/budget`)}>View Full Budget Analytics</button>
          </div>
        )}
        
        {activeTab === 'packing' && (
          <div className="placeholder-tab glass-card">
            <h3>Packing Checklist</h3>
            <p>Manage your items for this trip.</p>
            <button className="btn-primary mt-2 mx-auto" onClick={() => navigate(`/trip/${trip.id}/packing`)}>Go to Packing Manager</button>
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="placeholder-tab glass-card">
            <h3>Trip Notes</h3>
            <p>Journal and write down important remarks.</p>
            <button className="btn-primary mt-2 mx-auto" onClick={() => navigate(`/trip/${trip.id}/notes`)}>Open Trip Journal</button>
          </div>
        )}
      </div>
    </div>
  );
}
