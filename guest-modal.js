/* ============================================================
   Dimopoulos Law — Be a Guest on Split (podcast guest inquiry)
   ------------------------------------------------------------
   A single, self-contained module. Add to any page with:
       <script src="<relative-path-to>/guest-modal.js" defer></script>

   On load it:
     1. injects its own CSS into <head>
     2. injects the modal markup into <body>
     3. hooks every "Interested in being a guest" / "Be a guest"
        trigger on the page (anchors with href="#guest" or any
        element with data-guest-trigger).
   ============================================================ */
(function () {
  if (window.__dimoGuestModalLoaded) return;
  window.__dimoGuestModalLoaded = true;

  /* ---------- CSS ---------- */
  const css = `
  .gm-modal { position: fixed; inset: 0; z-index: 1000; display: none; align-items: flex-start; justify-content: center; padding: 56px 24px 48px; overflow-y: auto; }
  .gm-modal[data-open="true"] { display: flex; }
  .gm-modal-backdrop { position: fixed; inset: 0; background: rgba(8, 26, 51, 0.62); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); opacity: 0; transition: opacity 240ms ease; }
  .gm-modal[data-open="true"] .gm-modal-backdrop { opacity: 1; }

  .gm-modal-dialog {
    position: relative; width: 100%; max-width: 880px;
    background: var(--hp-bone, #F1ECDF);
    border: 1px solid var(--hp-rule, #D7CFB8);
    box-shadow: 0 40px 80px -20px rgba(8, 26, 51, 0.45);
    transform: translateY(12px); opacity: 0;
    transition: transform 320ms cubic-bezier(.2,.7,.2,1), opacity 240ms ease;
  }
  .gm-modal[data-open="true"] .gm-modal-dialog { transform: translateY(0); opacity: 1; }

  .gm-modal-close {
    position: absolute; top: 18px; right: 18px; width: 40px; height: 40px;
    display: flex; align-items: center; justify-content: center;
    border: 1px solid var(--hp-rule, #D7CFB8); background: var(--hp-bone, #F1ECDF); color: var(--hp-ink, #0F2748);
    cursor: pointer; padding: 0;
    transition: background 180ms ease, color 180ms ease, border-color 180ms ease;
  }
  .gm-modal-close:hover { background: var(--hp-ink, #0F2748); color: var(--hp-bone, #F1ECDF); border-color: var(--hp-ink, #0F2748); }

  .gm-modal-head { background: var(--hp-ink, #0F2748); color: var(--hp-bone, #F1ECDF); padding: 56px 48px 40px; position: relative; }
  .gm-modal-head::before { content: ''; position: absolute; left: 0; right: 0; top: 0; height: 2px; background: var(--steel, #4F7FB8); }
  .gm-modal-kicker { font-family: var(--hp-sans, "Source Sans 3", sans-serif); font-size: 11px; letter-spacing: 0.24em; text-transform: uppercase; font-weight: 600; color: var(--steel-soft, #A9C5E6); display: inline-flex; align-items: center; gap: 14px; }
  .gm-modal-kicker::before { content: ''; width: 28px; height: 1px; background: var(--steel-soft, #A9C5E6); }
  .gm-modal-head h2 { font-family: var(--hp-serif, "Cormorant Garamond", serif); font-weight: 400; font-size: clamp(36px, 4vw, 52px); line-height: 1; letter-spacing: -0.02em; margin: 14px 0 10px; color: var(--hp-bone, #F1ECDF); }
  .gm-modal-head h2 em { font-style: italic; color: var(--steel-soft, #A9C5E6); }
  .gm-modal-head p { font-family: var(--hp-serif, "Cormorant Garamond", serif); font-style: italic; font-size: 18px; line-height: 1.45; color: rgba(232, 228, 220, 0.86); margin: 0; max-width: 52ch; }

  .gm-modal-body { display: grid; grid-template-columns: 1.5fr 1fr; gap: 0; }
  @media (max-width: 720px) {
    .gm-modal-body { grid-template-columns: 1fr; }
    .gm-modal-head { padding: 44px 24px 30px; }
    .gm-form { padding: 26px 24px 6px !important; }
    .gm-contact { padding: 26px 24px 24px !important; border-left: 0 !important; border-top: 1px solid var(--hp-rule, #D7CFB8); }
    .gm-modal-foot { padding: 20px 24px 28px !important; }
  }

  .gm-form { padding: 36px 40px 12px; }
  .gm-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px 20px; }
  .gm-grid .span-2 { grid-column: 1 / -1; }

  .gm-field { display: flex; flex-direction: column; gap: 6px; }
  .gm-field label { font-family: var(--hp-sans, "Source Sans 3", sans-serif); font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; color: var(--hp-ink-deep, #081A33); }
  .gm-field label .req { color: var(--steel, #4F7FB8); margin-left: 4px; font-style: italic; letter-spacing: 0; text-transform: none; }
  .gm-field input, .gm-field select, .gm-field textarea {
    font-family: var(--hp-sans, "Source Sans 3", sans-serif); font-size: 15px; line-height: 1.4;
    color: var(--hp-ink, #0F2748); background: var(--hp-bone, #F1ECDF);
    border: 1px solid var(--hp-rule, #D7CFB8); border-bottom: 1px solid var(--hp-ink, #0F2748);
    border-radius: 0; padding: 12px 14px; outline: none; width: 100%; box-sizing: border-box;
    transition: border-color 160ms ease, background 160ms ease;
  }
  .gm-field textarea { resize: vertical; min-height: 110px; font-family: var(--hp-serif, "Cormorant Garamond", serif); font-size: 16px; line-height: 1.55; }
  .gm-field input:focus, .gm-field select:focus, .gm-field textarea:focus { border-color: var(--steel, #4F7FB8); background: var(--hp-paper, #F6F3EB); }

  /* Contact info column */
  .gm-contact {
    padding: 36px 36px;
    background: var(--hp-paper, #F6F3EB);
    border-left: 1px solid var(--hp-rule, #D7CFB8);
    display: flex; flex-direction: column; gap: 26px;
  }
  .gm-contact-h {
    font-family: var(--hp-sans, "Source Sans 3", sans-serif);
    font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase;
    font-weight: 600; color: var(--hp-ink-deep, #081A33);
    padding-bottom: 14px;
    border-bottom: 1px solid var(--hp-rule, #D7CFB8);
  }
  .gm-info { display: flex; flex-direction: column; gap: 18px; }
  .gm-info-row { display: flex; flex-direction: column; gap: 4px; }
  .gm-info-row .lbl {
    font-family: var(--hp-sans, "Source Sans 3", sans-serif);
    font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase;
    font-weight: 600; color: var(--hp-mute-deep, #5B6E89);
  }
  .gm-info-row .val {
    font-family: var(--hp-serif, "Cormorant Garamond", serif);
    font-style: italic;
    font-size: 18px; line-height: 1.35;
    color: var(--hp-ink, #0F2748);
  }
  .gm-info-row .val a { color: inherit; text-decoration: none; border-bottom: 1px solid transparent; transition: border-color 160ms ease; }
  .gm-info-row .val a:hover { border-bottom-color: var(--steel, #4F7FB8); }

  .gm-modal-foot { display: flex; align-items: center; justify-content: space-between; gap: 24px; padding: 22px 40px 32px; border-top: 1px solid var(--hp-rule, #D7CFB8); background: var(--hp-paper, #F6F3EB); }
  .gm-modal-foot .note { font-family: var(--hp-serif, "Cormorant Garamond", serif); font-style: italic; font-size: 14px; color: var(--hp-mute-deep, #5B6E89); max-width: 42ch; }
  .gm-modal-foot .actions { display: flex; align-items: center; gap: 20px; }
  .gm-modal-foot .cancel { font-family: var(--hp-sans, "Source Sans 3", sans-serif); font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; color: var(--hp-ink-deep, #081A33); background: none; border: 0; cursor: pointer; padding: 6px 4px; }
  .gm-modal-foot .cancel:hover { color: var(--steel-deep, #3A5F8E); text-decoration: underline; text-underline-offset: 4px; }
  .gm-modal-foot .submit {
    font-family: var(--hp-sans, "Source Sans 3", sans-serif); font-size: 13px; letter-spacing: 0.22em; text-transform: uppercase; font-weight: 600;
    color: var(--hp-bone, #F1ECDF); background: var(--hp-ink, #0F2748);
    border: 0; padding: 16px 28px; cursor: pointer;
    display: inline-flex; align-items: center; gap: 12px;
    transition: background 180ms ease;
  }
  .gm-modal-foot .submit:hover { background: var(--steel-deep, #3A5F8E); }
  .gm-modal-foot .submit .arr::after { content: ''; display: inline-block; width: 12px; height: 1px; background: currentColor; vertical-align: middle; transform: translateX(2px); }

  .gm-success { display: none; padding: 56px 48px; }
  .gm-modal[data-state="success"] .gm-modal-body, .gm-modal[data-state="success"] .gm-modal-foot { display: none; }
  .gm-modal[data-state="success"] .gm-success { display: block; }
  .gm-success .mark { font-family: var(--hp-serif, "Cormorant Garamond", serif); font-style: italic; font-size: 14px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--steel, #4F7FB8); margin-bottom: 14px; display: inline-flex; align-items: center; gap: 12px; }
  .gm-success .mark::before { content: ''; width: 28px; height: 1px; background: var(--steel, #4F7FB8); }
  .gm-success h3 { font-family: var(--hp-serif, "Cormorant Garamond", serif); font-weight: 400; font-size: clamp(28px, 3vw, 40px); line-height: 1.05; letter-spacing: -0.015em; color: var(--hp-ink, #0F2748); margin: 0 0 14px; }
  .gm-success h3 em { font-style: italic; color: var(--steel, #4F7FB8); }
  .gm-success p { font-family: var(--hp-serif, "Cormorant Garamond", serif); font-style: italic; font-size: 18px; line-height: 1.5; color: var(--hp-mute-deep, #5B6E89); margin: 0 0 22px; max-width: 48ch; }
  .gm-success .done { font-family: var(--hp-sans, "Source Sans 3", sans-serif); font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase; font-weight: 600; background: var(--hp-ink, #0F2748); color: var(--hp-bone, #F1ECDF); border: 0; padding: 14px 26px; cursor: pointer; }
  .gm-success .done:hover { background: var(--steel-deep, #3A5F8E); }

  body.gm-modal-open { overflow: hidden; }
  `;

  const style = document.createElement('style');
  style.id = 'gm-guest-styles';
  style.textContent = css;
  document.head.appendChild(style);

  /* ---------- Markup ---------- */
  const html = `
  <div class="gm-modal" id="gm-guest-modal" role="dialog" aria-modal="true" aria-labelledby="gm-title" aria-hidden="true">
    <div class="gm-modal-backdrop" data-gm-close></div>
    <div class="gm-modal-dialog" role="document">
      <button type="button" class="gm-modal-close" data-gm-close aria-label="Close guest inquiry form">
        <svg viewBox="0 0 14 14" width="14" height="14" aria-hidden="true"><path d="M1 1l12 12M13 1L1 13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"></path></svg>
      </button>

      <header class="gm-modal-head">
        <span class="gm-modal-kicker">Be a Guest on Split</span>
        <h2 id="gm-title">Tell us your <em>story</em>.</h2>
        <p>Pitch a topic, an angle, or just an experience worth talking about. We&rsquo;ll reply within a few business days.</p>
      </header>

      <div class="gm-modal-body">
        <form class="gm-form" id="gm-form" novalidate>
          <div class="gm-grid">
            <div class="gm-field span-2">
              <label for="gm-name">Contact <span class="req">*</span></label>
              <input id="gm-name" name="name" type="text" autocomplete="name" required placeholder="Your full name">
            </div>
            <div class="gm-field">
              <label for="gm-email">Email <span class="req">*</span></label>
              <input id="gm-email" name="email" type="email" autocomplete="email" required>
            </div>
            <div class="gm-field">
              <label for="gm-phone">Phone</label>
              <input id="gm-phone" name="phone" type="tel" autocomplete="tel">
            </div>
            <div class="gm-field span-2">
              <label for="gm-address">Address</label>
              <input id="gm-address" name="address" type="text" autocomplete="street-address" placeholder="City &amp; state (or full mailing address)">
            </div>
            <div class="gm-field span-2">
              <label for="gm-topic">Topic / area of expertise <span class="req">*</span></label>
              <input id="gm-topic" name="topic" type="text" required placeholder="e.g. Forensic accounting in high-net-worth divorce">
            </div>
            <div class="gm-field span-2">
              <label for="gm-message">Tell us about yourself &amp; what you&rsquo;d like to discuss</label>
              <textarea id="gm-message" name="message" placeholder="Background, credentials or lived experience, and a few topics or stories you&rsquo;d want to explore on the show."></textarea>
            </div>
          </div>
          <input type="hidden" name="source_page" id="gm-source-page" value="">
        </form>

        <aside class="gm-contact" aria-label="Contact the show">
          <span class="gm-contact-h">Or reach us directly</span>
          <div class="gm-info">
            <div class="gm-info-row">
              <span class="lbl">Address</span>
              <span class="val">73 Main Street<br>Tuckahoe, NY 10707</span>
            </div>
            <div class="gm-info-row">
              <span class="lbl">Email</span>
              <span class="val"><a href="mailto:podcast@dimolaw.com">podcast@dimolaw.com</a></span>
            </div>
            <div class="gm-info-row">
              <span class="lbl">Phone</span>
              <span class="val"><a href="tel:9144724242">914.472.4242</a></span>
            </div>
          </div>
        </aside>
      </div>

      <footer class="gm-modal-foot">
        <span class="note">We review every pitch personally. No publicists required.</span>
        <div class="actions">
          <button type="button" class="cancel" data-gm-close>Cancel</button>
          <button type="submit" form="gm-form" class="submit">Send pitch <span class="arr" aria-hidden="true"></span></button>
        </div>
      </footer>

      <div class="gm-success" role="status" aria-live="polite">
        <span class="mark">Pitch received</span>
        <h3>Thanks &mdash; we&rsquo;ll be <em>in touch</em>.</h3>
        <p>A member of the team reviews every guest pitch personally. We&rsquo;ll reach out within a few business days if it&rsquo;s a fit.</p>
        <button type="button" class="done" data-gm-close>Close</button>
      </div>
    </div>
  </div>
  `;

  function injectModal() {
    if (document.getElementById('gm-guest-modal')) return;
    const wrap = document.createElement('div');
    wrap.innerHTML = html;
    document.body.appendChild(wrap.firstElementChild);
    bindModal();
  }

  /* ---------- Behavior ---------- */
  let lastFocus = null;

  function open(e) {
    if (e) e.preventDefault();
    const modal = document.getElementById('gm-guest-modal');
    if (!modal) return;
    const src = document.getElementById('gm-source-page');
    if (src) src.value = location.pathname + location.hash;
    lastFocus = document.activeElement;
    modal.setAttribute('data-open', 'true');
    modal.setAttribute('aria-hidden', 'false');
    modal.removeAttribute('data-state');
    document.body.classList.add('gm-modal-open');
    setTimeout(() => {
      const first = modal.querySelector('input, textarea, button');
      if (first) first.focus();
    }, 80);
  }
  function close() {
    const modal = document.getElementById('gm-guest-modal');
    if (!modal) return;
    modal.removeAttribute('data-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('gm-modal-open');
    if (lastFocus && typeof lastFocus.focus === 'function') {
      try { lastFocus.focus(); } catch (e) {}
    }
  }

  function bindModal() {
    const modal = document.getElementById('gm-guest-modal');
    if (!modal || modal.dataset.bound) return;
    modal.dataset.bound = '1';

    modal.querySelectorAll('[data-gm-close]').forEach(el => {
      el.addEventListener('click', e => { e.preventDefault(); close(); });
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modal.getAttribute('data-open') === 'true') close();
    });

    const form = document.getElementById('gm-form');
    if (form) {
      form.addEventListener('submit', e => {
        e.preventDefault();
        let ok = true;
        ['gm-name', 'gm-email', 'gm-topic'].forEach(id => {
          const f = document.getElementById(id);
          if (!f || !f.value.trim()) { ok = false; if (f) { f.style.borderColor = '#b35a3c'; f.focus(); } }
        });
        if (!ok) return;
        modal.setAttribute('data-state', 'success');
      });
    }
  }

  /* ---------- Trigger discovery ---------- */
  function bindTriggers(root) {
    const scope = root || document;
    const candidates = scope.querySelectorAll('a[href="#guest"], [data-guest-trigger]');
    candidates.forEach(el => {
      if (el.dataset.gmBound === '1') return;
      el.dataset.gmBound = '1';
      el.addEventListener('click', open);
    });
  }

  function init() {
    injectModal();
    bindTriggers();
    const obs = new MutationObserver(muts => {
      for (const m of muts) m.addedNodes.forEach(n => { if (n.nodeType === 1) bindTriggers(n); });
    });
    obs.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.openGuestModal = open;
  window.closeGuestModal = close;
})();
