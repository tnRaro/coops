import * as redis from "@coops/redis";
import { RedisClient } from "redis";

export const findParticipantByNickname = async (
  client: RedisClient,
  roomId: string,
  nickname: string,
) => {
  const participantIds = await redis.participant.CRUD.findAllParticipantIds(
    client,
    roomId,
  );
  for (const participantId of participantIds) {
    const [participantNickname] = await redis.participant.CRUD.findParticipant(
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
      ] = await redis.participant.CRUD.findParticipant(
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
      } as redis.participant.types.Participant;
    }
  }
  return null;
};
