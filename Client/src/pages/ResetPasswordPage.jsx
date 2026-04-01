import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Logo } from '../components/Logo';
import { api } from '../api';
import { useToast } from '../context/ToastContext';

export default function ResetPasswordPage() {
  const [searchParams]                      = useSearchParams();
  const token                               = searchParams.get('token');
  const navigate                            = useNavigate();
  const { showToast }                       = useToast();

  const [password,        setPassword]        = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword,    setShowPassword]    = useState(false);
  const [loading,         setLoading]         = useState(false);
  const [done,            setDone]            = useState(false);
  const [error,           setError]           = useState('');

  if (!token) {
    return (
      <div className="container py-5">
        <div
          className="row justify-content-center align-items-center"
          style={{ minHeight: 'calc(100vh - 150px)' }}
        >
          <div className="col-md-5">
            <div className="card p-4 p-md-5 shadow-lg border-0 text-center">
              <div
                className="bg-danger bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3 mx-auto"
                style={{ width: '64px', height: '64px' }}
              >
                <AlertCircle className="text-danger" size={32} />
              </div>
              <h5 className="fw-bold text-dark mb-2">Invalid reset link</h5>
              <p className="text-secondary small mb-4">
                This password reset link is missing or malformed. Please request a new one.
              </p>
              <Link to="/forgot-password" className="btn btn-success fw-bold w-100 py-2 rounded-3">
                Request new link
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }
    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }

    setLoading(true);
    try {
      await api.auth.resetPassword({ token, password });
      setDone(true);
      showToast('Password reset! Please sign in with your new password.', 'success');
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError(
        err.message?.includes('400')
          ? 'This reset link has expired or is invalid. Please request a new one.'
          : 'Something went wrong. Please try again.'
      );
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
              <h2 className="fw-bold text-dark mb-1">Choose a new password</h2>
              <p className="text-secondary mb-0">
                Make it strong — at least 6 characters.
              </p>
            </div>

            {done ? (
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
                <h5 className="fw-bold text-dark mb-2">Password updated!</h5>
                <p className="text-secondary small mb-0">
                  Redirecting you to sign in...
                </p>
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
                    <span>
                      {error}{' '}
                      {error.includes('expired') && (
                        <Link to="/forgot-password" className="text-danger fw-bold">
                          Request a new link →
                        </Link>
                      )}
                    </span>
                  </motion.div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-secondary">
                      New Password
                    </label>
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
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="input-group-text bg-light border-0"
                        tabIndex={-1}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword
                          ? <EyeOff size={18} className="text-secondary" />
                          : <Eye    size={18} className="text-secondary" />}
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label small fw-bold text-secondary">
                      Confirm New Password
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0">
                        <Lock size={18} className="text-secondary" />
                      </span>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="form-control bg-light border-0 py-2"
                        placeholder="••••••••"
                        autoComplete="new-password"
                      />
                    </div>
                  </div>

                  {password.length > 0 && (
                    <div className="mb-4">
                      <div className="d-flex gap-1 mb-1">
                        {[1, 2, 3, 4].map((level) => (
                          <div
                            key={level}
                            className="flex-grow-1 rounded-pill"
                            style={{
                              height: '4px',
                              background:
                                password.length >= level * 3
                                  ? level <= 1 ? '#ef4444'
                                  : level <= 2 ? '#f59e0b'
                                  : level <= 3 ? '#3b82f6'
                                  : '#059669'
                                  : '#e2e8f0',
                              transition: 'background 0.3s',
                            }}
                          />
                        ))}
                      </div>
                      <p className="small text-secondary mb-0" style={{ fontSize: '11px' }}>
                        {password.length < 6  ? 'Too short'  :
                         password.length < 9  ? 'Fair'       :
                         password.length < 12 ? 'Good'       : 'Strong'}
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-success w-100 py-2 fw-bold rounded-3 d-flex align-items-center justify-content-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                        Updating...
                      </>
                    ) : (
                      'Reset Password'
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
