import * as redis from "@coops/redis";
import { RedisClient } from "redis";

import { Chat } from "./types";

export const findAllChats = async (client: RedisClient, roomId: string) => {
  const chats = await redis.chat.findAllChats(client, roomId);

  return chats.map((raw) => JSON.parse(raw) as Chat);
};
