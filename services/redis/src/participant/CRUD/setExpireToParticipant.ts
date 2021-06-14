import { RedisClient } from "redis";

import { useParticipantIdKey, useParticipantKey } from "../keys";

export const setExpireToParticipant = (
  client: RedisClient,
  roomId: string,
  participantId: string,
  expire = 86400,
) => {
  return Promise.all([
    new Promise<void>((resolve, reject) => {
      client.expire(
        useParticipantKey(roomId, participantId),
        expire,
        (error, reply) => {
          if (error) {
            return reject(error);
          }
          resolve();
        },
      );
    }),
    new Promise<void>((resolve, reject) => {
      client.expire(useParticipantIdKey(roomId), expire, (error, reply) => {
        if (error) {
          return reject(error);
        }
        resolve();
      });
    }),
  ]).then(() => {});
};
