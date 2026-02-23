# arihant-dev.github.io

Personal portfolio site built with vanilla HTML, CSS, and JavaScript. Retro Web 1.0 aesthetic with monospace fonts, outset/inset borders, and a dark-by-default theme.

**Live:** [arihant-dev.github.io](https://arihant-dev.github.io/)

## Pages

| # | Page | File | Description |
|---|------|------|-------------|
| 1 | Index | `index.html` | Hero, about, skills grid, contact |
| 2 | Experience | `experience.html` | Work history (Thriwe, DRDO), education, awards |
| 3 | Projects | `oss.html` | Forest BD Viewer, Command Shell, TVPlay |
| 4 | Journal | `journal.html` | Blog posts and references |
| 5 | Status | `status.html` | Kanban board of current tasks |

## Features

- **Dark/light theme** toggle with `localStorage` persistence (keyboard shortcut: `t`)
- **Keyboard navigation** &mdash; `1`-`5` for pages, `j`/`k` for scroll
- **Interactive map** via Leaflet with theme-aware CartoDB tiles
- **Self-hosted Fira Mono** (WOFF2, `font-display: swap`)
- **Mobile-responsive** with hamburger menu (Web 1.0 styled)
- **SEO** &mdash; Open Graph tags, `robots.txt`, `sitemap.xml`, canonical URLs
- **Accessibility** &mdash; skip-to-content links, ARIA labels, semantic roles
- **Print stylesheet** &mdash; hides interactive elements, appends URLs to links
- **Custom 404 page**
- **Analytics** via [GoatCounter](https://www.goatcounter.com/) (privacy-respecting, no cookies)
- **oneko.js** &mdash; cat that follows your cursor

## Tech Stack

- HTML, CSS, vanilla JS
- [Leaflet](https://leafletjs.com/) for the map
- [Devicon](https://devicon.dev/) for skill badge icons
- [GoatCounter](https://www.goatcounter.com/) for analytics
- Hosted on GitHub Pages

## Local Development

Open `index.html` in a browser. No build step required.

For a local server (avoids CORS issues with fonts):

```sh
python3 -m http.server 8000
```

## Structure

```bash
.
├── index.html          # Main landing page
├── experience.html     # Work & education
├── oss.html            # Projects
├── journal.html        # Blog
├── status.html         # Kanban board
├── 404.html            # Custom 404
├── styles.css          # All styles (~1800 lines)
├── script.js           # Theme, map, keyboard nav
├── oneko.js            # Cat animation
├── robots.txt          # Crawler directives
├── sitemap.xml         # Sitemap for search engines
├── profile_photo.jpg   # Hero photo
├── resume.pdf          # Downloadable resume
└── fonts/
    ├── FiraMono-Regular.woff2
    └── FiraMono-Bold.woff2
```

## License

Source code is available for reference. Content and design are personal.
