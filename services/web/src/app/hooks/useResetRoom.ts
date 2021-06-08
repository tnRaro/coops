import { useResetAtom } from "jotai/utils";

import {
  authorIdAtom,
  chatsAtom,
  isHostAtom,
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
  const resetNicknameAtom = useResetAtom(nicknameAtom);
  const resetPeerIdAtom = useResetAtom(peerIdAtom);
  const resetIsHostAtom = useResetAtom(isHostAtom);

  const reset = () => {
    resetRoomId();
    resetRoomTitle();
    resetRoomDescription();
    resetRoomMaximumParticipants();
    resetParticipants();
    resetChats();
    resetAuthorId();
    resetNicknameAtom();
    resetPeerIdAtom();
    resetIsHostAtom();
  };

  return reset;
};
