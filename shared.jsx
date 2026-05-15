/* global React, HOMEPAGE_DATA */
const { useEffect, useRef } = React;

// Shared scroll-reveal hook
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}
function Reveal({ as: Tag = 'div', stagger = false, className = '', children, ...rest }) {
  const ref = useReveal();
  return <Tag ref={ref} className={`${stagger ? 'hp-reveal-stagger' : 'hp-reveal'} ${className}`} {...rest}>{children}</Tag>;
}

// Shared site chrome — modern white nav (used by all 3)
function HPNav({ active = 'home' }) {
  const tabs = ['Home','Attorneys','Practice','Testimonials','Newsroom','Contact'];
  return (
    <header className="hp-nav">
      <div className="hp-nav-row">
        <nav className="hp-nav-tabs">
          {tabs.slice(0, 3).map(t => (
            <a key={t} className={t.toLowerCase() === active ? 'is-active' : ''}>{t}</a>
          ))}
        </nav>
        <div className="hp-nav-logo">
          <img src="assets/dimopoulos-logo.png" alt="Dimopoulos Law Firm, P.C." />
        </div>
        <div className="hp-nav-end">
          <span className="hp-nav-phone">914.472.4242</span>
          <button className="hp-nav-cta">Consultation</button>
        </div>
      </div>
    </header>
  );
}

window.useReveal = useReveal;
window.Reveal = Reveal;
window.HPNav = HPNav;
