import { useState } from 'react';
import { useTravel } from '../store/TravelContext';
import { BookOpen, Plus, Trash2, Calendar, MapPin, AlignLeft } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

export default function TripNotes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useTravel();
  const trip = state.trips.find(t => t.id === id);
  const [filter, setFilter] = useState('All');
  const [newNote, setNewNote] = useState('');

  if (!trip) return <div className="page-container content-wrapper">Trip not found</div>;

  const notes = trip.notes || [];

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    dispatch({ type: 'ADD_NOTE', payload: { tripId: trip.id, note: { text: newNote } } });
    setNewNote('');
  };

  return (
    <div className="page-container content-wrapper">
      <div className="orb orb-2" />
      <button className="btn-secondary back-btn mb-4" onClick={() => navigate(`/trip/${trip.id}/itinerary`)}>Back to Itinerary</button>

      <div className="page-header animate-fade-in-up">
        <h1><BookOpen size={28} /> Trip Notes</h1>
        <p>Journal and important details for {trip.name}</p>
      </div>

      <div className="flex gap-4 mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <button className={`filter-btn ${filter === 'All' ? 'active' : ''}`} onClick={() => setFilter('All')}>
          <AlignLeft size={16} /> All Notes
        </button>
        <button className={`filter-btn ${filter === 'By Day' ? 'active' : ''}`} onClick={() => setFilter('By Day')}>
          <Calendar size={16} /> By Day
        </button>
        <button className={`filter-btn ${filter === 'By Stop' ? 'active' : ''}`} onClick={() => setFilter('By Stop')}>
          <MapPin size={16} /> By Stop
        </button>
      </div>

      <div className="glass-card p-6 mb-8 flex flex-col gap-4 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
        <textarea 
          rows={3} 
          placeholder="Add a new note, reminder, or journal entry..." 
          className="w-full bg-glass border border-glass rounded-md p-4 text-primary resize-none"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
        />
        <button className="btn-primary self-end" onClick={handleAddNote}><Plus size={18} /> Add Note</button>
      </div>

      <div className="notes-grid animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        {notes.length === 0 ? (
          <div className="col-span-full text-center p-8 text-muted">No notes added yet. Start journaling!</div>
        ) : (
          notes.map(note => (
            <div key={note.id} className="glass-card p-5 relative group flex flex-col">
              <p className="text-primary mb-4 leading-relaxed flex-1 whitespace-pre-wrap">{note.text}</p>
              <div className="flex justify-between items-center text-xs text-muted border-t border-glass pt-3">
                <span>{new Date(note.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
              </div>
              <button 
                className="absolute top-4 right-4 text-secondary hover-text-rose opacity-0 group-hover-opacity-100 transition"
                onClick={() => dispatch({ type: 'DELETE_NOTE', payload: { tripId: trip.id, noteId: note.id } })}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>

      <style>{`
        .mb-4 { margin-bottom: 16px; } .mb-6 { margin-bottom: 24px; } .mb-8 { margin-bottom: 32px; }
        .p-6 { padding: 24px; } .p-5 { padding: 20px; } .p-4 { padding: 16px; } .p-8 { padding: 32px; } .pt-3 { padding-top: 12px; }
        .flex { display: flex; } .flex-col { flex-direction: column; } .flex-1 { flex: 1; }
        .justify-between { justify-content: space-between; } .items-center { align-items: center; } .self-end { align-self: flex-end; }
        .gap-4 { gap: 16px; }
        .relative { position: relative; } .absolute { position: absolute; } .top-4 { top: 16px; } .right-4 { right: 16px; }
        .w-full { width: 100%; }
        .bg-glass { background: var(--bg-glass); } .border { border: 1px solid var(--border-glass); } .border-t { border-top: 1px solid var(--border-glass); }
        .rounded-md { border-radius: var(--radius-md); }
        .text-primary { color: var(--text-primary); } .text-secondary { color: var(--text-secondary); } .text-muted { color: var(--text-muted); }
        .text-xs { font-size: 0.75rem; } .text-center { text-align: center; }
        .leading-relaxed { line-height: 1.625; } .whitespace-pre-wrap { white-space: pre-wrap; }
        .resize-none { resize: none; }
        .opacity-0 { opacity: 0; } .group:hover .group-hover-opacity-100 { opacity: 1; } .transition { transition: all 0.2s; }
        .hover-text-rose:hover { color: var(--accent-rose); }
        
        .filter-btn { display: flex; align-items: center; gap: 8px; padding: 10px 16px; border-radius: var(--radius-full); background: var(--bg-glass); border: 1px solid var(--border-glass); color: var(--text-secondary); font-size: 0.9rem; font-weight: 500; cursor: pointer; transition: all 0.2s; }
        .filter-btn:hover { background: var(--bg-glass-hover); color: var(--text-primary); }
        .filter-btn.active { background: rgba(99,102,241,0.15); color: var(--accent-primary-hover); border-color: rgba(99,102,241,0.3); }
        
        .notes-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
        .col-span-full { grid-column: 1 / -1; }
      `}</style>
    </div>
  );
}
