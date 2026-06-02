// Dimopoulos Law — custom GA4 event tracking.
//
// Pageviews, scroll depth, outbound clicks, and file downloads are auto-
// tracked by GA4 Enhanced Measurement. This file adds the conversion +
// engagement events that matter for a legal-intake funnel.
//
// Loaded on every page after the gtag.js init snippet.

(function () {
  'use strict';

  function track(name, params) {
    try {
      if (typeof window.gtag === 'function') {
        window.gtag('event', name, params || {});
      }
    } catch (e) { /* never break the site over analytics */ }
  }
  // Expose for consult-modal.js and any future inline use.
  window.dimoTrack = track;

  // Where in the page did this element live? Helps disambiguate the same
  // CTA showing in multiple places (e.g. phone in header vs contact block).
  function locate(el) {
    if (!el) return 'unknown';
    if (el.closest('.hp-nav, .bio-nav, .pa-nav, header[role="banner"]')) return 'header';
    if (el.closest('footer')) return 'footer';
    if (el.closest('#contact, .hpB-contact, .bio-contact, .pa-contact')) return 'contact_block';
    if (el.closest('.hpB-hero, .bioC3-hero, .pa-hero, .testC-hero, .faq-hero')) return 'hero';
    if (el.closest('.cm-modal, .consult-modal, [data-cm-modal]')) return 'consult_modal';
    return 'body';
  }

  function pagePath() {
    return location.pathname + (location.hash || '');
  }

  // ===== Phone clicks (tel:) =====
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="tel:"]');
    if (!a) return;
    track('phone_click', {
      phone_number: (a.getAttribute('href') || '').replace('tel:', ''),
      link_text: (a.textContent || '').trim().slice(0, 60),
      location: locate(a),
      page_path: pagePath()
    });
  }, true);

  // ===== Email clicks (mailto:) =====
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="mailto:"]');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    track('email_click', {
      email: href.replace('mailto:', '').split('?')[0],
      location: locate(a),
      page_path: pagePath()
    });
  }, true);

  // ===== Podcast platform clicks (Spotify / Apple) =====
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a.pc-chip, a.podx-listen-btn');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    var platform = 'unknown';
    if (/spotify/i.test(href)) platform = 'spotify';
    else if (/podcasts\.apple|itunes\.apple/i.test(href)) platform = 'apple';
    else if (/youtube|youtu\.be/i.test(href)) platform = 'youtube';
    track('podcast_listen_click', {
      platform: platform,
      page_path: pagePath()
    });
  }, true);

  // ===== Homepage attorney card clicks =====
  document.addEventListener('click', function (e) {
    var card = e.target.closest('a.hpB-att');
    if (!card) return;
    var nameEl = card.querySelector('.name');
    track('attorney_card_click', {
      attorney: nameEl ? nameEl.textContent.trim() : 'unknown',
      destination: card.getAttribute('href') || '',
      page_path: pagePath()
    });
  }, true);

  // ===== Homepage practice-area card clicks =====
  document.addEventListener('click', function (e) {
    var card = e.target.closest('a.hpB-pa');
    if (!card) return;
    var titleEl = card.querySelector('h3');
    track('practice_area_click', {
      practice_area: titleEl ? titleEl.textContent.trim() : 'unknown',
      destination: card.getAttribute('href') || '',
      page_path: pagePath()
    });
  }, true);

  // ===== FAQ question opens (homepage + dedicated FAQ page) =====
  document.addEventListener('toggle', function (e) {
    var el = e.target;
    if (!el || !el.matches) return;
    if (!el.matches('.hpB-faq-list details, .faq-q details')) return;
    if (!el.open) return; // only track opens, not collapses
    var summary = el.querySelector('summary');
    var rawText = summary ? summary.textContent.trim() : '';
    // Trim trailing +/- toggle indicators inserted by the design.
    var question = rawText.replace(/[+\-–—]\s*$/, '').trim().slice(0, 150);
    track('faq_open', {
      question: question,
      page_path: pagePath()
    });
  }, true);

  // ===== Homepage hero "More about Gus" expand =====
  document.addEventListener('toggle', function (e) {
    var el = e.target;
    if (!el || !el.matches) return;
    if (!el.matches('.hpB-hero-more')) return;
    if (!el.open) return;
    track('more_about_gus_open', { page_path: pagePath() });
  }, true);

  // ===== Testimonial carousel arrow clicks =====
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-testimonial-prev], [data-testimonial-next]');
    if (!btn) return;
    var direction = btn.hasAttribute('data-testimonial-prev') ? 'prev' : 'next';
    track('testimonial_advance', {
      direction: direction,
      method: 'arrow',
      page_path: pagePath()
    });
  }, true);

})();
