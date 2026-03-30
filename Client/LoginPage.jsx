import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Logo } from '../components/Logo';
import { api } from '../api';
import { AuthContext } from '../App';
import { useToast } from '../context/ToastContext';

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token, user } = await api.auth.login({ email, password });
      login(token, user);              
      showToast(`Welcome back, ${user?.fullName?.split(' ')[0] ?? 'there'}!`, 'success');
      navigate('/dashboard');          
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div
        className="row justify-content-center align-items-center"
        style={{ minHeight: 'calc(100vh - 150px)' }}
      >
        <div className="col-md-5">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="card p-4 p-md-5 shadow-lg border-0"
          >
            {/* Header */}
            <div className="text-center mb-4">
              <div className="d-inline-flex align-items-center justify-content-center bg-success bg-opacity-10 rounded-3 p-3 mb-3">
                <Logo size={48} />
              </div>
              <h2 className="fw-bold text-dark mb-1">Welcome back</h2>
              <p className="text-secondary mb-0">Sign in to your MediWell account</p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="alert alert-danger d-flex align-items-center gap-2 border-0 rounded-3 small mb-4"
              >
                <AlertCircle size={18} className="flex-shrink-0" />
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-bold text-secondary">
                  Email Address
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-0">
                    <Mail size={18} className="text-secondary" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control bg-light border-0 py-2"
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label small fw-bold text-secondary mb-0">
                    Password
                  </label>
                  <Link
                    to="#"
                    className="text-success text-decoration-none small fw-bold"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="input-group">
                  <span className="input-group-text bg-light border-0">
                    <Lock size={18} className="text-secondary" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control bg-light border-0 py-2"
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="input-group-text bg-light border-0"
                    style={{ cursor: 'pointer' }}
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword
                      ? <EyeOff size={18} className="text-secondary" />
                      : <Eye size={18} className="text-secondary" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-success w-100 py-2 fw-bold rounded-3 d-flex align-items-center justify-content-center gap-2"
              >
                {loading
                  ? <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                      Signing in...
                    </>
                  : <>
                      Sign In
                      <ArrowRight size={18} />
                    </>}
              </button>
            </form>

            <div className="text-center mt-4">
              <p className="text-secondary small mb-0">
                Don&apos;t have an account?{' '}
                <Link
                  to="/register"
                  className="text-success text-decoration-none fw-bold"
                >
                  Create one for free
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}