import { RedisClient } from "redis";
import * as redis from "@coops/redis";

export const appendChat = async (
  client: RedisClient,
  roomId: string,
  message: string,
  authorId: string,
) => {
  const chat = {
    message,
    authorId,
    createdAt: new Date(),
  } as redis.chat.types.Chat;
  await redis.chat.stream.appendChat(client, roomId, chat);
  await redis.chat.CURD.appendChat(client, roomId, chat);
};
