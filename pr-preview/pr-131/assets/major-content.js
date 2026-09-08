(function(){
  /*
   * Live status service.
   *
   * The dedicated Pinnacle endpoint is always tried first. Until that HTTPS
   * endpoint is exposed, the site uses mcstatus.io as the fast primary
   * Minecraft ping and mcsrvstat.us as a secondary fallback.
   */
  const DIRECT_STATUS_API = 'https://status.pinnaclesmp.org/api/status';
  const MCSTATUS_API = 'https://api.mcstatus.io/v2/status/java/pinnaclesmp.mcserv.fun?query=false&timeout=2.5';
  const MCSRVSTAT_API = 'https://api.mcsrvstat.us/3/pinnaclesmp.mcserv.fun';
  const CACHE_KEY = 'pinnacle-live-status-v2';
  const LAST_ONLINE_KEY = 'pinnacle-last-confirmed-online-v2';
  const CACHE_TTL = 8000;
  const ONLINE_GRACE = 75000;
  let inFlight = null;

  const normalizePlayers = value => {
    if (!value) return [];
    const list = Array.isArray(value) ? value : (typeof value === 'object' ? Object.values(value) : []);
    return list.map(player => {
      if (typeof player === 'string') return player;
      return player?.name_clean || player?.name_raw || player?.name || null;
    }).filter(Boolean);
  };

  const formatVersion = value => {
    const text = String(value || '').trim();
    if (!text) return 'Paper 26.2';
    if (/^paper\b/i.test(text)) return text.replace(/^paper/i, 'Paper');
    const release = text.match(/\b26\.2(?:\.\d+)?\b/);
    if (release) return `Paper ${release[0]}`;
    if (/^\d+(?:\.\d+)+$/.test(text)) return `Paper ${text}`;
    return text;
  };

  const unavailable = () => ({
    available: false,
    online: false,
    playersOnline: 0,
    playersMax: 20,
    onlinePlayers: [],
    version: 'Paper 26.2',
    source: 'none'
  });

  function readCache(){
    try {
      const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) || 'null');
      return cached && Date.now() - cached.savedAt <= CACHE_TTL ? cached.status : null;
    } catch { return null; }
  }

  function writeCache(status){
    try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), status })); } catch {}
    if (status.online) {
      try { localStorage.setItem(LAST_ONLINE_KEY, JSON.stringify({ savedAt: Date.now(), status })); } catch {}
    }
  }

  function applyOnlineGrace(status){
    if (status.online) return status;
    try {
      const previous = JSON.parse(localStorage.getItem(LAST_ONLINE_KEY) || 'null');
      if (previous?.status?.online && Date.now() - previous.savedAt <= ONLINE_GRACE) {
        return { ...previous.status, available: true, stale: true, source: `${previous.status.source || 'cached'}-grace` };
      }
    } catch {}
    return status;
  }

  async function getJson(url, timeoutMs){
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, { cache: 'no-store', signal: controller.signal, mode: 'cors' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } finally {
      clearTimeout(timer);
    }
  }

  async function fetchDirect(){
    const data = await getJson(`${DIRECT_STATUS_API}?t=${Date.now()}`, 1800);
    const updated = Date.parse(data.updatedAt || data.time || data.timestamp || '');
    if (Number.isFinite(updated) && Date.now() - updated > 45000) throw new Error('Direct status is stale');
    return {
      available: true,
      online: Boolean(data.online),
      playersOnline: Number(data.playersOnline ?? data.players?.online ?? 0),
      playersMax: Number(data.playersMax ?? data.players?.max ?? 20),
      onlinePlayers: normalizePlayers(data.onlinePlayers ?? data.players?.list ?? data.players),
      version: formatVersion(data.version),
      source: 'pinnacle-direct'
    };
  }

  async function fetchMcstatus(){
    const data = await getJson(`${MCSTATUS_API}&t=${Date.now()}`, 3800);
    return {
      available: true,
      online: Boolean(data.online),
      playersOnline: Number(data.players?.online ?? 0),
      playersMax: Number(data.players?.max ?? 20),
      onlinePlayers: normalizePlayers(data.players?.list),
      version: formatVersion(data.version?.name_clean || data.version?.name_raw || data.version?.name || data.software),
      source: 'mcstatus.io'
    };
  }

  async function fetchMcsrvstat(){
    const data = await getJson(`${MCSRVSTAT_API}?t=${Date.now()}`, 5500);
    return {
      available: true,
      online: Boolean(data.online),
      playersOnline: Number(data.players?.online ?? 0),
      playersMax: Number(data.players?.max ?? 20),
      onlinePlayers: normalizePlayers(data.players?.list),
      version: formatVersion(data.version || data.protocol?.name),
      source: 'mcsrvstat.us'
    };
  }

  async function requestStatus(){
    const checks = [fetchDirect(), fetchMcstatus(), fetchMcsrvstat()]
      .map(promise => promise.then(status => ({ status })).catch(error => ({ error })));

    return await new Promise(resolve => {
      let finished = 0;
      let bestOffline = null;
      let resolved = false;

      checks.forEach(check => check.then(result => {
        finished += 1;
        if (!resolved && result.status?.online) {
          resolved = true;
          resolve(result.status);
          return;
        }
        if (result.status?.available && !bestOffline) bestOffline = result.status;
        if (!resolved && finished === checks.length) {
          resolved = true;
          resolve(bestOffline || unavailable());
        }
      }));
    });
  }

  async function fetchServerStatus({ force = false } = {}){
    const cached = force ? null : readCache();
    if (cached) return cached;
    if (!inFlight) {
      inFlight = requestStatus()
        .then(applyOnlineGrace)
        .then(status => { writeCache(status); return status; })
        .catch(() => applyOnlineGrace(readCache() || unavailable()))
        .finally(() => { inFlight = null; });
    }
    return inFlight;
  }

  window.PinnacleServerStatus = { fetchServerStatus };

  const normalizeName = value => String(value ?? '').toLowerCase().replace(/[^a-z0-9_]/g, '');
  function paintLiveStatus(data){
    const available = data.available !== false;
    const state = !available ? 'STATUS UNAVAILABLE' : data.online ? 'ONLINE' : 'OFFLINE';
    const online = data.online ? Number(data.playersOnline || 0) : 0;
    const maximum = Number(data.playersMax || 20);

    document.querySelectorAll('[data-server-status]').forEach(el => { el.textContent = state; });
    document.querySelectorAll('[data-player-count]').forEach(el => { el.textContent = `${online} / ${maximum}`; });
    document.querySelectorAll('[data-server-version]').forEach(el => { el.textContent = formatVersion(data.version); });
    document.querySelectorAll('[data-live-dot]').forEach(dot => {
      dot.classList.remove('offline', 'unknown');
      if (!available) dot.classList.add('unknown');
      else if (!data.online) dot.classList.add('offline');
    });

    const onlineNames = new Set((data.onlinePlayers || []).map(normalizeName));
    document.querySelectorAll('[data-member-card]').forEach(card => {
      const names = String(card.dataset.usernames || card.dataset.username || '').split(',').map(normalizeName);
      const isOnline = names.some(name => onlineNames.has(name));
      card.classList.toggle('is-online', isOnline);
      const label = card.querySelector('[data-member-status]');
      if (label) label.textContent = isOnline ? 'Online' : 'Offline';
    });
  }

  async function refreshLiveStatus(force = false){
    try { paintLiveStatus(await fetchServerStatus({ force })); } catch {}
  }

  const beginPolling = () => {
    refreshLiveStatus(true);
    window.setInterval(() => refreshLiveStatus(true), 15000);
    window.addEventListener('focus', () => refreshLiveStatus(true));
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) refreshLiveStatus(true);
    });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', beginPolling, { once: true });
  else beginPolling();

  const newsArticles = [
    ['plugins','Announcement','July 2, 2026','Recent Plugin Updates and Additions','<p>Pinnacle SMP added several custom plugins and restored key community tools to make the server safer, easier to manage, and more connected across Minecraft, Discord, and the website.</p><ul class="icon-list"><li><strong>FragGuard:</strong> logs world changes and supports investigations and rollbacks.</li><li><strong>FragStealers:</strong> protects storage and supports player mailboxes.</li><li><strong>PinnacleAFK:</strong> displays and announces AFK status with configurable protection.</li><li><strong>PinnacleShop:</strong> provides protected player shops.</li><li><strong>PinnacleStats:</strong> exports current player statistics to the website.</li><li><strong>squaremap, DeathsToDiscord, and LastSeenToDiscord:</strong> restored mapping and Discord information.</li></ul>'],
    ['rollback','News','June 24, 2026','Griefing Incident and Rollback','<p>A serious griefing incident affected spawn and several player bases. The server was restored using the June 20 save so damaged areas could be recovered cleanly.</p><p>FragGuard was then created to log block changes, explosions, fire spread, liquids, pistons, and other world activity, allowing staff to investigate and roll back smaller areas without restoring the entire server.</p>'],
    ['paper','Update','June 22, 2026','We Have Updated to Paper 26.2!','<p>Pinnacle SMP moved back to Paper and updated to Paper 26.2: Chaos Cubed. The move restored plugin support while keeping ordinary survival gameplay mostly vanilla.</p><p>DeathsToDiscord and LastSeenToDiscord returned first, followed by the map and other custom community tools as compatibility became available.</p>'],
    ['june-awards','Announcement','June 1, 2026','June 2026 Award Winners Announced','<p>nicholattee won the Member Base Highlight, mermaidxellie won the Gameplay Award, and Atlaskytan and mermaidxellie tied for the Community Award.</p><p>These awards recognized builds, gameplay contributions, and positive community involvement during May 2026.</p>'],
    ['gallery-update','Announcement','May 28, 2026','Gallery Update','<p>The Season 12 gallery received a folder-style layout to make its growing screenshot archive easier to browse.</p><p>MBH galleries were organized by month and winner, while the Et al section remained available for other Season 12 community moments.</p>'],
    ['wait-26-2','Community Vote','May 6, 2026','Community Votes to Wait for 26.2','<p>The community voted 0–5 to wait for Paper 26.2 instead of moving temporarily to Paper 26.1.2.</p><p>The decision avoided a major server change immediately before another update and gave the server a cleaner upgrade path.</p>'],
    ['may-awards','Announcement','May 4, 2026','Monthly Member Awards','<p>Atlaskytan and McCreeper1318 tied for Member Base Highlight. Kananers won the Gameplay Award, and McCreeper1318 won the Community Award.</p>'],
    ['legacy','Announcement','April 24, 2026','New Legacy Members','<p>mermaidxellie and Atlaskytan were promoted to Legacy Members for consistent participation, contributions across Seasons 11 and 12, and their growth within the community.</p>'],
    ['season-start','Announcement','April 14, 2026','Season 12 Has Begun','<p>Season 12 officially launched with a new world and a fresh opportunity to explore, build, and grow together.</p><p>A temporary world border was introduced to keep early progression connected, resources accessible, and community activity concentrated.</p>'],
    ['update-progress','Announcement','April 6, 2026','Update Still In Progress','<p>Paper developers released alpha builds for 26.1.1 but had not announced a stable-build date.</p><p>The Minecraft source-code deobfuscation and world-save changes made this a particularly large server update, so Pinnacle continued waiting for a safe and stable release.</p>'],
    ['ranks','Announcement','March 24, 2026','Ranks System Update','<p>Rank advancement was changed to better reflect activity, contribution, conduct, collaboration, and community involvement instead of relying only on time played.</p><p>Promotions are reviewed by staff and are no longer automatic.</p>']
  ];

  function rebuildNews(){
    if (!/\/news\.html$/.test(location.pathname) && location.pathname !== '/news.html') return;
    const box = document.querySelector('main.content .box-body');
    if (!box) return;
    box.innerHTML = `<h1>Server News Archive</h1><p>Open an article to read it.</p><div class="news-archive">${newsArticles.map((a,i)=>`<details class="news-archive-item" id="${a[0]}"${i===0?' open':''}><summary><span><span class="news-date">${a[2].toUpperCase()}</span><strong>${a[3]}</strong></span><span class="archive-tag">${a[1]}</span></summary><div class="news-archive-body">${a[4]}</div></details>`).join('')}</div>`;
  }

  function rebuildGalleryLanding(){
    if (!/\/gallery\.html$/.test(location.pathname) && location.pathname !== '/gallery.html') return;
    const box = document.querySelector('main.content .box-body');
    if (!box) return;
    box.innerHTML = `<h1>Pinnacle SMP Galleries</h1><p>Browse the complete screenshot archives from the current and previous seasons.</p><div class="gallery-season-cards"><a class="gallery-season-card" href="gallery-season-12.html"><img src="https://res.cloudinary.com/ds4p9jsuf/image/upload/v1779704250/spawnportal_uu837o.png" alt="Season 12 gallery cover"><span><strong>Season 12 Gallery</strong><small>Browse folders, featured builds, and community screenshots</small></span></a><a class="gallery-season-card" href="gallery-season-11.html"><img src="https://res.cloudinary.com/ds4p9jsuf/image/upload/v1777776796/2026-01-26_20.25.19_2_vzvcr1.png" alt="Season 11 gallery cover"><span><strong>Season 11 Gallery</strong><small>Open the complete Season 11 screenshot archive</small></span></a></div>`;
  }

  window.PinnacleMajorContent={rebuildNews,rebuildGalleryLanding};
})();