export const getPeerClient = async (peerId: string) => {
  const Peer = (await import("peerjs")).default;
  const peer = new Peer(peerId, {
    host: "/",
    path: "/peer",
    port: process.env.NODE_ENV === "development" ? 3000 : 80,
    debug: process.env.NODE_ENV === "development" ? 3 : 0,
  });
  return peer;
};
