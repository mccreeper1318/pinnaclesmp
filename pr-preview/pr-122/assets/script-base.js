(() => {
  if (window.__pinnacleBaseScriptLoaded) return;
  window.__pinnacleBaseScriptLoaded = true;

  const loader = document.currentScript;
  const inProfiles = /\/profiles\//.test(location.pathname);
  const prefix = inProfiles ? '../' : '';
  const mapUrl = 'http://pinnaclesmp.mcserv.fun:1041/';

  if (!document.querySelector('link[data-major-update]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = new URL('major-update.css', loader.src).href;
    link.dataset.majorUpdate = 'true';
    document.head.appendChild(link);
  }

  function applySharedCleanup() {
    document.querySelectorAll('.top-strip span').forEach(element => {
      if (element.textContent.trim() === 'SURFING SINCE 2012') element.textContent = 'ONLINE SINCE 2012';
    });

    document.querySelectorAll('a[href="guestbook.html"],a[href="../guestbook.html"]').forEach(link => {
      (link.closest('li') || link).remove();
    });

    document.querySelectorAll('a').forEach(link => {
      const text = link.textContent.trim();
      if (/Live World Map|LIVE MAP|OPEN MAP|DIRECT MAP/i.test(text) || link.href.includes('map.pinnaclesmp.com')) {
        link.href = mapUrl;
      }
    });

    document.querySelectorAll('.box-title').forEach(element => {
      if (element.textContent.trim() === 'Eastern Time') element.textContent = 'Server Time';
    });

    document.querySelectorAll('.webring').forEach(ring => {
      ring.innerHTML = `<a href="${prefix}members.html">« Members</a><strong>PINNACLE</strong><a href="${prefix}links.html#voting">Vote »</a>`;
    });

    document.querySelectorAll('p.center a,.callout a').forEach(link => {
      if (/CHECK LIVE RULES PAGE/i.test(link.textContent)) link.closest('p')?.remove();
    });

    const linksHeading = [...document.querySelectorAll('h1')].find(heading => heading.textContent.includes('Links, Forms & Voting'));
    if (linksHeading) {
      document.querySelectorAll('.link-card').forEach(card => {
        const title = card.querySelector('h3')?.textContent.trim();
        if (title === 'Official Website') card.remove();
        if (title === 'Live World Map') {
          [...card.querySelectorAll('a')].forEach((link, index) => {
            if (index === 0) {
              link.href = mapUrl;
              link.textContent = 'OPEN MAP';
            } else {
              link.remove();
            }
          });
        }
      });
    }

    const joinHeading = [...document.querySelectorAll('h1')].find(heading => heading.textContent.includes('Join / Contact'));
    if (joinHeading) {
      [...document.querySelectorAll('ol.rules li')].find(item => /Learn about Pinnacle/i.test(item.textContent))?.remove();
    }
  }

  async function visitorCounter() {
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    const base = 'https://api.counterapi.dev/v1/pinnaclesmp-org/website-visitors';
    const lastValueKey = 'pinnacle-last-counter-value';
    const display = value => {
      const safeValue = Number.isFinite(value) && value >= 0 ? Math.floor(value) : 0;
      counters.forEach(element => { element.textContent = String(safeValue).padStart(7, '0'); });
    };

    counters.forEach(counter => {
      const caption = counter.parentElement?.querySelector('.small');
      if (caption) caption.textContent = 'page views since reset';
    });

    try {
      const response = await fetch(`${base}/up?t=${Date.now()}`, { cache: 'no-store' });
      if (!response.ok) throw new Error(`Counter request failed: HTTP ${response.status}`);
      const data = await response.json();
      const value = Number(data.count ?? data.value);
      if (!Number.isFinite(value)) throw new Error('Counter returned an invalid value');
      localStorage.setItem(lastValueKey, String(value));
      localStorage.setItem('pinnacle-local-counter', String(value));
      display(value);
    } catch {
      let value = Number(localStorage.getItem(lastValueKey) || localStorage.getItem('pinnacle-local-counter') || 0);
      if (!Number.isFinite(value) || value < 0) value = 0;
      value += 1;
      localStorage.setItem(lastValueKey, String(value));
      localStorage.setItem('pinnacle-local-counter', String(value));
      display(value);
    }
  }

  function startClock() {
    const render = () => document.querySelectorAll('[data-clock]').forEach(element => {
      element.textContent = new Date().toLocaleString('en-US', {
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
    window.setInterval(render, 1000);
  }

  function enableCopyButtons() {
    document.addEventListener('click', async event => {
      const button = event.target.closest('[data-copy-ip]');
      if (!button) return;
      const result = button.parentElement?.querySelector('.copy-result');
      try {
        await navigator.clipboard.writeText(button.dataset.copyIp || 'pinnaclesmp.mcserv.fun');
        if (result) result.textContent = 'Copied!';
      } catch {
        if (result) result.textContent = 'Copy failed';
      }
    });
  }

  function start() {
    applySharedCleanup();
    window.PinnacleMajorContent?.rebuildNews();
    window.PinnacleMajorContent?.rebuildMembers();
    applySharedCleanup();

    document.querySelectorAll('[data-year]').forEach(element => { element.textContent = new Date().getFullYear(); });
    visitorCounter();
    startClock();
    enableCopyButtons();
  }

  function boot() {
    const src = new URL('major-content.js', loader.src).href;
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

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
