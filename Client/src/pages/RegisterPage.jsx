import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Phone, AlertCircle, ArrowRight } from 'lucide-react';
import { Logo } from '../components/Logo';
import { api } from '../api';
import { useToast } from '../context/ToastContext';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match.');
    }
    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }

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
            className="card p-4 p-md-5 shadow-lg border-0"
          >
            <div className="text-center mb-4">
              <div className="d-inline-flex align-items-center justify-content-center bg-success bg-opacity-10 rounded-3 p-3 mb-3">
                <Logo size={48} />
              </div>
              <h2 className="fw-bold text-dark">Create your account</h2>
              <p className="text-secondary">Start managing your health with MediWell</p>
            </div>

            {error && (
              <div className="alert alert-danger d-flex align-items-center gap-2 border-0 rounded-3 small mb-4">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

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
                disabled={loading}
                className="btn btn-success w-100 py-2 fw-bold rounded-3 d-flex align-items-center justify-content-center gap-2"
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