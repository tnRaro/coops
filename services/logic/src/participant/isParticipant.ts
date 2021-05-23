import { LogicError } from "@coops/error";
import * as redis from "@coops/redis";
import { RedisClient } from "redis";

export const isParticipant = async (
  client: RedisClient,
  roomId: string,
  participantId: string,
) => {
  if (!(await redis.room.CRUD.hasRoom(client, roomId))) {
    throw new LogicError(404);
  }
  return redis.participant.CRUD.hasParticipantId(client, roomId, participantId);
};
