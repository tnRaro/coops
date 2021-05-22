import { RedisClient } from "redis";

import { useParticipantIdKey } from "../keys";

export const numOfParticipantIds = (client: RedisClient, roomId: string) => {
  return new Promise<number>((resolve, reject) => {
    client.scard(useParticipantIdKey(roomId), (error, reply) => {
      if (error) {
        reject(error);
      }
      resolve(reply);
    });
  });
};
