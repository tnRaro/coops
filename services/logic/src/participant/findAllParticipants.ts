import * as redis from "@coops/redis";
import { RedisClient } from "redis";

export const findAllParticipants = async (
  client: RedisClient,
  roomId: string,
) => {
  const participantIds = await redis.participant.CRUD.findAllParticipantIds(
    client,
    roomId,
  );
  const participants: redis.participant.types.Participant[] = [];
  for (const participantId of participantIds) {
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
    participants.push({
      participantId,
      nickname,
      peerId,
      isHost: isHost === "true",
      isDisconnected: isDisconnected === "true",
      muteAudio: muteAudio === "true",
      muteSpeaker: muteSpeaker === "true",
      mutedAudio: mutedAudio === "true",
      mutedSpeaker: mutedSpeaker === "true",
    });
  }
  return participants;
};
