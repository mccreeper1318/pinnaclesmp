(() => {
  const cloudName = 'ds4p9jsuf';
  const tag = 'Season 11';
  const status = document.getElementById('gallery-status');
  const grid = document.getElementById('season-gallery-grid');

  if (!status || !grid) return;

  const encodedTag = encodeURIComponent(tag);
  const listUrl = `https://res.cloudinary.com/${cloudName}/image/list/${encodedTag}.json`;

  fetch(listUrl)
    .then((response) => {
      if (!response.ok) throw new Error('Cloudinary gallery list failed to load.');
      return response.json();
    })
    .then((data) => {
      const resources = Array.isArray(data.resources) ? data.resources : [];
      if (!resources.length) {
        status.textContent = 'No screenshots have been added to this gallery yet.';
        return;
      }

      status.textContent = '';
      resources.forEach((image) => {
        const publicId = image.public_id;
        const format = image.format;
        if (!publicId || !format) return;

        const thumb = `https://res.cloudinary.com/${cloudName}/image/upload/w_500,h_350,c_fill,q_auto,f_auto/${publicId}.${format}`;
        const full = `https://res.cloudinary.com/${cloudName}/image/upload/w_1800,q_auto,f_auto/${publicId}.${format}`;
        const alt = publicId.replace(/[\/_-]+/g, ' ').trim();

        const link = document.createElement('a');
        link.className = 'season-gallery-item';
        link.href = full;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';

        const imageElement = document.createElement('img');
        imageElement.src = thumb;
        imageElement.alt = alt || 'Season 11 screenshot';
        imageElement.loading = 'lazy';

        link.appendChild(imageElement);
        grid.appendChild(link);
      });

      if (!grid.children.length) {
        status.textContent = 'No screenshots have been added to this gallery yet.';
      }
    })
    .catch((error) => {
      status.textContent = 'Sorry, we could not load the Season 11 gallery right now. Please try again later.';
      console.error(error);
    });
})();
