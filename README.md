# Pinnacle SMP Website

The official static website for Pinnacle SMP, hosted with GitHub Pages at `pinnaclesmp.org`.

## Current site

The website uses a custom retro late-1990s gaming-community design with modern responsive behavior and live server information.

Main sections include:

- Home and server news
- About Pinnacle and Season 12 information
- Member roster and live PinnacleStats profiles
- Tournament standings
- Season 11 and Season 12 screenshot galleries
- Server rules and FAQs
- Links, voting, applications, and contact information
- Player-facing Plugins Wiki

## Member profiles

Member profiles use one shared native retro profile viewer at `profiles/index.html`. The selected player is passed through the `player` query parameter, for example:

```text
profiles/?player=McCreeper1318
```

Profile statistics are loaded from the static JSON files in `assets/player-stats/`, which are published by PinnacleStats. Old per-player profile URLs are redirected by the custom 404 page for backward compatibility.

## Live features

- Minecraft server status and player count
- Online member indicators
- Server software version display
- Eastern Time server clock
- Page-view counter
- Cloudinary-powered screenshot galleries
- PinnacleStats player dashboards

## Development

The site is plain HTML, CSS, and JavaScript. No build step is required. Run a local web server from the repository root when testing features that use `fetch`:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

Pull requests are deployed to temporary GitHub Pages previews by `.github/workflows/pr-preview.yml`.

## Notice

Pinnacle SMP is not affiliated with or endorsed by Mojang Studios or Microsoft.
