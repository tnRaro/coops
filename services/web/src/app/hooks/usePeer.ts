import { useAtom } from "jotai";
import { useAtomValue, useUpdateAtom } from "jotai/utils";
import React, { useEffect, useRef, useState } from "react";

import {
  deviceIdAtom,
  participantsAtom,
  peerAtom,
  peerIdAtom,
  streamUpdaterAtom,
} from "../atoms";
import { getMediaStream } from "../utils/getMediaStream";
import { getPeerClient } from "../utils/PeerClient";

export const useSettingPeer = () => {
  const deviceId = useAtomValue(deviceIdAtom);
  const peerId = useAtomValue(peerIdAtom);
  const [peer, setPeer] = useAtom(peerAtom);
  const [isOpened, setIsOpened] = useState(false);
  const peerRef = useRef(peer);
  peerRef.current = peer;
  const participants = useAtomValue(participantsAtom);
  const participantsRef = useRef(participants);
  participantsRef.current = participants;
  const deviceIdRef = useRef(deviceId);
  deviceIdRef.current = deviceId;
  const updateStream = useUpdateAtom(streamUpdaterAtom);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const appendStream = React.useCallback(
    (peerId: string, remoteStream: MediaStream) => {
      updateStream({
        peerId,
        stream: remoteStream,
      });
    },
    [updateStream],
  );
  const removeStream = React.useCallback(
    (peerId: string) => {
      updateStream({
        peerId,
        stream: null,
      });
    },
    [updateStream],
  );
  useEffect(() => {
    if (peerId == null) return;
    peerRef.current?.destroy();
    setTimeout(async () => {
      if (peerId == null) return;
      const peer = await getPeerClient(peerId);
      peerRef.current = peer;
      setPeer(peer);
      peer.on("call", async (call) => {
        if (deviceIdRef.current != null) {
          const stream = mediaStreamRef.current;
          call.answer(stream ?? undefined);
        }
        call.on("stream", (remoteStream) => {
          appendStream(call.peer, remoteStream);
        });
        call.on("close", () => {
          removeStream(call.peer);
        });
        call.on("error", (error) => {
          // eslint-disable-next-line no-console
          console.error("error76fromcall", error);
        });
      });
      peer.on("error", (error) => {
        // eslint-disable-next-line no-console
        console.error("error76", error);
        setIsOpened(false);
      });
      peer.on("open", () => {
        setIsOpened(true);
      });
    });
    return () => {
      peerRef.current?.destroy();
    };
  }, [appendStream, peerId, removeStream, setPeer, updateStream]);
  useEffect(() => {
    setTimeout(async () => {
      if (peer == null) return;
      if (deviceId == null) return;
      if (!isOpened) return;
      const stream = await getMediaStream(deviceId);
      mediaStreamRef.current = stream;
      for (const participant of participantsRef.current) {
        if (participant.peerId !== peer.id) {
          const call = peer.call(participant.peerId, stream);
          call.on("stream", (remoteStream) => {
            appendStream(call.peer, remoteStream);
          });
          call.on("close", () => {
            removeStream(call.peer);
          });
          call.on("error", (error) => {
            // eslint-disable-next-line no-console
            console.error("error76fromcall", error);
          });
        }
      }
    });
  }, [appendStream, deviceId, isOpened, peer, removeStream]);
};
