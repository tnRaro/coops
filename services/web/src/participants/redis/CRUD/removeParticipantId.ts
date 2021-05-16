import { RedisClient } from "redis";

import { LogicError } from "../../../app/errors/LogicError";
import { useParticipantIdKey } from "../keys";

export const removeParticipantId = (
  client: RedisClient,
  roomId: string,
  participantId: string,
) => {
  return new Promise<void>((resolve, reject) => {
    client.srem(useParticipantIdKey(roomId), participantId, (error, reply) => {
      if (error) {
        return reject(error);
      }
      if (reply === 0) {
        return reject(new LogicError(404));
      }
      resolve();
    });
  });
};
