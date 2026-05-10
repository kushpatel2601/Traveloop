import { useState } from 'react';
import { useTravel } from '../store/TravelContext';
import { Search, MapPin, Filter, PlusCircle, ArrowRight } from 'lucide-react';

export default function CitySearch() {
  const { state } = useTravel();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRegion, setFilterRegion] = useState('All');

  const regions = ['All', ...new Set(state.cities.map(c => c.region))];

  const filteredCities = state.cities.filter(city => {
    const matchesSearch = city.name.toLowerCase().includes(searchTerm.toLowerCase()) || city.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = filterRegion === 'All' || city.region === filterRegion;
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="page-container content-wrapper">
      <div className="orb orb-1" />
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
              <h3>{city.name}</h3>
              <p className="explore-city-country">{city.country}</p>
              <p className="explore-city-desc">{city.description}</p>
              <div className="explore-city-footer">
                <div className="city-stats">
                  <span title="Cost Index" className="text-emerald-400">{'$$$$$'.substring(0, city.costIndex)}<span style={{opacity:0.3}}>{'$$$$$'.substring(city.costIndex)}</span></span>
                  <span title="Popularity" style={{color:'var(--accent-warm)'}}>★ {city.popularity}/100</span>
                </div>
                <button className="btn-secondary sm">Add to Trip <PlusCircle size={14}/></button>
              </div>
            </div>
          </div>
        ))}
        {filteredCities.length === 0 && (
          <div className="no-results">
            <p>No cities found matching your criteria.</p>
          </div>
        )}
      </div>

      <style>{`
        .search-bar-container { display: flex; gap: 16px; margin-bottom: 32px; }
        .search-input-wrapper { flex: 1; position: relative; }
        .search-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--text-muted); }
        .search-input { padding-left: 48px; height: 48px; border-radius: var(--radius-full); font-size: 1rem; }
        
        .filter-wrapper { position: relative; width: 200px; }
        .filter-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--text-muted); z-index: 1;}
        .filter-select { padding-left: 44px; height: 48px; border-radius: var(--radius-full); appearance: none; cursor: pointer; }
        
        .cities-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; }
        .explore-city-card { display: flex; flex-direction: column; overflow: hidden; padding: 0; }
        .explore-city-cover { height: 160px; background: linear-gradient(135deg, rgba(99,102,241,0.2), rgba(6,182,212,0.2)); display: flex; align-items: center; justify-content: center; position: relative; }
        .explore-city-emoji { font-size: 4rem; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2)); }
        .explore-city-meta { position: absolute; top: 16px; right: 16px; }
        .explore-city-body { padding: 20px; display: flex; flex-direction: column; flex: 1; }
        .explore-city-body h3 { font-size: 1.2rem; margin-bottom: 4px; }
        .explore-city-country { color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 12px; }
        .explore-city-desc { color: var(--text-muted); font-size: 0.85rem; line-height: 1.5; margin-bottom: 20px; flex: 1; }
        .explore-city-footer { display: flex; align-items: center; justify-content: space-between; margin-top: auto; padding-top: 16px; border-top: 1px solid var(--border-glass); }
        .city-stats { display: flex; gap: 12px; font-size: 0.85rem; font-weight: 600; }
        .text-emerald-400 { color: var(--accent-emerald); }
        .btn-secondary.sm { padding: 6px 12px; font-size: 0.8rem; gap: 4px; }
        .no-results { grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted); }

        @media (max-width: 640px) {
          .search-bar-container { flex-direction: column; }
          .filter-wrapper { width: 100%; }
        }
      `}</style>
    </div>
  );
}
