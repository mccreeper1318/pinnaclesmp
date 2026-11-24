# Pinnacle SMP Website

The official static website for Pinnacle SMP, hosted with GitHub Pages at `www.pinnaclesmp.org`.

## Current site

The website uses a custom responsive Minecraft community design with live server information and a dedicated Season 12 experience.

Main sections include:

- Home, community information, and Season 12
- Server news cards with standalone article pages
- Member roster and PinnacleStats player profiles
- Tournament standings and community events
- Season 11 and Season 12 screenshot galleries
- Server rules, FAQs, voting, applications, and contact information
- Player-facing plugin documentation
- Direct access to the live world map

## Member profiles and statistics

Member profiles use the shared viewer at `profiles/index.html`. The selected player is provided through the `player` query parameter:

```text
profiles/index.html?player=McCreeper1318
```

PinnacleStats publishes player data in `assets/player-stats/`, including named snapshots, UUID snapshots, and the statistics index. The profile viewer also includes an embedded fallback for portable, offline copies of the site.

## Live features

- Minecraft server status and online player count
- Online member indicators
- Eastern Time server clock
- Cloudinary-powered screenshot galleries
- PinnacleStats player dashboards
- Live world map

## Development and publishing

The site uses plain HTML, CSS, and JavaScript and does not require a build step. Run a local web server from the repository root when testing network-backed features:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

Changes pushed to `main` are automatically deployed to `gh-pages` by `.github/workflows/deploy-pages.yml`. Pull requests receive temporary previews through `.github/workflows/pr-preview.yml`.

## Temporary Christmas 2026 branding

The Christmas emblem is served from Cloudinary. The original logo asset (`assets/images/pinnacle-logo.webp`), header/footer SVG marks, and favicon (`assets/favicon.svg`) are retained for restoration after the holidays.

To restore the standard branding:

1. In `index.html` and `about.html`, set the official logo image `src` back to its `data-standard-logo` value.
2. Remove the **Christmas 2026 logo override** block at the end of `assets/theme.css`.
3. Remove the **Christmas 2026 favicon** block near the top of `assets/theme.js`.

No original logo assets need to be recreated or downloaded.

## Notice

Pinnacle SMP is not affiliated with or endorsed by Mojang Studios or Microsoft.
