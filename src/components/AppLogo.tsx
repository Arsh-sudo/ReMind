import React from 'react';

export const AppLogo = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ borderRadius: '22%' }}
  >
    <defs>
      <linearGradient id="logoGradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0072FF" />
        <stop offset="1" stopColor="#6C00FF" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" fill="url(#logoGradient)" />
    <path
      d="M 50 15 L 20 80 L 35 80 L 50 40 L 65 70 M 30 65 L 75 45 L 85 65 L 65 70 M 50 15 L 75 45"
      stroke="white"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);
