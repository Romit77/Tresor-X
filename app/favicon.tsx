export default function Favicon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id="treasureGradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="50%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <linearGradient id="gemGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>

      {/* Outer treasure chest */}
      <path
        d="M8 16 L40 16 L40 40 C40 42.2 38.2 44 36 44 L12 44 C9.8 44 8 42.2 8 40 L8 16 Z"
        fill="url(#treasureGradient)"
      />

      {/* Treasure chest lid */}
      <path
        d="M6 16 C6 13.8 7.8 12 10 12 L38 12 C40.2 12 42 13.8 42 16 C42 18.2 40.2 20 38 20 L10 20 C7.8 20 6 18.2 6 16 Z"
        fill="url(#treasureGradient)"
      />

      {/* Central diamond/gem */}
      <path d="M24 6 L28 14 L24 22 L20 14 Z" fill="url(#gemGradient)" />

      {/* Lock mechanism */}
      <circle cx="24" cy="28" r="3" fill="#fbbf24" />

      {/* Keyhole */}
      <path
        d="M24 26 C24.8 26 25.5 26.7 25.5 27.5 C25.5 28.3 24.8 29 24 29 C23.2 29 22.5 28.3 22.5 27.5 C22.5 26.7 23.2 26 24 26 Z M23.5 29 L24.5 29 L24.5 31 L23.5 31 Z"
        fill="#1f2937"
      />

      {/* Decorative elements */}
      <circle cx="16" cy="24" r="1.5" fill="#fbbf24" />
      <circle cx="32" cy="24" r="1.5" fill="#fbbf24" />
    </svg>
  );
}
