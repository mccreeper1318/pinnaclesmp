# Pinnacle SMP — 1990s Website Edition

A self-contained, multi-page static website customized with public information from PinnacleSMP.org while preserving the exact visual style of the original 1990s gaming-guild template.

## Pages

- `index.html` — Home, server status, news, and events
- `about.html` — Pinnacle history and membership system
- `season12.html` — Season 12 overview
- `news.html` — Current news archive
- `members.html` — Public roster and monthly awards
- `standings.html` — 2026 tournament standings
- `gallery.html` — Offline retro gallery with links to live galleries
- `rules.html` — Current public rule summary
- `faq.html` — Frequently asked questions
- `links.html` — Official links, forms, voting, and donation
- `join.html` — Application status and contact information
- `guestbook.html` — Browser-local guestbook demonstration
- `404.html` — Custom error page

## Assets

All design assets are stored locally in `assets/`, including:

- CSS and JavaScript
- Retro header logo
- Official Pinnacle SMP logo
- Backgrounds, icons, avatars, badges, and gallery illustrations

The site loads without any CSS or JavaScript CDN. The live status panel makes one optional request to the public mcsrvstat.us API. If that request fails, the site displays a status-unavailable fallback.

## Preview

Double-click `index.html`, or run a local server:

```bash
cd pinnacle_smp_1990s_website
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Publishing

The folder can be uploaded to GitHub Pages, Netlify, Cloudflare Pages, Neocities, or ordinary static hosting.

## Content date

Public Pinnacle SMP information was reviewed and packaged on August 4, 2026. Live information may change after that date. Links point to the current official pages and forms.

## Important notes

- The Gallery page's four bundled images are decorative retro illustrations, not live-server screenshots.
- The guestbook saves only to the visitor's own browser.
- Pinnacle SMP is not affiliated with or endorsed by Mojang Studios or Microsoft.
