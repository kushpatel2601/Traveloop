import { useState } from 'react';
import { useTravel } from '../store/TravelContext';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { DollarSign, AlertCircle, PieChart } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function BudgetBreakdown() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useTravel();
  const trip = state.trips.find(t => t.id === id);

  if (!trip) return <div className="page-container content-wrapper">Trip not found</div>;

  const totalBudget = trip.stops?.reduce((sum, stop) => sum + (stop.activities?.reduce((a, act) => a + (act.cost || 0), 0) || 0), 0) || 0;

  const [budgetLimit, setBudgetLimit] = useState(trip.budget || 5000);
  const [costs, setCosts] = useState({
    Activities: totalBudget,
    Accommodation: Math.round(totalBudget * 1.5),
    Transport: Math.round(totalBudget * 0.8),
    Food: Math.round(totalBudget * 1.2)
  });

  const handleCostChange = (cat, val) => {
    const newCosts = { ...costs, [cat]: parseInt(val) || 0 };
    setCosts(newCosts);
    dispatch({ type: 'UPDATE_TRIP_BUDGET', payload: { tripId: trip.id, budget: budgetLimit, categoryCosts: newCosts } });
  };

  const handleLimitChange = (val) => {
    const limit = parseInt(val) || 0;
    setBudgetLimit(limit);
    dispatch({ type: 'UPDATE_TRIP_BUDGET', payload: { tripId: trip.id, budget: limit, categoryCosts: costs } });
  };

  const totalEstCost = Object.values(costs).reduce((a, b) => a + b, 0);
  const isOverBudget = totalEstCost > budgetLimit;
  const budgetProgress = Math.min(100, (totalEstCost / budgetLimit) * 100);

  const chartData = {
    labels: Object.keys(costs),
    datasets: [
      {
        data: Object.values(costs),
        backgroundColor: ['rgba(99,102,241,0.8)', 'rgba(16,185,129,0.8)', 'rgba(245,158,11,0.8)', 'rgba(244,63,94,0.8)'],
        borderColor: ['rgba(99,102,241,1)', 'rgba(16,185,129,1)', 'rgba(245,158,11,1)', 'rgba(244,63,94,1)'],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    plugins: { legend: { position: 'bottom', labels: { color: '#f1f5f9' } } }
  };

  return (
    <div className="page-container content-wrapper">
      <div className="orb orb-1" />
      <button className="btn-secondary back-btn mb-4" onClick={() => navigate(`/trip/${trip.id}/itinerary`)}>Back to Itinerary</button>
      
      <div className="page-header animate-fade-in-up">
        <h1><PieChart size={28} /> Budget Breakdown</h1>
        <p>Estimated costs for {trip.name}</p>
      </div>

      <div className="budget-grid animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="glass-card p-6 flex flex-col justify-center">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-secondary">Budget Status</h3>
            <span className={`font-bold ${isOverBudget ? 'text-rose' : 'text-emerald'}`}>
              {Math.round(budgetProgress)}%
            </span>
          </div>
          <div className="progress-bar mb-4">
            <div 
              className={`progress-fill ${isOverBudget ? 'bg-rose' : 'bg-emerald'}`} 
              style={{ width: `${budgetProgress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm">
            <span>Spent: ${totalEstCost.toLocaleString()}</span>
            <span>Limit: ${budgetLimit.toLocaleString()}</span>
          </div>
          <div className="mt-4">
            <label className="text-xs font-semibold block mb-1">Set Budget Limit</label>
            <input 
              type="number" 
              value={budgetLimit} 
              onChange={(e) => handleLimitChange(e.target.value)}
              className="bg-glass border border-glass rounded p-2 w-full text-sm"
            />
          </div>
        </div>

        <div className="glass-card p-6 flex items-center justify-center">
          <div style={{ width: '100%', maxWidth: '300px' }}>
            <Pie data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="glass-card p-6 col-span-full">
          <h3 className="mb-4 text-xl">Adjust Spending</h3>
          <div className="flex flex-col gap-6">
            {Object.entries(costs).map(([key, value]) => (
              <div key={key} className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{key}</span>
                  <span className="font-bold text-emerald">${value.toLocaleString()}</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max={budgetLimit} 
                  value={value} 
                  onChange={(e) => handleCostChange(key, e.target.value)}
                  className="w-full h-2 bg-glass rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        .mb-4 { margin-bottom: 16px; }
        .mb-2 { margin-bottom: 8px; }
        .p-6 { padding: 24px; }
        .p-4 { padding: 16px; }
        .p-2 { padding: 8px; }
        .flex { display: flex; }
        .flex-col { flex-direction: column; }
        .items-center { align-items: center; }
        .justify-center { justify-content: center; }
        .justify-between { justify-content: space-between; }
        .text-center { text-align: center; }
        .text-4xl { font-size: 2.5rem; }
        .text-xl { font-size: 1.25rem; }
        .text-lg { font-size: 1.125rem; }
        .text-sm { font-size: 0.875rem; }
        .font-bold { font-weight: 700; }
        .font-semibold { font-weight: 600; }
        .text-emerald { color: #34d399; }
        .bg-emerald { background: #34d399; }
        .text-rose { color: #fb7185; }
        .bg-rose { background: #fb7185; }
        .text-warm { color: var(--accent-warm); }
        .text-secondary { color: var(--text-secondary); }
        .bg-warm-alpha { background: rgba(245,158,11,0.15); }
        .rounded-md { border-radius: var(--radius-md); }
        .rounded-lg { border-radius: var(--radius-lg); }
        .gap-2 { gap: 8px; }
        .gap-4 { gap: 16px; }
        .border { border: 1px solid var(--border-glass); }
        .bg-glass-hover { background: var(--bg-glass-hover); }
        .budget-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .col-span-full { grid-column: 1 / -1; }
        @media (max-width: 768px) { .budget-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
