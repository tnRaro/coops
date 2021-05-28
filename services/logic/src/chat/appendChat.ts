import { RedisClient } from "redis";
import * as redis from "@coops/redis";
import { findParticipant } from "@coops/redis/dist/participant/CRUD";

export const appendChat = async (
  client: RedisClient,
  roomId: string,
  message: string,
  authorId: string,
) => {
  const [nickname] = await findParticipant(
    client,
    roomId,
    authorId,
    "nickname",
  );

  const chat = {
    message,
    nickname,
    createdAt: new Date(),
  } as redis.chat.types.Chat;
  await redis.chat.stream.appendChat(client, roomId, chat);
  await redis.chat.CURD.appendChat(client, roomId, chat);
};
