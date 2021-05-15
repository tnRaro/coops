import { RedisClient } from "redis";

import { useRoomKey } from "./keys";
import { Room } from "./types";

export const addRoom = (
  client: RedisClient,
  roomId: string,
  values: Partial<Room>,
) => {
  return new Promise<void>((resolve, reject) => {
    client.hmset(useRoomKey(roomId), values as any, (error) => {
      if (error) {
        return reject(error);
      }
      resolve();
    });
  });
};
export const hasRoom = (client: RedisClient, roomId: string) => {
  return new Promise<boolean>((resolve, reject) => {
    client.hexists(useRoomKey(roomId), "title", (error, reply) => {
      if (error) {
        return reject(error);
      }
      resolve(reply === 1);
    });
  });
};
export const findRoomById = <TFields extends (keyof Room)[]>(
  client: RedisClient,
  roomId: string,
  ...fields: TFields
) => {
  type TResults = { [index in keyof TFields]: string };
  return new Promise<TResults>((resolve, reject) => {
    client.hmget(useRoomKey(roomId), fields, (error, reply) => {
      if (error) {
        return reject(error);
      }
      resolve(reply as TResults);
    });
  });
};
export const removeRoom = (client: RedisClient, roomId: string) => {
  return new Promise((resolve, reject) => {
    client.hdel(
      useRoomKey(roomId),
      ["title", "description", "maximumParticipants"],
      (error, reply) => {
        if (error) {
          return reject(error);
        }
        resolve(reply);
      },
    );
  });
};
