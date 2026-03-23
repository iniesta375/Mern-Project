import PropTypes from 'prop-types';

export const Logo = ({ size = 32, className = "" }) => {
  return (
    <div className={`d-flex align-items-center gap-2 ${className}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Medical Cross */}
        <path 
          d="M35 15C35 12.2386 37.2386 10 40 10H60C62.7614 10 65 12.2386 65 15V35H85C87.7614 35 90 37.2386 90 40V60C90 62.7614 87.7614 65 85 65H65V85C65 87.7614 62.7614 90 60 90H40C37.2386 90 35 87.7614 35 85V65H15C12.2386 65 10 62.7614 10 60V40C10 37.2386 12.2386 35 15 35H35V15Z" 
          fill="#10B981" 
        />
        
        {/* Pill Background Overlay (Subtle Shadow) */}
        <rect 
          x="25" 
          y="40" 
          width="50" 
          height="25" 
          rx="12.5" 
          transform="rotate(-45 50 50)" 
          fill="black" 
          fillOpacity="0.1" 
        />

        {/* Pill - Blue Half */}
        <path 
          d="M32.3223 67.6777C25.4882 60.8436 25.4882 49.7564 32.3223 42.9223L50 60.6L32.3223 67.6777Z" 
          fill="#0EA5E9" 
        />

        {/* Pill - Orange Half */}
        <path 
          d="M67.6777 32.3223C74.5118 39.1564 74.5118 50.2436 67.6777 57.0777L50 39.4L67.6777 32.3223Z" 
          fill="#F59E0B" 
        />

        {/* Checkmark on Orange Half */}
        <path 
          d="M58 45L62 49L70 41" 
          stroke="white" 
          strokeWidth="4" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
      </svg>
    </div>
  );
};

Logo.propTypes = {
  size: PropTypes.number,
  className: PropTypes.string
};

export const LogoWithText = ({ size = 32, fontSize = "1.25rem", className = "" }) => {
  return (
    <div className={`d-flex align-items-center gap-2 ${className}`}>
      <Logo size={size} />
      <span className="fw-bold" style={{ fontSize, color: '#111827' }}>
        Medi<span style={{ color: '#10B981' }}>Well</span>
      </span>
    </div>
  );
};

LogoWithText.propTypes = {
  size: PropTypes.number,
  fontSize: PropTypes.string,
  className: PropTypes.string
};
