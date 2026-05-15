/* global React, SplitCover */

// Shared platform-row component used by all three.
function PlatformRow({ tone = 'light' }) {
  const labelColor = tone === 'dark' ? 'rgba(246,244,239,0.55)' : 'rgba(31,29,26,0.55)';
  const chipBg = tone === 'dark' ? 'rgba(246,244,239,0.06)' : 'rgba(31,29,26,0.04)';
  const chipBorder = tone === 'dark' ? 'rgba(246,244,239,0.16)' : 'rgba(31,29,26,0.12)';
  const chipColor = tone === 'dark' ? '#f6f4ef' : '#1f1d1a';
  return (
    <div className="pc-platforms">
      <span className="pc-platforms-label" style={{ color: labelColor }}>Listen on</span>
      <a className="pc-chip" style={{ background: chipBg, borderColor: chipBorder, color: chipColor }}>
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="#1DB954"/><path d="M7.2 9.5c3.4-1 7.2-.8 10 .8M7.8 12.5c2.9-.8 6.1-.6 8.4.7M8.4 15.5c2.4-.6 5-.4 6.9.6" stroke="#000" strokeWidth="1.4" fill="none" strokeLinecap="round"/></svg>
        Spotify
      </a>
      <a className="pc-chip" style={{ background: chipBg, borderColor: chipBorder, color: chipColor }}>
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><defs><linearGradient id="apg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#F452FF"/><stop offset="1" stopColor="#832BC1"/></linearGradient></defs><circle cx="12" cy="12" r="11" fill="url(#apg)"/><path d="M12 6.5a1 1 0 011 1v6.2a2.4 2.4 0 11-2-2.36V7.5a1 1 0 011-1z" fill="#fff"/></svg>
        Apple Podcasts
      </a>
      <a className="pc-chip" style={{ background: chipBg, borderColor: chipBorder, color: chipColor }}>
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><rect width="24" height="24" rx="4" fill="#FF0000"/><path d="M16 12l-6 3.5v-7z" fill="#fff"/></svg>
        YouTube
      </a>
    </div>
  );
}

// ============================================================
// Option A — "On Air" Editorial
// Portrait-led, magazine spread. Cover floats as an overlay card.
// ============================================================
function PodcastA() {
  return (
    <section className="pcA" data-podcast-option="A">
      <div className="pcA-inner">
        <div className="pcA-text">
          <span className="pcA-eyebrow">
            <span className="dot"></span> On the record — Episode 47
          </span>
          <h2 className="pcA-title">
            <em>Split.</em>
            <span>A podcast on <span className="accent">modern divorce.</span></span>
          </h2>
          <p className="pcA-lead">
            Beyond the paperwork — expert-driven, sometimes unexpectedly funny conversations about what it really means to end a marriage today.
          </p>
          <p className="pcA-body">
            Hosted by New York family law attorney Gus Dimopoulos, the show explores the legal, emotional, and financial realities of divorce — and the cultural shifts reshaping family law.
          </p>
          <PlatformRow tone="light" />
        </div>

        <div className="pcA-art">
          <div className="pcA-portrait">
            <img src="assets/gus-podcast-laugh.jpg" alt="Gus Dimopoulos" />
            <span className="pcA-portrait-cap"><em>Hosted by</em> Gus Dimopoulos</span>
          </div>
          <div className="pcA-cover">
            <SplitCover size={360} />
            <div className="pcA-cover-foot">
              <span className="lbl">Now streaming</span>
              <span className="ep">EP 47 · 38 min</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// Option B — Studio Dark
// Full-bleed black matching the cover art. Cover-as-record-sleeve,
// editorial type on the right, Gus as a 'Hosted by' badge.
// ============================================================
function PodcastB() {
  return (
    <section className="pcB" data-podcast-option="B">
      <div className="pcB-bg-mark" aria-hidden="true">SPLIT</div>
      <div className="pcB-inner">
        <div className="pcB-cover-wrap">
          <div className="pcB-cover-shadow"></div>
          <SplitCover className="pcB-cover" size={480} />
          <button className="pcB-play" aria-label="Play latest episode">
            <svg viewBox="0 0 24 24" width="20" height="20"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>
            Play latest
          </button>
        </div>

        <div className="pcB-text">
          <span className="pcB-eyebrow">The Podcast</span>
          <h2 className="pcB-title">
            Split — <em>a podcast<br />on modern divorce.</em>
          </h2>
          <p className="pcB-body">
            Beyond the paperwork: expert-driven, thought-provoking, and sometimes unexpectedly funny conversations about what it really means to end a marriage today. Hosted by New York family law attorney Gus Dimopoulos.
          </p>

          <div className="pcB-host">
            <div className="pcB-host-img"><img src="assets/gus-podcast-glasses.jpg" alt="Gus Dimopoulos" /></div>
            <div className="pcB-host-meta">
              <span className="lbl">Hosted by</span>
              <span className="name">Gus Dimopoulos</span>
              <span className="sub">Managing Partner, Dimopoulos Law</span>
            </div>
          </div>

          <PlatformRow tone="dark" />
        </div>
      </div>
    </section>
  );
}

// ============================================================
// Option C — Studio Portrait (refined)
// Sharp, well-exposed studio image on the left; deep navy
// editorial panel on the right with the brand accent rail.
// ============================================================
function PodcastC() {
  return (
    <section className="pcC" data-podcast-option="C">
      {/* SVG filter — tone lift + true unsharp-mask. Lives once per section. */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <filter id="pcC-sharpen" colorInterpolationFilters="sRGB">
          {/* Linear lift on each channel — opens up the shadows without milky greys */}
          <feComponentTransfer>
            <feFuncR type="linear" slope="1.18" intercept="0.06" />
            <feFuncG type="linear" slope="1.18" intercept="0.05" />
            <feFuncB type="linear" slope="1.14" intercept="0.04" />
          </feComponentTransfer>
          {/* Unsharp-mask — strong center weight + negative neighbors = crisp edges */}
          <feConvolveMatrix order="3" preserveAlpha="true"
            kernelMatrix="0 -0.85 0  -0.85 4.4 -0.85  0 -0.85 0" />
        </filter>
      </svg>

      <div className="pcC-image">
        <img src="assets/gus-podcast-studio.png" alt="Gus Dimopoulos recording Split, a podcast on modern divorce" />
        <span className="pcC-image-cap">
          <span className="dot"></span> Recording — Studio · NY
        </span>
      </div>

      <div className="pcC-panel">
        <span className="pcC-rail" aria-hidden="true"></span>
        <div className="pcC-panel-inner">
          <span className="pcC-eyebrow">— The Podcast —</span>
          <h2 className="pcC-title">
            <em>Split:</em>
            <span>A Podcast on <span className="accent">Modern Divorce.</span></span>
          </h2>
          <p className="pcC-body">
            Beyond the paperwork — expert-driven, thought-provoking, and sometimes unexpectedly funny conversations about what it really means to end a marriage today. Hosted by New York family law attorney <strong>Gus&nbsp;Dimopoulos</strong>.
          </p>

          <div className="pcC-meta">
            <div><span className="lbl">New episodes</span><span className="val">Monthly</span></div>
            <div><span className="lbl">Latest</span><span className="val">Ep. 11 · 20 min</span></div>
          </div>

          <PlatformRow tone="dark" />
        </div>
      </div>
    </section>
  );
}

window.PodcastA = PodcastA;
window.PodcastB = PodcastB;
window.PodcastC = PodcastC;
