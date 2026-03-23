import { createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, History, Heart, BarChart3, User as UserIcon, LogOut, Menu,X} from 'lucide-react';
import { LogoWithText } from './components/Logo';
import { api } from './api';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import PropTypes from 'prop-types';

const AuthContext = createContext(null);

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Add Med', path: '/add-medication', icon: PlusCircle },
    { name: 'History', path: '/history', icon: History },
    { name: 'Wellness', path: '/wellness', icon: Heart },
    { name: 'Reports', path: '/reports', icon: BarChart3 },
    { name: 'Profile', path: '/profile', icon: UserIcon },
  ];

  if (!user) return null;

  return (
    <nav className="navbar navbar-expand-md navbar-light bg-white border-bottom sticky-top">
      <div className="container">
        <Link to="/dashboard" className="navbar-brand d-flex align-items-center">
          <LogoWithText size={32} />
        </Link>

        <button 
          className="navbar-toggler border-0" 
          type="button" 
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`}>
          <ul className="navbar-nav ms-auto align-items-md-center">
            {navItems.map((item) => (
              <li key={item.path} className="nav-item">
                <Link
                  to={item.path}
                  className="nav-link d-flex align-items-center gap-2 px-3"
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon size={16} />
                  {item.name}
                </Link>
              </li>
            ))}
            <li className="nav-item ms-md-2">
              <button
                onClick={() => { logout(); navigate('/'); setIsOpen(false); }}
                className="btn btn-link nav-link d-flex align-items-center gap-2 text-danger border-0"
              >
                <LogOut size={16} />
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AddMedication from './pages/AddMedication.jsx';
import MedicationHistory from './pages/MedicationHistory.jsx';
import WellnessTracker from './pages/WellnessTracker.jsx';
import Reports from './pages/Reports.jsx';
import Profile from './pages/Profile.jsx';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="vh-100 d-flex align-items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired
};

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await api.auth.me();
          setUser(userData);
        } catch (err) {
          console.error('Auth init failed:', err);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      <BrowserRouter>
        <div className="min-vh-100 d-flex flex-column">
          <Navbar />
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/add-medication" element={<ProtectedRoute><AddMedication /></ProtectedRoute>} />
              <Route path="/history" element={<ProtectedRoute><MedicationHistory /></ProtectedRoute>} />
              <Route path="/wellness" element={<ProtectedRoute><WellnessTracker /></ProtectedRoute>} />
              <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}
