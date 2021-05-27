import * as redis from "@coops/redis";
import { RedisClient } from "redis";

import { clearParticipants } from "../participant/clearParticipants";

import { createRoom } from "./createRoom";

export const resetRoom = async (client: RedisClient, beforeRoomId: string) => {
  const [title] = await redis.room.CRUD.findRoomById(
    client,
    beforeRoomId,
    "title",
  );
  await clearParticipants(client, beforeRoomId);
  await redis.room.CRUD.removeRoom(client, beforeRoomId);
  await redis.room.stream.removeRoom(client, beforeRoomId);
  const roomId = await createRoom(client, title);
  return roomId;
};
