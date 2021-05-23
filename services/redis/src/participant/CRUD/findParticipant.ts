import { RedisClient } from "redis";

import { useParticipantKey } from "../keys";
import { Participant } from "../types";

export const findParticipant = <TFields extends (keyof Participant)[]>(
  client: RedisClient,
  roomId: string,
  participantId: string,
  ...fields: TFields
) => {
  type TResults = { [index in keyof TFields]: string };
  return new Promise<TResults>((resolve, reject) => {
    client.hmget(
      useParticipantKey(roomId, participantId),
      fields,
      (error, reply) => {
        if (error) {
          return reject(error);
        }
        resolve(reply as TResults);
      },
    );
  });
};
