(() => {
  const STATUS_API = "https://api.mcsrvstat.us/3/pinnaclesmp.mcserv.fun";

  const normalizePlayerList = (listValue) => {
    const getPlayerName = (player) => {
      if (typeof player === "string") return player;
      if (player && typeof player === "object" && typeof player.name === "string") {
        return player.name;
      }
      return null;
    };

    if (Array.isArray(listValue)) {
      return listValue
        .map(getPlayerName)
        .filter((playerName) => typeof playerName === "string");
    }

    if (listValue && typeof listValue === "object") {
      return Object.values(listValue)
        .map(getPlayerName)
        .filter((playerName) => typeof playerName === "string");
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
