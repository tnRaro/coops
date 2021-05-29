import { useEffect, useRef, VoidFunctionComponent } from "react";

import { usePeer } from "../../hooks/usePeer";

interface AudioProps {
  stream: MediaStream;
}
export const Audio: VoidFunctionComponent<AudioProps> = (props) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    if (audioRef.current == null) return;
    audioRef.current.srcObject = props.stream;
  }, [props.stream]);
  return (
    <div style={{ opacity: 1 }}>
      <audio ref={audioRef} autoPlay controls>
        <track kind="captions" />
      </audio>
    </div>
  );
};

interface PeerListProps {
  peerId: string;
  nickname: string;
  participants: { nickname: string; peerId: string }[];
}
export const PeerList: VoidFunctionComponent<PeerListProps> = (props) => {
  const { peerId, participants, nickname } = props;
  const { call, streams, on } = usePeer(peerId);
  useEffect(() => {
    console.log(participants);
    for (const participant of participants) {
      if (participant.nickname === nickname) {
        continue;
      }
      call(participant.peerId);
    }
  }, [call, nickname, on, participants]);
  return (
    <div style={{ opacity: 1 }}>
      <div>{nickname}</div>
      {streams.map((stream) => (
        <Audio key={stream.id} stream={stream} />
      ))}
    </div>
  );
};

const getPeer = () => {};
