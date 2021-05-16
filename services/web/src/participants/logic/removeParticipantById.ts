import { RedisClient } from "redis";

import { removeParticipant } from "../redis/CRUD/removeParticipant";
import { removeParticipantId } from "../redis/CRUD/removeParticipantId";

export const removeParticipantById = async (
  client: RedisClient,
  roomId: string,
  participantId: string,
) => {
  await removeParticipantId(client, roomId, participantId);
  await removeParticipant(client, roomId, participantId);
};
