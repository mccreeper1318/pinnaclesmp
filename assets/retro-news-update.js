(() => {
  const ARTICLE = {
    id: 'fall-build-2026',
    date: 'AUG 12, 2026',
    archiveDate: 'AUGUST 12, 2026',
    title: '🍂 Pinnacle SMP Fall Build Contest 🍂',
    summary: 'Build something that captures the feeling of fall, win a prize, and keep your winning build featured at Spawn!',
    tag: 'Event',
    body: `<p>Fall is coming to <strong>Pinnacle SMP</strong>, and we're celebrating with a <strong>Fall Build Contest at Spawn!</strong></p>
      <h3>🎃 Theme: <strong>Autumn Harvest</strong></h3>
      <p>Build something that captures the feeling of fall! This could be a cozy autumn cottage, pumpkin patch, harvest festival, haunted farmhouse, corn maze, fall market, or anything else that fits the season.</p>
      <p>All contest builds must be constructed <strong>at Spawn</strong> so everyone can walk around and check out the entries.</p>
      <h3>🏆 Prizes</h3>
      <p>🥇 <strong>1st Place:</strong> 32 Diamonds + Fall Build Contest Champion recognition<br>
      🥈 <strong>2nd Place:</strong> 16 Diamonds<br>
      🥉 <strong>3rd Place:</strong> 8 Diamonds</p>
      <p>The winning build will also remain featured at Spawn as part of the season's history!</p>
      <h3>📜 Contest Rules</h3>
      <ul>
        <li>Builds must follow the <strong>Autumn Harvest</strong> theme.</li>
        <li>All entries must be built at <strong>Spawn</strong>.</li>
        <li>You may build alone or work with another member.</li>
        <li>Builds should be created specifically for this contest.</li>
        <li>Have fun with it! Creativity and atmosphere matter more than simply building the biggest structure.</li>
      </ul>
      <p>📅 <strong>Start:</strong> Sep. 1, 2026<br>
      📅 <strong>Deadline:</strong> Dec. 1, 2026</p>
      <p>Once the contest ends, the entries will be judged and the winners announced!</p>
      <p>Grab some pumpkins, leaves, hay bales, and spruce wood and help give Spawn a proper fall makeover. 🍁</p>
      <p><strong>Good luck, and happy building!</strong></p>`
  };

  const PREVIOUS_ARTICLE = {
    id: 'new-member-activity-purge',
    date: 'AUG 06, 2026',
    archiveDate: 'AUGUST 6, 2026',
    title: 'New Member Activity Purge — Monday, August 10',
    summary: 'New Members with 0 playtime will be removed from the whitelist on Monday. Recently accepted players should log in before then to keep their place.',
    tag: 'Announcement',
    body: `<p>Just a heads up! This Monday, August 10, Pinnacle SMP will be doing a cleanup of the member list.</p>
      <p>Any <strong>New Member</strong> who has <strong>0 playtime</strong> on the server will be removed from the whitelist to make room for players who are actively interested in joining the community.</p>
      <p>If you have recently been accepted but have not had a chance to log in yet, be sure to join the server before Monday—even if it is only for a few minutes—to avoid being removed.</p>
      <p>If you are removed and later decide you would still like to join us, you are always welcome to submit a new application.</p>
      <p>Thanks for helping us keep the community active and welcoming!</p>`
  };

  const OLDER_ARTICLE = {
    id: 'retro-redesign',
    date: 'AUG 04, 2026',
    archiveDate: 'AUGUST 4, 2026',
    title: "Pinnacle SMP Website Gets a Retro '90s Redesign",
    summary: "The Pinnacle SMP website has been rebuilt with a colorful late-'90s internet look while retaining modern server information, member profiles, statistics, galleries, and live tools.",
    tag: 'Announcement',
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

    const currentLink = document.querySelector(`.newest-news-item a[href="news.html#${ARTICLE.id}"]`);
    if (currentLink) return true;

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
    second.innerHTML = `<span class="news-date">${PREVIOUS_ARTICLE.date}</span><h3>${PREVIOUS_ARTICLE.title}</h3><p>${PREVIOUS_ARTICLE.summary}</p><a href="news.html#${PREVIOUS_ARTICLE.id}">Read the full update →</a>`;

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

    if (!location.hash) {
      archive.querySelectorAll('details.news-archive-item').forEach(item => {
        item.open = item === newest;
      });
    }
  }

  function ensureArchiveArticle(archive, article, showNewBadge) {
    let item = document.getElementById(article.id);
    if (!(item instanceof HTMLDetailsElement) || !archive.contains(item)) {
      item = document.createElement('details');
      item.className = 'news-archive-item';
      item.id = article.id;
    }

    const badge = showNewBadge ? '<span class="new-badge">NEW!</span>' : '';
    item.innerHTML = `<summary><span><span class="news-date">${article.archiveDate}</span><strong>${article.title}${badge}</strong></span><span class="archive-tag">${article.tag}</span></summary><div class="news-archive-body">${article.body}</div>`;
    return item;
  }

  function updateArchive() {
    if (!/(^|\/)news\.html$/.test(location.pathname)) return true;
    const archive = document.querySelector('.news-archive');
    if (!archive) return false;
    if (archive.dataset.retroNewsReady === ARTICLE.id) return true;

    const intro = archive.previousElementSibling;
    if (intro?.tagName === 'P') intro.textContent = 'Open an article to read it.';

    const older = ensureArchiveArticle(archive, OLDER_ARTICLE, false);
    archive.prepend(older);

    const previous = ensureArchiveArticle(archive, PREVIOUS_ARTICLE, false);
    archive.prepend(previous);

    const newest = ensureArchiveArticle(archive, ARTICLE, true);
    archive.prepend(newest);

    openArchiveArticle(archive, newest);

    if (!archive.dataset.hashListenerAdded) {
      window.addEventListener('hashchange', () => openArchiveArticle(archive, newest));
      archive.dataset.hashListenerAdded = 'true';
    }

    archive.dataset.retroNewsReady = ARTICLE.id;
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
