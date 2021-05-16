import { RedisClient } from "redis";
import { v4 as uuidv4 } from "uuid";

import { LogicError } from "../../app/errors/LogicError";
import { hasRoom } from "../../rooms/redis/CRUD";
import { addParticipant } from "../redis/CRUD/addParticipant";
import { addParticipantId } from "../redis/CRUD/addParticipantId";
import { numOfParticipantIds } from "../redis/CRUD/numOfParticipantIds";
import { Participant } from "../redis/types";

import { hasParticipant } from "./hasParticipant";

export const enterParticipant = async (
  client: RedisClient,
  roomId: string,
  nickname: string,
) => {
  if (!(await hasRoom(client, roomId))) {
    throw new LogicError(404);
  }
  const participantId = uuidv4();
  const peerId = uuidv4();
  if (await hasParticipant(client, roomId, nickname)) {
    throw new LogicError(409);
  }
  await addParticipantId(client, roomId, participantId);
  const numOfParticipants = await numOfParticipantIds(client, roomId);
  const participant: Participant = {
    participantId,
    nickname,
    peerId,
    isHost: numOfParticipants === 1,
    isDisconnected: false,
    muteAudio: false,
    muteSpeaker: false,
    mutedAudio: false,
    mutedSpeaker: false,
  };
  await addParticipant(client, roomId, participantId, participant);
  return participant;
};
