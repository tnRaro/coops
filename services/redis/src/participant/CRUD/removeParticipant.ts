import { RedisClient } from "redis";

import { useParticipantKey } from "../keys";

export const removeParticipant = (
  client: RedisClient,
  roomId: string,
  participantId: string,
) => {
  return new Promise<void>((resolve, reject) => {
    client.hdel(
      useParticipantKey(roomId, participantId),
      [
        "participantId",
        "nickname",
        "peerId",
        "isHost",
        "isDisconnected",
        "muteAudio",
        "muteSpeaker",
        "mutedAudio",
        "mutedSpeaker",
      ],
      (error, reply) => {
        if (error) {
          return reject(error);
        }
        resolve();
      },
    );
  });
};
