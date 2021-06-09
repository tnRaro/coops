import { useResetAtom } from "jotai/utils";

import {
  authorIdAtom,
  chatsAtom,
  isHostAtom,
  muteAudioAtom,
  mutedAudioAtom,
  mutedSpeakerAtom,
  muteSpeakerAtom,
  nicknameAtom,
  participantsAtom,
  peerIdAtom,
  roomDescriptionAtom,
  roomIdAtom,
  roomMaximumParticipantsAtom,
  roomTitleAtom,
} from "../atoms";

export const useResetRoom = () => {
  const resetRoomId = useResetAtom(roomIdAtom);
  const resetRoomTitle = useResetAtom(roomTitleAtom);
  const resetRoomDescription = useResetAtom(roomDescriptionAtom);
  const resetRoomMaximumParticipants = useResetAtom(
    roomMaximumParticipantsAtom,
  );
  const resetParticipants = useResetAtom(participantsAtom);
  const resetChats = useResetAtom(chatsAtom);
  const resetAuthorId = useResetAtom(authorIdAtom);
  const resetNickname = useResetAtom(nicknameAtom);
  const resetPeerId = useResetAtom(peerIdAtom);
  const resetIsHost = useResetAtom(isHostAtom);
  const resetMuteAudio = useResetAtom(muteAudioAtom);
  const resetMuteSpeaker = useResetAtom(muteSpeakerAtom);
  const resetMutedAudio = useResetAtom(mutedAudioAtom);
  const resetMutedSpeaker = useResetAtom(mutedSpeakerAtom);

  const reset = () => {
    resetRoomId();
    resetRoomTitle();
    resetRoomDescription();
    resetRoomMaximumParticipants();
    resetParticipants();
    resetChats();
    resetAuthorId();
    resetNickname();
    resetPeerId();
    resetIsHost();
    resetMuteAudio();
    resetMuteSpeaker();
    resetMutedAudio();
    resetMutedSpeaker();
  };

  return reset;
};
