import { LogicError } from "@coops/error";
import * as redis from "@coops/redis";
import { RedisClient } from "redis";

import { genInviteCode } from "./genInviteCode";

export const createRoom = async (client: RedisClient, title: string) => {
  const roomId = genInviteCode();
  if (await redis.room.CRUD.hasRoom(client, roomId)) {
    throw new LogicError(409);
  }
  await redis.room.CRUD.addRoom(client, roomId, {
    roomId,
    title,
  });
  return roomId;
};
