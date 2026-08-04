(() => {
  const badge = document.getElementById("server-status-badge");
  const label = document.getElementById("server-status-text");
  const statusService = window.PinnacleServerStatus;
  if (!badge || !label || !statusService?.fetchServerStatus) return;

  const setOffline = () => {
    badge.classList.remove("online");
    badge.classList.add("offline");
    label.textContent = "Offline";
  };

  const setOnline = (playersOnline) => {
    badge.classList.remove("offline");
    badge.classList.add("online");
    label.textContent = `Online ${playersOnline}/20`;
  };

  const refreshServerStatus = async (force = false) => {
    const data = await statusService.fetchServerStatus({ force });
    if (!data.online) {
      setOffline();
      return;
    }

    setOnline(data.playersOnline);
  };

  refreshServerStatus();
  window.setInterval(() => refreshServerStatus(true), 30_000);
})();
