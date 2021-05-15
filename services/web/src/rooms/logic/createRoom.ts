import { RedisClient } from "redis";

import { LogicError } from "../../app/errors/LogicError";
import { addRoom, hasRoom } from "../redis/CRUD";

import { genInviteCode } from "./inviteCodeGenerator";

export const createRoom = async (client: RedisClient, title: string) => {
  const roomId = genInviteCode();
  if (await hasRoom(client, roomId)) {
    throw new LogicError(409);
  }
  await addRoom(client, roomId, {
    roomId,
    title,
  });
  return roomId;
};
