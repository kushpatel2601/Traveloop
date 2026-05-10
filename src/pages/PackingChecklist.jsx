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

  const totalItems = trip.packingList.length;
  const packedItems = trip.packingList.filter(p => p.checked).length;
  const progress = totalItems === 0 ? 0 : Math.round((packedItems / totalItems) * 100);

  return (
    <div className="page-container content-wrapper">
      <div className="orb orb-3" />
      <button className="btn-secondary back-btn mb-4" onClick={() => navigate(`/trip/${trip.id}/itinerary`)}>Back to Itinerary</button>

      <div className="page-header animate-fade-in-up">
        <h1><CheckSquare size={28} /> Packing Checklist</h1>
        <p>Trip: {trip.name}</p>
      </div>

      <div className="glass-card p-6 mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold">Progress: {packedItems}/{totalItems} items packed</span>
          <span className="text-emerald font-bold">{progress}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: \`\${progress}%\` }}></div>
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

      <div className="grid-2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        {uniqueCategories.map(cat => {
          const catItems = trip.packingList.filter(p => p.category === cat);
          if (catItems.length === 0) return null;
          
          const catPacked = catItems.filter(p => p.checked).length;

          return (
            <div key={cat} className="glass-card p-6">
              <h3 className="text-lg mb-4 flex justify-between border-b pb-2">
                {cat} <span className="text-sm text-secondary font-normal">({catPacked}/{catItems.length})</span>
              </h3>
              <div className="flex flex-col gap-3">
                {catItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between group">
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        className="custom-checkbox"
                        checked={item.checked} 
                        onChange={() => dispatch({ type: 'TOGGLE_PACKING_ITEM', payload: { tripId: trip.id, itemId: item.id } })}
                      />
                      <span className={item.checked ? 'text-muted line-through' : ''}>{item.text}</span>
                    </label>
                    <button 
                      className="btn-icon sm btn-danger opacity-0 group-hover-opacity-100 transition" 
                      onClick={() => dispatch({ type: 'REMOVE_PACKING_ITEM', payload: { tripId: trip.id, itemId: item.id } })}
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
        .mb-4 { margin-bottom: 16px; } .mb-6 { margin-bottom: 24px; } .mb-2 { margin-bottom: 8px; } .mb-1 { margin-bottom: 4px; }
        .p-6 { padding: 24px; } .pb-2 { padding-bottom: 8px; }
        .flex { display: flex; } .flex-col { flex-direction: column; } .flex-1 { flex: 1; }
        .justify-between { justify-content: space-between; } .items-center { align-items: center; } .items-end { align-items: flex-end; }
        .gap-4 { gap: 16px; } .gap-3 { gap: 12px; }
        .font-semibold { font-weight: 600; } .font-bold { font-weight: 700; } .font-normal { font-weight: 400; }
        .text-emerald { color: var(--accent-emerald); } .text-sm { font-size: 0.875rem; } .text-lg { font-size: 1.125rem; }
        .text-secondary { color: var(--text-secondary); } .text-muted { color: var(--text-muted); }
        .block { display: block; }
        .border-b { border-bottom: 1px solid var(--border-glass); }
        .line-through { text-decoration: line-through; }
        .cursor-pointer { cursor: pointer; } .select-none { user-select: none; }
        .opacity-0 { opacity: 0; } .group:hover .group-hover-opacity-100 { opacity: 1; } .transition { transition: all 0.2s; }
        .btn-icon.sm { width: 28px; height: 28px; }
        
        .progress-bar { height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden; }
        .progress-fill { height: 100%; background: var(--gradient-primary); border-radius: 4px; transition: width 0.5s ease-out; }
        
        .input-select { 
          font-family: var(--font-body); background: var(--bg-glass); border: 1px solid var(--border-glass); 
          color: var(--text-primary); border-radius: var(--radius-md); padding: 12px 16px; font-size: 0.95rem; width: 100%; height: 48px;
        }
        
        .custom-checkbox {
          width: 20px; height: 20px; accent-color: var(--accent-primary); cursor: pointer;
        }
      `}</style>
    </div>
  );
}
