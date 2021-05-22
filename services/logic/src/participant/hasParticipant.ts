import * as redis from "@coops/redis";
import { RedisClient } from "redis";

export const hasParticipant = async (
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
    if (nickname === participantNickname) {
      return true;
    }
  }
  return false;
};
