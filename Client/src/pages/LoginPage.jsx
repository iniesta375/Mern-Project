import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Logo } from '../components/Logo';
import { api } from '../api';
import { AuthContext } from '../App';
import { useToast } from '../context/ToastContext';
import { signInWithGoogle } from '../firebase';

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]               = useState('');
  const [loading, setLoading]           = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

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

  const handleGoogleLogin = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      const { idToken } = await signInWithGoogle();
      const { token, user } = await api.auth.googleLogin({ idToken });
      login(token, user);
      showToast(`Welcome, ${user?.fullName?.split(' ')[0] ?? 'there'}!`, 'success');
      navigate('/dashboard');
    } catch (err) {
      console.error('Google login error:', err);
      setError('Google sign-in failed. Please try again.');
    } finally {
      setGoogleLoading(false);
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

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading || loading}
              className="btn btn-white w-100 py-2 mb-3 rounded-3 border d-flex align-items-center justify-content-center gap-3 fw-bold text-dark"
              style={{ background: '#fff', borderColor: '#dee2e6' }}
            >
              {googleLoading ? (
                <span className="spinner-border spinner-border-sm text-secondary" />
              ) : (
                <svg width="20" height="20" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.7 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.1-4z"/>
                  <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4c-7.7 0-14.3 4.4-17.7 10.7z"/>
                  <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.4 35.5 26.8 36 24 36c-5.2 0-9.6-2.9-11.3-7.1l-6.5 5C9.7 39.6 16.4 44 24 44z"/>
                  <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.4-2.5 4.4-4.6 5.8l6.2 5.2C40.7 35.7 44 30.3 44 24c0-1.3-.1-2.7-.4-4z"/>
                </svg>
              )}
              {googleLoading ? 'Signing in...' : 'Continue with Google'}
            </button>

            <div className="d-flex align-items-center gap-3 mb-3">
              <hr className="flex-grow-1 m-0" />
              <span className="text-secondary small">or</span>
              <hr className="flex-grow-1 m-0" />
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-bold text-secondary">Email Address</label>
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
                  <label className="form-label small fw-bold text-secondary mb-0">Password</label>
                  <Link to="/forgot-password" className="text-success text-decoration-none small fw-bold">
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
                  >
                    {showPassword
                      ? <EyeOff size={18} className="text-secondary" />
                      : <Eye size={18} className="text-secondary" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || googleLoading}
                className="btn btn-success w-100 py-2 fw-bold rounded-3 d-flex align-items-center justify-content-center gap-2"
              >
                {loading
                  ? <><span className="spinner-border spinner-border-sm" /> Signing in...</>
                  : <>Sign In <ArrowRight size={18} /></>}
              </button>
            </form>

            <div className="text-center mt-4">
              <p className="text-secondary small mb-0">
                Don&apos;t have an account?{' '}
                <Link to="/register" className="text-success text-decoration-none fw-bold">
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