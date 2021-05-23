import { RedisClient } from "redis";
import * as redis from "@coops/redis";

import { Chat } from "./types";

export const appendChat = async (
  client: RedisClient,
  roomId: string,
  message: string,
  authorId: string,
) => {
  const chatKey = redis.chat.useChatKey(roomId);
  const data = JSON.stringify({
    message,
    authorId,
    createdAt: new Date(),
  } as Chat);
  await redis.pubsub.pub(client, chatKey, data);
  await redis.chat.appendChat(client, roomId, data);
};
