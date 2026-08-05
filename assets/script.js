(() => {
  const loader = document.currentScript;
  let applyTimer = null;

  function replaceMembershipText(value) {
    return String(value)
      .replace(/WHITELIST APPLICATIONS ARE TEMPORARILY CLOSED/gi, 'WHITELIST APPLICATIONS ARE OPEN')
      .replace(/APPLICATIONS TEMPORARILY CLOSED/gi, 'NOW ACCEPTING NEW MEMBERS')
      .replace(/APPLICATIONS ARE CLOSED/gi, 'APPLICATIONS ARE OPEN')
      .replace(/Pinnacle SMP is not accepting additional new members at this time\./gi, 'Pinnacle SMP is accepting new members.')
      .replace(/Pinnacle SMP is not currently accepting new members\./gi, 'Pinnacle SMP is accepting new members.')
      .replace(/Pinnacle SMP is not accepting new members\./gi, 'Pinnacle SMP is accepting new members.')
      .replace(/When Applications Reopen/gi, 'How to Apply');
  }

  function ensurePluginsWikiLink() {
    const wikiHref = new URL('../plugins-wiki.html', loader.src).href;
    const onWikiPage = /\/(?:plugins-wiki|plugin-[^/]+)\.html$/.test(location.pathname);

    document.querySelectorAll('.nav-list').forEach(list => {
      const existing = [...list.querySelectorAll('a')].find(link =>
        /plugins-wiki\.html(?:$|[?#])/.test(link.getAttribute('href') || '')
      );

      if (existing) {
        existing.classList.toggle('active', onWikiPage);
        return;
      }

      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = wikiHref;
      link.textContent = 'Plugins Wiki';
      if (onWikiPage) link.classList.add('active');
      item.appendChild(link);

      const galleryItem = [...list.querySelectorAll('a')]
        .find(candidate => /gallery\.html(?:$|[?#])/.test(candidate.getAttribute('href') || ''))
        ?.closest('li');

      if (galleryItem) galleryItem.after(item);
      else list.appendChild(item);
    });
  }

  function applyMembershipOpen() {
    ensurePluginsWikiLink();

    document.querySelectorAll('.marquee-track').forEach(el => {
      let text = replaceMembershipText(el.textContent);
      if (!/ACCEPTING NEW MEMBERS/i.test(text)) text = `${text.trim()} • NOW ACCEPTING NEW MEMBERS`;
      if (el.textContent !== text) el.textContent = text;
    });

    document.querySelectorAll('.closed-status').forEach(el => {
      if (!/application|member/i.test(el.textContent)) return;
      const message = 'WHITELIST APPLICATIONS ARE OPEN — PINNACLE SMP IS ACCEPTING NEW MEMBERS';
      if (el.textContent.trim() !== message) el.textContent = message;
      el.classList.add('membership-open-status');
    });

    document.querySelectorAll('h2').forEach(el => {
      const updated = replaceMembershipText(el.textContent);
      if (updated !== el.textContent) el.textContent = updated;
    });

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      if (node.parentElement?.closest('script,style')) return;
      const updated = replaceMembershipText(node.nodeValue);
      if (updated !== node.nodeValue) node.nodeValue = updated;
    });
  }

  const style = document.createElement('style');
  style.textContent = `
    .membership-open-status {
      background: #dff5d5 !important;
      border-color: #5b8a4a !important;
      color: #153c0d !important;
    }
  `;
  document.head.appendChild(style);

  const scheduleApply = () => {
    clearTimeout(applyTimer);
    applyTimer = setTimeout(applyMembershipOpen, 0);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyMembershipOpen, { once: true });
  } else {
    applyMembershipOpen();
  }

  const observer = new MutationObserver(scheduleApply);
  observer.observe(document.documentElement, { childList: true, subtree: true });

  const baseScript = document.createElement('script');
  baseScript.src = new URL('script-base.js', loader.src).href;
  baseScript.onload = applyMembershipOpen;
  baseScript.onerror = applyMembershipOpen;
  document.head.appendChild(baseScript);
})();
