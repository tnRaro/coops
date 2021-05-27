import { LogicError } from "@coops/error";
import * as redis from "@coops/redis";
import { hasParticipantId } from "@coops/redis/dist/participant/CRUD";
import { RedisClient } from "redis";

export const setParticipant = async (
  client: RedisClient,
  roomId: string,
  participantId: string,
  participant: Partial<redis.participant.types.Participant>,
) => {
  if (!(await redis.room.CRUD.hasRoom(client, roomId))) {
    throw new LogicError(404);
  }
  if (!(await hasParticipantId(client, roomId, participantId))) {
    throw new LogicError(404);
  }
  await redis.participant.CRUD.addParticipant(
    client,
    roomId,
    participantId,
    participant,
  );
  await redis.participant.stream.updateParticipant(client, roomId, {
    ...participant,
    participantId,
  });
  return participant;
};
