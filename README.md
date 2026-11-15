# dimolaw.com

The Dimopoulos Law Firm website: static HTML, CSS and a little JavaScript. There is no build step and nothing to install.

## How it goes live

- **Hosting:** Vercel project `dimopoulos`, connected to this GitHub repo.
- **Production:** every push to `main` deploys to https://www.dimolaw.com automatically.
- **Previews:** every push to any other branch gets its own private preview URL (Vercel login required). Do work on a branch, check the preview, then merge to `main`.
- **Config:** `vercel.json` (clean URLs, redirects, headers). `.vercelignore` keeps repo-only files (docs, scripts, old prototypes) off the public site.

See `HOW TO DEPLOY.md` for the step-by-step.

## What's here

- `index.html`, `faq.html`, `podcast.html`, `testimonials.html`, `advisory.html`, `404.html`: top-level pages
- `practice-areas/`, `attorneys/`, `blog/`, `about/`, `legal/`: section pages
- `client-guide/`: private client guide (noindex, not in the sitemap)
- `styles.css` (+ section CSS files), `script.js`, `*-modal.js`, `analytics.js`: shared styling and behavior
- `EpisodesData.jsx`: the podcast episode list (repo-only; the grid on `/podcast` is generated from it)
- `assets/`: images, logos and award badges
- `sitemap.xml`, `robots.txt`, `llms.txt`: search engine and AI crawler files

## Local preview

```bash
python3 -m http.server 8000
# open http://localhost:8000/index.html
```

Clean URLs like `/faq` only work on Vercel; locally, add `.html` (`/faq.html`).

## Maintenance scripts

Run these before committing, when they apply:

| When | Run |
|---|---|
| You edited any page, or added one to `sitemap.xml` | `node scripts/update-sitemap-dates.mjs` |
| You edited a question or answer on `/faq` | `node scripts/update-faq-schema.mjs` |
| You added or changed a podcast episode in `EpisodesData.jsx` | `node scripts/build-podcast-grid.mjs` |

The first sets each sitemap `<lastmod>` from git history; the second rebuilds the FAQ structured data from the visible Q&A so they never drift apart; the third writes the `/podcast` episode grid into the page as plain HTML.

## Legacy files

`deploy.sh` and `deploy.command` are from the old GitHub Pages setup. Don't use them: deploys now happen through Vercel on push.
