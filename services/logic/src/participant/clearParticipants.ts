import * as redis from "@coops/redis";
import { RedisClient } from "redis";

import { removeParticipantById } from "./removeParticipantById";

export const clearParticipants = async (
  client: RedisClient,
  roomId: string,
) => {
  const participantIds = await redis.participant.CRUD.findAllParticipantIds(
    client,
    roomId,
  );
  const errors = [];
  for (const participantId of participantIds) {
    try {
      await removeParticipantById(client, roomId, participantId);
    } catch (error) {
      errors.push(error);
    }
  }
  if (errors.length > 0) {
    throw errors;
  }
};
