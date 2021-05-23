import { RedisClient } from "redis";

export const pub = (client: RedisClient, channel: string, value: string) => {
  return new Promise<number>((resolve, reject) => {
    client.publish(channel, value, (error, reply) => {
      if (error) {
        return reject(error);
      }
      resolve(reply);
    });
  });
};
