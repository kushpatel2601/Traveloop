import { useState } from 'react';
import { useTravel } from '../store/TravelContext';
import { CheckSquare, Plus, Trash2 } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

export default function PackingChecklist() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useTravel();
  const trip = state.trips.find(t => t.id === id);
  const [newItem, setNewItem] = useState({ text: '', category: 'Essentials' });

  if (!trip) return <div className="page-container content-wrapper">Trip not found</div>;

  const categories = [...new Set(trip.packingList.map(p => p.category)), 'Essentials', 'Clothing', 'Electronics', 'Documents', 'Health', 'Toiletries'];
  const uniqueCategories = [...new Set(categories)];

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItem.text.trim()) return;
    dispatch({ type: 'ADD_PACKING_ITEM', payload: { tripId: trip.id, item: newItem } });
    setNewItem({ ...newItem, text: '' });
  };

  const totalItems = trip.packingList?.length || 0;
  const packedItems = trip.packingList?.filter(p => p.checked).length || 0;
  const progress = totalItems === 0 ? 0 : Math.round((packedItems / totalItems) * 100);

  return (
    <div className="page-container content-wrapper">
      <div className="orb orb-3" />
      <button className="btn-secondary back-btn mb-4" onClick={() => navigate(`/trip/${trip.id}/itinerary`)}>Back to Itinerary</button>

      <div className="page-header animate-fade-in-up">
        <div className="flex justify-between items-center w-full">
          <div>
            <h1><CheckSquare size={28} /> Packing Checklist</h1>
            <p>Essential gear for {trip.name}</p>
          </div>
          <div className={`progress-badge ${progress === 100 ? 'complete' : ''}`}>
            {progress}% Ready
          </div>
        </div>
      </div>

      <div className="glass-card p-6 mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold">Progress: {packedItems}/{totalItems} items packed</span>
          <span className="text-emerald font-bold">{progress}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className="glass-card p-6 mb-6 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
        <form onSubmit={handleAddItem} className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="text-sm font-semibold mb-1 block">New Item</label>
            <input type="text" placeholder="e.g., Swimsuit" value={newItem.text} onChange={e => setNewItem({ ...newItem, text: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-semibold mb-1 block">Category</label>
            <select className="input-select" value={newItem.category} onChange={e => setNewItem({ ...newItem, category: e.target.value })}>
              {uniqueCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <button type="submit" className="btn-primary" style={{ height: '48px' }}><Plus size={18} /> Add</button>
        </form>
      </div>

      <div className="packing-grid animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        {uniqueCategories.map(cat => {
          const catItems = (trip.packingList || []).filter(p => p.category === cat);
          if (catItems.length === 0) return null;
          
          const catPacked = catItems.filter(p => p.checked).length;

          return (
            <div key={cat} className="glass-card packing-section">
              <h3 className="category-header">
                {cat} <span>{catPacked}/{catItems.length}</span>
              </h3>
              <div className="item-list">
                {catItems.map(item => (
                  <div key={item.id} className={`packing-item-row ${item.checked ? 'is-checked' : ''}`} onClick={() => dispatch({ type: 'TOGGLE_PACKING_ITEM', payload: { tripId: trip.id, itemId: item.id } })}>
                    <div className="check-box-outer">
                      {item.checked && <Check size={12} strokeWidth={3} />}
                    </div>
                    <span className="item-label">{item.text}</span>
                    <button 
                      className="btn-trash" 
                      onClick={(e) => { e.stopPropagation(); dispatch({ type: 'REMOVE_PACKING_ITEM', payload: { tripId: trip.id, itemId: item.id } }); }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <style>{`
        .progress-badge { background: var(--bg-glass); border: 1px solid var(--border-glass); padding: 6px 16px; border-radius: 20px; font-weight: 700; color: var(--accent-primary); }
        .progress-badge.complete { background: rgba(52,211,153,0.1); border-color: rgba(52,211,153,0.3); color: #34d399; }
        .packing-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; margin-top: 24px; }
        .packing-section { padding: 24px; border: 1px solid var(--border-glass); display: flex; flex-direction: column; gap: 16px; }
        .category-header { font-size: 1.1rem; font-weight: 700; display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-glass); padding-bottom: 8px; color: var(--accent-primary); }
        .category-header span { font-size: 0.8rem; opacity: 0.6; font-weight: 400; }
        .item-list { display: flex; flex-direction: column; gap: 8px; }
        .packing-item-row { display: flex; align-items: center; gap: 12px; padding: 10px 14px; border-radius: 12px; background: rgba(255,255,255,0.02); cursor: pointer; transition: all 0.2s; border: 1px solid transparent; }
        .packing-item-row:hover { background: rgba(255,255,255,0.06); border-color: var(--border-glass); }
        .packing-item-row.is-checked { opacity: 0.5; }
        .check-box-outer { width: 22px; height: 22px; border-radius: 6px; border: 2px solid var(--border-glass); display: flex; align-items: center; justify-content: center; flex-shrink: 0; background: rgba(0,0,0,0.2); }
        .is-checked .check-box-outer { background: var(--accent-emerald); border-color: var(--accent-emerald); color: white; }
        .item-label { flex: 1; font-size: 0.95rem; font-weight: 500; }
        .is-checked .item-label { text-decoration: line-through; }
        .btn-trash { opacity: 0; color: #fb7185; cursor: pointer; transition: opacity 0.2s; background: none; border: none; padding: 4px; }
        .packing-item-row:hover .btn-trash { opacity: 1; }
        
        .mb-4 { margin-bottom: 16px; } .mb-6 { margin-bottom: 24px; }
        .p-6 { padding: 24px; }
        .flex { display: flex; } .flex-col { flex-direction: column; } .flex-1 { flex: 1; }
        .justify-between { justify-content: space-between; } .items-center { align-items: center; } .items-end { align-items: flex-end; }
        .gap-4 { gap: 16px; }
        .progress-bar { height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden; }
        .progress-fill { height: 100%; background: var(--gradient-primary); border-radius: 4px; transition: width 0.5s ease-out; }
        .input-select { background: var(--bg-glass); border: 1px solid var(--border-glass); color: var(--text-primary); border-radius: var(--radius-md); padding: 12px 16px; font-size: 0.95rem; width: 100%; height: 48px; }
      `}</style>
    </div>
  );
}
