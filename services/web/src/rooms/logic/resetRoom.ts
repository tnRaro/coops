import { RedisClient } from "redis";

import { clearParticipants } from "../../participants/logic/clearParticipants";
import { findRoomById, removeRoom } from "../redis/CRUD";

import { createRoom } from "./createRoom";

export const resetRoom = async (client: RedisClient, beforeRoomId: string) => {
  const [title] = await findRoomById(client, beforeRoomId, "title");
  await clearParticipants(client, beforeRoomId);
  await removeRoom(client, beforeRoomId);
  const roomId = await createRoom(client, title);
  return roomId;
};
