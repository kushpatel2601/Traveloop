import { useState } from 'react';
import { Shield, Users, Activity, Map, Search, Edit3, Trash2, Plus } from 'lucide-react';
import { useTravel } from '../store/TravelContext';

export default function AdminPanel() {
  const { state } = useTravel();
  const [activeTab, setActiveTab] = useState('users');

  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active', trips: 4, avatar: '👨‍💼' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Active', trips: 12, avatar: '👩‍💼' },
    { id: 3, name: 'Alex Johnson', email: 'alex@example.com', status: 'Suspended', trips: 0, avatar: '🧑‍💻' },
    { id: 4, name: 'Maya Explorer', email: 'maya@example.com', status: 'Active', trips: 7, avatar: '🧕' },
  ];

  return (
    <div className="page-container content-wrapper">
      <div className="orb orb-1" />
      <div className="page-header animate-fade-in-up">
        <h1><Shield size={28} /> Admin Dashboard</h1>
        <p>Manage users, content, and platform analytics</p>
      </div>

      <div className="admin-grid animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="glass-card p-6 flex flex-col gap-2">
          <button className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
            <Users size={18} /> Manage Users
          </button>
          <button className={`admin-tab ${activeTab === 'cities' ? 'active' : ''}`} onClick={() => setActiveTab('cities')}>
            <Map size={18} /> Popular Cities
          </button>
          <button className={`admin-tab ${activeTab === 'activities' ? 'active' : ''}`} onClick={() => setActiveTab('activities')}>
            <Activity size={18} /> Popular Activities
          </button>
        </div>

        <div className="glass-card p-6">
          {activeTab === 'users' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl">User Management</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
                  <input type="text" placeholder="Search users..." className="pl-10 h-10 rounded-md bg-glass border border-glass" />
                </div>
              </div>
              
              <div className="flex flex-col gap-4">
                {users.map(user => (
                  <div key={user.id} className="flex items-center justify-between p-4 border border-glass rounded-lg hover-bg-glass">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{user.avatar}</div>
                      <div>
                        <h4 className="font-semibold">{user.name}</h4>
                        <span className="text-sm text-secondary">{user.email}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-sm text-secondary text-right">
                        <div><span className="font-bold text-primary">{user.trips}</span> trips</div>
                        <div className={user.status === 'Active' ? 'text-emerald' : 'text-rose'}>{user.status}</div>
                      </div>
                      <button className="btn-secondary sm">Edit</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'cities' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl">City Management</h3>
                <button className="btn-primary sm"><Plus size={16} /> Add City</button>
              </div>
              <div className="flex flex-col gap-4">
                {state.cities.map(city => (
                  <div key={city.id} className="flex items-center justify-between p-4 border border-glass rounded-lg hover-bg-glass">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{city.image}</div>
                      <div>
                        <h4 className="font-semibold">{city.name}</h4>
                        <span className="text-sm text-secondary">{city.country} · {city.region}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <button className="btn-secondary sm"><Edit3 size={14} /></button>
                      <button className="btn-icon btn-danger sm"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'activities' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl">Activity Management</h3>
                <button className="btn-primary sm"><Plus size={16} /> Add Activity</button>
              </div>
              <div className="flex flex-col gap-4">
                {state.activities.map(act => (
                  <div key={act.id} className="flex items-center justify-between p-4 border border-glass rounded-lg hover-bg-glass">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{act.image}</div>
                      <div>
                        <h4 className="font-semibold">{act.name}</h4>
                        <span className="text-sm text-secondary">{act.type} · ${act.cost}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <button className="btn-secondary sm"><Edit3 size={14} /></button>
                      <button className="btn-icon btn-danger sm"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .admin-grid { display: grid; grid-template-columns: 250px 1fr; gap: 24px; }
        .admin-tab { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: var(--radius-md); background: none; border: none; color: var(--text-secondary); text-align: left; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .admin-tab:hover { background: var(--bg-glass-hover); color: var(--text-primary); }
        .admin-tab.active { background: rgba(99,102,241,0.15); color: var(--accent-primary-hover); }
        
        .p-6 { padding: 24px; } .p-4 { padding: 16px; } .p-8 { padding: 32px; }
        .mb-6 { margin-bottom: 24px; }
        .flex { display: flex; } .flex-col { flex-direction: column; } .items-center { align-items: center; } .justify-between { justify-content: space-between; }
        .gap-2 { gap: 8px; } .gap-4 { gap: 16px; } .gap-6 { gap: 24px; }
        .relative { position: relative; } .absolute { position: absolute; } .left-3 { left: 12px; } .top-1\/2 { top: 50%; } .-translate-y-1\/2 { transform: translateY(-50%); }
        .pl-10 { padding-left: 40px; } .h-10 { height: 40px; }
        .rounded-md { border-radius: var(--radius-md); } .rounded-lg { border-radius: var(--radius-lg); }
        .border { border: 1px solid var(--border-glass); } .bg-glass { background: var(--bg-glass); }
        .hover-bg-glass:hover { background: var(--bg-glass-hover); }
        .text-xl { font-size: 1.25rem; } .text-3xl { font-size: 1.875rem; } .text-sm { font-size: 0.875rem; }
        .font-semibold { font-weight: 600; } .font-bold { font-weight: 700; }
        .text-primary { color: var(--text-primary); } .text-secondary { color: var(--text-secondary); } .text-muted { color: var(--text-muted); }
        .text-emerald { color: var(--accent-emerald); } .text-rose { color: var(--accent-rose); }
        .text-right { text-align: right; } .text-center { text-align: center; }
        .btn-secondary.sm { padding: 6px 16px; font-size: 0.85rem; }
        @media (max-width: 768px) { .admin-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
