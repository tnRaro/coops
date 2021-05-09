{
  const history = [];
  const state = {};
  const scenario = [
    {
      url: "/api/room/title/새로운 방 제목",
      method: "POST",
      cb: async (res) => (state.roomId = res.roomId),
    },
    { url: () => `/api/rooms/${state.roomId}` },
    {
      url: () => `/api/rooms/${state.roomId}/participants/참가자이름`,
      method: "POST",
      cb: async (res) => (state.hostId = res.participantId),
    },
    { url: () => `/api/rooms/${state.roomId}` },
    //     { url: () => `/api/rooms/${state.roomId}`, method: "PUT", headers: () => ({ authorization: "X-API-KEY " + state.hostId }), cb: async res => state.roomId = res.roomId },
  ];
  try {
    for (const scena of scenario) {
      const url = typeof scena.url === "function" ? scena.url() : scena.url;
      const method = scena.method ?? "GET";
      const headers =
        typeof scena.headers === "function"
          ? scena.headers()
          : scena.headers ?? {};
      const res = await fetch(url, { method, headers });
      console.info(method, url);
      if (res.status >= 400) {
        throw res;
      }
      const data = await res.json();
      console.log(res.status, data);
      history.push(data);
      if (typeof scena.cb === "function") await scena.cb(data);
    }
  } catch (error) {
    console.error(error);
  }
  console.info(history, state);
}
