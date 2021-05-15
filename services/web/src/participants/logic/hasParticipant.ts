import { RedisClient } from "redis";

import { findAllParticipantIds } from "../redis/CRUD/findAllParticipantIds";
import { findParticipant } from "../redis/CRUD/findParticipant";

export const hasParticipant = async (
  client: RedisClient,
  roomId: string,
  nickname: string,
) => {
  const participantIds = await findAllParticipantIds(client, roomId);
  for (const participantId of participantIds) {
    const [participantNickname] = await findParticipant(
      client,
      roomId,
      participantId,
      "nickname",
    );
    if (nickname === participantNickname) {
      return true;
    }
  }
  return false;
};
