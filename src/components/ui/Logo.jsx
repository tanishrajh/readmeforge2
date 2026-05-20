export default function Logo({ size = 36 }) {
  const id = `logo-${Math.random().toString(36).slice(2, 8)}`;

  return (
    <div className="logo-container" style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="logo-svg"
      >
        <defs>
          {/* Main gradient — cyan to deep blue */}
          <linearGradient id={`${id}-main`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--grad-cyan)" />
            <stop offset="100%" stopColor="var(--grad-blue)" />
          </linearGradient>

          {/* Accent glow gradient */}
          <linearGradient id={`${id}-glow`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--grad-cyan)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="var(--grad-blue)" stopOpacity="0" />
          </linearGradient>

          {/* Inner face gradient — subtle depth */}
          <linearGradient id={`${id}-inner`} x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.1)" />
          </linearGradient>

          {/* Drop shadow filter */}
          <filter id={`${id}-shadow`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="var(--grad-blue)" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* Outer glow ring */}
        <circle cx="50" cy="50" r="46" fill="none" stroke={`url(#${id}-glow)`} strokeWidth="1" opacity="0.5" />

        {/* Main document shape — rounded with a bevel corner */}
        <path
          d="M24 20C24 16.686 26.686 14 30 14H62L80 32V80C80 83.314 77.314 86 74 86H30C26.686 86 24 83.314 24 80V20Z"
          fill={`url(#${id}-main)`}
          filter={`url(#${id}-shadow)`}
          className="logo-base-path"
        />

        {/* Inner surface overlay for depth */}
        <path
          d="M24 20C24 16.686 26.686 14 30 14H62L80 32V80C80 83.314 77.314 86 74 86H30C26.686 86 24 83.314 24 80V20Z"
          fill={`url(#${id}-inner)`}
        />

        {/* Folded corner — with glass effect */}
        <path
          d="M62 14V28C62 30.209 63.791 32 66 32H80L62 14Z"
          fill="rgba(255,255,255,0.2)"
        />
        <path
          d="M62 14V28C62 30.209 63.791 32 66 32H80"
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="0.8"
        />

        {/* Stylized "F" mark — geometric, modern */}
        <path
          d="M38 36H58"
          stroke="white"
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.9"
        />
        <path
          d="M38 50H52"
          stroke="white"
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.7"
        />
        <path
          d="M38 36V70"
          stroke="white"
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.85"
        />

        {/* Code bracket accent — bottom right */}
        <path
          d="M60 58L66 64L60 70"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Anvil / forge spark dots */}
        <circle cx="70" cy="44" r="1.8" fill="rgba(255,255,255,0.5)">
          <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="74" cy="50" r="1.2" fill="rgba(255,255,255,0.35)">
          <animate attributeName="opacity" values="0.35;0.8;0.35" dur="2.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="72" cy="38" r="1" fill="rgba(255,255,255,0.3)">
          <animate attributeName="opacity" values="0.3;0.7;0.3" dur="1.8s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
}
