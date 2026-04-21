(() => {
  const STATUS_API = "https://api.mcsrvstat.us/3/pinnaclesmp.mcserv.fun";

  const fetchServerStatus = async () => {
    try {
      const response = await fetch(STATUS_API, { cache: "no-store" });
      if (!response.ok) throw new Error("Bad response");
      const data = await response.json();

      if (!data?.online) {
        return { online: false, playersOnline: 0, onlinePlayers: [] };
      }

      const onlinePlayers = Array.isArray(data.players?.list)
        ? data.players.list.filter((player) => typeof player === "string")
        : [];

      return {
        online: true,
        playersOnline: Number(data.players?.online ?? onlinePlayers.length ?? 0),
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
