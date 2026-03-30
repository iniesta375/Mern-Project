import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'
import { Pill, Clock, Calendar, Plus, X, ArrowLeft, Save } from 'lucide-react';
import { api } from '../api';

export default function AddMedication() {
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: 'once daily',
    times: ['08:00'],
    startDate: new Date().toISOString().split('T')[0],
    endDate: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAddTime = () => {
    setFormData({ ...formData, times: [...formData.times, '12:00'] });
  };

  const handleRemoveTime = (index) => {
    const newTimes = formData.times.filter((_, i) => i !== index);
    setFormData({ ...formData, times: newTimes });
  };

  const handleTimeChange = (index, value) => {
    const newTimes = [...formData.times];
    newTimes[index] = value;
    setFormData({ ...formData, times: newTimes });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.medications.create(formData);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <button 
            onClick={() => navigate(-1)}
            className="btn btn-link text-secondary text-decoration-none p-0 mb-4 d-flex align-items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card border-0 shadow-lg overflow-hidden"
          >
            <div className="card-header bg-success bg-opacity-10 border-0 p-4">
              <div className="d-flex align-items-center gap-3">
                <div className="bg-success rounded-3 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                  <Pill className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="h4 fw-bold text-dark mb-0">Add Medication</h1>
                  <p className="small text-secondary mb-0">Enter your prescription details below</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="card-body p-4 p-md-5">
              <div className="row g-4 mb-4">
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-secondary">Medication Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-control bg-light border-0 py-2"
                    placeholder="e.g. Paracetamol"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-secondary">Dosage</label>
                  <input
                    type="text"
                    required
                    value={formData.dosage}
                    onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                    className="form-control bg-light border-0 py-2"
                    placeholder="e.g. 500mg"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-secondary">Frequency</label>
                  <select
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                    className="form-select bg-light border-0 py-2"
                  >
                    <option value="once daily">Once Daily</option>
                    <option value="twice daily">Twice Daily</option>
                    <option value="thrice daily">Thrice Daily</option>
                    <option value="four times daily">Four Times Daily</option>
                    <option value="every 4 hours">Every 4 Hours</option>
                    <option value="every 6 hours">Every 6 Hours</option>
                    <option value="every 8 hours">Every 8 Hours</option>
                    <option value="weekly">Weekly</option>
                    <option value="as needed">As Needed (PRN)</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="form-label small fw-bold text-secondary mb-0">Time(s) to take medication</label>
                  <button
                    type="button"
                    onClick={handleAddTime}
                    className="btn btn-link text-success text-decoration-none fw-bold p-0 small d-flex align-items-center gap-1"
                  >
                    <Plus size={16} />
                    Add Time
                  </button>
                </div>
                <div className="row g-3">
                  {formData.times.map((time, index) => (
                    <div key={index} className="col-6 col-sm-4">
                      <div className="position-relative">
                        <span className="position-absolute top-50 start-0 translate-middle-y ps-3">
                          <Clock className="text-secondary" size={16} />
                        </span>
                        <input
                          type="time"
                          required
                          value={time}
                          onChange={(e) => handleTimeChange(index, e.target.value)}
                          className="form-control bg-light border-0 py-2 ps-5"
                        />
                        {formData.times.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveTime(index)}
                            className="btn btn-danger btn-sm rounded-circle position-absolute top-0 end-0 translate-middle p-0 d-flex align-items-center justify-content-center"
                            style={{ width: '20px', height: '20px' }}
                          >
                            <X size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="row g-4 mb-5">
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-secondary">Start Date</label>
                  <div className="position-relative">
                    <span className="position-absolute top-50 start-0 translate-middle-y ps-3">
                      <Calendar className="text-secondary" size={16} />
                    </span>
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="form-control bg-light border-0 py-2 ps-5"
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-secondary">End Date (Optional)</label>
                  <div className="position-relative">
                    <span className="position-absolute top-50 start-0 translate-middle-y ps-3">
                      <Calendar className="text-secondary" size={16} />
                    </span>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="form-control bg-light border-0 py-2 ps-5"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-success w-100 py-3 fw-bold rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-2"
              >
                {loading ? 'Saving...' : 'Save Medication'}
                {!loading && <Save size={20} />}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
