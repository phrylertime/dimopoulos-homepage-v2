/* global React */

// Recreated SPLIT podcast cover art as an SVG, so it scales crisply
// and we can tint it without rasterizing the original.
// Logo, marks and copy match the show artwork.
function SplitCover({ className = '', size = 600, accent = '#7BA9C8', bg = '#000', label = 'A PODCAST ON MODERN DIVORCE', host = 'WITH GUS DIMOPOULOS' }) {
  // viewBox is 1000x1000 — square cover art convention
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Split — A Podcast on Modern Divorce">
      <rect width="1000" height="1000" fill={bg} />

      {/* SPLIT wordmark — heavy industrial sans, with mic head replacing the 'P' bowl */}
      <g fill={accent}>
        {/* S */}
        <path d="M 130 305 H 250 V 365 H 200 V 395 H 260 V 555 H 130 V 495 H 200 V 465 H 130 Z" />
        {/* P — stem only; bowl replaced by mic head below */}
        <rect x="305" y="305" width="65" height="250" />
        {/* mic head as the P bowl */}
        <g transform="translate(395 332)">
          <rect x="0" y="0" width="115" height="160" rx="58" fill={accent} />
          {/* grille slats */}
          <g stroke={bg} strokeWidth="6">
            <line x1="20" y1="38" x2="95" y2="38" />
            <line x1="20" y1="62" x2="95" y2="62" />
            <line x1="20" y1="86" x2="95" y2="86" />
            <line x1="20" y1="110" x2="95" y2="110" />
            <line x1="20" y1="134" x2="95" y2="134" />
          </g>
        </g>
        {/* L */}
        <path d="M 555 305 H 620 V 495 H 700 V 555 H 555 Z" />
        {/* I */}
        <rect x="740" y="305" width="65" height="250" />
        {/* T */}
        <path d="M 825 305 H 970 V 365 H 920 V 555 H 875 V 365 H 825 Z" />
      </g>

      {/* subtitle */}
      <text x="500" y="635" textAnchor="middle" fill="#fff" fontFamily="'Source Sans 3','Helvetica Neue',Arial,sans-serif" fontSize="38" fontWeight="600" letterSpacing="3">{label}</text>

      {/* mic illustration */}
      <g transform="translate(220 720)">
        <rect x="0" y="0" width="80" height="120" rx="40" fill="#fff" />
        <g stroke="#000" strokeWidth="4">
          <line x1="14" y1="28" x2="66" y2="28" />
          <line x1="14" y1="52" x2="66" y2="52" />
          <line x1="14" y1="76" x2="66" y2="76" />
          <line x1="14" y1="100" x2="66" y2="100" />
        </g>
        <path d="M 8 140 Q 40 178 72 140" stroke="#fff" strokeWidth="6" fill="none" />
        <line x1="40" y1="170" x2="40" y2="200" stroke="#fff" strokeWidth="6" />
        <line x1="22" y1="200" x2="58" y2="200" stroke="#fff" strokeWidth="6" />
      </g>

      {/* "with GUS DIMOPOULOS" */}
      <text x="370" y="790" fill="#fff" fontFamily="'Source Sans 3','Helvetica Neue',Arial,sans-serif" fontSize="34" fontStyle="italic" fontWeight="400">with</text>
      <text x="370" y="838" fill={accent} fontFamily="'Source Sans 3','Helvetica Neue',Arial,sans-serif" fontSize="50" fontWeight="700" letterSpacing="2">{host.replace(/^WITH\s+/i, '')}</text>
    </svg>
  );
}

window.SplitCover = SplitCover;
