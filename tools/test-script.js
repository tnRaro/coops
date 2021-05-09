{
  const history = [];
  const state = {};
  const scenario = [
    {
      url: "/api/room/title/시나리오 테스트",
      method: "POST",
      cb: async (res) => (state.roomId = res.roomId),
    },
    { url: () => `/api/rooms/${state.roomId}` },
    {
      url: () => `/api/rooms/${state.roomId}/participants/탱템버린`,
      method: "POST",
      cb: async (res) => (state.hostId = res.participantId),
    },
    {
      url: () => `/api/rooms/${state.roomId}`,
      headers: () => ({ authorization: "X-API-KEY " + state.hostId }),
    },
    {
      url: () => `/api/rooms/${state.roomId}`,
      method: "PUT",
      headers: () => ({ authorization: "X-API-KEY " + state.hostId }),
      cb: async (res) => (state.roomId = res.roomId),
    },
  ];
  try {
    for (const scena of scenario) {
      const res = await fetch(
        typeof scena.url === "function" ? scena.url() : scena.url,
        {
          method: scena.method ?? "GET",
          headers:
            typeof scena.headers === "function"
              ? scena.headers()
              : scena.headers ?? {},
        },
      );
      console.info(res.status);
      const data = await res.json();
      console.log(data);
      history.push(data);
      if (typeof scena.cb === "function") await scena.cb(data);
    }
  } catch (error) {
    console.error(error);
  }
  console.info(history, state);
}
