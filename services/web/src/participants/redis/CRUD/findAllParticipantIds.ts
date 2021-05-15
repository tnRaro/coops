import { RedisClient } from "redis";

import { useParticipantIdKey } from "../keys";

export const findAllParticipantIds = (client: RedisClient, roomId: string) => {
  return new Promise<string[]>((resolve, reject) => {
    client.smembers(useParticipantIdKey(roomId), (error, reply) => {
      if (error) {
        return reject(error);
      }
      resolve(reply);
    });
  });
};
