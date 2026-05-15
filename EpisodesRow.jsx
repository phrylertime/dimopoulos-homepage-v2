/* global React, PODCAST_EPISODES */
const { useState: useStateEp } = React;

function EpisodesRow({ tone = 'light', sectionTitle = 'Split Podcast', allHref = '#podcast' }) {
  const eps = PODCAST_EPISODES;
  const visible = 3;
  const max = Math.max(0, eps.length - visible);
  const [start, setStart] = useStateEp(0);
  const canBack = start > 0;
  const canFwd = start < max;
  const go = (dir) => setStart(s => Math.min(max, Math.max(0, s + dir)));

  return (
    <section className={`epx epx--${tone}`} data-screen-label="Episodes">
      <div className="epx-head">
        <span className="epx-eyebrow">— {sectionTitle} —</span>
      </div>

      <div className="epx-stage">
        <button className="epx-nav epx-nav--prev" aria-label="Previous episodes" disabled={!canBack} onClick={() => go(-1)}>
          <svg viewBox="0 0 24 24" width="22" height="22"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>

        <div className="epx-viewport">
          <div className="epx-track" style={{ transform: `translateX(calc(${-start} * (var(--epx-card) + var(--epx-gap))))` }}>
            {eps.map((ep, i) => (
              <article key={ep.n} className="epx-card" aria-hidden={i < start || i >= start + visible}>
                <div className="epx-thumb">
                  <img src={ep.img} alt="" />
                  {/* angled brand-blue accent stroke, à la Law Disrupted teal */}
                  <span className="epx-stroke epx-stroke--tl" aria-hidden="true"></span>
                  <span className="epx-stroke epx-stroke--br" aria-hidden="true"></span>
                  <button className="epx-play" aria-label={`Play episode ${ep.n}`}>
                    <svg viewBox="0 0 24 24" width="20" height="20"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>
                  </button>
                </div>
                <div className="epx-body">
                  <span className="epx-num">Ep. {String(ep.n).padStart(2, '0')}</span>
                  <h3 className="epx-title">{ep.title}</h3>
                  <p className="epx-guest">{ep.guest}</p>
                  <div className="epx-foot">
                    <span>split.fm</span>
                    <span className="epx-dot" aria-hidden="true"></span>
                    <span>{ep.date}</span>
                    <span className="epx-dot" aria-hidden="true"></span>
                    <span>{ep.minutes}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <button className="epx-nav epx-nav--next" aria-label="Next episodes" disabled={!canFwd} onClick={() => go(1)}>
          <svg viewBox="0 0 24 24" width="22" height="22"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>

      <div className="epx-cta-row">
        <a className="epx-cta" href={allHref}>Click for all episodes</a>
      </div>
    </section>
  );
}

window.EpisodesRow = EpisodesRow;
