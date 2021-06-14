import { consts } from "@coops/core";
import { LogicError } from "@coops/error";
import * as redis from "@coops/redis";
import { RedisClient } from "redis";

import { genInviteCode } from "./genInviteCode";

export const createRoom = async (client: RedisClient, title: string) => {
  if (
    title.length > consts.room.title.length.max ||
    title.length < consts.room.title.length.min
  ) {
    throw new LogicError(400);
  }
  const roomId = genInviteCode();
  if (await redis.room.CRUD.hasRoom(client, roomId)) {
    throw new LogicError(409);
  }
  await redis.room.CRUD.addRoom(client, roomId, {
    roomId,
    title,
  });
  await redis.room.CRUD.setExpireToRoom(client, roomId);
  await redis.chat.CURD.setExpireToChat(client, roomId);
  return roomId;
};
