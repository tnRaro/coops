import * as redis from "@coops/redis";
import { RedisClient } from "redis";

import { createRoom } from "./createRoom";
import { removeRoom } from "./removeRoom";

export const resetRoom = async (client: RedisClient, beforeRoomId: string) => {
  const [title] = await redis.room.CRUD.findRoomById(
    client,
    beforeRoomId,
    "title",
  );
  await removeRoom(client, beforeRoomId);
  const roomId = await createRoom(client, title);
  return roomId;
};
