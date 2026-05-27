// Dimopoulos Law — homepage_v2 interactivity
// Three small features: testimonial rotator, episodes carousel, scroll-reveal.

(function () {
  'use strict';

  // ===== Testimonial rotator =====
  const testimonials = [
    {
      quote: 'From the moment I met Gus, I knew I was in good hands. He was empathetic, patient when I needed something explained, strong when I felt weak — and my prize fighter in the ring.',
      author: 'Lisa',
      context: 'Divorce, Westchester'
    },
    {
      quote: 'Gus was exactly the person I needed to guide me through an unexpected divorce. He listened, then provided the insight I needed to make intelligent decisions.',
      author: 'Anthony',
      context: 'Custody matter'
    },
    {
      quote: 'Going through a divorce is one of the most traumatic experiences I have ever faced. Gus Dimopoulos was my rock during this difficult time. His professionalism and expertise were evident throughout.',
      author: 'Jennifer',
      context: 'High-net-worth divorce'
    }
  ];

  const quoteEl = document.querySelector('[data-testimonial-quote]');
  const authorEl = document.querySelector('[data-testimonial-author]');
  const dotsRoot = document.querySelector('[data-testimonial-dots]');
  if (quoteEl && authorEl && dotsRoot) {
    const dots = dotsRoot.querySelectorAll('button');
    const show = (i) => {
      const t = testimonials[i];
      quoteEl.textContent = t.quote;
      authorEl.textContent = '— ' + t.author + ' · ' + t.context;
      dots.forEach((d, di) => d.classList.toggle('is-active', di === i));
    };
    dots.forEach((d) => {
      d.addEventListener('click', () => show(parseInt(d.dataset.index, 10)));
    });
  }

  // ===== Episodes carousel =====
  const track = document.querySelector('[data-epx-track]');
  const prevBtn = document.querySelector('[data-epx-prev]');
  const nextBtn = document.querySelector('[data-epx-next]');
  if (track && prevBtn && nextBtn) {
    const cards = track.querySelectorAll('.epx-card');
    const visible = 3;
    const max = Math.max(0, cards.length - visible);
    let start = 0;

    const apply = () => {
      track.style.transform =
        'translateX(calc(' + (-start) + ' * (var(--epx-card) + var(--epx-gap))))';
      prevBtn.disabled = start <= 0;
      nextBtn.disabled = start >= max;
      cards.forEach((card, i) => {
        card.setAttribute('aria-hidden', i < start || i >= start + visible ? 'true' : 'false');
      });
    };
    prevBtn.addEventListener('click', () => { start = Math.max(0, start - 1); apply(); });
    nextBtn.addEventListener('click', () => { start = Math.min(max, start + 1); apply(); });
    apply();
  }

  // ===== FAQ sticky-rail scroll-spy =====
  // Highlights the active section in the left-rail TOC as the user scrolls
  // through the FAQ sections. Mirrors the IntersectionObserver in FAQPage.jsx.
  const railList = document.querySelector('[data-faq-rail]');
  if (railList) {
    const sections = Array.from(document.querySelectorAll('.faq-sec[id^="faq-sec-"]'));
    const railItems = Array.from(railList.querySelectorAll('li'));
    const byId = new Map(railItems.map((li) => {
      const a = li.querySelector('a[href^="#faq-sec-"]');
      const id = a ? a.getAttribute('href').slice('#faq-sec-'.length) : null;
      return [id, li];
    }));
    const setActive = (id) => {
      railItems.forEach((li) => li.classList.remove('is-active'));
      const el = byId.get(id);
      if (el) el.classList.add('is-active');
    };
    if (sections.length && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((e) => e.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          if (visible[0]) {
            setActive(visible[0].target.id.replace('faq-sec-', ''));
          }
        },
        { rootMargin: '-30% 0px -60% 0px', threshold: [0, 0.2, 0.5, 1] }
      );
      sections.forEach((s) => io.observe(s));
    }
  }

  // ===== Scroll-reveal (progressive enhancement) =====
  // The source design fades sections in on scroll. If reduced-motion is set
  // we skip this entirely — content is already marked `is-visible` in markup
  // so it stays accessible without JS.
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReduced && 'IntersectionObserver' in window) {
    const targets = document.querySelectorAll('.hp-reveal, .hp-reveal-stagger');
    // Reset to hidden, then observe.
    targets.forEach((el) => el.classList.remove('is-visible'));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    targets.forEach((el) => io.observe(el));
  }
})();

/* Mobile nav drawer — toggles .is-open on .hp-nav and locks body scroll. */
(function mobileNavDrawer() {
  const nav = document.querySelector('.hp-nav');
  const btn = document.querySelector('.hp-nav-mobile-toggle');
  if (!nav || !btn) return;

  const setOpen = (open) => {
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('is-nav-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };

  btn.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));

  // Close when any nav link is tapped.
  nav.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (a && nav.classList.contains('is-open')) setOpen(false);
  });

  // Close on Escape and on resize past the breakpoint.
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) setOpen(false);
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1080 && nav.classList.contains('is-open')) setOpen(false);
  });
})();
