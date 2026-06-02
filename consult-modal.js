/* ============================================================
   Dimopoulos Law — Consultation Lightbox
   ------------------------------------------------------------
   A single, self-contained module. Add to any page with:
       <script src="<relative-path-to>/consult-modal.js" defer></script>

   On load it:
     1. injects its own CSS into <head>
     2. injects the modal markup into <body>
     3. hooks every "Schedule a consultation" / "Consultation" /
        href="#contact" trigger on the page (including React-
        rendered ones, via a MutationObserver)

   Skips the "Book Gus" speaker buttons on /about/speaking.html
   automatically because those use href="#book" / mailto:speaking.
   ============================================================ */
(function () {
  if (window.__dimoConsultModalLoaded) return;
  window.__dimoConsultModalLoaded = true;

  /* ---------- CSS ---------- */
  const css = `
  .cm-modal { position: fixed; inset: 0; z-index: 1000; display: none; align-items: flex-start; justify-content: center; padding: 56px 24px 48px; overflow-y: auto; }
  .cm-modal[data-open="true"] { display: flex; }
  .cm-modal-backdrop { position: fixed; inset: 0; background: rgba(8, 26, 51, 0.62); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); opacity: 0; transition: opacity 240ms ease; }
  .cm-modal[data-open="true"] .cm-modal-backdrop { opacity: 1; }

  .cm-modal-dialog {
    position: relative; width: 100%; max-width: 820px;
    background: var(--hp-bone, #F1ECDF);
    border: 1px solid var(--hp-rule, #D7CFB8);
    box-shadow: 0 40px 80px -20px rgba(8, 26, 51, 0.45);
    transform: translateY(12px); opacity: 0;
    transition: transform 320ms cubic-bezier(.2,.7,.2,1), opacity 240ms ease;
  }
  .cm-modal[data-open="true"] .cm-modal-dialog { transform: translateY(0); opacity: 1; }

  .cm-modal-close {
    position: absolute; top: 18px; right: 18px; width: 40px; height: 40px;
    display: flex; align-items: center; justify-content: center;
    border: 1px solid var(--hp-rule, #D7CFB8); background: var(--hp-bone, #F1ECDF); color: var(--hp-ink, #0F2748);
    cursor: pointer; padding: 0;
    transition: background 180ms ease, color 180ms ease, border-color 180ms ease;
  }
  .cm-modal-close:hover { background: var(--hp-ink, #0F2748); color: var(--hp-bone, #F1ECDF); border-color: var(--hp-ink, #0F2748); }

  .cm-modal-head { background: var(--hp-ink, #0F2748); color: var(--hp-bone, #F1ECDF); padding: 56px 48px 40px; position: relative; }
  .cm-modal-head::before { content: ''; position: absolute; left: 0; right: 0; top: 0; height: 2px; background: var(--steel, #4F7FB8); }
  .cm-modal-kicker { font-family: var(--hp-sans, "Source Sans 3", sans-serif); font-size: 11px; letter-spacing: 0.24em; text-transform: uppercase; font-weight: 600; color: var(--steel-soft, #A9C5E6); display: inline-flex; align-items: center; gap: 14px; }
  .cm-modal-kicker::before { content: ''; width: 28px; height: 1px; background: var(--steel-soft, #A9C5E6); }
  .cm-modal-head h2 { font-family: var(--hp-serif, "Cormorant Garamond", serif); font-weight: 400; font-size: clamp(36px, 4vw, 52px); line-height: 1; letter-spacing: -0.02em; margin: 14px 0 10px; color: var(--hp-bone, #F1ECDF); }
  .cm-modal-head h2 em { font-style: italic; color: var(--steel-soft, #A9C5E6); }
  .cm-modal-head p { font-family: var(--hp-serif, "Cormorant Garamond", serif); font-style: italic; font-size: 18px; line-height: 1.45; color: rgba(232, 228, 220, 0.86); margin: 0; max-width: 52ch; }

  .cm-modal-body { padding: 36px 48px 8px; }
  .cm-section { padding: 22px 0 26px; border-bottom: 1px solid var(--hp-rule, #D7CFB8); }
  .cm-section:last-of-type { border-bottom: 0; }
  .cm-section-h { display: flex; align-items: baseline; gap: 14px; margin-bottom: 18px; }
  .cm-section-h .num { font-family: var(--hp-serif, "Cormorant Garamond", serif); font-style: italic; font-size: 16px; color: var(--steel, #4F7FB8); }
  .cm-section-h .lbl { font-family: var(--hp-sans, "Source Sans 3", sans-serif); font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; font-weight: 600; color: var(--hp-ink-deep, #081A33); }

  .cm-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px 20px; }
  .cm-grid .span-2 { grid-column: 1 / -1; }
  @media (max-width: 640px) {
    .cm-grid { grid-template-columns: 1fr; }
    .cm-modal-head { padding: 44px 24px 30px; }
    .cm-modal-body { padding: 24px 24px 8px; }
    .cm-modal-foot { padding: 20px 24px 28px !important; }
  }

  .cm-field { display: flex; flex-direction: column; gap: 6px; }
  .cm-field label { font-family: var(--hp-sans, "Source Sans 3", sans-serif); font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; color: var(--hp-ink-deep, #081A33); }
  .cm-field label .req { color: var(--steel, #4F7FB8); margin-left: 4px; font-style: italic; letter-spacing: 0; text-transform: none; }
  .cm-field input, .cm-field select, .cm-field textarea {
    font-family: var(--hp-sans, "Source Sans 3", sans-serif); font-size: 15px; line-height: 1.4;
    color: var(--hp-ink, #0F2748); background: var(--hp-bone, #F1ECDF);
    border: 1px solid var(--hp-rule, #D7CFB8); border-bottom: 1px solid var(--hp-ink, #0F2748);
    border-radius: 0; padding: 12px 14px; outline: none; width: 100%; box-sizing: border-box;
    transition: border-color 160ms ease, background 160ms ease;
  }
  .cm-field textarea { resize: vertical; min-height: 110px; font-family: var(--hp-serif, "Cormorant Garamond", serif); font-size: 16px; line-height: 1.55; }
  .cm-field input:focus, .cm-field select:focus, .cm-field textarea:focus { border-color: var(--steel, #4F7FB8); background: var(--hp-paper, #F6F3EB); }
  .cm-field select { appearance: none; -webkit-appearance: none; background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 6' width='10' height='6'><path d='M1 1l4 4 4-4' fill='none' stroke='%230F2748' stroke-width='1.4' stroke-linecap='round' stroke-linejoin='round'/></svg>"); background-repeat: no-repeat; background-position: right 14px center; padding-right: 38px; }

  .cm-chips { display: flex; flex-wrap: wrap; gap: 8px; }
  .cm-chip { position: relative; display: inline-flex; align-items: center; cursor: pointer; }
  .cm-chip input { position: absolute; opacity: 0; inset: 0; width: 100%; height: 100%; cursor: pointer; margin: 0; }
  .cm-chip span { display: inline-block; padding: 8px 14px; border: 1px solid var(--hp-rule, #D7CFB8); font-family: var(--hp-sans, "Source Sans 3", sans-serif); font-size: 13px; color: var(--hp-ink, #0F2748); background: var(--hp-bone, #F1ECDF); user-select: none; transition: background 160ms ease, color 160ms ease, border-color 160ms ease; }
  .cm-chip:hover span { border-color: var(--steel, #4F7FB8); }
  .cm-chip input:checked + span { background: var(--hp-ink, #0F2748); color: var(--hp-bone, #F1ECDF); border-color: var(--hp-ink, #0F2748); }
  .cm-chip input:focus-visible + span { outline: 2px solid var(--steel, #4F7FB8); outline-offset: 2px; }

  .cm-radio-row { display: flex; flex-wrap: wrap; gap: 8px; }
  .cm-radio-row .cm-chip span { padding: 9px 16px; }

  .cm-help { font-family: var(--hp-serif, "Cormorant Garamond", serif); font-style: italic; font-size: 13px; color: var(--hp-mute-deep, #5B6E89); margin-top: 4px; }
  .cm-help.on-textarea { margin-top: 8px; }

  /* Conditional "Names and ages of children" input — shown when Children = Yes. */
  .cm-children-names-wrap { margin-top: 12px; display: flex; flex-direction: column; gap: 6px; }
  .cm-children-names-wrap[hidden] { display: none; }

  .cm-modal-foot { display: flex; align-items: center; justify-content: space-between; gap: 24px; padding: 22px 48px 32px; border-top: 1px solid var(--hp-rule, #D7CFB8); background: var(--hp-paper, #F6F3EB); }
  .cm-modal-foot .note { font-family: var(--hp-serif, "Cormorant Garamond", serif); font-style: italic; font-size: 14px; color: var(--hp-mute-deep, #5B6E89); max-width: 42ch; }
  .cm-modal-foot .actions { display: flex; align-items: center; gap: 20px; }
  .cm-modal-foot .cancel { font-family: var(--hp-sans, "Source Sans 3", sans-serif); font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; color: var(--hp-ink-deep, #081A33); background: none; border: 0; cursor: pointer; padding: 6px 4px; }
  .cm-modal-foot .cancel:hover { color: var(--steel-deep, #3A5F8E); text-decoration: underline; text-underline-offset: 4px; }
  .cm-modal-foot .submit {
    font-family: var(--hp-sans, "Source Sans 3", sans-serif); font-size: 13px; letter-spacing: 0.22em; text-transform: uppercase; font-weight: 600;
    color: var(--hp-bone, #F1ECDF); background: var(--hp-ink, #0F2748);
    border: 0; padding: 16px 28px; cursor: pointer;
    display: inline-flex; align-items: center; gap: 12px;
    transition: background 180ms ease;
  }
  .cm-modal-foot .submit:hover { background: var(--steel-deep, #3A5F8E); }
  .cm-modal-foot .submit .arr::after { content: ''; display: inline-block; width: 12px; height: 1px; background: currentColor; vertical-align: middle; transform: translateX(2px); }

  .cm-success { display: none; padding: 56px 48px; }
  .cm-modal[data-state="success"] .cm-modal-body, .cm-modal[data-state="success"] .cm-modal-foot { display: none; }
  .cm-modal[data-state="success"] .cm-success { display: block; }
  .cm-success .mark { font-family: var(--hp-serif, "Cormorant Garamond", serif); font-style: italic; font-size: 14px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--steel, #4F7FB8); margin-bottom: 14px; display: inline-flex; align-items: center; gap: 12px; }
  .cm-success .mark::before { content: ''; width: 28px; height: 1px; background: var(--steel, #4F7FB8); }
  .cm-success h3 { font-family: var(--hp-serif, "Cormorant Garamond", serif); font-weight: 400; font-size: clamp(28px, 3vw, 40px); line-height: 1.05; letter-spacing: -0.015em; color: var(--hp-ink, #0F2748); margin: 0 0 14px; text-wrap: balance; }
  .cm-success h3 em { font-style: italic; color: var(--steel, #4F7FB8); }
  .cm-success p { font-family: var(--hp-serif, "Cormorant Garamond", serif); font-style: italic; font-size: 18px; line-height: 1.5; color: var(--hp-mute-deep, #5B6E89); margin: 0 0 22px; max-width: 48ch; }
  .cm-success .done { font-family: var(--hp-sans, "Source Sans 3", sans-serif); font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase; font-weight: 600; background: var(--hp-ink, #0F2748); color: var(--hp-bone, #F1ECDF); border: 0; padding: 14px 26px; cursor: pointer; }
  .cm-success .done:hover { background: var(--steel-deep, #3A5F8E); }

  body.cm-modal-open { overflow: hidden; }
  `;

  const style = document.createElement('style');
  style.id = 'cm-consult-styles';
  style.textContent = css;
  document.head.appendChild(style);

  /* ---------- Markup ---------- */
  const html = `
  <div class="cm-modal" id="cm-consult-modal" role="dialog" aria-modal="true" aria-labelledby="cm-title" aria-hidden="true">
    <div class="cm-modal-backdrop" data-cm-close></div>
    <div class="cm-modal-dialog" role="document">
      <button type="button" class="cm-modal-close" data-cm-close aria-label="Close consultation form">
        <svg viewBox="0 0 14 14" width="14" height="14" aria-hidden="true"><path d="M1 1l12 12M13 1L1 13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"></path></svg>
      </button>

      <header class="cm-modal-head">
        <span class="cm-modal-kicker">Confidential Consultation</span>
        <h2 id="cm-title">Tell us what you&rsquo;re <em>facing</em>.</h2>
        <p>A member of the firm will respond within one business day to schedule a paid, confidential initial consultation.</p>
      </header>

      <form class="cm-modal-body" id="cm-form" novalidate>
        <!-- 1. About you -->
        <section class="cm-section">
          <div class="cm-section-h"><span class="num">i.</span><span class="lbl">About you</span></div>
          <div class="cm-grid">
            <div class="cm-field">
              <label for="cm-name">Full name <span class="req">*</span></label>
              <input id="cm-name" name="name" type="text" autocomplete="name" required>
            </div>
            <div class="cm-field">
              <label for="cm-email">Email <span class="req">*</span></label>
              <input id="cm-email" name="email" type="email" autocomplete="email" required>
            </div>
            <div class="cm-field">
              <label for="cm-phone">Phone <span class="req">*</span></label>
              <input id="cm-phone" name="phone" type="tel" autocomplete="tel" required>
            </div>
            <div class="cm-field">
              <label for="cm-contact-pref">Best way to reach you</label>
              <select id="cm-contact-pref" name="contact_preference">
                <option value="">Select&hellip;</option>
                <option>Phone call</option>
                <option>Text message</option>
                <option>Email</option>
                <option>Any of the above</option>
              </select>
            </div>
            <div class="cm-field span-2">
              <label>Voicemail &amp; discretion</label>
              <div class="cm-radio-row" role="radiogroup" aria-label="Voicemail preference">
                <label class="cm-chip"><input type="radio" name="voicemail" value="OK to leave voicemail"><span>OK to leave voicemail</span></label>
                <label class="cm-chip"><input type="radio" name="voicemail" value="Discreet — no voicemail / unmarked caller"><span>Discreet &mdash; no voicemail</span></label>
                <label class="cm-chip"><input type="radio" name="voicemail" value="No preference"><span>No preference</span></label>
              </div>
              <span class="cm-help">Many of our clients prefer we don&rsquo;t identify the firm in messages. We&rsquo;ll follow your lead.</span>
            </div>
          </div>
        </section>

        <!-- 2. Your matter -->
        <section class="cm-section">
          <div class="cm-section-h"><span class="num">ii.</span><span class="lbl">Your matter</span></div>
          <div class="cm-grid">
            <div class="cm-field span-2">
              <label>What does your matter involve? <span class="req">(select all that apply)</span></label>
              <div class="cm-chips">
                <label class="cm-chip"><input type="checkbox" name="matter" value="Divorce"><span>Divorce</span></label>
                <label class="cm-chip"><input type="checkbox" name="matter" value="High-net-worth divorce"><span>High-net-worth divorce</span></label>
                <label class="cm-chip"><input type="checkbox" name="matter" value="Equitable distribution"><span>Equitable distribution</span></label>
                <label class="cm-chip"><input type="checkbox" name="matter" value="Child custody"><span>Child custody</span></label>
                <label class="cm-chip"><input type="checkbox" name="matter" value="Parental relocation"><span>Parental relocation</span></label>
                <label class="cm-chip"><input type="checkbox" name="matter" value="International custody"><span>International custody</span></label>
                <label class="cm-chip"><input type="checkbox" name="matter" value="Child support"><span>Child support</span></label>
                <label class="cm-chip"><input type="checkbox" name="matter" value="Spousal maintenance"><span>Spousal maintenance</span></label>
                <label class="cm-chip"><input type="checkbox" name="matter" value="Prenup / Postnup / Separation"><span>Prenup / Postnup</span></label>
                <label class="cm-chip"><input type="checkbox" name="matter" value="Domestic violence / order of protection"><span>Domestic violence / OP</span></label>
                <label class="cm-chip"><input type="checkbox" name="matter" value="Enforcement / modification"><span>Enforcement / modification</span></label>
                <label class="cm-chip"><input type="checkbox" name="matter" value="Matrimonial appeals"><span>Matrimonial appeals</span></label>
                <label class="cm-chip"><input type="checkbox" name="matter" value="Crisis management"><span>Crisis management</span></label>
                <label class="cm-chip"><input type="checkbox" name="matter" value="Other / not sure"><span>Other / not sure</span></label>
              </div>
            </div>
            <div class="cm-field">
              <label for="cm-stage">Where is the matter now?</label>
              <select id="cm-stage" name="stage">
                <option value="">Select&hellip;</option>
                <option>Considering / preparing to file</option>
                <option>Recently filed</option>
                <option>Active case in litigation</option>
                <option>Settlement / negotiation</option>
                <option>Post-judgment / modification</option>
                <option>Just looking for information</option>
              </select>
            </div>
            <div class="cm-field">
              <label for="cm-opposing">Is the other party represented?</label>
              <select id="cm-opposing" name="opposing_represented">
                <option value="">Select&hellip;</option>
                <option>Yes &mdash; they have an attorney</option>
                <option>Not yet, but expected</option>
                <option>No</option>
                <option>Not sure</option>
              </select>
            </div>
            <div class="cm-field">
              <label>Children involved? <span class="req" aria-hidden="true">*</span></label>
              <div class="cm-radio-row" role="radiogroup" aria-label="Children involved" aria-required="true">
                <label class="cm-chip"><input type="radio" name="children" value="Yes" required><span>Yes</span></label>
                <label class="cm-chip"><input type="radio" name="children" value="No"><span>No</span></label>
                <label class="cm-chip"><input type="radio" name="children" value="Expecting"><span>Expecting</span></label>
              </div>
              <div class="cm-children-names-wrap" id="cm-children-names-wrap" hidden>
                <label for="cm-children-names">Names and ages of children <span class="req" aria-hidden="true">*</span></label>
                <input id="cm-children-names" name="children_names" type="text" placeholder="E.g., Sarah (6), James (4)">
              </div>
            </div>
            <div class="cm-field">
              <label for="cm-county">County where the matter is venued</label>
              <select id="cm-county" name="county">
                <option value="">Select&hellip;</option>
                <option>Westchester</option>
                <option>New York (Manhattan)</option>
                <option>Bronx</option>
                <option>Queens</option>
                <option>Brooklyn (Kings)</option>
                <option>Putnam</option>
                <option>Dutchess</option>
                <option>Rockland</option>
                <option>Orange</option>
                <option>Other / not yet filed</option>
              </select>
            </div>
          </div>
        </section>

        <!-- 3. Timing & format -->
        <section class="cm-section">
          <div class="cm-section-h"><span class="num">iii.</span><span class="lbl">Timing &amp; format</span></div>
          <div class="cm-grid">
            <div class="cm-field">
              <label for="cm-urgency">Urgency</label>
              <select id="cm-urgency" name="urgency">
                <option value="">Select&hellip;</option>
                <option>Urgent &mdash; this week</option>
                <option>Within 30 days</option>
                <option>1 &ndash; 3 months</option>
                <option>Just exploring</option>
              </select>
            </div>
            <div class="cm-field">
              <label for="cm-format">Preferred consultation format</label>
              <select id="cm-format" name="format">
                <option value="">Select&hellip;</option>
                <option>In person &mdash; Tuckahoe office</option>
                <option>Video call</option>
                <option>Phone call</option>
                <option>No preference</option>
              </select>
            </div>
            <div class="cm-field span-2">
              <label for="cm-referral">How did you hear about us?</label>
              <select id="cm-referral" name="referral">
                <option value="">Select&hellip;</option>
                <option>Attorney referral</option>
                <option>Friend or family</option>
                <option>Mental-health professional / therapist</option>
                <option>Financial advisor / accountant</option>
                <option>Search engine</option>
                <option>Split podcast</option>
                <option>News / media coverage</option>
                <option>Social media</option>
                <option>Returning client</option>
                <option>Other</option>
              </select>
            </div>
          </div>
        </section>

        <!-- 4. Brief description -->
        <section class="cm-section">
          <div class="cm-section-h"><span class="num">iv.</span><span class="lbl">A few details</span></div>
          <div class="cm-grid">
            <div class="cm-field span-2">
              <label for="cm-notes">Briefly, what&rsquo;s going on?</label>
              <textarea id="cm-notes" name="notes" placeholder="In a few sentences — what is happening, what has already been filed (if anything), and what outcome you are hoping for. Keep it high-level; we will go deeper at the consultation."></textarea>
              <span class="cm-help on-textarea">This form is reviewed by our intake team only. Please do not include privileged or sensitive information; the consultation itself is the right place for that.</span>
            </div>
            <div class="cm-field span-2">
              <label for="cm-conflict">Names of other parties (for conflict check) <span class="req" aria-hidden="true">*</span></label>
              <input id="cm-conflict" name="conflict_names" type="text" placeholder="Your spouse, ex-spouse, or opposing party — first and last name" required>
              <span class="cm-help">We run a quick conflict check before scheduling.</span>
            </div>
          </div>
        </section>

        <input type="hidden" name="source_page" id="cm-source-page" value="">
      </form>

      <footer class="cm-modal-foot">
        <span class="note">Your inquiry is confidential. Submitting this form does not create an attorney&ndash;client relationship.</span>
        <div class="actions">
          <button type="button" class="cancel" data-cm-close>Cancel</button>
          <button type="submit" form="cm-form" class="submit">Send inquiry <span class="arr" aria-hidden="true"></span></button>
        </div>
      </footer>

      <div class="cm-success" role="status" aria-live="polite">
        <span class="mark">Inquiry received</span>
        <h3>Thank you &mdash; we&rsquo;ll be <em>in touch</em>.</h3>
        <p>A member of our team will reach out within one business day to schedule your consultation. For urgent matters, please call <a href="tel:9144724242">914.472.4242</a>.</p>
        <button type="button" class="done" data-cm-close>Close</button>
      </div>
    </div>
  </div>
  `;

  function injectModal() {
    if (document.getElementById('cm-consult-modal')) return;
    const wrap = document.createElement('div');
    wrap.innerHTML = html;
    document.body.appendChild(wrap.firstElementChild);
    bindModal();
  }

  /* ---------- Behavior ---------- */
  let lastFocus = null;
  let openSourcePath = '';     // remembered between open() and close()
  let submittedSinceOpen = false;

  function track(name, params) {
    if (typeof window.dimoTrack === 'function') return window.dimoTrack(name, params || {});
    if (typeof window.gtag === 'function') {
      try { window.gtag('event', name, params || {}); } catch (e) {}
    }
  }

  function open(e) {
    if (e) e.preventDefault();
    const modal = document.getElementById('cm-consult-modal');
    if (!modal) return;
    const src = document.getElementById('cm-source-page');
    openSourcePath = location.pathname + location.hash;
    if (src) src.value = openSourcePath;
    submittedSinceOpen = false;
    lastFocus = document.activeElement;
    modal.setAttribute('data-open', 'true');
    modal.setAttribute('aria-hidden', 'false');
    modal.removeAttribute('data-state');
    document.body.classList.add('cm-modal-open');
    track('consult_modal_open', {
      source_page: openSourcePath,
      trigger_text: (e && e.currentTarget && (e.currentTarget.textContent || '').trim().slice(0, 60)) || ''
    });
    setTimeout(() => {
      const first = modal.querySelector('input, select, textarea, button');
      if (first) first.focus();
    }, 80);
  }
  function close() {
    const modal = document.getElementById('cm-consult-modal');
    if (!modal) return;
    const wasOpen = modal.getAttribute('data-open') === 'true';
    modal.removeAttribute('data-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('cm-modal-open');
    if (wasOpen && !submittedSinceOpen) {
      track('consult_modal_close_abandoned', {
        source_page: openSourcePath
      });
    }
    if (lastFocus && typeof lastFocus.focus === 'function') {
      try { lastFocus.focus(); } catch (e) {}
    }
  }

  function bindModal() {
    const modal = document.getElementById('cm-consult-modal');
    if (!modal || modal.dataset.bound) return;
    modal.dataset.bound = '1';

    modal.querySelectorAll('[data-cm-close]').forEach(el => {
      el.addEventListener('click', e => { e.preventDefault(); close(); });
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modal.getAttribute('data-open') === 'true') close();
    });

    const form = document.getElementById('cm-form');
    if (form) {
      // Show/hide "Names and ages of children" field based on Children radio.
      const childrenRadios = form.querySelectorAll('input[name="children"]');
      const childrenNamesWrap = document.getElementById('cm-children-names-wrap');
      const childrenNamesInput = document.getElementById('cm-children-names');
      const toggleChildrenNames = () => {
        const sel = form.querySelector('input[name="children"]:checked');
        const show = sel && sel.value === 'Yes';
        if (childrenNamesWrap) childrenNamesWrap.hidden = !show;
        if (childrenNamesInput) {
          if (show) {
            childrenNamesInput.setAttribute('required', '');
          } else {
            childrenNamesInput.removeAttribute('required');
            childrenNamesInput.value = '';
            childrenNamesInput.style.borderColor = '';
          }
        }
      };
      childrenRadios.forEach(r => r.addEventListener('change', toggleChildrenNames));

      form.addEventListener('submit', e => {
        e.preventDefault();
        let ok = true;
        let firstInvalid = null;
        const markInvalid = (el) => { ok = false; if (el && !firstInvalid) firstInvalid = el; if (el) el.style.borderColor = '#b35a3c'; };

        // Required text inputs
        ['cm-name', 'cm-email', 'cm-phone', 'cm-conflict'].forEach(id => {
          const f = document.getElementById(id);
          if (!f || !f.value.trim()) markInvalid(f);
        });

        // Required radio group: Children involved
        const childrenSel = form.querySelector('input[name="children"]:checked');
        if (!childrenSel) {
          const row = form.querySelector('.cm-radio-row[aria-label="Children involved"]');
          if (row) row.style.outline = '1px solid #b35a3c';
          markInvalid(row);
        } else {
          const row = form.querySelector('.cm-radio-row[aria-label="Children involved"]');
          if (row) row.style.outline = '';
          // If Yes, names of children is required
          if (childrenSel.value === 'Yes') {
            if (!childrenNamesInput || !childrenNamesInput.value.trim()) markInvalid(childrenNamesInput);
          }
        }

        if (!ok) {
          if (firstInvalid && firstInvalid.focus) firstInvalid.focus();
          track('consult_form_submit_invalid', {
            source_page: openSourcePath,
            first_invalid_field: (firstInvalid && (firstInvalid.id || firstInvalid.name || firstInvalid.className)) || 'unknown'
          });
          return;
        }

        // Snapshot useful fields for the submit event (no PII — just selections).
        const fd = new FormData(form);
        const matters = fd.getAll('matter');
        track('consult_form_submit', {
          source_page: openSourcePath,
          children_involved: (fd.get('children') || ''),
          urgency: (fd.get('urgency') || ''),
          format: (fd.get('format') || ''),
          referral: (fd.get('referral') || ''),
          county: (fd.get('county') || ''),
          voicemail: (fd.get('voicemail') || ''),
          matter_count: matters.length,
          matters: matters.join(',').slice(0, 200)
        });
        submittedSinceOpen = true;
        modal.setAttribute('data-state', 'success');
      });
    }
  }

  /* ---------- Trigger discovery ---------- */
  function isConsultTrigger(el) {
    if (!el || el.dataset.cmBound === '1') return false;
    if (el.dataset.cmIgnore === '1') return false;
    // Anything explicitly opted in
    if (el.hasAttribute('data-cm-trigger')) return true;
    const href = el.getAttribute && el.getAttribute('href');
    // Skip speaker-page Book Gus triggers
    if (href && (href === '#book' || href.indexOf('mailto:speaking') === 0)) return false;
    // Anchor to contact section
    if (href && /(^|\/)#contact$/.test(href)) return true;
    // Text-based detection on common CTA classes
    const text = (el.textContent || '').trim().toLowerCase();
    if (!text) return false;
    if (el.matches && (
      el.matches('a.hp-nav-cta, button.hp-nav-cta, a.bio-nav-cta, button.bio-nav-cta')
    ) && text === 'consultation') return true;
    if (el.matches && (
      el.matches('a.hp-cta-primary, button.hp-cta-primary, a.cta-primary, button.cta-primary, a.bio-cta, button.bio-cta, a.cta, button.cta')
    ) && /schedule a consultation/.test(text)) return true;
    // Bare href="#" CTAs labeled "Schedule a consultation"
    if (el.tagName === 'A' && (href === '#' || href === '') && /schedule a consultation/.test(text)) return true;
    return false;
  }

  function bindTriggers(root) {
    const scope = root || document;
    const candidates = scope.querySelectorAll(
      'a, button, [data-cm-trigger]'
    );
    candidates.forEach(el => {
      if (isConsultTrigger(el)) {
        el.dataset.cmBound = '1';
        el.addEventListener('click', open);
      }
    });
  }

  function init() {
    injectModal();
    bindTriggers();
    // Catch React-rendered nav buttons / async content
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

  // Public API in case any page wants to open programmatically
  window.openConsultModal = open;
  window.closeConsultModal = close;
})();
