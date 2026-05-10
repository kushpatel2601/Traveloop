import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTravel } from '../store/TravelContext';
import { MapPin, Calendar, Clock, DollarSign, Plus, Trash2, ArrowLeft, GripVertical, Navigation, Share2 } from 'lucide-react';
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

  const handleShareTrip = () => {
    const post = {
      userId: 'me',
      userName: state.user?.name || 'Explorer',
      avatar: state.user?.avatar || '✈️',
      tripName: trip.name,
      description: `Check out my trip to ${trip.stops?.map(s => state.cities.find(c => c.id === s.cityId)?.name).join(', ')}!`,
      cities: trip.stops?.map(s => state.cities.find(c => c.id === s.cityId)?.name) || [],
    };
    dispatch({ type: 'ADD_COMMUNITY_POST', payload: post });
    alert('Trip shared to community!');
    navigate('/community');
  };

  const getDaysArray = (start, end) => {
    const arr = [];
    const dt = new Date(start);
    const endDt = new Date(end);
    while (dt <= endDt) {
      arr.push(new Date(dt));
      dt.setDate(dt.getDate() + 1);
    }
    return arr;
  };

  const days = getDaysArray(trip.startDate, trip.endDate);

  return (
    <div className="page-container content-wrapper">
      <div className="orb orb-1" />
      <button className="btn-secondary back-btn" onClick={() => navigate('/trips')}><ArrowLeft size={16} /> Back to Trips</button>
      
      <div className="page-header mt-2 animate-fade-in-up">
        <h1>{trip.name}</h1>
        <div className="trip-meta-header">
          <span><Calendar size={14} /> {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</span>
          <span><MapPin size={14} /> {trip.stops?.length || 0} Stops</span>
          <button className="btn-secondary sm" onClick={handleShareTrip}>
            <Share2 size={14} /> Share to Community
          </button>
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
              <div className="timeline-header-actions">
                <h3>Itinerary Timeline</h3>
                <div className="budget-summary-pills">
                  <span className="budget-pill">
                    Est. Budget: ${trip.stops?.reduce((total, s) => total + (s.activities?.reduce((sum, a) => sum + a.cost, 0) || 0), 0)}
                  </span>
                </div>
              </div>
              {trip.stops?.length === 0 ? (
                <div className="empty-timeline">
                  <Navigation size={48} />
                  <p>Add stops to your route to start building your itinerary.</p>
                </div>
              ) : (
                <div className="itinerary-main-view">
                  <div className="map-panel glass-card mb-4" style={{ height: '300px', overflow: 'hidden', padding: '0' }}>
                    <iframe
                      title="Trip Map"
                      src="https://www.openstreetmap.org/export/embed.html?bbox=-180,-85,180,85&amp;layer=mapnik"
                      style={{ width: '100%', height: '100%', border: 'none' }}
                      loading="lazy"
                    />
                  </div>
                  <div className="timeline">
                    {days.map((date, i) => {
                      // Find if any stop covers this day? 
                      // This is a bit complex without explicit day mapping in state.
                      // For now, let's just show Day 1, Day 2... and list all activities assigned to stops.
                      // Or better, let's group activities by stop in this day view for now.
                      return (
                        <div key={i} className="timeline-day">
                          <div className="day-marker">
                            <div className="day-dot"></div>
                            <div className="day-line"></div>
                          </div>
                          <div className="day-content">
                            <div className="day-header">
                              <h4>Day {i + 1}</h4>
                              <span className="badge badge-muted">{date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                            </div>
                            
                            <div className="activities-list">
                              {/* If no stops, show nothing. If stops, maybe show the city for the first day of that stop? */}
                              {/* This logic needs state refinement, but for UI parity: */}
                              {i === 0 && trip.stops?.[0] && (
                                <div className="stop-intro-pill">
                                  Arrive in {state.cities.find(c => c.id === trip.stops[0].cityId)?.name}
                                </div>
                              )}
                              
                              {/* Show activities assigned to this dayIndex */}
                              {trip.stops?.map(stop => (
                                stop.activities?.filter(act => act.dayIndex === i).map(act => (
                                  <div key={act.instanceId} className="activity-card animate-fade-in">
                                    <div className="act-info">
                                      <span className="act-emoji">{act.image}</span>
                                      <div>
                                        <h5>{act.name}</h5>
                                        <div className="act-meta-row">
                                          <span className="act-meta"><Clock size={12}/> {act.duration}h • <DollarSign size={12}/>{act.cost}</span>
                                        </div>
                                      </div>
                                    </div>
                                    <button className="btn-icon btn-danger sm" onClick={() => dispatch({ type: 'REMOVE_ACTIVITY_FROM_STOP', payload: { tripId: trip.id, stopId: stop.id, instanceId: act.instanceId } })}><Trash2 size={12} /></button>
                                  </div>
                                ))
                              ))}
                              
                              <div className="add-activity-dropdown mt-2">
                                <select 
                                  className="activity-select sm" 
                                  onChange={(e) => {
                                    if(e.target.value) {
                                      const [stopId, actId] = e.target.value.split('|');
                                      const act = state.activities.find(a => a.id === actId);
                                      dispatch({ type: 'ADD_ACTIVITY_TO_STOP', payload: { tripId: trip.id, stopId, activity: act, dayIndex: i } });
                                      e.target.value = "";
                                    }
                                  }}
                                  defaultValue=""
                                >
                                  <option value="" disabled>+ Plan activity for Day {i+1}</option>
                                  {trip.stops?.map(stop => {
                                    const city = state.cities.find(c => c.id === stop.cityId);
                                    return state.activities.filter(a => a.cityIds.includes(city.id)).map(a => (
                                      <option key={`${stop.id}|${a.id}`} value={`${stop.id}|${a.id}`}>{city.name}: {a.name} (${a.cost})</option>
                                    ));
                                  })}
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
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
