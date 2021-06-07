import * as redis from "@coops/redis";
import { RedisClient } from "redis";

import { clearParticipants } from "../participant/clearParticipants";

import { createRoom } from "./createRoom";

export const removeRoom = async (client: RedisClient, roomId: string) => {
  await clearParticipants(client, roomId);
  await redis.chat.CURD.removeAllChats(client, roomId);
  await redis.room.CRUD.removeRoom(client, roomId);
  await redis.room.stream.removeRoom(client, roomId);
};
