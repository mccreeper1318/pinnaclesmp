(() => {
  const cloudName = 'ds4p9jsuf';
  const tree = window.SEASON_12_GALLERY_TREE;
  const titleEl = document.getElementById('gallery-title');
  const descEl = document.getElementById('gallery-description');
  const statusEl = document.getElementById('gallery-status');
  const crumbsEl = document.getElementById('gallery-breadcrumbs');
  const foldersEl = document.getElementById('folder-grid');
  const imagesEl = document.getElementById('season-gallery-grid');

  const params = new URLSearchParams(window.location.search);
  const path = (params.get('path') || '').split('/').filter(Boolean);

  function findNodeWithTrail(root, ids) {
    let current = root;
    const trail = [root];
    for (const id of ids) {
      if (!current.children) return null;
      const next = current.children.find((child) => child.id === id);
      if (!next) return null;
      current = next;
      trail.push(next);
    }
    return { node: current, trail };
  }

  function renderBreadcrumbs(trail) {
    crumbsEl.innerHTML = '';
    trail.forEach((item, index) => {
      const isLast = index === trail.length - 1;
      if (index > 0) {
        const sep = document.createElement('span');
        sep.textContent = '›';
        sep.setAttribute('aria-hidden', 'true');
        crumbsEl.appendChild(sep);
      }
      if (isLast) {
        const current = document.createElement('span');
        current.textContent = item.title;
        current.setAttribute('aria-current', 'page');
        crumbsEl.appendChild(current);
      } else {
        const a = document.createElement('a');
        const sub = trail.slice(1, index + 1).map((s) => s.id).join('/');
        a.href = sub ? `gallery-season-12.html?path=${encodeURIComponent(sub)}` : 'gallery-season-12.html';
        a.textContent = item.title;
        crumbsEl.appendChild(a);
      }
    });
  }

  function renderFolderCards(node, trail) {
    foldersEl.innerHTML = '';
    imagesEl.innerHTML = '';
    const children = Array.isArray(node.children) ? node.children : [];
    if (!children.length) return;
    statusEl.textContent = '';
    children.forEach((child) => {
      const a = document.createElement('a');
      a.className = 'gallery-feature-card';
      const childPath = trail.slice(1).map((s) => s.id).concat(child.id).join('/');
      a.href = `gallery-season-12.html?path=${encodeURIComponent(childPath)}`;
      a.setAttribute('aria-label', `Open ${child.title} folder`);
      a.innerHTML = `<img class="gallery-card-image" src="${child.coverImage}" alt="${child.title} cover image" loading="lazy" /><span class="gallery-card-title">${child.title}</span>`;
      foldersEl.appendChild(a);
    });
  }

  async function fetchByTag(tag) {
    const encodedTag = encodeURIComponent(tag);
    const url = `https://res.cloudinary.com/${cloudName}/image/list/${encodedTag}.json`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed loading tag ${tag}`);
    const data = await response.json();
    return Array.isArray(data.resources) ? data.resources : [];
  }

  async function fetchImagesWithAllTags(tags) {
    const tagSets = await Promise.all(tags.map((tag) => fetchByTag(tag)));
    if (!tagSets.length) return [];
    const idCounts = new Map();
    const canonical = new Map();
    for (const set of tagSets) {
      const seenInSet = new Set();
      for (const resource of set) {
        if (!resource.public_id || !resource.format || seenInSet.has(resource.public_id)) continue;
        seenInSet.add(resource.public_id);
        canonical.set(resource.public_id, resource);
        idCounts.set(resource.public_id, (idCounts.get(resource.public_id) || 0) + 1);
      }
    }
    return Array.from(idCounts.entries())
      .filter(([, count]) => count === tags.length)
      .map(([id]) => canonical.get(id));
  }

  async function renderImageGallery(node) {
    foldersEl.innerHTML = '';
    imagesEl.innerHTML = '';
    const requiredTags = node.tags || [];
    statusEl.textContent = 'Loading screenshots…';
    const resources = await fetchImagesWithAllTags(requiredTags);
    if (!resources.length) {
      statusEl.textContent = 'No screenshots have been added to this gallery yet.';
      return;
    }
    statusEl.textContent = '';
    resources.forEach((image) => {
      const thumb = `https://res.cloudinary.com/${cloudName}/image/upload/w_500,h_350,c_fill,q_auto,f_auto/${image.public_id}.${image.format}`;
      const full = `https://res.cloudinary.com/${cloudName}/image/upload/w_1800,q_auto,f_auto/${image.public_id}.${image.format}`;
      const alt = image.public_id.replace(/[\/_-]+/g, ' ').trim();
      const a = document.createElement('a');
      a.className = 'season-gallery-item';
      a.href = full;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      const img = document.createElement('img');
      img.src = thumb;
      img.alt = alt || `${node.title} screenshot`;
      img.loading = 'lazy';
      a.appendChild(img);
      imagesEl.appendChild(a);
    });
  }

  const resolved = findNodeWithTrail(tree, path);
  if (!resolved) {
    titleEl.textContent = 'Season 12 Gallery';
    descEl.textContent = 'The folder you requested could not be found.';
    statusEl.textContent = 'Please go back and choose another folder.';
    return;
  }

  const { node, trail } = resolved;
  titleEl.textContent = `${node.title} Gallery`;
  descEl.textContent = node.description || 'Browse folders and screenshots from this gallery section.';
  renderBreadcrumbs(trail);
  if (node.children && node.children.length) {
    renderFolderCards(node, trail);
  } else if (node.tags) {
    renderImageGallery(node).catch((error) => {
      statusEl.textContent = 'Sorry, we could not load this gallery right now. Please try again later.';
      console.error(error);
    });
  }
})();
