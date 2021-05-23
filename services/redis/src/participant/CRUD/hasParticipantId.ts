import { RedisClient } from "redis";

import { useParticipantIdKey } from "../keys";

export const hasParticipantId = (
  client: RedisClient,
  roomId: string,
  participantId: string,
) => {
  return new Promise<boolean>((resolve, reject) => {
    client.sismember(
      useParticipantIdKey(roomId),
      participantId,
      (error, reply) => {
        if (error) {
          return reject(error);
        }
        resolve(reply === 1);
      },
    );
  });
};
