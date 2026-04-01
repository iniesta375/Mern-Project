import { useEffect, useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { History, CheckCircle2, XCircle, Clock, Download, Trash2, AlertCircle } from 'lucide-react';
import { api } from '../api';
import { AuthContext } from '../App';
import { useToast } from '../context/ToastContext';
import { format, isValid } from 'date-fns';
import { SkeletonLine, SkeletonCard } from '../components/Skeleton';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function MedicationHistory() {
  const { user }      = useContext(AuthContext);
  const { showToast } = useToast();

  const [meds,        setMeds]        = useState([]);
  const [adherence,   setAdherence]   = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [filter,      setFilter]      = useState('all');
  const [deletingId,  setDeletingId]  = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [medsData, adherenceData] = await Promise.all([
          api.medications.list(),
          api.adherence.today(),
        ]);
        setMeds(medsData);
        setAdherence(adherenceData);
      } catch (err) {
        console.error('Failed to fetch history:', err);
        showToast('Failed to load medication history.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await api.medications.delete(id);
      setMeds(prev => prev.filter(m => m.id !== id));
      showToast('Medication removed successfully.', 'success');
    } catch (err) {
      showToast('Failed to remove medication.', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownloadPDF = () => {
    setDownloading(true);
    try {
      const doc       = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const now       = new Date();

      doc.setFillColor(5, 150, 105);
      doc.rect(0, 0, pageWidth, 28, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('MediWell — Medication History', 14, 12);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generated: ${format(now, 'MMMM do, yyyy · h:mm a')}`, 14, 20);
      doc.text(`Patient: ${user?.fullName || 'N/A'}`, pageWidth - 14, 20, { align: 'right' });

      let y = 40;

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text('Active Medications', 14, y);
      y += 2;
      doc.setDrawColor(5, 150, 105);
      doc.setLineWidth(0.5);
      doc.line(14, y + 2, pageWidth - 14, y + 2);
      y += 8;

      if (meds.length === 0) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(100, 116, 139);
        doc.text('No medications on record.', 14, y);
        y += 10;
      } else {
        autoTable(doc, {
          startY: y,
          head: [['Medication', 'Dosage', 'Frequency', 'Times', 'Start Date']],
          body: meds.map(m => [
            m.name,
            m.dosage,
            m.frequency,
            Array.isArray(m.times) ? m.times.join(', ') : m.times || 'N/A',
            m.start_date
              ? (isValid(new Date(m.start_date)) ? format(new Date(m.start_date), 'MMM d, yyyy') : 'N/A')
              : 'N/A',
          ]),
          styles:     { fontSize: 9, cellPadding: 4 },
          headStyles: { fillColor: [5, 150, 105], textColor: 255, fontStyle: 'bold' },
          alternateRowStyles: { fillColor: [240, 253, 244] },
          margin: { left: 14, right: 14 },
        });
        y = doc.lastAutoTable.finalY + 14;
      }

      if (y > 220) { doc.addPage(); y = 20; }

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text("Today's Dose Log", 14, y);
      y += 2;
      doc.setDrawColor(59, 130, 246);
      doc.line(14, y + 2, pageWidth - 14, y + 2);
      y += 8;

      if (adherence.length === 0) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(100, 116, 139);
        doc.text('No doses logged today.', 14, y);
      } else {
        autoTable(doc, {
          startY: y,
          head: [['Scheduled Time', 'Status', 'Logged At']],
          body: adherence.map(log => {
            const scheduledDate = new Date(log.scheduled_time);
            const loggedDate    = new Date(log.logged_at);
            return [
              isValid(scheduledDate) ? format(scheduledDate, 'h:mm a') : log.scheduled_time || 'N/A',
              log.status === 'taken' ? 'Taken ✓' : 'Missed ✗',
              isValid(loggedDate)    ? format(loggedDate,    'h:mm a') : 'N/A',
            ];
          }),
          styles:     { fontSize: 9, cellPadding: 4 },
          headStyles: { fillColor: [59, 130, 246], textColor: 255, fontStyle: 'bold' },
          alternateRowStyles: { fillColor: [239, 246, 255] },
          margin: { left: 14, right: 14 },
        });
      }

      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text(
          `MediWell Medication History  ·  Page ${i} of ${pageCount}  ·  ${user?.email || ''}`,
          pageWidth / 2,
          doc.internal.pageSize.getHeight() - 8,
          { align: 'center' }
        );
      }

      doc.save(`MediWell_History_${format(now, 'yyyy-MM-dd')}.pdf`);
      showToast('History downloaded successfully!', 'success');

    } catch (err) {
      console.error('PDF error:', err);
      showToast('Failed to generate PDF. Please try again.', 'error');
    } finally {
      setDownloading(false);
    }
  };

  const getStatus = (med) => {
    const taken = adherence.some(log => log.medication_id === med.id);
    return taken ? 'taken' : 'pending';
  };

  const filteredMeds = meds.filter(med => {
    if (filter === 'all')    return true;
    if (filter === 'taken')  return getStatus(med) === 'taken';
    if (filter === 'missed') return getStatus(med) === 'pending';
    return true;
  });

  if (loading) return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <SkeletonLine width="220px" height="32px" className="mb-2" />
          <SkeletonLine width="300px" height="18px" />
        </div>
        <SkeletonLine width="150px" height="42px" className="rounded-3" />
      </div>
      <SkeletonCard>
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="d-flex gap-3 align-items-center mb-4">
            <SkeletonLine width="40px" height="40px" className="rounded-circle flex-shrink-0" />
            <div className="flex-grow-1">
              <SkeletonLine width="50%" height="16px" className="mb-2" />
              <SkeletonLine width="35%" height="13px" />
            </div>
            <SkeletonLine width="80px" height="30px" className="rounded-3" />
          </div>
        ))}
      </SkeletonCard>
    </div>
  );

  return (
    <div className="container py-4">

      <header className="mb-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <div>
          <h1 className="h2 fw-bold text-dark mb-1 d-flex align-items-center gap-2">
            <History className="text-success" size={28} />
            Medication History
          </h1>
          <p className="text-secondary mb-0">
            Your active medications and today&apos;s dose log.
          </p>
        </div>
        <button
          onClick={handleDownloadPDF}
          disabled={downloading}
          className="btn btn-success fw-bold px-4 py-2 rounded-3 d-flex align-items-center gap-2 shadow-sm"
        >
          {downloading ? (
            <>
              <span className="spinner-border spinner-border-sm" />
              Generating...
            </>
          ) : (
            <>
              <Download size={18} />
              Download PDF
            </>
          )}
        </button>
      </header>

      <div className="d-flex gap-2 mb-4">
        {[
          { key: 'all',    label: 'All Medications' },
          { key: 'taken',  label: '✓ Taken Today'   },
          { key: 'missed', label: '✗ Pending Today'  },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`btn btn-sm fw-bold rounded-3 px-3 py-2 ${
              filter === key
                ? 'btn-success'
                : 'btn-light text-secondary'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <section className="card border-0 shadow-sm overflow-hidden mb-4">
        <div className="card-header bg-white border-bottom p-3">
          <h2 className="h6 fw-bold text-dark mb-0">
            Active Medications
            <span className="badge bg-success bg-opacity-10 text-success ms-2 rounded-pill px-2">
              {filteredMeds.length}
            </span>
          </h2>
        </div>

        {filteredMeds.length === 0 ? (
          <div className="text-center py-5">
            <AlertCircle className="text-secondary mb-2" size={36} />
            <p className="text-secondary mb-1 fw-bold">No medications found</p>
            <p className="text-secondary small mb-0">
              {filter === 'all'
                ? 'You have no active medications yet.'
                : `No medications match the "${filter}" filter.`}
            </p>
          </div>
        ) : (
          <div className="list-group list-group-flush">
            {filteredMeds.map((med, i) => {
              const status  = getStatus(med);
              const isTaken = status === 'taken';
              const startDate = med.start_date && isValid(new Date(med.start_date))
                ? format(new Date(med.start_date), 'MMM d, yyyy')
                : null;

              return (
                <motion.div
                  key={med.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="list-group-item p-4 border-0 border-bottom d-flex align-items-center justify-content-between gap-3"
                >
                  <div
                    className={`rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 ${
                      isTaken
                        ? 'bg-success bg-opacity-10 text-success'
                        : 'bg-light text-secondary'
                    }`}
                    style={{ width: '44px', height: '44px' }}
                  >
                    {isTaken
                      ? <CheckCircle2 size={22} />
                      : <Clock size={22} />}
                  </div>

                  <div className="flex-grow-1">
                    <h3 className="h6 fw-bold text-dark mb-1">{med.name}</h3>
                    <p className="small text-secondary mb-0">
                      {med.dosage} · {med.frequency}
                      {Array.isArray(med.times) && med.times.length > 0 && (
                        <> · {med.times.join(', ')}</>
                      )}
                      {startDate && (
                        <span className="ms-2 text-muted" style={{ fontSize: '11px' }}>
                          Since {startDate}
                        </span>
                      )}
                    </p>
                  </div>

                  <span className={`badge rounded-pill px-3 py-2 fw-bold small flex-shrink-0 ${
                    isTaken
                      ? 'bg-success bg-opacity-10 text-success'
                      : 'bg-warning bg-opacity-10 text-warning'
                  }`}>
                    {isTaken ? '✓ Taken' : '⏳ Pending'}
                  </span>

                  <button
                    onClick={() => handleDelete(med.id)}
                    disabled={deletingId === med.id}
                    className="btn btn-link text-danger p-1 flex-shrink-0"
                    title="Remove medication"
                  >
                    {deletingId === med.id
                      ? <span className="spinner-border spinner-border-sm text-danger" />
                      : <Trash2 size={18} />}
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      <section className="card border-0 shadow-sm overflow-hidden">
        <div className="card-header bg-white border-bottom p-3">
          <h2 className="h6 fw-bold text-dark mb-0">Today&apos;s Dose Log</h2>
        </div>

        {adherence.length === 0 ? (
          <div className="text-center py-5">
            <Clock className="text-secondary mb-2" size={36} />
            <p className="text-secondary mb-0 small">No doses logged today yet.</p>
          </div>
        ) : (
          <div className="list-group list-group-flush">
            {adherence.map((log, i) => {
              const scheduledDate = new Date(log.scheduled_time);
              const loggedDate    = new Date(log.logged_at);
              const isTaken       = log.status === 'taken';

              return (
                <div
                  key={i}
                  className="list-group-item p-3 border-0 border-bottom d-flex align-items-center justify-content-between gap-3"
                >
                  <div className="d-flex align-items-center gap-3">
                    {isTaken
                      ? <CheckCircle2 className="text-success flex-shrink-0" size={20} />
                      : <XCircle     className="text-danger  flex-shrink-0" size={20} />}
                    <div>
                      <p className="small fw-bold text-dark mb-0">
                        Scheduled: {isValid(scheduledDate) ? format(scheduledDate, 'h:mm a') : log.scheduled_time}
                      </p>
                      <p className="small text-secondary mb-0" style={{ fontSize: '11px' }}>
                        Logged at: {isValid(loggedDate) ? format(loggedDate, 'h:mm a') : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <span className={`badge rounded-pill px-3 py-2 fw-bold small ${
                    isTaken
                      ? 'bg-success bg-opacity-10 text-success'
                      : 'bg-danger bg-opacity-10 text-danger'
                  }`}>
                    {isTaken ? 'Taken' : 'Missed'}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>

    </div>
  );
}
