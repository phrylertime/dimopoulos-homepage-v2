# Slack alerts for form send failures — design + implementation record

**Date:** 2026-07-16
**Status:** SHIPPED — deployed and verified end-to-end same day
**Where the code lives:** Cloudflare dashboard → Workers & Pages → `autumn-dimo` → Edit code
(the Worker is NOT in this repo — this doc is the source of truth for the change)

## What shipped

When the Worker's Postmark send fails (any of `/consult`, `/speaking`, `/podcast`)
— or the Worker itself throws — it posts an alert to the **private** Slack channel
`#dimolaw-form-failure` containing:

- which form failed and when
- the exact Postmark error (status + response body)
- the client's submitted fields (each truncated to 500 chars), so the inquiry
  can be answered manually

Decisions made during design (2026-07-16):

- **Channel:** Slack incoming webhook — independent of Postmark, so the alert
  survives a Postmark outage.
- **Content:** full submission details in the alert (Phil's explicit call,
  overriding the security memo's caution). Mitigation: the channel is private,
  members limited to intake-trusted people.
- **Never post to `#dimolaw-form-failures`** (public, plural "s") — a stray
  near-duplicate channel with other workspace members auto-joined. Phil's
  explicit instruction. Recommended for archival.
- **Safety rule:** the alert must never break the form response. `notifySlack()`
  is wrapped in its own try/catch and no-ops if the `SLACK_WEBHOOK_URL` secret
  is unset; if Slack is down, the visitor still gets the normal error path.

## The bug this work uncovered (root cause of the 2026-07-16 consult outage)

The consultation form had been failing since the post-Postmark-approval Cc
edit in June. The design phase initially assumed Postmark was rejecting sends;
reading the Worker code showed the truth: consult's `cc:` line had been deleted
rather than restored, so `config.cc.join(', ')` threw a TypeError on undefined
inside the try/catch → generic 502 "Send failed". **The request never reached
Postmark.** Speaking/podcast kept working because their `cc` arrays existed.

Fixes deployed with this feature:

- `Cc: (config.cc || []).join(', ')` — tolerates a missing cc list (the real fix)
- consult's `cc: ['phil@phryl.com']` restored per the original plan
  (TEMP — remove after testing, along with phil@ on speaking/podcast)

## Deploy incidents worth remembering

Both stem from the Worker being dashboard-edited with no version control:

1. **Truncated paste:** the first paste from chat silently dropped the bottom
   half of the file. It was still syntactically valid JS, so Cloudflare
   deployed it — and every POST 400'd because `parseFormData` no longer
   existed. Check the last line and total line count after any paste.
2. **Gradual-deployment split:** old and new versions briefly served traffic
   simultaneously (responses flapped 200/400). Fix: Deployments tab → promote
   the newest version to 100%.

**Safe verification trick:** POST with `_honeypot=x` returns `{ok:true}` from
the current code *without sending email* — old truncated code 400s. Lets you
burst-test a deploy without flooding inboxes.

## Setup performed (2026-07-16)

1. Slack app "DimoLaw Form Alerts" (api.slack.com/apps) → Incoming Webhooks →
   webhook bound to `#dimolaw-form-failure`.
2. Webhook URL stored as encrypted Cloudflare secret `SLACK_WEBHOOK_URL` on
   `autumn-dimo` (never pasted into chat/docs/code — it's a credential).
3. `notifySlack()` added to the Worker; called from both failure paths
   (Postmark non-2xx and the surrounding catch).

Cloudflare + Postmark accounts are both under `phil@galvanizeworldwide.com`.

## Verification results (2026-07-16)

- All 3 routes return `{ok:true}` (24/24 honeypot burst, no version flapping).
- Real consult submission delivered end-to-end via Postmark.
- Forced failure (oversized TextBody → Postmark error 300) produced the Slack
  alert in `#dimolaw-form-failure` with the verbatim Postmark error and
  truncated fields, exactly as designed.
- TEST emails left in gd@dimolaw.com / heidi@ / phil@ inboxes need deleting.

## Out of scope (queued separately)

- Bringing the Worker under version control with Wrangler — recommended
  follow-up; both deploy incidents above would have been caught by a diff.
- Storing failed payloads in KV/R2 (Phase 3 item 10 of the form-email plan).
- Retry/auto-resend of failed submissions.
- Removing the TEMP `phil@phryl.com` Ccs once Phil finishes observing.
