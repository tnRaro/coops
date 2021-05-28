import { LogicError } from "@coops/error";
import * as redis from "@coops/redis";
import { Room } from "@coops/redis/dist/room/types";
import { RedisClient } from "redis";

export const updateRoom = async (
  client: RedisClient,
  roomId: string,
  values: Partial<Room>,
) => {
  if (!(await redis.room.CRUD.hasRoom(client, roomId))) {
    throw new LogicError(404);
  }
  await redis.room.CRUD.addRoom(client, roomId, values);
  await redis.room.stream.setRoom(client, roomId, values);
  return roomId;
};
