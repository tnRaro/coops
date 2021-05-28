import * as redis from "@coops/redis";
import { RedisClient } from "redis";

export const removeParticipantById = async (
  client: RedisClient,
  roomId: string,
  participantId: string,
) => {
  const [nickname] = await redis.participant.CRUD.findParticipant(
    client,
    roomId,
    participantId,
    "nickname",
  );
  await redis.participant.CRUD.removeParticipantId(
    client,
    roomId,
    participantId,
  );
  await redis.participant.CRUD.removeParticipant(client, roomId, participantId);
  await redis.participant.stream.deleteParticipant(client, roomId, nickname);
};
