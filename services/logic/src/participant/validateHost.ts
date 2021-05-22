import { LogicError } from "@coops/error";
import * as redis from "@coops/redis";
import { RedisClient } from "redis";

import { isParticipant } from "./isParticipant";

export const validateHost = async (
  client: RedisClient,
  roomId: string,
  participantId: string,
) => {
  if (!(await isHost(client, roomId, participantId))) {
    throw new LogicError(403);
  }
};
export const isHost = async (
  client: RedisClient,
  roomId: string,
  participantId: string,
) => {
  if (!(await isParticipant(client, roomId, participantId))) {
    return false;
  }
  const [isHost] = await redis.participant.CRUD.findParticipant(
    client,
    roomId,
    participantId,
    "isHost",
  );
  return isHost === "true";
};
