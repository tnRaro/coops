import { RedisClient } from "redis";

import { useChatKey } from "./keys";

export const appendChat = async (
  client: RedisClient,
  roomId: string,
  message: string,
) => {
  return new Promise<number>((resolve, reject) => {
    client.rpush(useChatKey(roomId), message, (error, reply) => {
      if (error) {
        reject(error);
      } else {
        resolve(reply);
      }
    });
  });
};

export const findAllChats = async (client: RedisClient, roomId: string) => {
  return new Promise<string[]>((resolve, reject) => {
    client.lrange(useChatKey(roomId), 0, -1, (error, reply) => {
      if (error) {
        reject(error);
      } else {
        resolve(reply);
      }
    });
  });
};
