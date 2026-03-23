import { useState, useEffect } from 'react';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  Settings, 
  Bell, 
  Lock, 
  Shield,
  Camera
} from 'lucide-react';
import { api } from '../api';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await api.auth.me();
        setUser(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) return <div className="container py-5 text-center">Loading profile...</div>;

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
                <div className="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center border border-4 border-white shadow" style={{ width: '120px', height: '120px' }}>
                  <UserIcon className="text-success" size={60} />
                </div>
                <button className="btn btn-white btn-sm rounded-circle shadow-sm border position-absolute bottom-0 end-0 p-2">
                  <Camera size={18} className="text-secondary" />
                </button>
              </div>
            </div>
            <div className="col text-center text-md-start">
              <h2 className="h3 fw-bold text-dark mb-1">{user?.fullName}</h2>
              <p className="text-secondary mb-3">{user?.email}</p>
              <div className="d-flex flex-wrap justify-content-center justify-content-md-start gap-2">
                <span className="badge rounded-pill bg-success bg-opacity-10 text-success px-3 py-2 small border border-success border-opacity-25">
                  Premium Member
                </span>
                <span className="badge rounded-pill bg-light text-secondary px-3 py-2 small border">
                  Joined Feb 2026
                </span>
              </div>
            </div>
            <div className="col-md-auto">
              <button className="btn btn-dark fw-bold px-4 py-2 rounded-3 w-100">
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
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-light rounded-3 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                    <Mail className="text-secondary" size={20} />
                  </div>
                  <div>
                    <p className="x-small fw-bold text-secondary text-uppercase tracking-wider mb-0">Email Address</p>
                    <p className="fw-bold text-dark mb-0">{user?.email}</p>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-light rounded-3 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                    <Phone className="text-secondary" size={20} />
                  </div>
                  <div>
                    <p className="x-small fw-bold text-secondary text-uppercase tracking-wider mb-0">Phone Number</p>
                    <p className="fw-bold text-dark mb-0">{user?.phone || 'Not provided'}</p>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-light rounded-3 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                    <Lock className="text-secondary" size={20} />
                  </div>
                  <div>
                    <p className="x-small fw-bold text-secondary text-uppercase tracking-wider mb-0">Password</p>
                    <p className="fw-bold text-dark mb-0">••••••••••••</p>
                  </div>
                </div>
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
                {[
                  { label: 'Push Notifications', desc: 'Get reminders on your device', icon: Bell, active: true },
                  { label: 'Caregiver Alerts', desc: 'Notify others if you miss a dose', icon: Shield, active: false },
                  { label: 'Weekly Summary', desc: 'Receive email health reports', icon: Settings, active: true },
                ].map((pref, i) => (
                  <div key={i} className="list-group-item p-4 d-flex align-items-center justify-content-between border-0 border-bottom">
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-light rounded-3 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                        <pref.icon className="text-secondary" size={20} />
                      </div>
                      <div>
                        <p className="small fw-bold text-dark mb-0">{pref.label}</p>
                        <p className="x-small text-secondary mb-0">{pref.desc}</p>
                      </div>
                    </div>
                    <div className="form-check form-switch">
                      <input className="form-check-input" type="checkbox" checked={pref.active} readOnly style={{ cursor: 'pointer' }} />
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
          <button className="btn btn-danger fw-bold px-4 py-2 rounded-3">
            Delete Account
          </button>
        </section>
      </div>
    </div>
  );
}
