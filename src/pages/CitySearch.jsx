import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTravel } from '../store/TravelContext';
import { Search, MapPin, Filter, PlusCircle, ArrowRight, Tag, Check } from 'lucide-react';

export default function CitySearch() {
  const { state, dispatch } = useTravel();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRegion, setFilterRegion] = useState('All');
  const [activeTag, setActiveTag] = useState('All');
  const [selectedCityForTrip, setSelectedCityForTrip] = useState(null);
  const [addedCityMsg, setAddedCityMsg] = useState('');

  // Sync state with URL parameters
  useEffect(() => {
    const filterParam = searchParams.get('filter');
    if (filterParam) {
      setActiveTag(filterParam);
    }
  }, [searchParams]);

  const regions = ['All', ...new Set(state.cities.map(c => c.region))];
  const allTags = ['All', 'Nature', 'Historical', 'BeachVibes', 'Nightlife', 'Adventure', 'Culinary', 'SoloTravel', 'Relaxation'];

  const filteredCities = state.cities.filter(city => {
    const matchesSearch = city.name.toLowerCase().includes(searchTerm.toLowerCase()) || city.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = filterRegion === 'All' || city.region === filterRegion;
    const matchesTag = activeTag === 'All' || (city.tags && city.tags.includes(activeTag));
    return matchesSearch && matchesRegion && matchesTag;
  });

  const handleAddToTrip = (city, tripId) => {
    if (tripId === 'CANCEL') {
      setSelectedCityForTrip(null);
      return;
    }
    dispatch({ type: 'ADD_STOP', payload: { tripId, stop: { cityId: city.id, days: 2 } } });
    setSelectedCityForTrip(null);
    setAddedCityMsg(`Successfully added ${city.name} to your trip!`);
    setTimeout(() => setAddedCityMsg(''), 3000);
  };

  return (
    <div className="page-container content-wrapper">
      <div className="orb orb-1" />

      {/* Toast Notification */}
      {addedCityMsg && (
        <div className="premium-toast animate-fade-in">
          <div className="toast-content">
            <Check size={18} className="text-emerald" />
            <span>{addedCityMsg}</span>
          </div>
        </div>
      )}
      <div className="page-header animate-fade-in-up">
        <h1><MapPin size={28} /> Explore Cities</h1>
        <p>Find your next dream destination</p>
      </div>

      <div className="search-bar-container animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="search-input-wrapper">
          <Search className="search-icon" size={20} />
          <input 
            type="text" 
            placeholder="Search by city or country..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-wrapper">
          <Filter className="filter-icon" size={18} />
          <select 
            value={filterRegion} 
            onChange={(e) => setFilterRegion(e.target.value)}
            className="filter-select"
          >
            {regions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="tag-filter-row animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
        {allTags.map(tag => (
          <button 
            key={tag} 
            className={`tag-pill ${activeTag === tag ? 'active' : ''}`}
            onClick={() => {
              setActiveTag(tag);
              setSearchParams(tag === 'All' ? {} : { filter: tag });
            }}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="cities-grid animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        {filteredCities.map(city => (
          <div key={city.id} className="explore-city-card glass-card">
            <div className="explore-city-cover">
              <span className="explore-city-emoji">{city.image}</span>
              <div className="explore-city-meta">
                <span className="badge badge-accent">{city.region}</span>
              </div>
            </div>
            <div className="explore-city-body">
              <div className="city-title-row">
                <h3>{city.name}</h3>
                <span className="country-chip">{city.country}</span>
              </div>
              <p className="explore-city-desc">{city.description}</p>
              
              <div className="city-tags-small">
                {city.tags?.map(t => <span key={t} className="mini-tag">#{t}</span>)}
              </div>

              <div className="explore-city-footer">
                <div className="city-stats">
                  <span title="Cost Index" className="text-emerald-400">{'$$$$$'.substring(0, city.costIndex)}<span style={{opacity:0.3}}>{'$$$$$'.substring(city.costIndex)}</span></span>
                  <span title="Popularity" style={{color:'var(--accent-warm)'}}>★ {city.popularity}</span>
                </div>
                
                {selectedCityForTrip === city.id ? (
                  <select 
                    className="btn-secondary sm" 
                    onChange={(e) => { if (e.target.value) handleAddToTrip(city, e.target.value); }}
                    defaultValue=""
                  >
                    <option value="" disabled>Select Trip</option>
                    {state.trips.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    <option value="CANCEL">Cancel</option>
                  </select>
                ) : (
                  <button className="btn-secondary sm" onClick={() => setSelectedCityForTrip(city.id)}>
                    Add to Trip <PlusCircle size={14}/>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {filteredCities.length === 0 && (
          <div className="no-results glass-card">
            <Search size={48} opacity={0.3} />
            <p>No cities found matching your criteria.</p>
            <button className="btn-link mt-2" onClick={() => {setActiveTag('All'); setFilterRegion('All'); setSearchTerm(''); setSearchParams({});}}>Clear all filters</button>
          </div>
        )}
      </div>

      <style>{`
        .search-bar-container { display: flex; gap: 16px; margin-bottom: 20px; }
        .search-input-wrapper { flex: 1; position: relative; }
        .search-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--text-muted); }
        .search-input { padding-left: 48px; height: 48px; border-radius: var(--radius-full); font-size: 1rem; }
        
        .filter-wrapper { position: relative; width: 200px; }
        .filter-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--text-muted); z-index: 1;}
        .filter-select { padding-left: 44px; height: 48px; border-radius: var(--radius-full); appearance: none; cursor: pointer; }
        
        .tag-filter-row { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 32px; padding-bottom: 8px; border-bottom: 1px solid var(--border-glass); }
        .tag-pill { background: rgba(255,255,255,0.03); border: 1px solid var(--border-glass); color: var(--text-secondary); padding: 8px 16px; border-radius: var(--radius-full); font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .tag-pill:hover { background: rgba(255,255,255,0.08); color: white; }
        .tag-pill.active { background: var(--accent-primary); color: white; border-color: transparent; box-shadow: 0 4px 12px rgba(99,102,241,0.3); }

        .cities-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; }
        .explore-city-card { display: flex; flex-direction: column; overflow: hidden; padding: 0; }
        .explore-city-cover { height: 160px; background: linear-gradient(135deg, rgba(99,102,241,0.1), rgba(6,182,212,0.1)); display: flex; align-items: center; justify-content: center; position: relative; }
        .explore-city-emoji { font-size: 4rem; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2)); }
        .explore-city-meta { position: absolute; top: 16px; right: 16px; }
        .explore-city-body { padding: 24px; display: flex; flex-direction: column; flex: 1; }
        
        .city-title-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
        .city-title-row h3 { font-size: 1.3rem; }
        .country-chip { font-size: 0.75rem; background: rgba(255,255,255,0.05); padding: 2px 8px; border-radius: 6px; color: var(--text-muted); }
        
        .explore-city-desc { color: var(--text-secondary); font-size: 0.9rem; line-height: 1.5; margin-bottom: 16px; flex: 1; }
        
        .city-tags-small { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; }
        .mini-tag { font-size: 0.75rem; color: var(--accent-primary-hover); font-weight: 600; }

        .explore-city-footer { display: flex; align-items: center; justify-content: space-between; margin-top: auto; padding-top: 16px; border-top: 1px solid var(--border-glass); }
        .city-stats { display: flex; gap: 12px; font-size: 0.85rem; font-weight: 600; }
        .text-emerald-400 { color: var(--accent-emerald); }
        .btn-secondary.sm { padding: 8px 16px; font-size: 0.85rem; gap: 6px; border-radius: 10px; }
        .no-results { grid-column: 1 / -1; text-align: center; padding: 80px 40px; color: var(--text-muted); display: flex; flex-direction: column; align-items: center; gap: 12px; }

        .premium-toast { position: fixed; bottom: 32px; right: 32px; z-index: 1000; background: rgba(5,5,15,0.8); backdrop-filter: blur(20px); border: 1px solid var(--border-glass); padding: 16px 24px; border-radius: 16px; box-shadow: 0 12px 40px rgba(0,0,0,0.4); }
        .toast-content { display: flex; align-items: center; gap: 12px; font-weight: 600; color: white; }
        .text-emerald { color: #34d399; }

        @media (max-width: 640px) {
          .search-bar-container { flex-direction: column; }
          .filter-wrapper { width: 100%; }
        }
      `}</style>
    </div>
  );
}
