import { useState } from 'react';
import { useTravel } from '../store/TravelContext';
import { Compass, Clock, DollarSign, Filter, Search, PlusCircle } from 'lucide-react';

export default function ActivitySearch() {
  const { state, dispatch } = useTravel();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [selectedActForTrip, setSelectedActForTrip] = useState(null);

  const types = ['All', ...new Set(state.activities.map(a => a.type))];

  const filteredActivities = state.activities.filter(act => {
    const matchesSearch = act.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || act.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleAddActivity = (act, combinedId) => {
    if (combinedId === 'CANCEL') {
      setSelectedActForTrip(null);
      return;
    }
    const [tripId, stopId] = combinedId.split('|');
    dispatch({ type: 'ADD_ACTIVITY_TO_STOP', payload: { tripId, stopId, activity: act } });
    setSelectedActForTrip(null);
  };

  return (
    <div className="page-container content-wrapper">
      <div className="orb orb-2" />
      <div className="page-header animate-fade-in-up">
        <h1><Compass size={28} /> Browse Activities</h1>
        <p>Find exciting things to do for your next trip</p>
      </div>

      <div className="search-bar-container animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="search-input-wrapper">
          <Search className="search-icon" size={20} />
          <input 
            type="text" 
            placeholder="Search activities..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-wrapper">
          <Filter className="filter-icon" size={18} />
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            {types.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div className="activities-grid animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        {filteredActivities.map(act => (
          <div key={act.id} className="explore-act-card glass-card">
            <div className="act-header-info">
              <span className="explore-act-emoji">{act.image}</span>
              <div>
                <h3>{act.name}</h3>
                <div className="badge-row">
                  <span className="badge badge-accent">{act.type}</span>
                  <span className={`activity-level-badge ${act.physicalActivity?.toLowerCase()}`}>
                    {act.physicalActivity} Intensity
                  </span>
                </div>
              </div>
            </div>
            <p className="explore-act-desc">{act.description}</p>
            <div className="explore-act-footer">
              <div className="act-stats">
                <span><Clock size={14}/> {act.duration}h</span>
                <span className="text-emerald-400"><DollarSign size={14}/>{act.cost}</span>
              </div>
              <div className="act-cities">
                Available in {act.cityIds.length} {act.cityIds.length === 1 ? 'city' : 'cities'}
              </div>
            </div>
            
            <div style={{ marginTop: '16px' }}>
              {selectedActForTrip === act.id ? (
                <select 
                  className="btn-secondary sm w-full" 
                  onChange={(e) => { if(e.target.value) handleAddActivity(act, e.target.value); }}
                  defaultValue=""
                >
                  <option value="" disabled>Select Trip & Stop</option>
                  {state.trips.map(t => 
                    t.stops?.filter(s => act.cityIds.includes(s.cityId)).map(s => {
                      const city = state.cities.find(c => c.id === s.cityId);
                      return <option key={`${t.id}|${s.id}`} value={`${t.id}|${s.id}`}>{t.name} - {city?.name}</option>
                    })
                  )}
                  <option value="CANCEL">Cancel</option>
                </select>
              ) : (
                <button className="btn-secondary sm w-full" onClick={() => setSelectedActForTrip(act.id)}>
                  Add to Trip <PlusCircle size={14}/>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .search-bar-container { display: flex; gap: 16px; margin-bottom: 32px; }
        .search-input-wrapper { flex: 1; position: relative; }
        .search-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--text-muted); }
        .search-input { padding-left: 48px; height: 48px; border-radius: var(--radius-full); font-size: 1rem; }
        
        .filter-wrapper { position: relative; width: 200px; }
        .filter-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--text-muted); z-index: 1;}
        .filter-select { padding-left: 44px; height: 48px; border-radius: var(--radius-full); appearance: none; cursor: pointer; }
        
        .activities-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }
        .explore-act-card { padding: 24px; display: flex; flex-direction: column; }
        .explore-act-card:hover { transform: translateY(-4px); border-color: var(--accent-primary); }
        .act-header-info { display: flex; align-items: flex-start; gap: 16px; margin-bottom: 16px; }
        .explore-act-emoji { font-size: 2.5rem; background: rgba(255,255,255,0.05); padding: 12px; border-radius: var(--radius-md); }
        .act-header-info h3 { font-size: 1.15rem; margin-bottom: 8px; line-height: 1.3; }
        .badge-row { display: flex; gap: 8px; flex-wrap: wrap; }
        .activity-level-badge {
          font-size: 0.7rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 12px;
          text-transform: uppercase;
        }
        .activity-level-badge.low { background: rgba(16,185,129,0.15); color: #34d399; }
        .activity-level-badge.medium { background: rgba(245,158,11,0.15); color: #fbbf24; }
        .activity-level-badge.high { background: rgba(244,63,94,0.15); color: #fb7185; }
        
        .explore-act-desc { color: var(--text-secondary); font-size: 0.9rem; line-height: 1.5; margin-bottom: 24px; flex: 1; }
        .explore-act-footer { display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--border-glass); padding-top: 16px; }
        .act-stats { display: flex; gap: 16px; font-weight: 600; font-size: 0.9rem; }
        .act-stats span { display: flex; align-items: center; gap: 4px; }
        .text-emerald-400 { color: var(--accent-emerald); }
        .act-cities { font-size: 0.8rem; color: var(--text-muted); }
        .w-full { width: 100%; justify-content: center; }

        @media (max-width: 640px) {
          .search-bar-container { flex-direction: column; }
          .filter-wrapper { width: 100%; }
        }
      `}</style>
    </div>
  );
}
