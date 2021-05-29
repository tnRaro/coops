export const getPeerClient = async (peerId: string) => {
  const Peer = (await import("peerjs")).default;
  const peer = new Peer(peerId, {
    host: "/",
    path: "/",
    port: 9000,
    debug: process.env.NODE_ENV === "development" ? 3 : 0,
  });
  return peer;
};
