(() => {
  const THEME_STORAGE_KEY = 'pinnacle-theme';
  const root = document.documentElement;

  const readStoredTheme = () => {
    try {
      return window.localStorage.getItem(THEME_STORAGE_KEY) === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  };

  const writeStoredTheme = theme => {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Theme still works for the current page when storage is unavailable.
    }
  };

  let activeTheme = readStoredTheme();
  root.dataset.theme = activeTheme;

  const themeScript = document.currentScript || Array.from(document.scripts).find(script => /\/assets\/theme\.js(?:\?|$)/.test(script.src));
  if (!document.querySelector('link[data-dark-mode-styles]')) {
    const themeStyles = document.createElement('link');
    themeStyles.rel = 'stylesheet';
    themeStyles.dataset.darkModeStyles = '';
    themeStyles.href = themeScript?.src
      ? new URL('dark-mode.css', themeScript.src).href
      : new URL('assets/dark-mode.css', document.baseURI).href;
    document.head.appendChild(themeStyles);
  }

  const updateThemeControls = theme => {
    document.querySelectorAll('[data-theme-toggle]').forEach(button => {
      const isDark = theme === 'dark';
      const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';
      button.setAttribute('aria-checked', String(isDark));
      button.setAttribute('aria-label', label);
      button.setAttribute('title', label);
    });
  };

  const applyTheme = (theme, persist = false) => {
    activeTheme = theme === 'light' ? 'light' : 'dark';
    root.dataset.theme = activeTheme;

    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.setAttribute('content', activeTheme === 'dark' ? '#0d1b27' : '#102b48');

    updateThemeControls(activeTheme);
    if (persist) writeStoredTheme(activeTheme);
  };

  applyTheme(activeTheme);

  const headerActions = document.querySelector('.header-actions');
  if (headerActions && !headerActions.querySelector('[data-theme-toggle]')) {
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.type = 'button';
    themeToggle.dataset.themeToggle = '';
    themeToggle.setAttribute('role', 'switch');
    themeToggle.innerHTML = '<span class="theme-toggle__thumb" aria-hidden="true"></span>';
    themeToggle.addEventListener('click', () => {
      applyTheme(activeTheme === 'dark' ? 'light' : 'dark', true);
    });
    headerActions.appendChild(themeToggle);
    updateThemeControls(activeTheme);
  }

  window.addEventListener('storage', event => {
    if (event.key === THEME_STORAGE_KEY) applyTheme(event.newValue === 'light' ? 'light' : 'dark');
  });

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
