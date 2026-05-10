import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TravelProvider, useTravel } from './store/TravelContext';
import Sidebar from './components/Sidebar';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import CreateTrip from './pages/CreateTrip';
import TripList from './pages/TripList';
import ItineraryBuilder from './pages/ItineraryBuilder';
import CitySearch from './pages/CitySearch';
import ActivitySearch from './pages/ActivitySearch';
import BudgetBreakdown from './pages/BudgetBreakdown';
import PackingChecklist from './pages/PackingChecklist';
import CommunityTab from './pages/CommunityTab';
import AdminPanel from './pages/AdminPanel';
import TripNotes from './pages/TripNotes';
import ProfilePage from './pages/ProfilePage';
import './App.css';

const ProtectedLayout = ({ children }) => {
  const { state } = useTravel();
  const [collapsed, setCollapsed] = useState(false);
  if (!state.user) return <Navigate to="/" replace />;
  return (
    <div className="app-layout">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main className="main-content" style={{ marginLeft: collapsed ? '72px' : '260px' }}>
        {children}
      </main>
    </div>
  );
};

const ProtectedRoute = ({ children }) => (
  <ProtectedLayout>{children}</ProtectedLayout>
);



function AppRoutes() {
  const { state } = useTravel();
  
  return (
    <Routes>
      <Route path="/" element={state.user ? <Navigate to="/dashboard" replace /> : <AuthPage />} />
      
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/trips" element={<ProtectedRoute><TripList /></ProtectedRoute>} />
      <Route path="/create-trip" element={<ProtectedRoute><CreateTrip /></ProtectedRoute>} />
      <Route path="/trip/:id/itinerary" element={<ProtectedRoute><ItineraryBuilder /></ProtectedRoute>} />
      <Route path="/trip/:id/budget" element={<ProtectedRoute><BudgetBreakdown /></ProtectedRoute>} />
      <Route path="/trip/:id/packing" element={<ProtectedRoute><PackingChecklist /></ProtectedRoute>} />
      <Route path="/trip/:id/notes" element={<ProtectedRoute><TripNotes /></ProtectedRoute>} />
      <Route path="/cities" element={<ProtectedRoute><CitySearch /></ProtectedRoute>} />
      <Route path="/activities" element={<ProtectedRoute><ActivitySearch /></ProtectedRoute>} />
      <Route path="/community" element={<ProtectedRoute><CommunityTab /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
      
      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <TravelProvider>
      <Router>
        <AppRoutes />
      </Router>
    </TravelProvider>
  );
}

export default App;
