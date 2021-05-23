import { RedisClient } from "redis";

export const sub = (client: RedisClient, channel: string) => {
  return new Promise((resolve, reject) => {
    client.subscribe(channel, (error, reply) => {
      if (error == null) {
        resolve(reply);
      } else {
        reject(error);
      }
    });
  });
};
