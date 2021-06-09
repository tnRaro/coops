import { Chat } from "@coops/redis/dist/chat/types";
import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";

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
export const chatsAtom = atomWithReset<Chat[]>([]);

export const errorAtom = atomWithReset<Error | null>(null);
