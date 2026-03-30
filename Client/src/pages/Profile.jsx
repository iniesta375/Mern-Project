import { useState, useEffect, useContext } from 'react';
import {
  User as UserIcon,
  Mail,
  Phone,
  Settings,
  Bell,
  Lock,
  Shield,
  Camera,
  Save,
  X,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { AuthContext } from '../App';
import { useToast } from '../context/ToastContext';
import { SkeletonLine, SkeletonCard } from '../components/Skeleton';

export default function Profile() {
  const { user, logout } = useContext(AuthContext);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ fullName: '', phone: '' });
  const [editLoading, setEditLoading] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [prefs, setPrefs] = useState({
    pushNotifications: true,
    caregiverAlerts: false,
    weeklySummary: true,
  });
  const [savingPref, setSavingPref] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await api.auth.me();
        setProfileData(data);
        setEditForm({ fullName: data.fullName || '', phone: data.phone || '' });
        if (data.preferences) setPrefs(data.preferences);
      } catch (err) {
        showToast('Failed to load profile.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      const updated = await api.auth.updateProfile(editForm);
      setProfileData(updated);
      setShowEditModal(false);
      showToast('Profile updated successfully!', 'success');
    } catch (err) {
      showToast('Failed to update profile. Please try again.', 'error');
    } finally {
      setEditLoading(false);
    }
  };

  const handleToggle = async (key) => {
    const updated = { ...prefs, [key]: !prefs[key] };
    setPrefs(updated);
    setSavingPref(key);
    try {
      await api.auth.updatePreferences(updated);
      showToast('Preference saved.', 'success');
    } catch (err) {
      setPrefs(prefs); 
      showToast('Failed to save preference.', 'error');
    } finally {
      setSavingPref(null);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') return;
    setDeleteLoading(true);
    try {
      await api.auth.deleteAccount();
      logout();
      navigate('/');
      showToast('Your account has been deleted.', 'info');
    } catch (err) {
      showToast('Failed to delete account. Please try again.', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) return (
    <div className="container py-4">
      <SkeletonLine width="200px" height="32px" className="mb-2" />
      <SkeletonLine width="280px" height="18px" className="mb-4" />
      <SkeletonCard>
        <div className="d-flex gap-4 align-items-center">
          <SkeletonLine width="120px" height="120px" className="rounded-circle flex-shrink-0" />
          <div className="flex-grow-1">
            <SkeletonLine width="50%" height="24px" className="mb-2" />
            <SkeletonLine width="35%" height="16px" className="mb-3" />
            <SkeletonLine width="200px" height="32px" className="rounded-3" />
          </div>
        </div>
      </SkeletonCard>
    </div>
  );

  const PREFERENCES = [
    { key: 'pushNotifications', label: 'Push Notifications', desc: 'Get reminders on your device',       icon: Bell },
    { key: 'caregiverAlerts',   label: 'Caregiver Alerts',   desc: 'Notify others if you miss a dose',   icon: Shield },
    { key: 'weeklySummary',     label: 'Weekly Summary',     desc: 'Receive email health reports',        icon: Settings },
  ];

  return (
    <div className="container py-4">

      <header className="mb-4">
        <h1 className="h2 fw-bold text-dark mb-1">Profile & Settings</h1>
        <p className="text-secondary">Manage your account and preferences.</p>
      </header>

      <div className="vstack gap-4">

        <section className="card border-0 shadow-sm p-4 p-md-5">
          <div className="row g-4 align-items-center">
            <div className="col-auto">
              <div className="position-relative">
                <div
                  className="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center border border-4 border-white shadow"
                  style={{ width: '120px', height: '120px' }}
                >
                  <UserIcon className="text-success" size={60} />
                </div>
                <button className="btn btn-white btn-sm rounded-circle shadow-sm border position-absolute bottom-0 end-0 p-2">
                  <Camera size={18} className="text-secondary" />
                </button>
              </div>
            </div>

            <div className="col text-center text-md-start">
              <h2 className="h3 fw-bold text-dark mb-1">{profileData?.fullName}</h2>
              <p className="text-secondary mb-3">{profileData?.email}</p>
              <div className="d-flex flex-wrap justify-content-center justify-content-md-start gap-2">
                <span className="badge rounded-pill bg-success bg-opacity-10 text-success px-3 py-2 small border border-success border-opacity-25">
                  Active Member
                </span>
                <span className="badge rounded-pill bg-light text-secondary px-3 py-2 small border">
                  MediWell User
                </span>
              </div>
            </div>

            <div className="col-md-auto">
              <button
                onClick={() => setShowEditModal(true)}
                className="btn btn-dark fw-bold px-4 py-2 rounded-3 w-100"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </section>

        <div className="row g-4">

          <div className="col-md-6">
            <section className="card border-0 shadow-sm h-100 overflow-hidden">
              <div className="card-header bg-white border-bottom p-3">
                <h3 className="h6 fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                  <Settings className="text-success" size={18} />
                  Account Details
                </h3>
              </div>
              <div className="card-body p-4 vstack gap-4">
                {[
                  { icon: Mail,  label: 'Email Address', value: profileData?.email },
                  { icon: Phone, label: 'Phone Number',  value: profileData?.phone || 'Not provided' },
                  { icon: Lock,  label: 'Password',      value: '••••••••••••' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="d-flex align-items-center gap-3">
                    <div
                      className="bg-light rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                      style={{ width: '40px', height: '40px' }}
                    >
                      <Icon className="text-secondary" size={20} />
                    </div>
                    <div>
                      <p className="small fw-bold text-secondary text-uppercase mb-0" style={{ fontSize: '11px', letterSpacing: '.05em' }}>{label}</p>
                      <p className="fw-bold text-dark mb-0">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="col-md-6">
            <section className="card border-0 shadow-sm h-100 overflow-hidden">
              <div className="card-header bg-white border-bottom p-3">
                <h3 className="h6 fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                  <Bell className="text-success" size={18} />
                  Preferences
                </h3>
              </div>
              <div className="list-group list-group-flush">
                {PREFERENCES.map(({ key, label, desc, icon: Icon }) => (
                  <div
                    key={key}
                    className="list-group-item p-4 d-flex align-items-center justify-content-between border-0 border-bottom"
                  >
                    <div className="d-flex align-items-center gap-3">
                      <div
                        className="bg-light rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{ width: '40px', height: '40px' }}
                      >
                        <Icon className="text-secondary" size={20} />
                      </div>
                      <div>
                        <p className="small fw-bold text-dark mb-0">{label}</p>
                        <p className="small text-secondary mb-0">{desc}</p>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      {savingPref === key && (
                        <span className="spinner-border spinner-border-sm text-success" />
                      )}
                      <div className="form-check form-switch mb-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={prefs[key]}
                          onChange={() => handleToggle(key)}
                          style={{ cursor: 'pointer', width: '40px', height: '22px' }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        <section className="card border-0 shadow-sm bg-danger bg-opacity-10 p-4 d-flex flex-row justify-content-between align-items-center rounded-4">
          <div>
            <h3 className="h6 fw-bold text-danger mb-1">Danger Zone</h3>
            <p className="small text-danger opacity-75 mb-0">Permanently delete your account and all data.</p>
          </div>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="btn btn-danger fw-bold px-4 py-2 rounded-3 d-flex align-items-center gap-2"
          >
            <Trash2 size={16} />
            Delete Account
          </button>
        </section>
      </div>

      <AnimatePresence>
        {showEditModal && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1055 }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowEditModal(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="card border-0 shadow-lg p-4 mx-3"
              style={{ width: '100%', maxWidth: '460px' }}
            >
              <div className="d-flex align-items-center justify-content-between mb-4">
                <h5 className="fw-bold text-dark mb-0">Edit Profile</h5>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="btn btn-light btn-sm rounded-circle p-1"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleEditSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-secondary">Full Name</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0">
                      <UserIcon size={16} className="text-secondary" />
                    </span>
                    <input
                      type="text"
                      required
                      value={editForm.fullName}
                      onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                      className="form-control bg-light border-0 py-2"
                      placeholder="Your full name"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-bold text-secondary">Phone Number</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0">
                      <Phone size={16} className="text-secondary" />
                    </span>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="form-control bg-light border-0 py-2"
                      placeholder="+234 800 000 0000"
                    />
                  </div>
                </div>

                <div className="d-flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="btn btn-light fw-bold px-4 py-2 rounded-3 flex-grow-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editLoading}
                    className="btn btn-success fw-bold px-4 py-2 rounded-3 flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                  >
                    {editLoading
                      ? <><span className="spinner-border spinner-border-sm" /> Saving...</>
                      : <><Save size={16} /> Save Changes</>}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    
      <AnimatePresence>
        {showDeleteModal && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1055 }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowDeleteModal(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="card border-0 shadow-lg p-4 mx-3"
              style={{ width: '100%', maxWidth: '440px' }}
            >
              <div className="text-center mb-4">
                <div
                  className="bg-danger bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: '64px', height: '64px' }}
                >
                  <AlertTriangle className="text-danger" size={32} />
                </div>
                <h5 className="fw-bold text-dark mb-2">Delete your account?</h5>
                <p className="text-secondary small mb-0">
                  This will permanently delete your account, all medications, adherence history, and wellness logs. <strong>This cannot be undone.</strong>
                </p>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold text-secondary">
                  Type <span className="text-danger fw-bold">DELETE</span> to confirm
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  className="form-control bg-light border-0 py-2"
                  placeholder="Type DELETE here"
                />
              </div>

              <div className="d-flex gap-3">
                <button
                  onClick={() => { setShowDeleteModal(false); setDeleteConfirmText(''); }}
                  className="btn btn-light fw-bold px-4 py-2 rounded-3 flex-grow-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmText !== 'DELETE' || deleteLoading}
                  className="btn btn-danger fw-bold px-4 py-2 rounded-3 flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                >
                  {deleteLoading
                    ? <><span className="spinner-border spinner-border-sm" /> Deleting...</>
                    : <><Trash2 size={16} /> Delete Account</>}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}