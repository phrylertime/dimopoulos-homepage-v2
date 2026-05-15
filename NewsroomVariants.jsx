/* global React */
/* Three exploration variants of the "Recent thinking" Newsroom block.
   Mirrors the data shape used by VariationB (D.newsroom). */

// Local data — same fields VariationB uses; isolated here so the
// canvas page can render standalone without pulling in HOMEPAGE_DATA.
const NEWSROOM_ITEMS = [
  { kind: 'Podcast',  date: 'Episode 14', minutes: '32 min',        title: 'Hidden assets: when the marital balance sheet doesn’t add up' },
  { kind: 'Article',  date: 'Sep 2024',   minutes: '6 min read',    title: 'What changed in NY spousal-maintenance law — and what it means for you' },
  { kind: 'Newsroom', date: 'Aug 2024',   minutes: '2 min read',    title: 'Gus Dimopoulos named to Super Lawyers for the fifth consecutive year' },
];

function ArrowRight({ size = 18 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d="M5 12h13M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ==========================================================
   N1 — Editorial Index
   Magazine TOC feel. Horizontal rules, large serif numerals,
   each item is a row not a card. Light paper background.
   ========================================================== */
function NewsroomN1() {
  return (
    <section className="nrN1" data-screen-label="Newsroom">
      <div className="nrN1-inner">
        <header className="nrN1-head">
          <span className="nrN1-eyebrow">Newsroom</span>
          <h2 className="nrN1-title"><em>Recent</em> thinking.</h2>
          <a className="nrN1-all">All articles <ArrowRight size={16}/></a>
        </header>

        <ol className="nrN1-list">
          {NEWSROOM_ITEMS.map((n, i) => (
            <li key={i} className="nrN1-row">
              <span className="nrN1-num">{String(i + 1).padStart(2, '0')}</span>
              <div className="nrN1-meta">
                <span className="nrN1-kind">{n.kind}</span>
                <span className="nrN1-date">{n.date} · {n.minutes}</span>
              </div>
              <h3 className="nrN1-headline">{n.title}</h3>
              <a className="nrN1-cta" aria-label={`Read: ${n.title}`}>
                Read <ArrowRight size={14}/>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ==========================================================
   N2 — Featured + Stack
   One large hero story left, two compact stories stacked right.
   Asymmetric grid, paper background.
   ========================================================== */
function NewsroomN2() {
  const [hero, ...rest] = NEWSROOM_ITEMS;
  return (
    <section className="nrN2" data-screen-label="Newsroom">
      <div className="nrN2-inner">
        <header className="nrN2-head">
          <div>
            <span className="nrN2-eyebrow">Newsroom</span>
            <h2 className="nrN2-title">Recent <em>thinking.</em></h2>
          </div>
          <a className="nrN2-all">All articles <ArrowRight size={16}/></a>
        </header>

        <div className="nrN2-grid">
          <article className="nrN2-hero">
            <span className="nrN2-stripe" aria-hidden="true"></span>
            <div className="nrN2-hero-meta">
              <span className="kind">{hero.kind}</span>
              <span className="dot" aria-hidden="true"></span>
              <span>{hero.date}</span>
              <span className="dot" aria-hidden="true"></span>
              <span>{hero.minutes}</span>
            </div>
            <h3 className="nrN2-hero-title">{hero.title}</h3>
            <p className="nrN2-hero-blurb">
              Forensic accountants and matrimonial counsel break down how undisclosed assets surface — and what to do when they don’t.
            </p>
            <a className="nrN2-hero-cta">Listen to the episode <ArrowRight size={16}/></a>
          </article>

          <div className="nrN2-stack">
            {rest.map((n, i) => (
              <article key={i} className="nrN2-card">
                <div className="nrN2-card-meta">
                  <span className="kind">{n.kind}</span>
                  <span>{n.date}</span>
                </div>
                <h3 className="nrN2-card-title">{n.title}</h3>
                <span className="nrN2-card-foot">{n.minutes} <ArrowRight size={14}/></span>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================
   N3 — Dark Newsroom
   Deep ink background, brand-blue accents, three equal cards
   with a number rail and a clean cream divider system.
   ========================================================== */
function NewsroomN3() {
  return (
    <section className="nrN3" data-screen-label="Newsroom">
      <div className="nrN3-inner">
        <header className="nrN3-head">
          <span className="nrN3-eyebrow">— Newsroom —</span>
          <h2 className="nrN3-title"><em>Recent</em> thinking.</h2>
          <p className="nrN3-sub">Writing, podcasts, and announcements from the firm.</p>
        </header>

        <div className="nrN3-grid">
          {NEWSROOM_ITEMS.map((n, i) => (
            <article key={i} className="nrN3-card">
              <div className="nrN3-top">
                <span className="nrN3-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="nrN3-kind">{n.kind}</span>
              </div>
              <h3 className="nrN3-headline">{n.title}</h3>
              <footer className="nrN3-foot">
                <span>{n.date}</span>
                <span className="nrN3-dot" aria-hidden="true"></span>
                <span>{n.minutes}</span>
                <a className="nrN3-cta" aria-label="Read more"><ArrowRight size={14}/></a>
              </footer>
            </article>
          ))}
        </div>

        <div className="nrN3-cta-row">
          <a className="nrN3-all">All articles <ArrowRight size={16}/></a>
        </div>
      </div>
    </section>
  );
}

window.NewsroomN1 = NewsroomN1;
window.NewsroomN2 = NewsroomN2;
window.NewsroomN3 = NewsroomN3;
