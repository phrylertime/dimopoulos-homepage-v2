/* global React, PODCAST_EPISODES */
// Standalone stacked grid for the /pages/podcast.html page.
// Reuses .epx-card markup from EpisodesRow but lays the cards
// out in a 3-column responsive grid instead of a carousel.

function EpisodesGrid({ tone = 'dark' }) {
  const eps = PODCAST_EPISODES;
  return (
    <div className={`epx epx--${tone}`} style={{ padding: 0, background: 'transparent' }}>
      <div className="podx-eps-grid">
        {eps.map((ep) => (
          <article key={ep.n} className="epx-card">
            <div className="epx-thumb">
              <img src={ep.img} alt={ep.imgAlt || ''} loading="lazy" />
              <span className="epx-stroke epx-stroke--tl" aria-hidden="true"></span>
              <span className="epx-stroke epx-stroke--br" aria-hidden="true"></span>
              {ep.listen ? (
                <a className="epx-play" href={ep.listen} target="_blank" rel="noopener noreferrer" aria-label={`Listen to episode ${ep.n}: ${ep.title}`}>
                  <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true"><path d="M6 4l14 8-14 8V4z" fill="currentColor"/></svg>
                </a>
              ) : (
                <button className="epx-play" type="button" aria-label={`Play episode ${ep.n}`}>
                  <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true"><path d="M6 4l14 8-14 8V4z" fill="currentColor"/></svg>
                </button>
              )}
            </div>
            <div className="epx-body">
              <span className="epx-num">Ep. {String(ep.n).padStart(2, '0')}</span>
              <h3 className="epx-title">
                {ep.listen
                  ? <a className="epx-title-link" href={ep.listen} target="_blank" rel="noopener noreferrer">{ep.title}</a>
                  : ep.title}
              </h3>
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
  );
}

window.EpisodesGrid = EpisodesGrid;
