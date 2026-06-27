(() => {
  const STALE_AFTER_DAYS = 14;
  const numberFormat = new Intl.NumberFormat();
  const escapeHtml = (value) => String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  const formatNumber = (value, suffix = '') => { const number = Number(value); return Number.isFinite(number) ? `${numberFormat.format(Math.round(number))}${suffix}` : '—'; };
  const formatDate = (value) => { const date = new Date(value || ''); const bad = Number.isNaN(date.getTime()); const stale = bad || Date.now() - date.getTime() > STALE_AFTER_DAYS * 86400000; return { label: bad ? 'Last updated time unavailable' : `Last updated ${date.toLocaleString()}`, stale }; };
  const valueMarkup = (value) => Array.isArray(value) ? `<ul class="stat-row__list">${value.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>` : `<div class="stat-row__value">${escapeHtml(value ?? '—')}</div>`;
  const renderFallback = (container, playerName, message) => { container.innerHTML = `<div class="stats-fallback"><strong>Stats are warming up for ${escapeHtml(playerName)}.</strong><span>${escapeHtml(message)}</span></div>`; };
  const renderDashboard = (container, data) => {
    const player = data.player || {};
    const summary = data.summary || {};
    const updated = formatDate(player.lastUpdated);
    const nickname = container.dataset.nickname;
    const highlights = Array.isArray(data.highlights) ? data.highlights : [];
    const cards = Array.isArray(data.cards) ? data.cards : [];
    const summaryTiles = [['Playtime', summary.playtime || '—'], ['Deaths', formatNumber(summary.deaths)], ['Mob kills', formatNumber(summary.mobKills)], ['Player kills', formatNumber(summary.playerKills)], ['Distance traveled', formatNumber(summary.distanceTraveledBlocks, ' blocks')], ['Jumps', formatNumber(summary.jumps)]];
    container.innerHTML = `<div class="stats-dashboard"><div class="stats-updated${updated.stale ? ' is-stale' : ''}">${escapeHtml(updated.label)}${updated.stale ? ' · stats may be stale' : ''}</div>${nickname ? `<div class="profile-nickname">Display note: ${escapeHtml(nickname)}</div>` : ''}<div class="stats-summary">${summaryTiles.map(([label, value]) => `<article class="stat-tile"><div class="stat-tile__label">${escapeHtml(label)}</div><div class="stat-tile__value">${escapeHtml(value)}</div></article>`).join('')}</div><div class="stats-highlights">${highlights.map((item) => `<article class="highlight-card"><div class="highlight-card__label">${escapeHtml(item.label)}</div><div class="highlight-card__value">${escapeHtml(item.value)}</div>${item.amount == null ? '' : `<div class="highlight-card__amount">${formatNumber(item.amount)}</div>`}</article>`).join('')}</div><div class="stats-categories">${cards.map((card) => `<article class="stat-category-card"><h2>${escapeHtml(card.title)}</h2><p>${escapeHtml(card.description || '')}</p>${(card.stats || []).map((stat) => `<div class="stat-row"><div class="stat-row__label">${escapeHtml(stat.label)}</div>${valueMarkup(stat.value)}</div>`).join('')}</article>`).join('')}</div></div>`;
  };
  document.querySelectorAll('.dynamic-profile[data-player]').forEach(async (container) => {
    const playerName = container.dataset.player;
    const url = `/assets/player-stats/players/${encodeURIComponent(playerName)}.json?v=${Date.now()}`;
    try { const response = await fetch(url, { cache: 'no-store' }); if (!response.ok) throw new Error(`HTTP ${response.status}`); renderDashboard(container, await response.json()); }
    catch (error) { renderFallback(container, playerName, 'Latest JSON could not be loaded yet. Please check back after the next PinnacleStats export.'); }
  });
})();
