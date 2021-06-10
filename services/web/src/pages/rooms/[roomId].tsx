import { useAtom } from "jotai";
import { useAtomValue, useResetAtom, useUpdateAtom } from "jotai/utils";
import { useRouter } from "next/router";
import React, { useEffect, VoidFunctionComponent } from "react";

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
  participantUpdaterAtom,
  peerIdAtom,
  roomDescriptionAtom,
  roomIdAtom,
  roomMaximumParticipantsAtom,
  roomTitleAtom,
} from "../../app/atoms";
import { LoginPhase } from "../../app/components/coops/LoginPhase";
import { RoomRhase } from "../../app/components/coops/RoomPhase";
import { useQuery } from "../../app/hooks/useQuery";
import { useResetRoom } from "../../app/hooks/useResetRoom";
import { ParticipantWithNickname, useStream } from "../../app/hooks/useStream";
import { Participant } from "../../app/types";
import { isRoomIdQuery } from "../../app/utils/queries";
import { useOops } from "../../app/hooks/useOops";
import { FrontError } from "../../app/errors";

const useRoomId = () => {
  const router = useRouter();
  const [_, setRoomId] = useAtom(roomIdAtom);
  useEffect(() => {
    if (!isRoomIdQuery(router.query)) {
      setRoomId(null);
      return;
    }
    const roomId = router.query.roomId;
    setRoomId(roomId);
  }, [router.query, setRoomId]);
};

const toLocalParticipant = (participant: ParticipantWithNickname) => {
  return {
    isDisconnected: participant.isDisconnected,
    isHost: participant.isHost,
    muteAudio: participant.muteAudio,
    muteSpeaker: participant.muteSpeaker,
    mutedAudio: participant.mutedAudio,
    mutedSpeaker: participant.mutedSpeaker,
    isLocalAudioMuted: false,
    nickname: participant.nickname,
    peerId: participant.peerId,
    stream: null,
  } as Participant;
};

const useRoomInfo = () => {
  const roomId = useAtomValue(roomIdAtom);
  const authorId = useAtomValue(authorIdAtom);
  const { getRoom } = useQuery();
  const setTitle = useUpdateAtom(roomTitleAtom);
  const setDescription = useUpdateAtom(roomDescriptionAtom);
  const setMaximumParticipants = useUpdateAtom(roomMaximumParticipantsAtom);
  const setParticipants = useUpdateAtom(participantsAtom);
  const setChats = useUpdateAtom(chatsAtom);

  useEffect(() => {
    if (roomId == null) {
      return;
    }
    setTimeout(async () => {
      try {
        const res = await getRoom(roomId, authorId);
        setTitle(res.title);
        setDescription(res.description);
        setMaximumParticipants(Number(res.maximumParticipants));
        setParticipants(res.participants.map(toLocalParticipant));
        setChats(res.chats.map((chat: any) => JSON.parse(chat)));
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    });
  }, [
    authorId,
    getRoom,
    roomId,
    setChats,
    setDescription,
    setMaximumParticipants,
    setParticipants,
    setTitle,
  ]);
};

const useRealtimeApi = () => {
  const stream = useStream();
  const setTitle = useUpdateAtom(roomTitleAtom);
  const setDescription = useUpdateAtom(roomDescriptionAtom);
  const setMaximumParticipants = useUpdateAtom(roomMaximumParticipantsAtom);
  const setParticipants = useUpdateAtom(participantsAtom);
  const setChats = useUpdateAtom(chatsAtom);
  const authorNickname = useAtomValue(nicknameAtom);
  const setPeerId = useUpdateAtom(peerIdAtom);
  const setIsHost = useUpdateAtom(isHostAtom);
  const setMuteAudio = useUpdateAtom(muteAudioAtom);
  const setMuteSpeaker = useUpdateAtom(muteSpeakerAtom);
  const setMutedAudio = useUpdateAtom(mutedAudioAtom);
  const setMutedSpeaker = useUpdateAtom(mutedSpeakerAtom);
  const resetParticipants = useResetAtom(participantsAtom);
  const resetRoom = useResetRoom();
  const resetAuthorId = useResetAtom(authorIdAtom);
  const resetNickname = useResetAtom(nicknameAtom);
  const resetPeerId = useResetAtom(peerIdAtom);
  const resetIsHost = useResetAtom(isHostAtom);
  const updateParticipant = useUpdateAtom(participantUpdaterAtom);
  const setOops = useOops();

  useEffect(() => {
    stream.on("chat", (chat) => {
      setChats((chats) => [
        ...chats,
        {
          id: chat.id,
          createdAt: chat.createdAt,
          message: chat.message,
          nickname: chat.nickname,
        },
      ]);
    });
    stream.on("room", (data) => {
      switch (data.type) {
        case "update": {
          if (data.body.title != null) {
            setTitle(data.body.title);
          }
          if (data.body.description != null) {
            setDescription(data.body.description);
          }
          if (data.body.maximumParticipants != null) {
            setMaximumParticipants(data.body.maximumParticipants);
          }
          break;
        }
        case "delete": {
          resetRoom();
          break;
        }
      }
    });
    stream.on("participant", (data) => {
      switch (data.type) {
        case "create": {
          const participant = data.body;
          setParticipants((participants) => [
            ...participants,
            toLocalParticipant(participant),
          ]);
          break;
        }
        case "update": {
          const participant = data.body;
          updateParticipant(participant);
          break;
        }
        case "delete": {
          const nickname = data.body;
          setParticipants((participants) =>
            participants.filter((part) => part.nickname !== nickname),
          );
          if (authorNickname === nickname) {
            setOops(
              new FrontError("강제 퇴장 되셨습니다", { pageError: true }),
            );
          }
          break;
        }
        case "delete_all": {
          resetParticipants();
          resetAuthorId();
          resetNickname();
          resetPeerId();
          resetIsHost();
          setOops(
            new FrontError("짜잔 방이 사라졌습니다", { pageError: true }),
          );
        }
      }
    });
  }, [
    authorNickname,
    resetAuthorId,
    resetIsHost,
    resetNickname,
    resetParticipants,
    resetPeerId,
    resetRoom,
    setChats,
    setDescription,
    setIsHost,
    setMaximumParticipants,
    setMuteAudio,
    setMuteSpeaker,
    setMutedAudio,
    setMutedSpeaker,
    setOops,
    setParticipants,
    setPeerId,
    setTitle,
    stream,
    updateParticipant,
  ]);
};

type PageProps = unknown;
const Page: VoidFunctionComponent<PageProps> = (props) => {
  useRoomId();
  useRoomInfo();
  useRealtimeApi();
  const roomId = useAtomValue(roomIdAtom);
  const authorId = useAtomValue(authorIdAtom);

  if (roomId == null) {
    return null;
  }

  if (authorId == null) {
    return <LoginPhase />;
  }
  return <RoomRhase />;
};
export default Page;
