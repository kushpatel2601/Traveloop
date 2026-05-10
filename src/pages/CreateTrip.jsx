import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTravel } from '../store/TravelContext';
import { PlusCircle, Calendar, FileText, DollarSign, Tag, ArrowRight, Sparkles, MapPin } from 'lucide-react';
import './CreateTrip.css';

export default function CreateTrip() {
  const { dispatch } = useTravel();
  const navigate = useNavigate();
  const [form, setForm] = useState({ 
    name: '', 
    startDate: '', 
    endDate: '', 
    description: '',
    budget: '',
    tripType: 'Vacation',
    from: '',
    to: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.startDate || !form.endDate) { setError('Please fill in trip name and dates'); return; }
    if (new Date(form.endDate) < new Date(form.startDate)) { setError('End date must be after start date'); return; }
    dispatch({ type: 'CREATE_TRIP', payload: form });
    navigate('/trips');
  };

  const tripTypes = ['Vacation', 'Business', 'Adventure', 'Relaxation', 'Family', 'Solo'];

  return (
    <div className="page-container content-wrapper">
      <div className="orb orb-1" /><div className="orb orb-3" />
      <div className="page-header animate-fade-in-up">
        <h1><Sparkles size={28} /> Plan Your Next Journey</h1>
        <p>Fill in the details to start your adventure</p>
      </div>

      <div className="create-trip-layout">
        <div className="create-trip-form-card glass-card animate-fade-in-up">
          {error && <div className="auth-error">{error}</div>}
          <form onSubmit={handleSubmit} className="premium-form">
            <div className="form-group full-width">
              <label htmlFor="trip-name"><FileText size={16} /> Trip Title</label>
              <input id="trip-name" type="text" placeholder="e.g., Summer in Paris" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="trip-from"><MapPin size={16} /> From</label>
                <input id="trip-from" type="text" placeholder="Origin City" value={form.from} onChange={e => setForm({ ...form, from: e.target.value })} />
              </div>
              <div className="form-group">
                <label htmlFor="trip-to"><MapPin size={16} /> To</label>
                <input id="trip-to" type="text" placeholder="Destination City" value={form.to} onChange={e => setForm({ ...form, to: e.target.value })} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="trip-start"><Calendar size={16} /> Starting Date</label>
                <input id="trip-start" type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} />
              </div>
              <div className="form-group">
                <label htmlFor="trip-end"><Calendar size={16} /> Ending Date</label>
                <input id="trip-end" type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="trip-budget"><DollarSign size={16} /> Est. Budget ($)</label>
                <input id="trip-budget" type="number" placeholder="5000" value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })} />
              </div>
              <div className="form-group">
                <label htmlFor="trip-type"><Tag size={16} /> Trip Type</label>
                <select id="trip-type" value={form.tripType} onChange={e => setForm({ ...form, tripType: e.target.value })}>
                  {tripTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <button type="submit" className="btn-primary create-submit" id="create-trip-submit">
              <PlusCircle size={18} /> Create Plan <ArrowRight size={18} />
            </button>
          </form>
        </div>

        <div className="create-trip-sidebar animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
          <div className="info-card glass-card">
            <h3>💡 Pro Tip</h3>
            <p>Define your budget early to get more accurate activity recommendations later in the itinerary builder.</p>
          </div>
          <div className="info-card glass-card mt-4">
            <h3>🌍 Destination Insight</h3>
            <p>Popular destinations for {form.tripType} include Paris, Tokyo, and Bali. Check the community tab for inspiration!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
