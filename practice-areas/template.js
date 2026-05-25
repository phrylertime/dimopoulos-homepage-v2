/* practice-areas/template.js
   ---------------------------------------------------------------
   Progressive enhancement for practice area pages. The page
   renders fully without JS (per the SEO brief). This script just
   adds the niceties:

     1. Scroll-spy for the sticky anchored sub-nav (highlights the
        currently-visible H2 link).
     2. Smooth scroll for anchor links, accounting for the sticky
        nav offset.
     3. Close the mobile TOC <details> after a jump-link click.

   No content is generated here. No event listeners are required
   for the page to be usable.
   --------------------------------------------------------------- */
(function () {
  'use strict';

  // ---- Scroll-spy on anchored sub-nav --------------------------
  // Targets the inline pa-main-sub on simplified pages AND the
  // sticky pa-anchor-nav-inner on the marquee variant.
  var anchorNav = document.querySelector('.pa-main-sub, .pa-anchor-nav-inner');
  if (anchorNav) {
    var links = Array.prototype.slice.call(
      anchorNav.querySelectorAll('a[href^="#"]')
    );
    var sections = links
      .map(function (a) {
        var id = a.getAttribute('href').slice(1);
        return { link: a, el: document.getElementById(id) };
      })
      .filter(function (s) { return s.el; });

    if (sections.length && 'IntersectionObserver' in window) {
      var current = null;
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              if (current) current.link.classList.remove('is-active');
              current = sections.find(function (s) { return s.el === entry.target; });
              if (current) current.link.classList.add('is-active');
            }
          });
        },
        // Trigger when the section's top crosses the area just
        // below the sticky nav (top: 130px) — keeps the highlight
        // aligned with what the reader is actually looking at.
        { rootMargin: '-140px 0px -70% 0px', threshold: 0 }
      );
      sections.forEach(function (s) { io.observe(s.el); });
    }
  }

  // ---- Smooth scroll with sticky-nav offset --------------------
  function jumpTo(id) {
    var target = document.getElementById(id);
    if (!target) return;
    var navHeight = 150; // sticky .hp-nav (~76) + .pa-anchor-nav (~50)
    var top = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
    window.scrollTo({ top: top, behavior: 'smooth' });
  }

  Array.prototype.forEach.call(
    document.querySelectorAll('.pa-main-sub a, .pa-anchor-nav a, .pa-anchor-nav-mobile a'),
    function (a) {
      a.addEventListener('click', function (e) {
        var href = a.getAttribute('href');
        if (!href || href.charAt(0) !== '#') return;
        e.preventDefault();
        jumpTo(href.slice(1));
        history.replaceState(null, '', href);

        // Close the mobile TOC if it's open
        var details = a.closest('details.pa-anchor-nav-mobile');
        if (details && details.open) details.open = false;
      });
    }
  );
})();
