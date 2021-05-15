import { RedisClient } from "redis";

import { findAllParticipantIds } from "../redis/CRUD/findAllParticipantIds";
import { findParticipant } from "../redis/CRUD/findParticipant";
import { Participant } from "../redis/types";

export const findParticipantByNickname = async (
  client: RedisClient,
  roomId: string,
  nickname: string,
) => {
  const participantIds = await findAllParticipantIds(client, roomId);
  for (const participantId of participantIds) {
    const [participantNickname] = await findParticipant(
      client,
      roomId,
      participantId,
      "nickname",
    );
    if (participantNickname === nickname) {
      const [
        nickname,
        peerId,
        isHost,
        isDisconnected,
        muteAudio,
        muteSpeaker,
        mutedAudio,
        mutedSpeaker,
      ] = await findParticipant(
        client,
        roomId,
        participantId,
        "nickname",
        "peerId",
        "isHost",
        "isDisconnected",
        "muteAudio",
        "muteSpeaker",
        "mutedAudio",
        "mutedSpeaker",
      );
      return {
        participantId,
        nickname,
        peerId,
        isHost: isHost === "true",
        isDisconnected: isDisconnected === "true",
        muteAudio: muteAudio === "true",
        muteSpeaker: muteSpeaker === "true",
        mutedAudio: mutedAudio === "true",
        mutedSpeaker: mutedSpeaker === "true",
      } as Participant;
    }
  }
  return null;
};
