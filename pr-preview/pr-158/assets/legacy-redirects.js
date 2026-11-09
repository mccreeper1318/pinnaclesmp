(() => {
  const path = location.pathname;
  const profile = path.match(/^(.*\/profiles\/)([^/]+)\.html$/i);

  if (profile) {
    let player = profile[2];
    try {
      player = decodeURIComponent(player);
    } catch {
      // Preserve the original segment when it was not valid percent-encoding.
    }
    location.replace(`${profile[1]}index.html?player=${encodeURIComponent(player)}`);
    return;
  }

  const file = path.slice(path.lastIndexOf('/') + 1).toLowerCase();
  const redirects = {
    'about-us.html': 'about.html',
    'about-season-12.html': 'season12.html',
    'tournament-standings.html': 'standings.html',
    'vote-history.html': 'links.html#voting',
    'vote-links.html': 'links.html#voting',
  };

  if (redirects[file]) {
    const base = path.slice(0, path.lastIndexOf('/') + 1);
    location.replace(`${base}${redirects[file]}`);
  }
})();
