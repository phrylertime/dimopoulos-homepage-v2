# Dimopoulos Law — Homepage v2

Static preview of the redesigned homepage. Deploys via GitHub Pages.

## What's here

- `index.html` — entry point
- `design-system.css` — brand tokens (color, type, spacing)
- `styles.css`, `podcast-blocks.css`, `episodes.css` — layout
- `*.jsx` — React components, transpiled in-browser via Babel Standalone
- `assets/` — local imagery (Gus portraits, logo, studio shot)

Some imagery (attorney headshots, award badges) hotlinks to dimolaw.com. If those break, replace with local copies in `assets/`.

## Local preview

```bash
# any static server will do
python3 -m http.server 8000
# → http://localhost:8000
```

## Deploy

GitHub Pages: Settings → Pages → Source: `main` branch, `/` (root). URL goes live at `https://<user>.github.io/<repo>/`.
