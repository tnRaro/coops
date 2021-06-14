export const getPeerClient = async (peerId: string) => {
  const Peer = (await import("peerjs")).default;
  const peer = new Peer(peerId, {
    host: "/",
    path: "/peer",
    port: 443,
    debug: process.env.NODE_ENV === "development" ? 1 : 0,
  });
  return peer;
};
