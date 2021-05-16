import { RedisClient } from "redis";

import { LogicError } from "../../app/errors/LogicError";
import { hasRoom } from "../../rooms/redis/CRUD";
import { hasParticipantId } from "../redis/CRUD/hasParticipantId";

export const isParticipant = async (
  client: RedisClient,
  roomId: string,
  participantId: string,
) => {
  if (!(await hasRoom(client, roomId))) {
    throw new LogicError(404);
  }
  return hasParticipantId(client, roomId, participantId);
};
