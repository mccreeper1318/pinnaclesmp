(() => {
  const menuButton = document.querySelector('[data-menu-toggle]');
  const menu = document.getElementById('primary-navigation');

  if (menuButton && menu) {
    menuButton.addEventListener('click', () => {
      const expanded = menuButton.getAttribute('aria-expanded') !== 'true';
      menuButton.setAttribute('aria-expanded', String(expanded));
      menuButton.setAttribute('aria-label', expanded ? 'Close navigation' : 'Open navigation');
      menu.classList.toggle('is-open', expanded);
    });

    document.addEventListener('click', event => {
      if (!menu.contains(event.target) && !menuButton.contains(event.target)) {
        menu.classList.remove('is-open');
        menuButton.setAttribute('aria-expanded', 'false');
      }
    });
  }

  document.querySelectorAll('.nav-more').forEach(dropdown => {
    document.addEventListener('click', event => {
      if (!dropdown.contains(event.target)) dropdown.open = false;
    });
  });

  let toastTimer;
  document.addEventListener('click', async event => {
    const button = event.target.closest('[data-copy-ip]');
    if (!button) return;

    const address = button.dataset.copyIp || 'pinnaclesmp.mcserv.fun';
    let copied = false;

    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(address);
        copied = true;
      } catch {
        copied = false;
      }
    }

    if (!copied) {
      const field = document.createElement('textarea');
      field.value = address;
      field.setAttribute('readonly', '');
      field.style.position = 'fixed';
      field.style.left = '-9999px';
      document.body.appendChild(field);
      field.select();
      try {
        copied = document.execCommand('copy');
      } catch {
        copied = false;
      }
      field.remove();
    }

    const toast = document.querySelector('[data-copy-toast]');
    if (toast) {
      toast.textContent = copied ? 'Server address copied' : address;
      toast.classList.add('is-visible');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2400);
    }
  });

  document.querySelectorAll('[data-year]').forEach(element => {
    element.textContent = String(new Date().getFullYear());
  });

  const renderClock = () => {
    document.querySelectorAll('[data-clock]').forEach(element => {
      element.textContent = new Date().toLocaleString('en-US', {
        timeZone: 'America/New_York',
        weekday: 'short',
        hour: 'numeric',
        minute: '2-digit',
        timeZoneName: 'short',
      });
    });
  };

  renderClock();
  window.setInterval(renderClock, 30000);

  if (location.hash) {
    let target;
    try {
      target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    } catch {
      target = document.getElementById(location.hash.slice(1));
    }

    if (target instanceof HTMLDetailsElement) target.open = true;
  }
})();
