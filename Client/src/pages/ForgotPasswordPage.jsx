import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Logo } from '../components/Logo';
import { api } from '../api';

export default function ForgotPasswordPage() {
  const [email,   setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.auth.forgotPassword({ email });
      setSent(true);
    } catch (err) {
      setError('Something went wrong. Please try again.');
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
            <Link
              to="/login"
              className="text-secondary text-decoration-none small d-flex align-items-center gap-1 mb-4 fw-bold"
              style={{ width: 'fit-content' }}
            >
              <ArrowLeft size={16} />
              Back to sign in
            </Link>

            <div className="text-center mb-4">
              <div className="d-inline-flex align-items-center justify-content-center bg-success bg-opacity-10 rounded-3 p-3 mb-3">
                <Logo size={48} />
              </div>
              <h2 className="fw-bold text-dark mb-1">Forgot your password?</h2>
              <p className="text-secondary mb-0">
                Enter your email and we'll send you a reset link.
              </p>
            </div>

            {sent ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-3"
              >
                <div
                  className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: '64px', height: '64px' }}
                >
                  <CheckCircle2 className="text-success" size={32} />
                </div>
                <h5 className="fw-bold text-dark mb-2">Check your inbox</h5>
                <p className="text-secondary small mb-4">
                  If <strong>{email}</strong> is registered with MediWell, you'll receive
                  a reset link shortly. Check your spam folder if you don't see it.
                </p>
                <Link
                  to="/login"
                  className="btn btn-success fw-bold w-100 py-2 rounded-3"
                >
                  Back to sign in
                </Link>
              </motion.div>
            ) : (
              <>
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
                  <div className="mb-4">
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

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-success w-100 py-2 fw-bold rounded-3 d-flex align-items-center justify-content-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                        Sending...
                      </>
                    ) : (
                      'Send Reset Link'
                    )}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
