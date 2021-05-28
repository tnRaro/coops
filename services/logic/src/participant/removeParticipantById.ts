import * as redis from "@coops/redis";
import { RedisClient } from "redis";

export const removeParticipantById = async (
  client: RedisClient,
  roomId: string,
  participantId: string,
) => {
  await redis.participant.CRUD.removeParticipantId(
    client,
    roomId,
    participantId,
  );
  await redis.participant.CRUD.removeParticipant(client, roomId, participantId);
  await redis.participant.stream.deleteParticipant(
    client,
    roomId,
    participantId,
  );
};
