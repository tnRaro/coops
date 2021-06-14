import type * as redis from "@coops/redis";
import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";
import Peer from "peerjs";

import type { Toast } from "./hooks/useToast";
import { Participant } from "./types";

export const toastsAtom = atom<Toast[]>([]);

export const devicesAtom = atom<MediaDeviceInfo[]>([]);
export const deviceIdAtom = atom<string | null>(null);

export const authorIdAtom = atomWithReset<string | null>(null);
export const nicknameAtom = atomWithReset<string | null>(null);
export const peerIdAtom = atomWithReset<string | null>(null);
export const isHostAtom = atomWithReset<boolean>(false);
export const muteAudioAtom = atomWithReset<boolean>(false);
export const muteSpeakerAtom = atomWithReset<boolean>(false);
export const mutedAudioAtom = atomWithReset<boolean>(false);
export const mutedSpeakerAtom = atomWithReset<boolean>(false);

export const roomIdAtom = atomWithReset<string | null>(null);
export const roomTitleAtom = atomWithReset<string | null>(null);
export const roomDescriptionAtom = atomWithReset<string | null>(null);
export const roomMaximumParticipantsAtom = atomWithReset<number | null>(null);
export const participantsAtom = atomWithReset<Participant[]>([]);
export const chatsAtom = atomWithReset<
  {
    id: string;
    message: string;
    nickname: string | null;
    createdAt: Date;
  }[]
>([]);

export const errorAtom = atomWithReset<Error | null>(null);

export const participantUpdaterAtom = atom(
  null,
  (
    get,
    set,
    participant: Partial<Participant> & { nickname: Participant["nickname"] },
  ) => {
    set(
      participantsAtom,
      get(participantsAtom).map((part) => {
        if (part.nickname === participant.nickname) {
          return {
            ...part,
            ...participant,
          };
        } else {
          return part;
        }
      }),
    );
    if (participant.nickname === get(nicknameAtom)) {
      if (participant.peerId != null) {
        set(peerIdAtom, participant.peerId);
      }
      if (participant.isHost != null) {
        set(isHostAtom, participant.isHost);
      }
      if (participant.muteAudio != null) {
        set(muteAudioAtom, participant.muteAudio);
      }
      if (participant.muteSpeaker != null) {
        set(muteSpeakerAtom, participant.muteSpeaker);
      }
      if (participant.mutedAudio != null) {
        set(mutedAudioAtom, participant.mutedAudio);
      }
      if (participant.mutedSpeaker != null) {
        set(mutedSpeakerAtom, participant.mutedSpeaker);
      }
    }
  },
);

export const streamUpdaterAtom = atom(
  null,
  (get, set, participant: Pick<Participant, "peerId" | "stream">) => {
    set(
      participantsAtom,
      get(participantsAtom).map((part) => {
        if (part.peerId === participant.peerId) {
          return {
            ...part,
            stream: participant.stream,
          };
        } else {
          return part;
        }
      }),
    );
  },
);

export const peerAtom = atom<Peer | null>(null);
