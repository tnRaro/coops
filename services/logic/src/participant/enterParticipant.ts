import { consts } from "@coops/core";
import { LogicError } from "@coops/error";
import * as redis from "@coops/redis";
import { RedisClient } from "redis";
import { v4 as uuidv4 } from "uuid";

import { hasParticipant } from "./hasParticipant";

export const enterParticipant = async (
  client: RedisClient,
  roomId: string,
  nickname: string,
) => {
  if (
    nickname.length > consts.participant.nickname.length.max ||
    nickname.length < consts.participant.nickname.length.min
  ) {
    throw new LogicError(400);
  }
  if (!(await redis.room.CRUD.hasRoom(client, roomId))) {
    throw new LogicError(404);
  }
  const participantId = uuidv4();
  const peerId = uuidv4();
  if (await hasParticipant(client, roomId, nickname)) {
    throw new LogicError(409);
  }
  await redis.participant.CRUD.addParticipantId(client, roomId, participantId);
  const numOfParticipants = await redis.participant.CRUD.numOfParticipantIds(
    client,
    roomId,
  );
  const participant: redis.participant.types.Participant = {
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
  await redis.participant.CRUD.addParticipant(
    client,
    roomId,
    participantId,
    participant,
  );
  await redis.participant.stream.createParticipant(client, roomId, participant);
  return participant;
};
