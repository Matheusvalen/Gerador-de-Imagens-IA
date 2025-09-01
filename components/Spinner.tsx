
import React from 'react';

interface SpinnerProps {
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ className = 'w-6 h-6' }) => {
  return (
    <svg
      className={`animate-spinner-rotate ${className}`}
      viewBox="0 0 50 50"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        className="stroke-current"
        cx="25"
        cy="25"
        r="20"
        fill="none"
        strokeWidth="5"
        strokeOpacity="0.3"
      ></circle>
      <circle
        className="stroke-current"
        cx="25"
        cy="25"
        r="20"
        fill="none"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray="31.415, 200"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 25 25"
          to="360 25 25"
          dur="1.2s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
};

export default Spinner;
