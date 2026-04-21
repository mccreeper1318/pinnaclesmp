(() => {
  const statusService = window.PinnacleServerStatus;
  const badge = document.querySelector('.profile-status[data-username]');
  if (!statusService?.fetchServerStatus || !badge) return;

  const label = badge.querySelector('.profile-status-label');

  const normalizeUsername = (value) => String(value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '');

  const getCandidateUsernames = () => {
    const candidates = new Set(
      String(badge.dataset.usernames || badge.dataset.username || '')
        .split(',')
        .map((entry) => normalizeUsername(entry))
        .filter(Boolean)
    );

    return [...candidates];
  };

  const setOnlineState = (isOnline) => {
    badge.classList.toggle('online', isOnline);
    badge.classList.toggle('offline', !isOnline);
    if (label) {
      label.textContent = isOnline ? 'Online' : 'Offline';
    }
  };

  const refreshProfileStatus = async () => {
    const usernames = getCandidateUsernames();
    if (!usernames.length) {
      setOnlineState(false);
      return;
    }

    const data = await statusService.fetchServerStatus();
    const onlinePlayers = new Set((data.onlinePlayers || [])
      .map((player) => normalizeUsername(player))
      .filter(Boolean));

    setOnlineState(usernames.some((username) => onlinePlayers.has(username)));
  };

  refreshProfileStatus();
})();
