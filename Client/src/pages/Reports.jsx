import { useEffect, useState, useContext } from 'react';
import { Download, CheckCircle2, Heart, FileText, AlertCircle } from 'lucide-react';
import { api } from '../api';
import { AuthContext } from '../App';
import { useToast } from '../context/ToastContext';
import { format, isValid } from 'date-fns';
import { SkeletonLine, SkeletonCard } from '../components/Skeleton';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function Reports() {
  const { user }      = useContext(AuthContext);
  const { showToast } = useToast();

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await api.reports.summary();
        setSummary(data);
      } catch (err) {
        console.error('Failed to fetch report summary:', err);
        showToast('Failed to load report data.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

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
      doc.text('MediWell Health Report', 14, 12);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generated: ${format(now, 'MMMM do, yyyy · h:mm a')}`, 14, 20);
      doc.text(`Patient: ${user?.fullName || 'N/A'}`, pageWidth - 14, 20, { align: 'right' });

      let y = 40;

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text('Adherence Summary', 14, y);
      y += 2;

      doc.setDrawColor(5, 150, 105);
      doc.setLineWidth(0.5);
      doc.line(14, y + 2, pageWidth - 14, y + 2);
      y += 8;

      if (!summary?.adherence || summary.adherence.length === 0) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(100, 116, 139);
        doc.text('No adherence data available.', 14, y);
        y += 10;
      } else {
        const adherenceRows = summary.adherence.map((log) => {
          const dateObj    = new Date(log.scheduled_time || log.logged_at);
          const dateStr    = isValid(dateObj) ? format(dateObj, 'MMM d, yyyy') : 'N/A';
          const timeStr    = isValid(dateObj) ? format(dateObj, 'h:mm a')      : 'N/A';
          const statusText = log.status === 'taken' ? 'Taken' : log.status === 'missed' ? 'Missed' : log.status || 'N/A';
          return [dateStr, timeStr, statusText];
        });

        autoTable(doc, {
          startY: y,
          head: [['Date', 'Scheduled Time', 'Status']],
          body: adherenceRows,
          styles:     { fontSize: 9, cellPadding: 4 },
          headStyles: { fillColor: [5, 150, 105], textColor: 255, fontStyle: 'bold' },
          alternateRowStyles: { fillColor: [240, 253, 244] },
          columnStyles: {
            2: {
              fontStyle: 'bold',
              textColor: (cell) =>
                cell.raw === 'Taken' ? [5, 150, 105] : [239, 68, 68],
            },
          },
          margin: { left: 14, right: 14 },
        });
        y = doc.lastAutoTable.finalY + 14;
      }

      
      if (y > 220) { doc.addPage(); y = 20; }

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text('Mood & Wellness Logs', 14, y);
      y += 2;

      doc.setDrawColor(239, 68, 68);
      doc.line(14, y + 2, pageWidth - 14, y + 2);
      y += 8;

      if (!summary?.wellness || summary.wellness.length === 0) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(100, 116, 139);
        doc.text('No wellness data available.', 14, y);
        y += 10;
      } else {
        const wellnessRows = summary.wellness.map((log) => {
          const dateObj = new Date(log.date || log.logged_at);
          const dateStr = isValid(dateObj) ? format(dateObj, 'MMM d, yyyy') : 'N/A';
          const timeStr = isValid(dateObj) ? format(dateObj, 'h:mm a')      : 'N/A';
          const mood    = log.mood
            ? log.mood.charAt(0).toUpperCase() + log.mood.slice(1)
            : 'N/A';
          const note = log.note || '—';
          return [dateStr, timeStr, mood, note];
        });

        autoTable(doc, {
          startY: y,
          head: [['Date', 'Time', 'Mood', 'Note']],
          body: wellnessRows,
          styles:     { fontSize: 9, cellPadding: 4 },
          headStyles: { fillColor: [239, 68, 68], textColor: 255, fontStyle: 'bold' },
          alternateRowStyles: { fillColor: [255, 241, 242] },
          columnStyles: { 3: { cellWidth: 70 } },
          margin: { left: 14, right: 14 },
        });
        y = doc.lastAutoTable.finalY + 14;
      }

      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text(
          `MediWell Health Report  ·  Page ${i} of ${pageCount}  ·  ${user?.email || ''}`,
          pageWidth / 2,
          doc.internal.pageSize.getHeight() - 8,
          { align: 'center' }
        );
      }

      const fileName = `MediWell_Report_${format(now, 'yyyy-MM-dd')}.pdf`;
      doc.save(fileName);
      showToast('Report downloaded successfully!', 'success');

    } catch (err) {
      console.error('PDF generation error:', err);
      showToast('Failed to generate PDF. Please try again.', 'error');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <SkeletonLine width="180px" height="32px" className="mb-2" />
          <SkeletonLine width="280px" height="18px" />
        </div>
        <SkeletonLine width="150px" height="42px" className="rounded-3" />
      </div>
      <div className="row g-4">
        {[1, 2].map(i => (
          <div key={i} className="col-md-6">
            <SkeletonCard>
              <SkeletonLine width="50%" height="20px" className="mb-4" />
              {[1, 2, 3, 4].map(j => (
                <SkeletonLine key={j} width="100%" height="14px" className="mb-3" />
              ))}
            </SkeletonCard>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="container py-4">

      <header className="mb-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <div>
          <h1 className="h2 fw-bold text-dark mb-1">Health Reports</h1>
          <p className="text-secondary mb-0">Comprehensive summary of your adherence and wellness.</p>
        </div>
        <button
          onClick={handleDownloadPDF}
          disabled={downloading}
          className="btn btn-success fw-bold px-4 py-2 rounded-3 d-flex align-items-center gap-2 shadow-sm"
        >
          {downloading ? (
            <>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
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

      <div className="row g-4 mb-5">

        <div className="col-md-6">
          <section className="card border-0 shadow-sm p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="h5 fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                <CheckCircle2 className="text-success" size={20} />
                Adherence Summary
              </h2>
              <span className="badge rounded-pill bg-success bg-opacity-10 text-success px-3 py-2 small">
                All Time
              </span>
            </div>

            {!summary?.adherence || summary.adherence.length === 0 ? (
              <div className="text-center py-5">
                <AlertCircle className="text-secondary mb-2" size={32} />
                <p className="text-secondary small mb-0">No adherence data available yet.</p>
              </div>
            ) : (
              <div className="vstack gap-3">
                {summary.adherence.slice(0, 10).map((log, i) => {
                  const dateObj = new Date(log.scheduled_time || log.logged_at);
                  const dateStr = isValid(dateObj) ? format(dateObj, 'MMM d · h:mm a') : 'N/A';
                  const taken   = log.status === 'taken';
                  return (
                    <div key={i} className="d-flex align-items-center justify-content-between p-3 bg-light rounded-3">
                      <span className="small text-secondary fw-bold">{dateStr}</span>
                      <span className={`badge rounded-pill px-3 py-2 small fw-bold ${
                        taken
                          ? 'bg-success bg-opacity-10 text-success'
                          : 'bg-danger bg-opacity-10 text-danger'
                      }`}>
                        {taken ? '✓ Taken' : '✗ Missed'}
                      </span>
                    </div>
                  );
                })}
                {summary.adherence.length > 10 && (
                  <p className="small text-secondary text-center mb-0">
                    +{summary.adherence.length - 10} more entries in the downloaded PDF
                  </p>
                )}
              </div>
            )}
          </section>
        </div>

        <div className="col-md-6">
          <section className="card border-0 shadow-sm p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="h5 fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                <Heart className="text-danger" size={20} />
                Mood Trends
              </h2>
              <span className="badge rounded-pill bg-danger bg-opacity-10 text-danger px-3 py-2 small">
                Recent Logs
              </span>
            </div>

            {!summary?.wellness || summary.wellness.length === 0 ? (
              <div className="text-center py-5">
                <AlertCircle className="text-secondary mb-2" size={32} />
                <p className="text-secondary small mb-0">No wellness data available yet.</p>
              </div>
            ) : (
              <div className="vstack gap-3">
                {summary.wellness.slice(0, 10).map((log, i) => {
                  const dateObj = new Date(log.date || log.logged_at);
                  const dateStr = isValid(dateObj) ? format(dateObj, 'MMM d') : 'N/A';
                  const MOOD_EMOJI = {
                    great: '😄', good: '🙂', okay: '😐', bad: '😔', terrible: '😢',
                  };
                  const emoji = MOOD_EMOJI[log.mood?.toLowerCase()] || '😐';
                  return (
                    <div key={i} className="d-flex align-items-center justify-content-between p-3 bg-light rounded-3">
                      <div className="d-flex align-items-center gap-3">
                        <span style={{ fontSize: '20px' }}>{emoji}</span>
                        <div>
                          <p className="small fw-bold text-dark mb-0 text-capitalize">{log.mood}</p>
                          {log.note && (
                            <p className="small text-secondary mb-0" style={{ fontSize: '11px' }}>
                              {log.note.length > 40 ? log.note.slice(0, 40) + '…' : log.note}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="small text-secondary fw-bold">{dateStr}</span>
                    </div>
                  );
                })}
                {summary.wellness.length > 10 && (
                  <p className="small text-secondary text-center mb-0">
                    +{summary.wellness.length - 10} more entries in the downloaded PDF
                  </p>
                )}
              </div>
            )}
          </section>
        </div>
      </div>

      <section className="card border-0 shadow-lg bg-dark text-white p-4 p-md-5 rounded-4 overflow-hidden position-relative">
        <div className="row position-relative align-items-center" style={{ zIndex: 1 }}>
          <div className="col-lg-7">
            <h2 className="display-6 fw-bold mb-3">Share with your Doctor</h2>
            <p className="lead opacity-75 mb-4">
              Your health data is most valuable when shared with professionals.
              Download the PDF above and bring it to your next appointment.
            </p>
            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="btn btn-light btn-lg px-4 fw-bold text-dark rounded-3 d-flex align-items-center gap-2"
              style={{ width: 'fit-content' }}
            >
              <FileText size={20} />
              {downloading ? 'Generating...' : 'Download Report'}
            </button>
          </div>
        </div>
        <div
          className="position-absolute end-0 bottom-0 opacity-10 d-none d-md-block"
          style={{ width: '280px', height: '280px' }}
        >
          <FileText size={280} />
        </div>
      </section>

    </div>
  );
}
