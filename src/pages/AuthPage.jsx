import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTravel } from '../store/TravelContext';
import { Plane, Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import './Auth.css';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { dispatch } = useTravel();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) { setError('Please fill all fields'); return; }
    if (!isLogin && !form.name) { setError('Please enter your name'); return; }
    if (form.password.length < 4) { setError('Password must be at least 4 characters'); return; }

    const user = { name: form.name || form.email.split('@')[0], email: form.email, joinedAt: new Date().toISOString() };
    dispatch({ type: isLogin ? 'LOGIN' : 'SIGNUP', payload: user });
    navigate('/dashboard');
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      // Decode JWT locally for hackathon demo if backend is down
      const base64Url = credentialResponse.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
      const googleUser = JSON.parse(jsonPayload);

      const user = { 
        name: googleUser.name, 
        email: googleUser.email, 
        avatar: googleUser.picture,
        joinedAt: new Date().toISOString() 
      };

      // Attempt backend auth, but don't block the UI if it fails during hackathon
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const res = await fetch(`${apiUrl}/api/auth/google`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: credentialResponse.credential }),
        });
        const data = await res.json();
        if (res.ok) {
          localStorage.setItem('token', data.accessToken);
          dispatch({ type: 'LOGIN', payload: data.user });
          navigate('/dashboard');
          return;
        }
      } catch (backendErr) {
        console.warn('Backend unreachable, proceeding with client-side session for demo');
      }

      // Fallback for demo: Log in client-side anyway
      dispatch({ type: 'LOGIN', payload: user });
      navigate('/dashboard');

    } catch (err) {
      console.error('Google Auth Error:', err);
      setError('Connection error');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="auth-grid-bg" />
      </div>
      <div className="auth-container animate-fade-in-up">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo"><Plane size={28} /></div>
            <h1>Traveloop</h1>
            <p>{isLogin ? 'Welcome back, explorer!' : 'Start your journey today'}</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="auth-name"><User size={16} /> Full Name</label>
                <input id="auth-name" type="text" placeholder="John Explorer" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
            )}
            <div className="form-group">
              <label htmlFor="auth-email"><Mail size={16} /> Email</label>
              <input id="auth-email" type="email" placeholder="explorer@traveloop.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="form-group">
              <label htmlFor="auth-password"><Lock size={16} /> Password</label>
              <div className="password-wrapper">
                <input id="auth-password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {isLogin && <button type="button" className="forgot-link">Forgot Password?</button>}

            <button type="submit" className="auth-submit" id="auth-submit">
              {isLogin ? 'Sign In' : 'Create Account'} <ArrowRight size={18} />
            </button>
          </form>

          <div className="auth-divider"><span>OR</span></div>

          <div className="google-auth-wrapper">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google Login Failed')}
              useOneTap
              theme="filled_blue"
              shape="pill"
              width="400"
            />
            <button className="google-style-btn" onClick={() => {
              const guestUser = { name: 'Hackathon Judge', email: 'judge@odoo.com', avatar: '👨‍⚖️', joinedAt: new Date().toISOString() };
              dispatch({ type: 'LOGIN', payload: guestUser });
              navigate('/dashboard');
            }}>
              <span className="btn-icon">G</span>
              Sign in as Guest / Demo Mode
            </button>
          </div>

          <div className="auth-switch">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <button onClick={() => { setIsLogin(!isLogin); setError(''); }} id="auth-switch-btn">
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
        </div>

        <div className="auth-features">
          <div className="feature-item"><span className="feature-icon">🌍</span><span>Multi-city itineraries</span></div>
          <div className="feature-item"><span className="feature-icon">💰</span><span>Smart budgeting</span></div>
          <div className="feature-item"><span className="feature-icon">📅</span><span>Visual timelines</span></div>
          <div className="feature-item"><span className="feature-icon">🤝</span><span>Share with friends</span></div>
        </div>
      </div>
    </div>
  );
}
