import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useTravel } from '../store/TravelContext';
import { Home, PlusCircle, Map, Search, Compass, Users, LogOut, Menu, X, Plane, Shield, ChevronLeft, ChevronRight, Sparkles, User } from 'lucide-react';
import { useState } from 'react';
import './Sidebar.css';

export default function Sidebar({ collapsed, setCollapsed }) {
  const { state, dispatch } = useTravel();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const mainLinks = [
    { to: '/dashboard', icon: <Home size={20} />, label: 'Dashboard' },
    { to: '/profile', icon: <User size={20} />, label: 'My Profile' },
    { to: '/trips', icon: <Map size={20} />, label: 'My Trips' },
    { to: '/create-trip', icon: <PlusCircle size={20} />, label: 'New Trip' },
  ];

  const discoverLinks = [
    { to: '/cities', icon: <Search size={20} />, label: 'Explore Cities' },
    { to: '/activities', icon: <Compass size={20} />, label: 'Activities' },
    { to: '/community', icon: <Users size={20} />, label: 'Community' },
  ];

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/');
  };

  const renderLink = (link) => (
    <NavLink
      key={link.to}
      to={link.to}
      className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
      onClick={() => setMobileOpen(false)}
      id={`nav-${link.to.slice(1)}`}
      title={collapsed ? link.label : undefined}
    >
      <span className="nav-icon">{link.icon}</span>
      {!collapsed && <span className="nav-label">{link.label}</span>}
      {!collapsed && <span className="nav-indicator"></span>}
    </NavLink>
  );

  return (
    <>
      <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} id="sidebar-toggle">
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      {mobileOpen && <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />}
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-header">
          <div className="sidebar-logo" onClick={() => navigate('/dashboard')}>
            <div className="logo-icon">
              <Plane size={20} />
            </div>
            {!collapsed && <span className="logo-text">Traveloop</span>}
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="sidebar-nav">
          {!collapsed && <span className="nav-section-label">MAIN</span>}
          {mainLinks.map(renderLink)}

          {!collapsed && <span className="nav-section-label">DISCOVER</span>}
          {discoverLinks.map(renderLink)}

          {!collapsed && <span className="nav-section-label">MANAGE</span>}
          {renderLink({ to: '/admin', icon: <Shield size={20} />, label: 'Admin Panel' })}
        </nav>

        {/* Quick Create CTA */}
        {!collapsed && (
          <div className="sidebar-cta" onClick={() => navigate('/create-trip')}>
            <Sparkles size={18} />
            <div className="cta-text">
              <span className="cta-title">Plan a Trip</span>
              <span className="cta-sub">Create your next adventure</span>
            </div>
          </div>
        )}

        {/* Collapse Toggle */}
        <button className="collapse-toggle desktop-only" onClick={() => setCollapsed(!collapsed)} id="sidebar-collapse" title={collapsed ? 'Expand' : 'Collapse'}>
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        {/* Footer */}
        <div className="sidebar-footer">
          {state.user && !collapsed && (
            <div className="user-info">
              <div className="user-avatar-sb overflow-hidden">
                {state.user.name?.[0]?.toUpperCase() || '?'}
              </div>
              <div className="user-details-sb">
                <span className="user-name-sb">{state.user.name}</span>
                <span className="user-email-sb">{state.user.email}</span>
              </div>
            </div>
          )}
          {state.user && collapsed && (
            <div className="user-info collapsed-user">
              <div className="user-avatar-sb overflow-hidden">
                {state.user.name?.[0]?.toUpperCase() || '?'}
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
