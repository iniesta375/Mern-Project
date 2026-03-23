import { useState } from 'react';
import { Link } from 'react-router-dom';
// import { motion } from 'motion/react';
import { Mail, Lock, User, Phone, AlertCircle, ArrowRight } from 'lucide-react';
import { Logo } from '../components/Logo';
import { api } from '../api';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  // const navigate = useNavigate(); // Removed unused

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    try {
      const { token } = await api.auth.register(formData);
      localStorage.setItem('token', token);
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 150px)' }}>
        <div className="col-md-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card p-4 p-md-5 shadow-lg border-0"
          >
            <div className="text-center mb-4">
              <div className="d-inline-flex align-items-center justify-content-center bg-success bg-opacity-10 rounded-3 p-3 mb-3">
                <Logo size={48} />
              </div>
              <h2 className="fw-bold text-dark">Create Account</h2>
              <p className="text-secondary">Start your wellness journey today</p>
            </div>

            {error && (
              <div className="alert alert-danger d-flex align-items-center gap-2 border-0 rounded-3 small mb-4">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label small fw-bold text-secondary">Full Name</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0">
                      <User size={18} className="text-secondary" />
                    </span>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="form-control bg-light border-0 py-2"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div className="col-12">
                  <label className="form-label small fw-bold text-secondary">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0">
                      <Mail size={18} className="text-secondary" />
                    </span>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="form-control bg-light border-0 py-2"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div className="col-12">
                  <label className="form-label small fw-bold text-secondary">Phone Number (Optional)</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0">
                      <Phone size={18} className="text-secondary" />
                    </span>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="form-control bg-light border-0 py-2"
                      placeholder="+234..."
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold text-secondary">Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0">
                      <Lock size={18} className="text-secondary" />
                    </span>
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="form-control bg-light border-0 py-2"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold text-secondary">Confirm Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0">
                      <Lock size={18} className="text-secondary" />
                    </span>
                    <input
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="form-control bg-light border-0 py-2"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-success w-100 py-2 fw-bold rounded-3 mt-4 d-flex align-items-center justify-content-center gap-2"
              >
                {loading ? 'Creating account...' : 'Create Account'}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            <div className="text-center mt-4">
              <p className="text-secondary small mb-0">
                Already have an account?{' '}
                <Link to="/login" className="text-success text-decoration-none fw-bold">
                  Sign in
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
