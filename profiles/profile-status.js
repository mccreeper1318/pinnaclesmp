(() => {
  const statusService = window.PinnacleServerStatus;
  const badge = document.querySelector('.profile-status[data-username]');
  if (!statusService?.fetchServerStatus || !badge) return;

  const label = badge.querySelector('.profile-status-label');

  const setOnlineState = (isOnline) => {
    badge.classList.toggle('online', isOnline);
    badge.classList.toggle('offline', !isOnline);
    if (label) {
      label.textContent = isOnline ? 'Online' : 'Offline';
    }
  };

  const refreshProfileStatus = async () => {
    const username = String(badge.dataset.username ?? '').toLowerCase();
    if (!username) {
      setOnlineState(false);
      return;
    }

    const data = await statusService.fetchServerStatus();
    const onlinePlayers = new Set((data.online ? data.onlinePlayers : []).map((player) => String(player).toLowerCase()));
    setOnlineState(onlinePlayers.has(username));
  };

  refreshProfileStatus();
})();
