import { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';

const ICONS = {
  success: <CheckCircle2 size={18} />,
  error: <AlertCircle size={18} />,
  info: <Info size={18} />,
};

const STYLES = {
  success: { bg: 'bg-success', text: 'text-white' },
  error:   { bg: 'bg-danger',  text: 'text-white' },
  info:    { bg: 'bg-primary', text: 'text-white' },
};

export function Toast({ message, type = 'info', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const { bg, text } = STYLES[type];

  return (
    <div
      className={`d-flex align-items-center gap-3 px-4 py-3 rounded-3 shadow-lg ${bg} ${text}`}
      style={{ minWidth: '280px', maxWidth: '380px' }}
    >
      {ICONS[type]}
      <span className="small fw-bold flex-grow-1">{message}</span>
      <button onClick={onClose} className={`btn btn-link p-0 ${text} opacity-75`}>
        <X size={16} />
      </button>
    </div>
  );
}