/* global React, HOMEPAGE_DATA, Reveal, HPNav */
const { useState: useStateB } = React;

function VariationB() {
  const D = HOMEPAGE_DATA;
  const [tIdx, setTIdx] = useStateB(0);
  const t = D.testimonials[tIdx];

  return (
    <div className="hp-root" data-variation="B">
      <HPNav active="home" />

      {/* Hero — image left, headline overlay right */}
      <section className="hpB-hero" data-screen-label="Hero">
        <div className="hpB-hero-grid">
          <div className="hpB-hero-img-side">
            <img className="hpB-hero-img" src="assets/gus-portrait-b.jpg" alt="Gus Dimopoulos" />
          </div>
          <div className="hpB-hero-text-side">
            <Reveal className="hpB-hero-text">
              <span className="hpB-label">Matrimonial · Custody · High-Conflict</span>
              <h1>When everything is on the line, <span className="accent">experience</span> <em>matters</em>.</h1>
              <p className="hpB-hero-sub">When divorce turns high-stakes, clients turn to Gus Dimopoulos for clarity, strategy, and results.</p>
              <details className="hpB-hero-more">
                <summary>
                  <span className="lbl">More about Gus</span>
                  <span className="chev" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="14" height="14"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                </summary>
                <p>As managing partner of Dimopoulos Law Firm, Gus is recognized by Super Lawyers, Lawyers of Distinction, and Premier Lawyers of America. With 20+ years of courtroom wins, he’s trusted to handle the most combative cases — often involving mental health challenges, coercive control, addiction, and narcissism. He’s secured sole custody in high-conflict cases and defended clients from unjustified claims. Whether resolving complex financial disputes or de-escalating crises before court, Gus brings unmatched judgment and discretion when your children, future, and peace of mind are at stake.</p>
              </details>
              <div className="hpB-hero-actions">
                <button className="hp-cta-primary">Schedule a consultation <span className="arr"></span></button>
                <a className="hp-cta-ghost on-dark">914.472.4242</a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="hpB-marquee">
        <div className="hpB-marquee-track">
          <span>Westchester County <span className="dot"></span> New York City <span className="dot"></span> Putnam <span className="dot"></span> Dutchess <span className="dot"></span> Rockland <span className="dot"></span> Orange <span className="dot"></span></span>
          <span>Westchester County <span className="dot"></span> New York City <span className="dot"></span> Putnam <span className="dot"></span> Dutchess <span className="dot"></span> Rockland <span className="dot"></span> Orange <span className="dot"></span></span>
        </div>
      </div>

      {/* About */}
      <section className="hpB-about" data-screen-label="About">
        <div className="hpB-about-inner">
          <Reveal className="hpB-about-side">
            <span className="hp-eyebrow">Why Dimopoulos Law</span>
            <h2>Built for <em>complicated</em> matters.</h2>
          </Reveal>
          <Reveal className="hpB-about-prose">
            <p className="lead">At Dimopoulos Law, we handle the divorce and custody cases others can’t — high conflict, mental health challenges, addiction, coercive control, financial complexity, and the well-being of children caught in the middle.</p>
            <p>Known for strategic litigation and relentless preparation, Gus Dimopoulos is a trusted advocate in and out of the courtroom.</p>
            <p>Through his podcast, <em>Split: A Podcast on Modern Divorce</em>, social media presence, and thought leadership, Gus has become a leading voice on the realities of modern family conflict — giving clients clarity, perspective, and fierce representation when the stakes are highest.</p>
          </Reveal>
        </div>
      </section>

      {/* Testimonial spotlight */}
      <section className="hpB-testimonials" data-screen-label="Testimonials">
        <div className="hpB-testimonials-inner">
          <Reveal className="hpB-test-lede">
            <p>In any line of work, there is no greater compliment than the kind words of satisfied clients.</p>
          </Reveal>
          <Reveal>
            <p className="hpB-test-mark">“</p>
            <blockquote className="hpB-test-quote">{t.quote}</blockquote>
            <span className="hpB-test-author">— {t.author} · {t.context}</span>
          </Reveal>
          <div className="hpB-test-dots">
            {D.testimonials.map((_, i) => (
              <button key={i} aria-label={`Testimonial ${i + 1}`} className={i === tIdx ? 'is-active' : ''} onClick={() => setTIdx(i)}></button>
            ))}
          </div>
          <Reveal className="hpB-test-cta">
            <a href="#testimonials" className="hp-cta-primary on-dark">Read more testimonials <span className="arr"></span></a>
          </Reveal>
        </div>
      </section>

      {/* Podcast — Option C (Studio Portrait, refined) */}
      <PodcastC />
      <EpisodesRow tone="dark" sectionTitle="Split Podcast" allHref="#podcast" />

      {/* Practice */}
      <section className="hpB-practice" data-screen-label="Practice">
        <Reveal className="hpB-practice-head">
          <div>
            <span className="hp-eyebrow">Practice areas</span>
            <h2>Where <em>we work</em>.</h2>
          </div>
          <p>Full-service matrimonial and family practice — from prenuptial planning through trial, appeals, and crisis management.</p>
        </Reveal>
        <Reveal className="hpB-pa-grid" stagger>
          <article className="hpB-pa feature">
            <div className="img"><img src={D.editorialImg} alt="" /></div>
            <div className="body">
              <span className="n">01</span>
              <h3>Divorce</h3>
              <p>{D.practiceAreas[0].blurb}</p>
              <span className="arr">Read more →</span>
            </div>
          </article>
          {D.practiceAreas.slice(1, 5).map((p, i) => (
            <article key={p.slug} className="hpB-pa">
              <span className="n">{String(i + 2).padStart(2, '0')}</span>
              <h3>{p.title}</h3>
              <p>{p.blurb}</p>
              <span className="arr">Read more →</span>
            </article>
          ))}
        </Reveal>
      </section>

      {/* Stats */}
      <section className="hpB-stats" data-screen-label="Stats">
        <Reveal className="hpB-stats-inner" stagger>
          {D.stats.map((s, i) => (
            <div key={i} className="hpB-stat">
              <div className="v"><em>{s.value}</em></div>
              <div className="l">{s.label}</div>
            </div>
          ))}
        </Reveal>
      </section>

      {/* Attorneys */}
      <section className="hpB-attorneys" data-screen-label="Attorneys">
        <div className="hpB-attorneys-inner">
          <Reveal className="hpB-attorneys-head">
            <div>
              <span className="hp-eyebrow">The team</span>
              <h2>Counsel <em>worth</em> hiring.</h2>
            </div>
            <p style={{ fontFamily: 'var(--hp-serif)', fontStyle: 'italic', fontSize: 19, color: 'var(--hp-mute-deep)', maxWidth: '40ch', margin: 0 }}>A focused team that prioritizes depth over headcount. Each member is empowered to own the work in front of them.</p>
          </Reveal>
          <Reveal className="hpB-att-row" stagger>
            {D.attorneys.map(a => (
              <article key={a.slug} className="hpB-att">
                <div className="photo"><img src={a.img} alt={a.name} /></div>
                <div className="meta">
                  <span className="role">{a.role}</span>
                  <span className="name">{a.name}</span>
                </div>
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Awards */}
      <section className="hpB-awards" data-screen-label="Awards">
        <div className="hpB-awards-inner">
          <h2 className="hpB-awards-label">
            We have a long history <em>of solving matrimonial disputes.</em>
          </h2>
          <Reveal className="hpB-awards-row" stagger>
            {D.awards.map((a, i) => (
              <div key={i} className="hpB-award"><img src={a.src} alt={a.alt} /></div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Newsroom — N3 (Dark Newsroom, brand navy with subtle texture) */}
      <NewsroomN3 />

      {/* FAQ */}
      <section className="hpB-faq" data-screen-label="FAQ">
        <div className="hpB-faq-inner">
          <Reveal className="hpB-faq-side">
            <span className="hp-eyebrow">FAQ</span>
            <h2>Questions <em>clients ask first</em>.</h2>
            <p>Have a question we don’t answer here?<br />Call us: <a href="tel:9144724242" className="hpB-faq-phone">914-472-4242</a></p>
          </Reveal>
          <Reveal className="hpB-faq-list">
            {D.faqs.map((f, i) => (
              <details key={i} {...(i === 0 ? { open: true } : {})}>
                <summary>{f.q}</summary>
                <div className="a">{f.a}</div>
              </details>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Contact band */}
      <section className="hpB-contact" data-screen-label="Contact">
        <div className="hpB-contact-inner">
          <Reveal>
            <span className="hp-eyebrow on-dark">Get in touch</span>
            <h2>Let’s <em>begin</em>.</h2>
            <p className="lead">Tell us what you are facing. We’ll respond within one business day.</p>
            <button className="hp-cta-primary">Schedule a consultation <span className="arr"></span></button>
          </Reveal>
          <Reveal className="hpB-contact-info">
            <div><dt>Phone</dt><dd>{D.contact.phone}</dd></div>
            <div><dt>Office</dt><dd>{D.contact.address}</dd></div>
            <div><dt>Hours</dt><dd>{D.contact.hours}</dd></div>
          </Reveal>
        </div>
      </section>

      <footer className="hpA-footer">
        <div className="hpA-footer-row">
          <span>© 2007– Dimopoulos Law Firm PC. All rights reserved.</span>
          <span>Westchester · NYC · Putnam · Dutchess · Rockland · Orange</span>
        </div>
      </footer>
    </div>
  );
}

window.VariationB = VariationB;
