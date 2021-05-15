import { RedisClient } from "redis";

import { findAllParticipantIds } from "../redis/CRUD/findAllParticipantIds";
import { findParticipant } from "../redis/CRUD/findParticipant";
import { Participant } from "../redis/types";

export const findAllParticipants = async (
  client: RedisClient,
  roomId: string,
) => {
  const participantIds = await findAllParticipantIds(client, roomId);
  const participants: Participant[] = [];
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
