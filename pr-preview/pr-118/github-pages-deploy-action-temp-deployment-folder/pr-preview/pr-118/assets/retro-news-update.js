(() => {
  const ARTICLE = {
    id: 'retro-redesign',
    date: 'AUG 04, 2026',
    title: "Pinnacle SMP Website Gets a Retro '90s Redesign",
    summary: "The Pinnacle SMP website has been rebuilt with a colorful late-'90s internet look while retaining modern server information, member profiles, statistics, galleries, and live tools.",
    body: `<p>The Pinnacle SMP website has received a complete visual overhaul inspired by the personal websites, gaming fan pages, and community portals of the late 1990s.</p>
      <p>The new design uses classic beveled panels, bright blue title bars, compact sidebars, pixel-style details, scrolling announcements, web counters, and other familiar elements from the early days of the internet. The goal was to give Pinnacle a more distinctive and memorable home while reflecting the community-focused character of the server.</p>
      <p>Although the website now looks intentionally retro, its important modern features remain available. Visitors can still view live server information, open member profiles, browse PinnacleStats dashboards, check tournament standings, read server rules, access voting and contact links, and explore the complete Season 11 and Season 12 screenshot galleries.</p>
      <p>Server news is now stored in a collapsible archive so older announcements remain available without making the page excessively long.</p>
      <p>This redesign gives Pinnacle SMP a website that feels less like a generic modern template and more like a community site built specifically for the server—just with a little dial-up-era personality.</p>`
  };

  function addStyles() {
    if (document.getElementById('retro-news-update-style')) return;
    const style = document.createElement('style');
    style.id = 'retro-news-update-style';
    style.textContent = `
      .new-badge{
        display:inline;
        margin-left:8px;
        color:#c00;
        background:none;
        border:0;
        padding:0;
        font:bold 13px "Courier New",monospace;
        letter-spacing:.04em;
        vertical-align:baseline;
        animation:retro-news-blink .8s steps(1,end) infinite;
      }
      @keyframes retro-news-blink{0%,49%{visibility:visible}50%,100%{visibility:hidden}}
      @media (prefers-reduced-motion:reduce){.new-badge{animation:none}}
    `;
    document.head.appendChild(style);
  }

  function updateHome() {
    const isHome = /(^|\/)index\.html$/.test(location.pathname) || location.pathname === '/' || /\/pr-preview\/pr-\d+\/?$/.test(location.pathname);
    if (!isHome) return true;
    if (document.querySelector('.newest-news-item .new-badge')) return true;

    const heading = [...document.querySelectorAll('main.content h2')].find(el => el.textContent.trim() === 'Latest Server News');
    if (!heading) return false;

    let node = heading.nextElementSibling;
    while (node && node.tagName !== 'H2') {
      const next = node.nextElementSibling;
      node.remove();
      node = next;
    }

    const first = document.createElement('div');
    first.className = 'news-item newest-news-item';
    first.innerHTML = `<span class="news-date">${ARTICLE.date}</span><h3>${ARTICLE.title}<span class="new-badge">NEW!</span></h3><p>${ARTICLE.summary}</p><a href="news.html#${ARTICLE.id}">Read the full update →</a>`;

    const second = document.createElement('div');
    second.className = 'news-item';
    second.innerHTML = `<span class="news-date">JUL 02, 2026</span><h3>Recent Plugin Updates and Additions</h3><p>New custom plugins and restored community tools improve protection, shops, activity visibility, Discord updates, mapping, and website statistics.</p><a href="news.html#plugins">Read the full update →</a>`;

    heading.after(first, second);
    return true;
  }

  function getHashArticle(archive) {
    if (!location.hash) return null;

    let id;
    try {
      id = decodeURIComponent(location.hash.slice(1));
    } catch {
      id = location.hash.slice(1);
    }

    const target = document.getElementById(id);
    return target instanceof HTMLDetailsElement && target.classList.contains('news-archive-item') && archive.contains(target)
      ? target
      : null;
  }

  function openArchiveArticle(archive, newest) {
    const hashArticle = getHashArticle(archive);

    if (hashArticle) {
      archive.querySelectorAll('details.news-archive-item').forEach(item => {
        item.open = item === hashArticle;
      });
      return;
    }

    // Only make the newest article the default when the URL is not targeting
    // another archive entry. An unknown hash leaves the archive's existing
    // open state untouched rather than overriding the requested destination.
    if (!location.hash) {
      archive.querySelectorAll('details.news-archive-item').forEach(item => {
        item.open = item === newest;
      });
    }
  }

  function updateArchive() {
    if (!/(^|\/)news\.html$/.test(location.pathname)) return true;
    const archive = document.querySelector('.news-archive');
    if (!archive) return false;
    if (archive.dataset.retroNewsReady === 'true') return true;

    const intro = archive.previousElementSibling;
    if (intro?.tagName === 'P') intro.textContent = 'Open an article to read it.';

    let newest = document.getElementById(ARTICLE.id);
    if (!newest) {
      newest = document.createElement('details');
      newest.className = 'news-archive-item';
      newest.id = ARTICLE.id;
      newest.innerHTML = `<summary><span><span class="news-date">AUGUST 4, 2026</span><strong>${ARTICLE.title}<span class="new-badge">NEW!</span></strong></span><span class="archive-tag">Announcement</span></summary><div class="news-archive-body">${ARTICLE.body}</div>`;
      archive.prepend(newest);
    }

    openArchiveArticle(archive, newest);

    if (!archive.dataset.hashListenerAdded) {
      window.addEventListener('hashchange', () => openArchiveArticle(archive, newest));
      archive.dataset.hashListenerAdded = 'true';
    }

    archive.dataset.retroNewsReady = 'true';
    return true;
  }

  function start() {
    addStyles();
    let attempts = 0;
    const timer = setInterval(() => {
      attempts += 1;
      const homeReady = updateHome();
      const archiveReady = updateArchive();
      if ((homeReady && archiveReady) || attempts >= 40) clearInterval(timer);
    }, 250);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
