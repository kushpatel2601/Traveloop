import { NavLink, useNavigate } from 'react-router-dom';
import { useTravel } from '../store/TravelContext';
import { Home, PlusCircle, Map, Search, Compass, DollarSign, CheckSquare, Users, BookOpen, LogOut, Menu, X, Plane, Shield } from 'lucide-react';
import { useState } from 'react';
import './Sidebar.css';

export default function Sidebar() {
  const { state, dispatch } = useTravel();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { to: '/dashboard', icon: <Home size={20} />, label: 'Dashboard' },
    { to: '/trips', icon: <Map size={20} />, label: 'My Trips' },
    { to: '/create-trip', icon: <PlusCircle size={20} />, label: 'New Trip' },
    { to: '/cities', icon: <Search size={20} />, label: 'Explore Cities' },
    { to: '/activities', icon: <Compass size={20} />, label: 'Activities' },
    { to: '/community', icon: <Users size={20} />, label: 'Community' },
    { to: '/admin', icon: <Shield size={20} />, label: 'Admin Panel' },
  ];

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/');
  };

  return (
    <>
      <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} id="sidebar-toggle">
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      {mobileOpen && <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />}
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo" onClick={() => navigate('/dashboard')}>
            <div className="logo-icon"><Plane size={22} /></div>
            {!collapsed && <span className="logo-text">Traveloop</span>}
          </div>
          <button className="collapse-btn desktop-only" onClick={() => setCollapsed(!collapsed)} id="sidebar-collapse">
            {collapsed ? <Menu size={18} /> : <X size={18} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
              id={`nav-${link.to.slice(1)}`}
            >
              <span className="nav-icon">{link.icon}</span>
              {!collapsed && <span className="nav-label">{link.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          {state.user && !collapsed && (
            <div className="user-info">
              <div className="user-avatar">{state.user.name?.[0]?.toUpperCase() || '?'}</div>
              <div className="user-details">
                <span className="user-name">{state.user.name}</span>
                <span className="user-email">{state.user.email}</span>
              </div>
            </div>
          )}
          <button className="nav-link logout-btn" onClick={handleLogout} id="logout-btn">
            <span className="nav-icon"><LogOut size={20} /></span>
            {!collapsed && <span className="nav-label">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
