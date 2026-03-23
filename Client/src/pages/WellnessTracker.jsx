import { useEffect, useState } from 'react';
import { 
  Smile, 
  Meh, 
  Frown, 
  AlertCircle, 
  Send,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { api } from '../api';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MOODS = [
  { id: 'happy', label: 'Happy', icon: Smile, color: 'text-success', bg: 'bg-success bg-opacity-10', border: 'border-success' },
  { id: 'okay', label: 'Okay', icon: Meh, color: 'text-primary', bg: 'bg-primary bg-opacity-10', border: 'border-primary' },
  { id: 'sad', label: 'Sad', icon: Frown, color: 'text-warning', bg: 'bg-warning bg-opacity-10', border: 'border-warning' },
  { id: 'stressed', label: 'Stressed', icon: AlertCircle, color: 'text-danger', bg: 'bg-danger bg-opacity-10', border: 'border-danger' },
];

export default function WellnessTracker() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const data = await api.wellness.logs();
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMood) return;
    setSubmitting(true);
    try {
      await api.wellness.log({ mood: selectedMood, note });
      setSelectedMood(null);
      setNote('');
      fetchLogs();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const chartData = [...logs].reverse().map(log => ({
    date: format(new Date(log.logged_at), 'MMM d'),
    value: log.mood === 'happy' ? 4 : log.mood === 'okay' ? 3 : log.mood === 'sad' ? 2 : 1
  }));

  if (loading) return <div className="container py-5 text-center">Loading wellness...</div>;

  return (
    <div className="container py-4">
      <header className="mb-4">
        <h1 className="h2 fw-bold text-dark mb-1">Wellness Tracker</h1>
        <p className="text-secondary">Monitor your mental and emotional well-being.</p>
      </header>

      <div className="row g-4">
        <div className="col-lg-4">
          <section className="card border-0 shadow-sm p-4 sticky-top" style={{ top: '90px' }}>
            <h2 className="h5 fw-bold text-dark mb-4">How are you feeling?</h2>
            <form onSubmit={handleSubmit}>
              <div className="row g-3 mb-4">
                {MOODS.map((mood) => (
                  <div key={mood.id} className="col-6">
                    <button
                      type="button"
                      onClick={() => setSelectedMood(mood.id)}
                      className={`btn w-100 p-3 rounded-3 border-2 d-flex flex-column align-items-center gap-2 transition-all ${
                        selectedMood === mood.id 
                          ? `${mood.bg} border-${mood.id === 'happy' ? 'success' : mood.id === 'okay' ? 'primary' : mood.id === 'sad' ? 'warning' : 'danger'} ${mood.color}` 
                          : 'bg-light border-light text-secondary'
                      }`}
                    >
                      <mood.icon size={28} />
                      <span className="x-small fw-bold text-uppercase tracking-wider">{mood.label}</span>
                    </button>
                  </div>
                ))}
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold text-secondary">Add a note (Optional)</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="form-control bg-light border-0 py-3 rounded-3"
                  rows="4"
                  placeholder="What's on your mind?"
                  style={{ resize: 'none' }}
                />
              </div>

              <button
                type="submit"
                disabled={!selectedMood || submitting}
                className="btn btn-success w-100 py-2 fw-bold rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-2"
              >
                {submitting ? 'Saving...' : 'Log Wellness'}
                {!submitting && <Send size={16} />}
              </button>
            </form>
          </section>
        </div>

        <div className="col-lg-8">
          <section className="card border-0 shadow-sm p-4 mb-4">
            <h2 className="h5 fw-bold text-dark mb-4 d-flex align-items-center gap-2">
              <TrendingUp className="text-success" size={20} />
              Mood Trends
            </h2>
            <div style={{ height: '300px', width: '100%' }}>
              {chartData.length > 1 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                    <YAxis hide domain={[0, 5]} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#198754" 
                      strokeWidth={3} 
                      dot={{ r: 4, fill: '#198754', strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-100 d-flex align-items-center justify-content-center text-secondary small">
                  Log more moods to see your trends
                </div>
              )}
            </div>
          </section>

          <section className="card border-0 shadow-sm overflow-hidden">
            <div className="card-header bg-white border-bottom p-3">
              <h2 className="h6 fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                <Calendar className="text-success" size={18} />
                Recent Logs
              </h2>
            </div>
            <div className="list-group list-group-flush">
              {logs.length === 0 ? (
                <div className="p-5 text-center text-secondary small">No logs yet.</div>
              ) : (
                logs.map((log) => {
                  const mood = MOODS.find(m => m.id === log.mood) || MOODS[1];
                  return (
                    <div key={log.id} className="list-group-item p-4 d-flex align-items-start gap-3 border-0 border-bottom">
                      <div className={`rounded-3 d-flex align-items-center justify-content-center flex-shrink-0 ${mood.bg} ${mood.color}`} style={{ width: '44px', height: '44px' }}>
                        <mood.icon size={24} />
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start mb-1">
                          <h3 className="h6 fw-bold text-dark mb-0 capitalize">{log.mood}</h3>
                          <span className="x-small text-secondary">{format(new Date(log.logged_at), 'MMM d, h:mm a')}</span>
                        </div>
                        {log.note && <p className="small text-secondary mb-0">{log.note}</p>}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
