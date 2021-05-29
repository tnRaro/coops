import { useAtom } from "jotai";
import Peer from "peerjs";
import { useCallback, useEffect, useRef, useState } from "react";

import { deviceIdAtom } from "../atoms/deviceAtoms";
import { getPeerClient } from "../utils/PeerClient";

export const getMediaStream = async (deviceId: string) => {
  const mediaStream = await navigator.mediaDevices.getUserMedia({
    audio: { deviceId },
  });
  return mediaStream;
};

export const usePeer = (peerId: string) => {
  const [deviceId, setDeviceId] = useAtom(deviceIdAtom);
  const peerRef = useRef<Peer | null>(null);
  const [streams, setStreams] = useState<MediaStream[]>([]);
  const appendStreamHandler = useCallback((remoteStream) => {
    setStreams((streams) => [...streams, remoteStream]);
  }, []);
  type OpenHandler = (peerId: string) => void;
  const openHandlerRef = useRef<OpenHandler | null>(null);
  const call = useCallback(
    async (remotePeerId: string) => {
      if (deviceId == null) return;
      const mediaStream = await getMediaStream(deviceId);
      const call = peerRef.current?.call(remotePeerId, mediaStream);
      call?.on("stream", appendStreamHandler);
    },
    [appendStreamHandler, deviceId],
  );
  interface Result {
    on(type: "open", handler: OpenHandler): void;
  }
  const on = useCallback<Result["on"]>((type: any, handler: any) => {
    switch (type) {
      case "open": {
        openHandlerRef.current = handler;
        break;
      }
    }
  }, []);
  useEffect(() => {
    setTimeout(async () => {
      const peer = await getPeerClient(peerId);
      peerRef.current = peer;
      peer.on("open", (peerId) => {
        console.log(peerId);
      });
      peer.on("call", async (call) => {
        if (deviceId == null) {
          console.error(
            `call id: ${call.peer} has been received. but, deviceId is null`,
          );
          return;
        }
        const mediaStream = await getMediaStream(deviceId);
        call.answer(mediaStream);
        call.on("stream", appendStreamHandler);
      });
    });
    return () => {
      peerRef.current?.destroy();
    };
  }, [appendStreamHandler, deviceId, peerId]);
  return { streams, call, on };
};
