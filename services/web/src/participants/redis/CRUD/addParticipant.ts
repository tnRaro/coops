import { RedisClient } from "redis";

import { useParticipantKey } from "../keys";
import { Participant } from "../types";

export const addParticipant = (
  client: RedisClient,
  roomId: string,
  participantId: string,
  participant: Partial<Participant>,
) => {
  return new Promise<void>((resolve, reject) => {
    client.hmset(
      useParticipantKey(roomId, participantId),
      participant as any,
      (error, reply) => {
        if (error) {
          return reject(error);
        }
        resolve();
      },
    );
  });
};
