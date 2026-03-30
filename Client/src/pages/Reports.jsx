import { useEffect, useState } from 'react';
import { 
  Download, 
  CheckCircle2, 
  Heart,
  FileText,
  Share2
} from 'lucide-react';
import { api } from '../api';
import { format, isValid } from 'date-fns';

export default function Reports() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await api.reports.summary();
        setSummary(data);
      } catch (err) {
        console.error("Failed to fetch report summary:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) return <div className="container py-5 text-center">Generating reports...</div>;

  return (
    <div className="container py-4">
      <header className="mb-4 d-flex flex-column flex-md-row justify-content-between align-md-center gap-3">
        <div>
          <h1 className="h2 fw-bold text-dark mb-1">Health Reports</h1>
          <p className="text-secondary mb-0">Comprehensive summary of your adherence and wellness.</p>
        </div>
        <button className="btn btn-success fw-bold px-4 py-2 rounded-3 d-flex align-items-center gap-2 shadow-sm">
          <Download size={20} />
          Download PDF
        </button>
      </header>

      <div className="row g-4 mb-5">
        {/* Adherence Summary Section */}
        <div className="col-md-6">
          <section className="card border-0 shadow-sm p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="h5 fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                <CheckCircle2 className="text-success" size={20} />
                Adherence Summary
              </h2>
              <span className="badge rounded-pill bg-success bg-opacity-10 text-success px-3 py-2 small">Last 7 Days</span>
            </div>
            
            <div className="vstack gap-4">
              {!summary?.adherence || summary?.adherence.length === 0 ? (
                <p className="text-secondary text-center py-5 small">No adherence data available.</p>
              ) : (
                summary.adherence.map((day, index) => {
                  const dateObj = new Date(day.date);
                  const displayDate = isValid(dateObj) ? format(dateObj, 'EEEE, MMM d') : 'Unknown Date';
                  const percentage = day.total > 0 ? Math.round((day.taken / day.total) * 100) : 0;

                  return (
                    <div key={day.date || index}>
                      <div className="d-flex justify-content-between small fw-bold mb-2">
                        <span className="text-secondary">{displayDate}</span>
                        <span className="text-dark">{percentage}%</span>
                      </div>
                      <div className="bg-light rounded-pill overflow-hidden" style={{ height: '8px' }}>
                        <div 
                          className="h-100 bg-success transition-all" 
                          style={{ width: `${percentage}%`, transition: 'width 0.5s ease-in-out' }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>

        {/* Mood Trends Section */}
        <div className="col-md-6">
          <section className="card border-0 shadow-sm p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="h5 fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                <Heart className="text-danger" size={20} />
                Mood Trends
              </h2>
              <span className="badge rounded-pill bg-danger bg-opacity-10 text-danger px-3 py-2 small">Recent Logs</span>
            </div>

            <div className="vstack gap-3">
              {!summary?.wellness || summary?.wellness.length === 0 ? (
                <p className="text-secondary text-center py-5 small">No wellness data available.</p>
              ) : (
                summary.wellness.map((log, i) => {
                  const logDate = new Date(log.date || log.logged_at); // Handling both potential naming conventions
                  const displayLogDate = isValid(logDate) ? format(logDate, 'MMM d') : 'N/A';

                  return (
                    <div key={i} className="d-flex align-items-center justify-content-between p-3 bg-light rounded-3">
                      <div className="d-flex align-items-center gap-3">
                        <div className="rounded-circle bg-danger" style={{ width: '8px', height: '8px' }} />
                        <span className="small fw-bold text-secondary">{displayLogDate}</span>
                      </div>
                      <span className="small fw-bold text-dark text-capitalize">{log.mood}</span>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Doctor Sharing Section */}
      <section className="card border-0 shadow-lg bg-dark text-white p-4 p-md-5 rounded-4 overflow-hidden position-relative">
        <div className="row position-relative z-1 align-items-center">
          <div className="col-lg-7">
            <h2 className="display-6 fw-bold mb-4">Share with your Doctor</h2>
            <p className="lead opacity-75 mb-5">
              Your health data is most valuable when shared with professionals. 
              MediWell makes it easy to provide a clear picture of your adherence 
              and mental state over time.
            </p>
            <div className="d-flex flex-wrap gap-3">
              <button className="btn btn-light btn-lg px-4 fw-bold text-dark rounded-3 d-flex align-items-center gap-2">
                <Share2 size={20} />
                Share Access
              </button>
              <button className="btn btn-outline-light btn-lg px-4 fw-bold rounded-3 d-flex align-items-center gap-2">
                <FileText size={20} />
                View Full History
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}