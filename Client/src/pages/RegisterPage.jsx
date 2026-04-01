import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Phone, AlertCircle, ArrowRight } from 'lucide-react';
import { Logo } from '../components/Logo';
import { api } from '../api';
import { AuthContext } from '../App';
import { useToast } from '../context/ToastContext';
import { signInWithGoogle } from '../firebase';

export default function RegisterPage() {
  const { login } = useContext(AuthContext);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', password: '', confirmPassword: '',
  });
  const [error, setError]                 = useState('');
  const [loading, setLoading]             = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) return setError('Passwords do not match.');
    if (formData.password.length < 6) return setError('Password must be at least 6 characters.');
    setLoading(true);
    try {
      await api.auth.register({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });
      showToast('Account created! Please sign in.', 'success');
      navigate('/login');
    } catch (err) {
      setError('Registration failed. Email may already be in use.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      const { idToken } = await signInWithGoogle();
      const { token, user } = await api.auth.googleLogin({ idToken });
      login(token, user);
      showToast(`Welcome to MediWell, ${user?.fullName?.split(' ')[0]}!`, 'success');
      navigate('/dashboard');
    } catch (err) {
      console.error('Google register error:', err);
      setError('Google sign-in failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const fields = [
    { name: 'fullName',        label: 'Full Name',        type: 'text',     icon: User,  placeholder: 'e.g. Amaka Okonkwo' },
    { name: 'email',           label: 'Email Address',    type: 'email',    icon: Mail,  placeholder: 'you@gmail.com' },
    { name: 'phone',           label: 'Phone (Optional)', type: 'tel',      icon: Phone, placeholder: '+234 800 000 0000' },
    { name: 'password',        label: 'Password',         type: 'password', icon: Lock,  placeholder: '••••••••' },
    { name: 'confirmPassword', label: 'Confirm Password', type: 'password', icon: Lock,  placeholder: '••••••••' },
  ];

  return (
    <div className="container py-5">
      <div className="row justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 150px)' }}>
        <div className="col-md-6 col-lg-5">
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
              <h2 className="fw-bold text-dark mb-1">Create your account</h2>
              <p className="text-secondary mb-0">Start managing your health with MediWell</p>
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

            {/* Google Sign-Up button */}
            <button
              type="button"
              onClick={handleGoogleRegister}
              disabled={googleLoading || loading}
              className="btn w-100 py-2 mb-3 rounded-3 border d-flex align-items-center justify-content-center gap-3 fw-bold text-dark"
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
              {googleLoading ? 'Signing up...' : 'Continue with Google'}
            </button>

            {/* Divider */}
            <div className="d-flex align-items-center gap-3 mb-3">
              <hr className="flex-grow-1 m-0" />
              <span className="text-secondary small">or</span>
              <hr className="flex-grow-1 m-0" />
            </div>

            <form onSubmit={handleSubmit}>
              <div className="vstack gap-3 mb-4">
                {fields.map(({ name, label, type, icon: Icon, placeholder }) => (
                  <div key={name}>
                    <label className="form-label small fw-bold text-secondary">{label}</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0">
                        <Icon size={18} className="text-secondary" />
                      </span>
                      <input
                        type={type}
                        name={name}
                        required={name !== 'phone'}
                        value={formData[name]}
                        onChange={handleChange}
                        className="form-control bg-light border-0 py-2"
                        placeholder={placeholder}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={loading || googleLoading}
                className="btn btn-success w-100 py-2 fw-bold rounded-3 d-flex align-items-center justify-content-center gap-2"
              >
                {loading
                  ? <><span className="spinner-border spinner-border-sm" /> Creating account...</>
                  : <>Create Account <ArrowRight size={18} /></>}
              </button>
            </form>

            <div className="text-center mt-4">
              <p className="text-secondary small mb-0">
                Already have an account?{' '}
                <Link to="/login" className="text-success text-decoration-none fw-bold">Sign in</Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}