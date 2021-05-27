import * as redis from "@coops/redis";
import { RedisClient } from "redis";

export const findAllChats = async (client: RedisClient, roomId: string) => {
  const chats = await redis.chat.CURD.findAllChats(client, roomId);
  return chats.map((raw) => JSON.parse(raw) as redis.chat.types.Chat);
};
