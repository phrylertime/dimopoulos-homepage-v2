/* ============================================================
   Dimopoulos Advisory — Confidential Inquiry Lightbox
   ------------------------------------------------------------
   Single self-contained module for the /advisory page.
   Triggered by any element with [data-am-trigger].

   Pipeline: form -> Cloudflare Worker (/advisory) -> Postmark
   ============================================================ */
(function () {
  if (window.__dimoAdvisoryModalLoaded) return;
  window.__dimoAdvisoryModalLoaded = true;

  /* ---------- CSS ---------- */
  const css = `
  .am-modal { position: fixed; inset: 0; z-index: 1000; display: none; align-items: flex-start; justify-content: center; padding: 56px 24px 48px; overflow-y: auto; }
  .am-modal[data-open="true"] { display: flex; }
  .am-modal-backdrop { position: fixed; inset: 0; background: rgba(8, 26, 51, 0.72); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); opacity: 0; transition: opacity 240ms ease; }
  .am-modal[data-open="true"] .am-modal-backdrop { opacity: 1; }

  .am-modal-dialog {
    position: relative; width: 100%; max-width: 720px;
    background: var(--hp-bone, #F1ECDF);
    border: 1px solid var(--hp-rule, #D7CFB8);
    box-shadow: 0 40px 80px -20px rgba(8, 26, 51, 0.5);
    transform: translateY(12px); opacity: 0;
    transition: transform 320ms cubic-bezier(.2,.7,.2,1), opacity 240ms ease;
  }
  .am-modal[data-open="true"] .am-modal-dialog { transform: translateY(0); opacity: 1; }

  .am-modal-close {
    position: absolute; top: 18px; right: 18px; width: 40px; height: 40px;
    display: flex; align-items: center; justify-content: center;
    border: 1px solid rgba(232, 228, 220, 0.3); background: transparent; color: var(--hp-bone, #F1ECDF);
    cursor: pointer; padding: 0;
    transition: background 180ms ease, color 180ms ease, border-color 180ms ease;
    z-index: 2;
  }
  .am-modal-close:hover { background: var(--hp-bone, #F1ECDF); color: var(--hp-ink, #0F2748); border-color: var(--hp-bone, #F1ECDF); }

  .am-modal-head { background: var(--hp-ink, #0F2748); color: var(--hp-bone, #F1ECDF); padding: 56px 48px 40px; position: relative; }
  .am-modal-head::before { content: ''; position: absolute; left: 0; right: 0; top: 0; height: 2px; background: var(--steel, #4F7FB8); }
  .am-modal-kicker { font-family: var(--hp-sans, "Source Sans 3", sans-serif); font-size: 11px; letter-spacing: 0.24em; text-transform: uppercase; font-weight: 600; color: var(--steel-soft, #A9C5E6); display: inline-flex; align-items: center; gap: 14px; }
  .am-modal-kicker::before { content: ''; width: 28px; height: 1px; background: var(--steel-soft, #A9C5E6); }
  .am-modal-head h2 { font-family: var(--hp-serif, "Cormorant Garamond", serif); font-weight: 400; font-size: clamp(32px, 3.6vw, 44px); line-height: 1.05; letter-spacing: -0.02em; margin: 14px 0 12px; color: var(--hp-bone, #F1ECDF); }
  .am-modal-head h2 em { font-style: italic; color: var(--steel-soft, #A9C5E6); }
  .am-modal-head p { font-family: var(--hp-serif, "Cormorant Garamond", serif); font-style: italic; font-size: 17px; line-height: 1.45; color: rgba(232, 228, 220, 0.86); margin: 0; max-width: 50ch; }

  .am-modal-body { padding: 36px 48px 8px; }
  .am-section { padding: 22px 0 26px; border-bottom: 1px solid var(--hp-rule, #D7CFB8); }
  .am-section:last-of-type { border-bottom: 0; }
  .am-section-h { display: flex; align-items: baseline; gap: 14px; margin-bottom: 18px; }
  .am-section-h .num { font-family: var(--hp-serif, "Cormorant Garamond", serif); font-style: italic; font-size: 16px; color: var(--steel, #4F7FB8); }
  .am-section-h .lbl { font-family: var(--hp-sans, "Source Sans 3", sans-serif); font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; font-weight: 600; color: var(--hp-ink-deep, #081A33); }

  .am-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px 20px; }
  .am-grid .span-2 { grid-column: 1 / -1; }
  @media (max-width: 640px) {
    .am-grid { grid-template-columns: 1fr; }
    .am-modal-head { padding: 44px 24px 30px; }
    .am-modal-body { padding: 24px 24px 8px; }
    .am-modal-foot { padding: 20px 24px 28px !important; }
  }

  .am-field { display: flex; flex-direction: column; gap: 6px; }
  .am-field label { font-family: var(--hp-sans, "Source Sans 3", sans-serif); font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; color: var(--hp-ink-deep, #081A33); }
  .am-field label .req { color: var(--steel, #4F7FB8); margin-left: 4px; font-style: italic; letter-spacing: 0; text-transform: none; }
  .am-field input, .am-field textarea {
    font-family: var(--hp-sans, "Source Sans 3", sans-serif); font-size: 15px; line-height: 1.4;
    color: var(--hp-ink, #0F2748); background: var(--hp-bone, #F1ECDF);
    border: 1px solid var(--hp-rule, #D7CFB8); border-bottom: 1px solid var(--hp-ink, #0F2748);
    border-radius: 0; padding: 12px 14px; outline: none; width: 100%; box-sizing: border-box;
    transition: border-color 160ms ease, background 160ms ease;
  }
  .am-field textarea { resize: vertical; min-height: 120px; font-family: var(--hp-serif, "Cormorant Garamond", serif); font-size: 16px; line-height: 1.55; }
  .am-field input:focus, .am-field textarea:focus { border-color: var(--steel, #4F7FB8); background: var(--hp-paper, #F6F3EB); }

  .am-chips { display: flex; flex-wrap: wrap; gap: 8px; }
  .am-chip { position: relative; display: inline-flex; align-items: center; cursor: pointer; }
  .am-chip input { position: absolute; opacity: 0; inset: 0; width: 100%; height: 100%; cursor: pointer; margin: 0; }
  .am-chip span { display: inline-block; padding: 9px 16px; border: 1px solid var(--hp-rule, #D7CFB8); font-family: var(--hp-sans, "Source Sans 3", sans-serif); font-size: 13px; color: var(--hp-ink, #0F2748); background: var(--hp-bone, #F1ECDF); user-select: none; transition: background 160ms ease, color 160ms ease, border-color 160ms ease; }
  .am-chip:hover span { border-color: var(--steel, #4F7FB8); }
  .am-chip input:checked + span { background: var(--hp-ink, #0F2748); color: var(--hp-bone, #F1ECDF); border-color: var(--hp-ink, #0F2748); }
  .am-chip input:focus-visible + span { outline: 2px solid var(--steel, #4F7FB8); outline-offset: 2px; }

  .am-help { font-family: var(--hp-serif, "Cormorant Garamond", serif); font-style: italic; font-size: 13px; color: var(--hp-mute-deep, #5B6E89); margin-top: 4px; }
  .am-help.on-textarea { margin-top: 8px; }

  .am-modal-foot { display: flex; align-items: center; justify-content: space-between; gap: 24px; padding: 22px 48px 32px; border-top: 1px solid var(--hp-rule, #D7CFB8); background: var(--hp-paper, #F6F3EB); }
  .am-modal-foot .note { font-family: var(--hp-serif, "Cormorant Garamond", serif); font-style: italic; font-size: 14px; color: var(--hp-mute-deep, #5B6E89); max-width: 38ch; }
  .am-modal-foot .actions { display: flex; align-items: center; gap: 20px; }
  .am-modal-foot .cancel { font-family: var(--hp-sans, "Source Sans 3", sans-serif); font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; color: var(--hp-ink-deep, #081A33); background: none; border: 0; cursor: pointer; padding: 6px 4px; }
  .am-modal-foot .cancel:hover { color: var(--steel-deep, #3A5F8E); text-decoration: underline; text-underline-offset: 4px; }
  .am-modal-foot .submit {
    font-family: var(--hp-sans, "Source Sans 3", sans-serif); font-size: 13px; letter-spacing: 0.22em; text-transform: uppercase; font-weight: 600;
    color: var(--hp-bone, #F1ECDF); background: var(--hp-ink, #0F2748);
    border: 0; padding: 16px 28px; cursor: pointer;
    display: inline-flex; align-items: center; gap: 12px;
    transition: background 180ms ease;
  }
  .am-modal-foot .submit:hover { background: var(--steel-deep, #3A5F8E); }
  .am-modal-foot .submit .arr::after { content: ''; display: inline-block; width: 12px; height: 1px; background: currentColor; vertical-align: middle; transform: translateX(2px); }

  .am-success { display: none; padding: 56px 48px; }
  .am-modal[data-state="success"] .am-modal-body, .am-modal[data-state="success"] .am-modal-foot { display: none; }
  .am-modal[data-state="success"] .am-success { display: block; }
  .am-success .mark { font-family: var(--hp-serif, "Cormorant Garamond", serif); font-style: italic; font-size: 14px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--steel, #4F7FB8); margin-bottom: 14px; display: inline-flex; align-items: center; gap: 12px; }
  .am-success .mark::before { content: ''; width: 28px; height: 1px; background: var(--steel, #4F7FB8); }
  .am-success h3 { font-family: var(--hp-serif, "Cormorant Garamond", serif); font-weight: 400; font-size: clamp(28px, 3vw, 38px); line-height: 1.05; letter-spacing: -0.015em; color: var(--hp-ink, #0F2748); margin: 0 0 14px; text-wrap: balance; }
  .am-success h3 em { font-style: italic; color: var(--steel, #4F7FB8); }
  .am-success p { font-family: var(--hp-serif, "Cormorant Garamond", serif); font-style: italic; font-size: 17px; line-height: 1.5; color: var(--hp-mute-deep, #5B6E89); margin: 0 0 22px; max-width: 48ch; }
  .am-success .done { font-family: var(--hp-sans, "Source Sans 3", sans-serif); font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase; font-weight: 600; background: var(--hp-ink, #0F2748); color: var(--hp-bone, #F1ECDF); border: 0; padding: 14px 26px; cursor: pointer; }
  .am-success .done:hover { background: var(--steel-deep, #3A5F8E); }

  body.am-modal-open { overflow: hidden; }
  `;

  const style = document.createElement('style');
  style.id = 'am-advisory-styles';
  style.textContent = css;
  document.head.appendChild(style);

  /* ---------- Markup ---------- */
  const html = `
  <div class="am-modal" id="am-advisory-modal" role="dialog" aria-modal="true" aria-labelledby="am-title" aria-hidden="true">
    <div class="am-modal-backdrop" data-am-close></div>
    <div class="am-modal-dialog" role="document">
      <button type="button" class="am-modal-close" data-am-close aria-label="Close inquiry form">
        <svg viewBox="0 0 14 14" width="14" height="14" aria-hidden="true"><path d="M1 1l12 12M13 1L1 13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"></path></svg>
      </button>

      <header class="am-modal-head">
        <span class="am-modal-kicker">Confidential Advisory</span>
        <h2 id="am-title">Start a confidential <em>conversation</em>.</h2>
        <p>Gus will personally review your inquiry. All communications are handled with complete discretion.</p>
      </header>

      <form class="am-modal-body" id="am-form" novalidate>
        <input type="text" name="_honeypot" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px;width:1px;height:1px;opacity:0" aria-hidden="true">

        <section class="am-section">
          <div class="am-section-h"><span class="num">i.</span><span class="lbl">About you</span></div>
          <div class="am-grid">
            <div class="am-field">
              <label for="am-name">Full name <span class="req">*</span></label>
              <input id="am-name" name="name" type="text" autocomplete="name" required>
            </div>
            <div class="am-field">
              <label for="am-email">Email <span class="req">*</span></label>
              <input id="am-email" name="email" type="email" autocomplete="email" required>
            </div>
            <div class="am-field">
              <label for="am-firm">Firm or organization <span class="req">*</span></label>
              <input id="am-firm" name="firm" type="text" autocomplete="organization" required>
            </div>
            <div class="am-field">
              <label for="am-role">Role / title <span class="req">*</span></label>
              <input id="am-role" name="role" type="text" autocomplete="organization-title" placeholder="e.g., Managing Partner, COO, Head of Talent" required>
            </div>
            <div class="am-field span-2">
              <label for="am-phone">Phone <span class="req">(optional)</span></label>
              <input id="am-phone" name="phone" type="tel" autocomplete="tel">
            </div>
          </div>
        </section>

        <section class="am-section">
          <div class="am-section-h"><span class="num">ii.</span><span class="lbl">Nature of inquiry</span></div>
          <div class="am-grid">
            <div class="am-field span-2">
              <label>This inquiry is <span class="req" aria-hidden="true">*</span></label>
              <div class="am-chips" role="radiogroup" aria-label="Inquiry type" aria-required="true">
                <label class="am-chip"><input type="radio" name="inquiry_type" value="On behalf of a firm" required><span>On behalf of a firm</span></label>
                <label class="am-chip"><input type="radio" name="inquiry_type" value="Personal / 1:1 advisory"><span>Personal &mdash; 1:1 advisory</span></label>
                <label class="am-chip"><input type="radio" name="inquiry_type" value="Event or speaking engagement"><span>Event or speaking engagement</span></label>
              </div>
            </div>
            <div class="am-field span-2">
              <label>Which offerings are you interested in? <span class="req">(select all that apply)</span></label>
              <div class="am-chips">
                <label class="am-chip"><input type="checkbox" name="interest" value="Executive Workshops"><span>Executive Workshops</span></label>
                <label class="am-chip"><input type="checkbox" name="interest" value="Confidential 1:1 Advisory"><span>Confidential 1:1 Advisory</span></label>
                <label class="am-chip"><input type="checkbox" name="interest" value="Leadership & HR Advisory"><span>Leadership &amp; HR Advisory</span></label>
                <label class="am-chip"><input type="checkbox" name="interest" value="Fireside Talks / Events"><span>Fireside Talks / Events</span></label>
                <label class="am-chip"><input type="checkbox" name="interest" value="Not sure yet"><span>Not sure yet</span></label>
              </div>
            </div>
          </div>
        </section>

        <section class="am-section">
          <div class="am-section-h"><span class="num">iii.</span><span class="lbl">Context</span></div>
          <div class="am-grid">
            <div class="am-field span-2">
              <label for="am-notes">What would you like to discuss?</label>
              <textarea id="am-notes" name="notes" placeholder="A short summary — what prompted your outreach, what you are hoping to explore, and any context about your team or situation that would help frame the first conversation."></textarea>
              <span class="am-help on-textarea">Keep it high-level. The conversation itself is the right place for specifics.</span>
            </div>
          </div>
        </section>

        <input type="hidden" name="source_page" id="am-source-page" value="">
      </form>

      <footer class="am-modal-foot">
        <span class="note">Your inquiry is handled with complete discretion.</span>
        <div class="actions">
          <button type="button" class="cancel" data-am-close>Cancel</button>
          <button type="submit" form="am-form" class="submit">Send inquiry <span class="arr" aria-hidden="true"></span></button>
        </div>
      </footer>

      <div class="am-success" role="status" aria-live="polite">
        <span class="mark">Inquiry received</span>
        <h3>Thank you &mdash; Gus will be <em>in touch</em>.</h3>
        <p>Your inquiry has been received and will be reviewed personally. Expect a reply within one to two business days.</p>
        <button type="button" class="done" data-am-close>Close</button>
      </div>
    </div>
  </div>
  `;

  function injectModal() {
    if (document.getElementById('am-advisory-modal')) return;
    const wrap = document.createElement('div');
    wrap.innerHTML = html;
    document.body.appendChild(wrap.firstElementChild);
    bindModal();
  }

  /* ---------- Behavior ---------- */
  let lastFocus = null;
  let openSourcePath = '';
  let submittedSinceOpen = false;

  function track(name, params) {
    if (typeof window.dimoTrack === 'function') return window.dimoTrack(name, params || {});
    if (typeof window.gtag === 'function') {
      try { window.gtag('event', name, params || {}); } catch (e) {}
    }
  }

  function open(e) {
    if (e) e.preventDefault();
    const modal = document.getElementById('am-advisory-modal');
    if (!modal) return;
    const src = document.getElementById('am-source-page');
    openSourcePath = location.pathname + location.hash;
    if (src) src.value = openSourcePath;
    submittedSinceOpen = false;
    lastFocus = document.activeElement;
    modal.setAttribute('data-open', 'true');
    modal.setAttribute('aria-hidden', 'false');
    modal.removeAttribute('data-state');
    document.body.classList.add('am-modal-open');
    track('advisory_modal_open', {
      source_page: openSourcePath,
      trigger_text: (e && e.currentTarget && (e.currentTarget.textContent || '').trim().slice(0, 60)) || ''
    });
    setTimeout(() => {
      const first = modal.querySelector('input:not([type=hidden]):not([name=_honeypot]), select, textarea, button');
      if (first) first.focus();
    }, 80);
  }

  function close() {
    const modal = document.getElementById('am-advisory-modal');
    if (!modal) return;
    const wasOpen = modal.getAttribute('data-open') === 'true';
    modal.removeAttribute('data-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('am-modal-open');
    if (wasOpen && !submittedSinceOpen) {
      track('advisory_modal_close_abandoned', { source_page: openSourcePath });
    }
    if (lastFocus && typeof lastFocus.focus === 'function') {
      try { lastFocus.focus(); } catch (e) {}
    }
  }

  function bindModal() {
    const modal = document.getElementById('am-advisory-modal');
    if (!modal || modal.dataset.bound) return;
    modal.dataset.bound = '1';

    modal.querySelectorAll('[data-am-close]').forEach(el => {
      el.addEventListener('click', e => { e.preventDefault(); close(); });
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modal.getAttribute('data-open') === 'true') close();
    });

    const form = document.getElementById('am-form');
    if (!form) return;

    form.addEventListener('submit', e => {
      e.preventDefault();
      let ok = true;
      let firstInvalid = null;
      const markInvalid = (el) => { ok = false; if (el && !firstInvalid) firstInvalid = el; if (el) el.style.borderColor = '#b35a3c'; };

      ['am-name', 'am-email', 'am-firm', 'am-role'].forEach(id => {
        const f = document.getElementById(id);
        if (!f || !f.value.trim()) markInvalid(f);
        else if (f) f.style.borderColor = '';
      });

      const inquirySel = form.querySelector('input[name="inquiry_type"]:checked');
      const inquiryRow = form.querySelector('.am-chips[aria-label="Inquiry type"]');
      if (!inquirySel) {
        if (inquiryRow) inquiryRow.style.outline = '1px solid #b35a3c';
        markInvalid(inquiryRow);
      } else if (inquiryRow) {
        inquiryRow.style.outline = '';
      }

      if (!ok) {
        if (firstInvalid && firstInvalid.focus) firstInvalid.focus();
        track('advisory_form_submit_invalid', {
          source_page: openSourcePath,
          first_invalid_field: (firstInvalid && (firstInvalid.id || firstInvalid.name || firstInvalid.className)) || 'unknown'
        });
        return;
      }

      const fd = new FormData(form);
      const interests = fd.getAll('interest');
      track('advisory_form_submit', {
        source_page: openSourcePath,
        inquiry_type: fd.get('inquiry_type') || '',
        interest_count: interests.length,
        interests: interests.join(',').slice(0, 200)
      });

      const submitBtn = document.querySelector('button[form="am-form"]');
      if (submitBtn) submitBtn.disabled = true;

      fetch('https://autumn-dimo.phil-fe5.workers.dev/advisory', {
        method: 'POST',
        body: fd,
      })
        .then(r => r.json().catch(() => ({ error: 'Network error' })))
        .then(data => {
          if (data && data.ok) {
            submittedSinceOpen = true;
            const modal = document.getElementById('am-advisory-modal');
            if (modal) modal.setAttribute('data-state', 'success');
          } else {
            throw new Error((data && data.error) || 'Send failed');
          }
        })
        .catch(err => {
          if (submitBtn) submitBtn.disabled = false;
          track('advisory_form_submit_error', { error: String(err.message || err).slice(0, 200) });
          alert('Something went wrong sending your inquiry. Please email gd@dimolaw.com directly.');
          console.error('Advisory form submit failed', err);
        });
    });
  }

  /* ---------- Trigger binding ---------- */
  function bindTriggers(root) {
    const scope = root || document;
    const candidates = scope.querySelectorAll('[data-am-trigger]');
    candidates.forEach(el => {
      if (el.dataset.amBound === '1') return;
      el.dataset.amBound = '1';
      el.addEventListener('click', open);
    });
  }

  function init() {
    injectModal();
    bindTriggers();
    const obs = new MutationObserver(muts => {
      for (const m of muts) {
        m.addedNodes.forEach(n => {
          if (n.nodeType === 1) bindTriggers(n);
        });
      }
    });
    obs.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.openAdvisoryModal = open;
  window.closeAdvisoryModal = close;
})();
