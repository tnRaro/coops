import util from "util";

import { RedisClient } from "redis";

import { useChatKey } from "./keys";
import { Chat } from "./types";

export const appendChat = async (
  client: RedisClient,
  roomId: string,
  chat: Chat,
) => {
  const message = JSON.stringify(chat);
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

export const removeAllChats = async (client: RedisClient, roomId: string) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const chatKey = useChatKey(roomId);
  return new Promise<void>((resolve, reject) => {
    client.llen(chatKey, (error, reply) => {
      if (error) {
        reject(error);
      } else {
        const lpop = util.promisify(client.lpop).bind(client);
        Promise.all(Array.from({ length: reply }, () => lpop(chatKey)))
          .then(() => resolve())
          .catch((error) => reject(error));
      }
    });
  });
};

export const setExpireToChat = (
  client: RedisClient,
  roomId: string,
  expire = 86400,
) => {
  return new Promise<void>((resolve, reject) => {
    client.expire(useChatKey(roomId), expire, (error, reply) => {
      if (error) {
        return reject(error);
      }
      resolve();
    });
  });
};
