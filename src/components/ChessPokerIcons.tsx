import React from "react";

type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number;
};

export const Spade = ({ size = 24, className, ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    {...props}
  >
    <path d="M12 2C11.5 2 9 6.5 9 9.5C9 12 10.5 13.5 12 13.5C13.5 13.5 15 12 15 9.5C15 6.5 12.5 2 12 2Z" />
    <path d="M12 12C12 12 10 16.5 8 17.5C7.2 17.9 6 18.2 6 19.5C6 21 7.5 21.5 12 21C16.5 21.5 18 21 18 19.5C18 18.2 16.8 17.9 16 17.5C14 16.5 12 12 12 12Z" />
  </svg>
);

export const Heart = ({ size = 24, className, ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    {...props}
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

export const Club = ({ size = 24, className, ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    {...props}
  >
    <circle cx="12" cy="7.5" r="3.5" />
    <circle cx="7.5" cy="13.5" r="3.5" />
    <circle cx="16.5" cy="13.5" r="3.5" />
    <path d="M12 13.5C12 13.5 10 16.5 8.5 18C7.5 19 6.5 20.2 7 21.5C7.5 22.5 9 22.5 12 22C15 22.5 16.5 22.5 17 21.5C17.5 20.2 16.5 19 15.5 18C14 16.5 12 13.5 12 13.5Z" />
  </svg>
);

export const Diamond = ({ size = 24, className, ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    {...props}
  >
    <path d="M12 2L2 12l10 10 10-10L12 2z" />
  </svg>
);

export const ChessKing = ({ size = 24, className, ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {/* King Cross */}
    <path d="M12 2v4M10 4h4" />
    {/* Crown Base & Top points */}
    <path d="M5 16l2-7 5 3 5-3 2 7H5z" fill="currentColor" fillOpacity="0.1" />
    <circle cx="7" cy="9" r="1" fill="currentColor" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
    <circle cx="17" cy="9" r="1" fill="currentColor" />
    {/* Base Pedestal */}
    <path d="M4 19h16M5 22h14" />
    <path d="M6 16v3h12v-3" />
  </svg>
);

export const ChessQueen = ({ size = 24, className, ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M12 4a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" fill="currentColor" />
    <path d="M3 16l3-10 6 5 6-5 3 10H3z" fill="currentColor" fillOpacity="0.1" />
    <circle cx="3" cy="6" r="1" fill="currentColor" />
    <circle cx="9" cy="8" r="1" fill="currentColor" />
    <circle cx="15" cy="8" r="1" fill="currentColor" />
    <circle cx="21" cy="6" r="1" fill="currentColor" />
    <path d="M4 19h16M5 22h14" />
    <path d="M6 16v3h12v-3" />
  </svg>
);

export const ChessRook = ({ size = 24, className, ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {/* Castle Battlements */}
    <path d="M5 6V3h3v2h2V3h4v2h2V3h3v3" />
    {/* Body */}
    <path d="M6 6l1 10h10l1-10H6z" fill="currentColor" fillOpacity="0.1" />
    {/* Base */}
    <path d="M4 19h16M5 22h14" />
    <path d="M6 16v3h12v-3" />
  </svg>
);

export const ChessKnight = ({ size = 24, className, ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path
      d="M19 19c-1-2-1.5-4-1.5-6c0-4-3-6.5-6.5-6.5c-3 0-4.5 2.5-4.5 4.5c0 2 1.5 2 1.5 3.5c0 1.5-1.5 2.5-2.5 3c-1.5.75-2 2.5-2 4.5h15.5v-3z"
      fill="currentColor"
      fillOpacity="0.1"
    />
    <path d="M6 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" fill="currentColor" />
    <path d="M5 22h14M17 19v3M7 19v3" />
  </svg>
);

export const ChessPawn = ({ size = 24, className, ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <circle cx="12" cy="7" r="3" fill="currentColor" fillOpacity="0.1" />
    <path d="M12 10c-2.5 3-3.5 5.5-3.5 9h7c0-3.5-1-6-3.5-9z" fill="currentColor" fillOpacity="0.1" />
    <path d="M6 19h12M5 22h14" />
  </svg>
);

export const PokerChip = ({ size = 28, className, active, ...props }: IconProps & { active?: boolean }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    className={className}
    {...props}
  >
    <circle
      cx="20"
      cy="20"
      r="18"
      className={`${active ? "fill-accent-gold" : "fill-charcoal-light"} stroke-accent-gold`}
      strokeWidth="2"
    />
    <circle
      cx="20"
      cy="20"
      r="13"
      fill="none"
      stroke={active ? "#0a2218" : "#cfa846"}
      strokeWidth="1.5"
      strokeDasharray="4 3"
    />
    <circle
      cx="20"
      cy="20"
      r="8"
      className={active ? "fill-felt-green" : "fill-felt-dark"}
      stroke={active ? "#cfa846" : "#4a5d54"}
      strokeWidth="1"
    />
  </svg>
);
