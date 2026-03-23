import { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';
import { CheckCircle2, Clock, TrendingUp, Smile, AlertTriangle,ChevronRight,Plus,Bell} from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { format } from 'date-fns';

export default function Dashboard() {
  const [meds, setMeds] = useState([]);
  const [adherenceToday, setAdherenceToday] = useState([]);
  const [stats, setStats] = useState({ percentage: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [medsData, adherenceData, statsData] = await Promise.all([
          api.medications.list(),
          api.adherence.today(),
          api.adherence.stats()
        ]);
        setMeds(medsData);
        setAdherenceToday(adherenceData);
        setStats(statsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleMarkAsTaken = async (medId, time) => {
    try {
      await api.adherence.log({
        medicationId: medId,
        scheduledTime: `${new Date().toISOString().split('T')[0]} ${time}`,
        status: 'taken'
      });
      const adherenceData = await api.adherence.today();
      setAdherenceToday(adherenceData);
      const statsData = await api.adherence.stats();
      setStats(statsData);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="container py-5 text-center">Loading dashboard...</div>;

  return (
    <div className="container py-4">
      <header className="mb-4">
        <h1 className="h2 fw-bold text-dark mb-1">Good morning!</h1>
        <p className="text-secondary">Here&apos;s your health summary for today, {format(new Date(), 'MMMM do')}.</p>
      </header>

      <div className="row g-4">
        <div className="col-lg-8">
          <section className="card border-0 shadow-sm mb-4 overflow-hidden">
            <div className="card-header bg-white border-bottom p-3 d-flex justify-content-between align-items-center">
              <h2 className="h5 fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                <Clock className="text-success" size={20} />
                Today&apos;s Medications
              </h2>
              <Link to="/add-medication" className="btn btn-link text-success text-decoration-none fw-bold p-0 small d-flex align-items-center gap-1">
                <Plus size={16} />
                Add New
              </Link>
            </div>
            <div className="list-group list-group-flush">
              {meds.length === 0 ? (
                <div className="p-5 text-center">
                  <p className="text-secondary mb-3">No medications scheduled.</p>
                  <Link to="/add-medication" className="btn btn-success btn-sm fw-bold px-4 rounded-3">
                    Add your first medication
                  </Link>
                </div>
              ) : (
                meds.flatMap(med => med.times.map(time => {
                  const isTaken = adherenceToday.some(log => log.medication_id === med.id && log.scheduled_time.includes(time));
                  return (
                    <div key={`${med.id}-${time}`} className="list-group-item p-3 d-flex align-items-center justify-content-between border-0 border-bottom">
                      <div className="d-flex align-items-center gap-3">
                        <div className={`rounded-circle d-flex align-items-center justify-content-center ${isTaken ? 'bg-success bg-opacity-10 text-success' : 'bg-light text-secondary'}`} style={{ width: '40px', height: '40px' }}>
                          <Clock size={20} />
                        </div>
                        <div>
                          <h3 className="h6 fw-bold text-dark mb-0">{med.name}</h3>
                          <p className="small text-secondary mb-0">{med.dosage} • {med.frequency} • {time}</p>
                        </div>
                      </div>
                      {isTaken ? (
                        <span className="badge rounded-pill bg-success bg-opacity-10 text-success px-3 py-2 d-flex align-items-center gap-1">
                          <CheckCircle2 size={14} />
                          Taken
                        </span>
                      ) : (
                        <button
                          onClick={() => handleMarkAsTaken(med.id, time)}
                          className="btn btn-success btn-sm fw-bold px-3 rounded-3"
                        >
                          Mark as Taken
                        </button>
                      )}
                    </div>
                  );
                }))
              )}
            </div>
          </section>

          <div className="row g-4">
            <div className="col-md-6">
              <section className="card border-0 shadow-sm p-4 h-100">
                <h3 className="small fw-bold text-secondary text-uppercase tracking-wider mb-3">Adherence Rate</h3>
                <div className="d-flex align-items-end gap-3 mb-3">
                  <span className="display-5 fw-bold text-dark">{stats.percentage}%</span>
                  <div className="flex-grow-1 bg-light rounded-pill overflow-hidden mb-2" style={{ height: '10px' }}>
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${stats.percentage}%` }}
                      className="h-100 bg-success"
                    />
                  </div>
                </div>
                <p className="small text-secondary mb-0 d-flex align-items-center gap-1">
                  <TrendingUp className="text-success" size={16} />
                  Keep it up! Consistency is key.
                </p>
              </section>
            </div>

            <div className="col-md-6">
              <section className="card border-0 shadow-sm p-4 h-100">
                <h3 className="small fw-bold text-secondary text-uppercase tracking-wider mb-3">Mood Today</h3>
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-danger bg-opacity-10 text-danger rounded-3 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                    <Smile size={28} />
                  </div>
                  <div>
                    <span className="h4 fw-bold text-dark mb-0">Feeling Good</span>
                    <p className="small text-secondary mb-0">Logged 2 hours ago</p>
                  </div>
                </div>
                <Link to="/wellness" className="mt-3 small text-success fw-bold text-decoration-none d-flex align-items-center gap-1">
                  Update mood
                  <ChevronRight size={16} />
                </Link>
              </section>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <section className="card border-0 shadow-sm p-4 mb-4">
            <h2 className="h5 fw-bold text-dark mb-4 d-flex align-items-center gap-2">
              <Bell className="text-success" size={20} />
              Notifications
            </h2>
            <div className="vstack gap-3">
              <div className="p-3 bg-warning bg-opacity-10 border border-warning border-opacity-25 rounded-3 d-flex gap-3">
                <AlertTriangle className="text-warning flex-shrink-0" size={20} />
                <div>
                  <p className="small fw-bold text-dark mb-1">Missed Dose Alert</p>
                  <p className="x-small text-secondary mb-0">You missed your Vitamin C dose at 8:00 AM.</p>
                </div>
              </div>
              <div className="p-3 bg-primary bg-opacity-10 border border-primary border-opacity-25 rounded-3 d-flex gap-3">
                <Clock className="text-primary flex-shrink-0" size={20} />
                <div>
                  <p className="small fw-bold text-dark mb-1">Upcoming Reminder</p>
                  <p className="x-small text-secondary mb-0">Paracetamol dose coming up at 2:00 PM.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="card border-0 shadow-lg bg-success text-white p-4">
            <h3 className="h5 fw-bold mb-2">Need a Report?</h3>
            <p className="small opacity-75 mb-4">
              Generate a PDF summary of your adherence and wellness for your next doctor&apos;s visit.
            </p>
            <Link to="/reports" className="btn btn-light w-100 fw-bold text-success rounded-3">
              Generate Report
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}