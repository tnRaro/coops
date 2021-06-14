import { RedisClient } from "redis";
import { v4 as uuid } from "uuid";
import * as redis from "@coops/redis";

export const appendChat = async (
  client: RedisClient,
  roomId: string,
  message: string,
  authorId: string,
) => {
  const [nickname] = await redis.participant.CRUD.findParticipant(
    client,
    roomId,
    authorId,
    "nickname",
  );
  const id = uuid();
  const chat = {
    id,
    message,
    nickname,
    createdAt: new Date(),
  } as redis.chat.types.Chat;
  await redis.chat.stream.appendChat(client, roomId, chat);
  await redis.chat.CURD.appendChat(client, roomId, chat);
};
