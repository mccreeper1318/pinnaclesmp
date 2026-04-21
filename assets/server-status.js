(() => {
  const STATUS_API = "https://api.mcsrvstat.us/3/pinnaclesmp.mcserv.fun";

  const normalizePlayerList = (listValue) => {
    if (Array.isArray(listValue)) {
      return listValue.filter((player) => typeof player === "string");
    }

    if (listValue && typeof listValue === "object") {
      return Object.values(listValue).filter((player) => typeof player === "string");
    }

    return [];
  };

  const fetchServerStatus = async () => {
    try {
      const response = await fetch(STATUS_API, { cache: "no-store" });
      if (!response.ok) throw new Error("Bad response");
      const data = await response.json();

      const onlinePlayers = normalizePlayerList(data?.players?.list);
      const playersOnlineRaw = Number(data?.players?.online);
      const playersOnline = Number.isFinite(playersOnlineRaw)
        ? playersOnlineRaw
        : onlinePlayers.length;

      const hasExplicitOnlineFlag = typeof data?.online === "boolean";
      const inferredOnline = onlinePlayers.length > 0
        || playersOnline > 0
        || Number(data?.players?.max) > 0;
      const online = hasExplicitOnlineFlag ? data.online : inferredOnline;

      if (!online) {
        return { online: false, playersOnline: 0, onlinePlayers: [] };
      }

      return {
        online: true,
        playersOnline,
        onlinePlayers
      };
    } catch (error) {
      return { online: false, playersOnline: 0, onlinePlayers: [] };
    }
  };

  window.PinnacleServerStatus = {
    fetchServerStatus
  };
})();
