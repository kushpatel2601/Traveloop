import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTravel } from '../store/TravelContext';
import { PlusCircle, Calendar, FileText, Image, ArrowRight, Sparkles } from 'lucide-react';
import './CreateTrip.css';

export default function CreateTrip() {
  const { dispatch } = useTravel();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', startDate: '', endDate: '', description: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.startDate || !form.endDate) { setError('Please fill in trip name and dates'); return; }
    if (new Date(form.endDate) < new Date(form.startDate)) { setError('End date must be after start date'); return; }
    dispatch({ type: 'CREATE_TRIP', payload: form });
    navigate('/trips');
  };

  const quickTemplates = [
    { name: 'Weekend Getaway', days: 3, emoji: '🏖️' },
    { name: 'Week Explorer', days: 7, emoji: '🗺️' },
    { name: 'Two-Week Adventure', days: 14, emoji: '🌍' },
    { name: 'Month Long Journey', days: 30, emoji: '🧭' },
  ];

  const applyTemplate = (t) => {
    const start = new Date();
    start.setDate(start.getDate() + 7);
    const end = new Date(start);
    end.setDate(end.getDate() + t.days);
    setForm({ ...form, name: t.name, startDate: start.toISOString().split('T')[0], endDate: end.toISOString().split('T')[0] });
  };

  return (
    <div className="page-container content-wrapper">
      <div className="orb orb-1" /><div className="orb orb-3" />
      <div className="page-header animate-fade-in-up">
        <h1><Sparkles size={28} /> Create New Trip</h1>
        <p>Start planning your next adventure</p>
      </div>

      <div className="create-trip-layout">
        <div className="create-trip-form-card glass-card animate-fade-in-up">
          {error && <div className="auth-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="trip-name"><FileText size={16} /> Trip Name</label>
              <input id="trip-name" type="text" placeholder="e.g., European Summer 2026" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="trip-start"><Calendar size={16} /> Start Date</label>
                <input id="trip-start" type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} />
              </div>
              <div className="form-group">
                <label htmlFor="trip-end"><Calendar size={16} /> End Date</label>
                <input id="trip-end" type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="trip-desc"><FileText size={16} /> Description (optional)</label>
              <textarea id="trip-desc" rows={4} placeholder="Describe your dream trip..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
            <button type="submit" className="btn-primary create-submit" id="create-trip-submit">
              <PlusCircle size={18} /> Create Trip <ArrowRight size={18} />
            </button>
          </form>
        </div>

        <div className="templates-section animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
          <h3>⚡ Quick Templates</h3>
          <div className="templates-grid">
            {quickTemplates.map((t, i) => (
              <button key={i} className="template-card glass-card" onClick={() => applyTemplate(t)} id={`template-${i}`}>
                <span className="template-emoji">{t.emoji}</span>
                <span className="template-name">{t.name}</span>
                <span className="template-days">{t.days} days</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
