(() => {
  const STATUS_API = "https://api.mcsrvstat.us/3/pinnaclesmp.mcserv.fun";
  const CACHE_KEY = "pinnacle-server-status";
  const CACHE_TTL = 25_000;
  const REQUEST_TIMEOUT = 5_000;
  let inFlightRequest = null;

  const normalizePlayerList = (listValue) => {
    const getPlayerName = (player) => {
      if (typeof player === "string") return player;
      if (player && typeof player === "object" && typeof player.name === "string") {
        return player.name;
      }
      return null;
    };

    if (Array.isArray(listValue)) {
      return listValue.map(getPlayerName).filter((playerName) => typeof playerName === "string");
    }

    if (listValue && typeof listValue === "object") {
      return Object.values(listValue).map(getPlayerName).filter((playerName) => typeof playerName === "string");
    }

    return [];
  };

  const offlineStatus = () => ({ online: false, playersOnline: 0, onlinePlayers: [] });

  const readCachedStatus = () => {
    try {
      const cached = JSON.parse(window.sessionStorage.getItem(CACHE_KEY) || "null");
      if (!cached || Date.now() - cached.cachedAt > CACHE_TTL) return null;
      return cached.status;
    } catch (error) {
      return null;
    }
  };

  const writeCachedStatus = (status) => {
    try {
      window.sessionStorage.setItem(CACHE_KEY, JSON.stringify({ cachedAt: Date.now(), status }));
    } catch (error) {
      // Ignore unavailable storage; the live request result is still returned.
    }
  };

  const requestStatus = async () => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
      const response = await fetch(STATUS_API, { cache: "no-store", signal: controller.signal });
      if (!response.ok) throw new Error("Bad response");
      const data = await response.json();

      const onlinePlayers = normalizePlayerList(data?.players?.list);
      const playersOnlineRaw = Number(data?.players?.online);
      const playersOnline = Number.isFinite(playersOnlineRaw) ? playersOnlineRaw : onlinePlayers.length;
      const hasExplicitOnlineFlag = typeof data?.online === "boolean";
      const inferredOnline = onlinePlayers.length > 0 || playersOnline > 0 || Number(data?.players?.max) > 0;
      const online = hasExplicitOnlineFlag ? data.online : inferredOnline;

      return online ? { online: true, playersOnline, onlinePlayers } : offlineStatus();
    } finally {
      window.clearTimeout(timeoutId);
    }
  };

  const fetchServerStatus = async ({ force = false } = {}) => {
    const cached = !force ? readCachedStatus() : null;
    if (cached) return cached;

    if (!inFlightRequest) {
      inFlightRequest = requestStatus()
        .then((status) => {
          writeCachedStatus(status);
          return status;
        })
        .catch(() => readCachedStatus() || offlineStatus())
        .finally(() => {
          inFlightRequest = null;
        });
    }

    return inFlightRequest;
  };

  window.PinnacleServerStatus = { fetchServerStatus };
})();
