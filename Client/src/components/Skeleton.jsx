import '../styles/skeleton.css';
export function SkeletonLine({ width = '100%', height = '16px', className = '' }) {
  return (
    <div
      className={`skeleton-pulse rounded ${className}`}
      style={{ width, height }}
    />
  );
}

export function SkeletonCard({ children }) {
  return (
    <div className="card border-0 shadow-sm p-4">
      {children}
    </div>
  );
}