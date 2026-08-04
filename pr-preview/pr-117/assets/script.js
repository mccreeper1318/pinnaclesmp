(function () {
  if (window.__pinnacleMajorScriptLoaded) return;
  window.__pinnacleMajorScriptLoaded = true;

  const inProfiles = /\/profiles\//.test(location.pathname);
  const prefix = inProfiles ? '../' : '';
  const mapUrl = 'http://pinnaclesmp.mcserv.fun:1041/';
  const statusApi = 'https://api.mcsrvstat.us/3/pinnaclesmp.mcserv.fun';

  if (!document.querySelector('link[data-major-update]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `${prefix}assets/major-update.css`;
    link.dataset.majorUpdate = 'true';
    document.head.appendChild(link);
  }

  const normalize = value => String(value ?? '').toLowerCase().replace(/[^a-z0-9_]/g, '');

  function globalChanges() {
    document.querySelectorAll('.top-strip span').forEach(el => {
      if (el.textContent.trim() === 'SURFING SINCE 2012') el.textContent = 'ONLINE SINCE 2012';
    });

    document.querySelectorAll('a[href="guestbook.html"],a[href="../guestbook.html"]').forEach(a => {
      (a.closest('li') || a).remove();
    });

    document.querySelectorAll('a').forEach(a => {
      const text = a.textContent.trim();
      if (/Live World Map|LIVE MAP|OPEN MAP|DIRECT MAP/i.test(text) || a.href.includes('map.pinnaclesmp.com')) {
        a.href = mapUrl;
      }
    });

    document.querySelectorAll('.box-title').forEach(el => {
      if (el.textContent.trim() === 'Eastern Time') el.textContent = 'Server Time';
    });

    document.querySelectorAll('.webring').forEach(ring => {
      const rootPrefix = inProfiles ? '../' : '';
      ring.innerHTML = `<a href="${rootPrefix}members.html">« Members</a><strong>PINNACLE</strong><a href="${rootPrefix}links.html#voting">Vote »</a>`;
    });

    document.querySelectorAll('p.center a,.callout a').forEach(a => {
      if (/CHECK LIVE RULES PAGE/i.test(a.textContent)) a.closest('p')?.remove();
    });

    const linksHeading = [...document.querySelectorAll('h1')].find(h => h.textContent.includes('Links, Forms & Voting'));
    if (linksHeading) {
      document.querySelectorAll('.link-card').forEach(card => {
        const title = card.querySelector('h3')?.textContent.trim();
        if (title === 'Official Website') card.remove();
        if (title === 'Live World Map') {
          const links = [...card.querySelectorAll('a')];
          links.forEach((a, index) => {
            if (index === 0) {
              a.href = mapUrl;
              a.textContent = 'OPEN MAP';
            } else {
              a.remove();
            }
          });
        }
      });
    }

    const joinHeading = [...document.querySelectorAll('h1')].find(h => h.textContent.includes('Join / Contact'));
    if (joinHeading) {
      const items = [...document.querySelectorAll('ol.rules li')];
      items.find(li => /Learn about Pinnacle/i.test(li.textContent))?.remove();
    }
  }

  function sharedSidebar(active) {
    const items = [
      ['index.html', 'Home'],
      ['about.html', 'About Pinnacle'],
      ['season12.html', 'Season 12'],
      ['news.html', 'Server News'],
      ['members.html', 'Members'],
      ['standings.html', 'Tournament Standings'],
      ['gallery.html', 'Gallery'],
      ['rules.html', 'Server Rules'],
      ['faq.html', 'FAQs'],
      ['links.html', 'Links & Voting'],
      ['join.html', 'Join / Contact']
    ];

    return `<aside class="sidebar">
      <section class="box">
        <div class="box-title">Main Menu</div>
        <nav><ul class="nav-list">${items.map(([href, label]) => `<li><a href="${prefix}${href}"${href === active ? ' class="active"' : ''}>${label}</a></li>`).join('')}</ul></nav>
      </section>
      <section class="box">
        <div class="box-title">Quick Connect</div>
        <div class="box-body small">
          <p><strong>Server IP:</strong><br>pinnaclesmp.mcserv.fun</p>
          <p><strong>Capacity:</strong><br>20 players</p>
          <p><strong>Edition:</strong><br>Java Edition</p>
          <p><a href="${mapUrl}" target="_blank" rel="noopener">Live World Map</a></p>
          <p><a href="https://discord.gg/97hdX25n7F" target="_blank" rel="noopener">Pinnacle Discord</a></p>
        </div>
      </section>
      <section class="box">
        <div class="box-title">Cool Links</div>
        <div class="box-body center"><div class="webring"><a href="${prefix}members.html">« Members</a><strong>PINNACLE</strong><a href="${prefix}links.html#voting">Vote »</a></div></div>
      </section>
    </aside>`;
  }

  function rightbar() {
    return `<aside class="rightbar">
      <section class="box">
        <div class="box-title">Server Status</div>
        <div class="box-body center">
          <p class="status-online"><span class="status-dot unknown" data-live-dot></span><span data-server-status>CHECKING...</span></p>
          <p><strong data-player-count>— / 20</strong> players</p>
          <p><span class="server-version" data-server-version>Paper 26.2</span></p>
          <p class="small"><strong>pinnaclesmp.mcserv.fun</strong></p>
        </div>
      </section>
      <section class="box">
        <div class="box-title">Official Emblem</div>
        <div class="box-body center"><img class="official-logo" src="${prefix}assets/pinnacle-logo.png" alt="Official Pinnacle SMP logo"></div>
      </section>
      <section class="box">
        <div class="box-title">Web Counter</div>
        <div class="box-body center"><div class="hit-counter" data-counter>0000000</div><p class="small">unique visitors since reset</p></div>
      </section>
      <section class="box">
        <div class="box-title">Server Time</div>
        <div class="box-body center small" data-clock>Loading...</div>
      </section>
    </aside>`;
  }

  function wrapLegacyPage(main, active, tagline) {
    if (!main || document.querySelector('.profile-site-shell,.gallery-site-shell')) return;

    document.querySelector('.site-header')?.remove();
    document.querySelector('.site-warning-banner')?.remove();
    document.querySelector('.site-footer')?.remove();
    document.getElementById('particle-bg')?.remove();
    document.body.classList.add('retro-wrapped-page');

    const shell = document.createElement('div');
    shell.className = `site-shell ${active === 'members.html' ? 'profile-site-shell' : 'gallery-site-shell'}`;
    shell.innerHTML = `<div class="top-strip"><span>PINNACLE SMP ONLINE NETWORK</span><span>ONLINE SINCE 2012</span></div>
      <header class="header"><img class="logo" src="${prefix}assets/logo.svg" alt="Pinnacle SMP"><p class="tagline">${tagline}</p></header>
      <div class="marquee-box"><span class="marquee-track">PINNACLE SMP • SEASON 12 • PAPER 26.2 • WHITELISTED VANILLA+ • 18+ COMMUNITY</span></div>
      <div class="main-grid">${sharedSidebar(active)}<main class="content"><section class="box"><div class="box-body" data-legacy-slot></div></section></main>${rightbar()}</div>
      <footer class="footer"><div>© 2012–<span data-year></span> Pinnacle SMP. All rights reserved.</div><div><a href="${prefix}index.html">Home</a> | <a href="${prefix}members.html">Members</a></div></footer>`;

    shell.querySelector('[data-legacy-slot]').appendChild(main);
    document.body.prepend(shell);
  }

  async function visitorCounter() {
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    const countedKey = 'pinnacle-global-visitor-counted';
    const firstVisit = !localStorage.getItem(countedKey);
    const base = 'https://api.counterapi.dev/v1/pinnaclesmp-org/website-visitors';

    try {
      const response = await fetch(firstVisit ? `${base}/up` : `${base}/`, { cache: 'no-store' });
      if (!response.ok) throw new Error('Counter request failed');
      const data = await response.json();
      const value = Number(data.count ?? data.value ?? 0);
      if (firstVisit) localStorage.setItem(countedKey, 'true');
      counters.forEach(el => { el.textContent = String(Number.isFinite(value) ? value : 0).padStart(7, '0'); });
    } catch {
      let value = Number(localStorage.getItem('pinnacle-local-counter') || 0);
      if (firstVisit) {
        value += 1;
        localStorage.setItem('pinnacle-local-counter', String(value));
        localStorage.setItem(countedKey, 'true');
      }
      counters.forEach(el => { el.textContent = String(value).padStart(7, '0'); });
    }
  }

  function clock() {
    const render = () => document.querySelectorAll('[data-clock]').forEach(el => {
      el.textContent = new Date().toLocaleString('en-US', {
        timeZone: 'America/New_York',
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
      });
    });
    render();
    setInterval(render, 1000);
  }

  function paintStatus(data) {
    const available = data.available !== false;
    const state = !available ? 'STATUS UNAVAILABLE' : data.online ? 'ONLINE' : 'OFFLINE';
    const onlineCount = data.online ? Number(data.playersOnline || 0) : 0;
    const maxCount = Number(data.playersMax || 20);

    document.querySelectorAll('[data-server-status]').forEach(el => { el.textContent = state; });
    document.querySelectorAll('[data-player-count]').forEach(el => { el.textContent = `${onlineCount} / ${maxCount}`; });
    document.querySelectorAll('[data-server-version]').forEach(el => { el.textContent = data.version || 'Paper 26.2'; });
    document.querySelectorAll('[data-live-dot]').forEach(dot => {
      dot.classList.remove('offline', 'unknown');
      if (!available) dot.classList.add('unknown');
      else if (!data.online) dot.classList.add('offline');
    });

    const onlinePlayers = new Set((data.onlinePlayers || []).map(normalize));
    document.querySelectorAll('[data-member-card]').forEach(card => {
      const candidates = String(card.dataset.usernames || card.dataset.username || '').split(',').map(normalize);
      const online = candidates.some(name => onlinePlayers.has(name));
      card.classList.toggle('is-online', online);
      const label = card.querySelector('[data-member-status]');
      if (label) label.textContent = online ? 'Online' : 'Offline';
    });
  }

  function normalizePlayerList(value) {
    if (Array.isArray(value)) {
      return value.map(player => typeof player === 'string' ? player : player?.name).filter(Boolean);
    }
    if (value && typeof value === 'object') {
      return Object.values(value).map(player => typeof player === 'string' ? player : player?.name).filter(Boolean);
    }
    return [];
  }

  async function fetchStatusDirectly() {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch(`${statusApi}?t=${Date.now()}`, {
        cache: 'no-store',
        signal: controller.signal,
        mode: 'cors'
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      return {
        available: true,
        online: Boolean(data.online),
        playersOnline: Number(data.players?.online || 0),
        playersMax: Number(data.players?.max || 20),
        onlinePlayers: normalizePlayerList(data.players?.list),
        version: data.version || data.protocol?.name || 'Paper 26.2'
      };
    } finally {
      clearTimeout(timeout);
    }
  }

  async function status() {
    try {
      const service = window.PinnacleServerStatus;
      const data = service?.fetchServerStatus
        ? await service.fetchServerStatus({ force: true })
        : await fetchStatusDirectly();
      paintStatus(data);
    } catch (error) {
      console.warn('Unable to retrieve live Pinnacle SMP status.', error);
      paintStatus({ available: false, online: false, playersOnline: 0, playersMax: 20, onlinePlayers: [], version: 'Paper 26.2' });
    }
  }

  function profileOrGalleryWrap() {
    if (inProfiles) {
      wrapLegacyPage(document.querySelector('main.page'), 'members.html', 'PLAYER PROFILE • LIVE PINNACLESTATS');
    } else if (/gallery-season-(11|12)\.html$/.test(location.pathname)) {
      wrapLegacyPage(document.querySelector('main.container'), 'gallery.html', 'COMMUNITY SCREENSHOT ARCHIVE');
    }
  }

  function start() {
    profileOrGalleryWrap();
    globalChanges();
    window.PinnacleMajorContent?.rebuildNews();
    window.PinnacleMajorContent?.rebuildMembers();
    window.PinnacleMajorContent?.rebuildGalleryLanding();
    globalChanges();

    const year = document.querySelector('[data-year]');
    if (year) year.textContent = new Date().getFullYear();

    visitorCounter();
    clock();
    status();
    setInterval(status, 60000);
  }

  function boot() {
    const src = `${prefix}assets/major-content.js`;
    if (window.PinnacleMajorContent) {
      start();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = start;
    script.onerror = start;
    document.head.appendChild(script);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
