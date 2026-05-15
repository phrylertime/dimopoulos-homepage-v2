/* global React */
/* SPLIT podcast — real episodes from dimolaw.com/podcast (pulled live)
   Image placeholders are inline-SVG B&W vignettes hinting at each topic;
   swap in real stills when handed off. */

const enc = (s) => 'data:image/svg+xml;utf8,' + encodeURIComponent(s);

// Generic B&W editorial thumbnail factory.
// Returns a data URL for a 400x300 SVG with a smoky gradient, a faint
// vignette, and a topical glyph rendered in mid-grey.
function bwThumb({ icon = '', sky = false }) {
  const bg = sky
    ? `<defs><linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
         <stop offset="0" stop-color="#9aa0a4"/><stop offset="1" stop-color="#3a3d40"/></linearGradient></defs>
       <rect width="400" height="300" fill="url(#g)"/>`
    : `<defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
         <stop offset="0" stop-color="#4a4742"/><stop offset="1" stop-color="#1c1a18"/></linearGradient></defs>
       <rect width="400" height="300" fill="url(#g)"/>`;
  return enc(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
       ${bg}
       <g opacity="0.45">${icon}</g>
       <rect width="400" height="300" fill="url(#vg)"/>
       <defs><radialGradient id="vg" cx="0.5" cy="0.5" r="0.7">
         <stop offset="0.55" stop-color="rgba(0,0,0,0)"/>
         <stop offset="1" stop-color="rgba(0,0,0,0.55)"/>
       </radialGradient></defs>
     </svg>`
  );
}

const PODCAST_EPISODES = [
  {
    n: 11,
    date: 'Apr 14, 2026',
    title: 'When Suspicion Meets Strategy: Divorce Law & Investigation',
    guest: 'With Jessica Zannetti',
    minutes: '20 min',
    img: bwThumb({
      sky: true,
      icon: `
        <g fill="#1a1a1a">
          <rect x="150" y="40" width="180" height="48" rx="6"/>
          <polygon points="330,40 360,64 330,88"/>
          <rect x="60" y="120" width="220" height="60" rx="8"/>
          <polygon points="280,120 320,150 280,180"/>
          <rect x="186" y="88" width="8" height="180" fill="#2a2a2a"/>
        </g>
        <g fill="#fff" font-family="Helvetica, Arial, sans-serif" font-weight="900" font-size="22" letter-spacing="2">
          <text x="170" y="73" >DIVORCE</text>
          <text x="80" y="158" font-size="28">DIVORCE</text>
        </g>`
    }),
  },
  {
    n: 10,
    date: 'Mar 10, 2026',
    title: 'The Biggest Trends Reshaping Divorce Law in 2026',
    guest: 'With Jill Spielberg, Esq., Abrams Fensterman',
    minutes: '23 min',
    img: bwThumb({
      icon: `
        <g fill="#cfcfcf" font-family="Helvetica, Arial, sans-serif" font-weight="800">
          <text x="118" y="120" font-size="42">conflict</text>
          <text x="92"  y="172" font-size="72" letter-spacing="-2">divorce</text>
          <text x="138" y="208" font-size="34">relationship</text>
          <text x="64"  y="92"  font-size="22" opacity="0.75">argument</text>
          <text x="300" y="92"  font-size="22" opacity="0.75">stress</text>
          <text x="48"  y="232" font-size="20" opacity="0.7">family</text>
          <text x="294" y="232" font-size="20" opacity="0.7">marriage</text>
        </g>`
    }),
  },
  {
    n: 9,
    date: 'Feb 18, 2026',
    title: 'Divorce & Money: Financial Abuse, Hidden Assets, and Crypto',
    guest: 'With Nick Himonidis & Gus Dimopoulos',
    minutes: '34 min',
    img: bwThumb({
      icon: `
        <rect x="60" y="80" width="280" height="180" fill="#2a2a2a"/>
        <g fill="#d6d6d6">
          <rect x="100" y="120" width="180" height="100" rx="3"/>
          <circle cx="190" cy="170" r="28" fill="#1c1a18"/>
          <text x="190" y="178" text-anchor="middle" fill="#d6d6d6" font-family="Georgia, serif" font-weight="700" font-size="22">$</text>
        </g>
        <g fill="#3a3a3a">
          <ellipse cx="100" cy="240" rx="40" ry="10"/>
          <ellipse cx="300" cy="240" rx="40" ry="10"/>
        </g>`
    }),
  },
  {
    n: 8,
    date: 'Jan 27, 2026',
    title: 'Navigating Complex Dynamics in Divorce',
    guest: 'With Heidi Davidson & Gus Dimopoulos',
    minutes: '29 min',
    img: bwThumb({
      icon: `
        <rect x="40" y="60" width="320" height="220" fill="#dcdcdc"/>
        <g stroke="#3a3a3a" stroke-width="1.4" fill="none">
          <line x1="60" y1="100" x2="340" y2="100"/>
          <line x1="60" y1="120" x2="280" y2="120"/>
          <line x1="60" y1="140" x2="320" y2="140"/>
          <line x1="60" y1="160" x2="260" y2="160"/>
          <line x1="60" y1="180" x2="300" y2="180"/>
        </g>
        <g fill="none" stroke="#1a1a1a" stroke-width="3">
          <circle cx="240" cy="220" r="18"/>
          <circle cx="270" cy="220" r="18"/>
        </g>`
    }),
  },
  {
    n: 7,
    date: 'Jan 7, 2026',
    title: 'Safe Exchange and Supervised Visitation',
    guest: 'With Tiffany Hamilton, YWCA CEO',
    minutes: '31 min',
    img: bwThumb({
      icon: `
        <g fill="#c8c8c8">
          <circle cx="140" cy="120" r="26"/>
          <rect x="116" y="148" width="48" height="80" rx="20"/>
          <circle cx="260" cy="120" r="26"/>
          <rect x="236" y="148" width="48" height="80" rx="20"/>
        </g>
        <g fill="#9a9a9a">
          <circle cx="200" cy="170" r="14"/>
          <rect x="190" y="180" width="20" height="40" rx="8"/>
        </g>
        <line x1="155" y1="180" x2="190" y2="195" stroke="#aaa" stroke-width="2"/>
        <line x1="245" y1="180" x2="210" y2="195" stroke="#aaa" stroke-width="2"/>`
    }),
  },
  {
    n: 6,
    date: 'Dec 9, 2025',
    title: 'Litigation Strategy & Tactical Decision-Making',
    guest: 'With Heidi Davidson & Gus Dimopoulos',
    minutes: '36 min',
    img: bwThumb({
      icon: `
        <rect x="80" y="80" width="240" height="170" fill="#dcdcdc"/>
        <g stroke="#3a3a3a" stroke-width="1.2">
          <line x1="100" y1="110" x2="300" y2="110"/>
          <line x1="100" y1="130" x2="280" y2="130"/>
          <line x1="100" y1="150" x2="290" y2="150"/>
          <line x1="100" y1="170" x2="260" y2="170"/>
        </g>
        <g fill="#1a1a1a">
          <rect x="220" y="190" width="80" height="14" rx="3" transform="rotate(-12 220 190)"/>
          <circle cx="248" cy="188" r="6"/>
        </g>`
    }),
  },
];

window.PODCAST_EPISODES = PODCAST_EPISODES;
