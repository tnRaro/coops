import { RedisClient } from "redis";
import { v4 as uuidv4 } from "uuid";

import { ModelError } from "../../app/errors/ModelError";

import { hasRoom } from "./rooms";

interface Participant {
  nickname: string;
  peerId: string;
  isHost: boolean;
  isDisconnected: boolean;
  muteAudio: boolean;
  muteSpeaker: boolean;
  mutedAudio: boolean;
  mutedSpeaker: boolean;
}
const useParticipantIdKey = (roomId: string) => `rooms:${roomId}:participants`;
export const addParticipantId = (
  client: RedisClient,
  roomId: string,
  participantId: string,
) => {
  return new Promise<void>((resolve, reject) => {
    client.sadd(useParticipantIdKey(roomId), participantId, (error, reply) => {
      if (error) {
        return reject(error);
      }
      if (reply === 0) {
        return reject(new ModelError(409));
      }
      resolve();
    });
  });
};
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
        return reject(new ModelError(404));
      }
      resolve();
    });
  });
};
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
export const numOfParticipantIds = (client: RedisClient, roomId: string) => {
  return new Promise((resolve, reject) => {
    client.scard(useParticipantIdKey(roomId), (error, reply) => {
      if (error) {
        reject(error);
      }
      resolve(reply);
    });
  });
};
// participant
const useParticipantKey = (roomId: string, participantId: string) =>
  `rooms:${roomId}:participants:${participantId}`;
export const addParticipant = (
  client: RedisClient,
  roomId: string,
  participantId: string,
  participant: Participant,
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
export const getParticipant = <TFields extends (keyof Participant)[]>(
  client: RedisClient,
  roomId: string,
  participantId: string,
  ...fields: TFields
) => {
  type TResults = { [index in keyof TFields]: string };
  return new Promise<TResults>((resolve, reject) => {
    client.hmget(
      useParticipantKey(roomId, participantId),
      fields.join(" "),
      (error, reply) => {
        if (error) {
          return reject(error);
        }
        resolve(reply as TResults);
      },
    );
  });
};

// high-level API

export const enterParticipantAtRoom = async (
  client: RedisClient,
  roomId: string,
  nickname: string,
) => {
  if (!hasRoom(client, roomId)) {
    throw new ModelError(404);
  }
  const participantId = uuidv4();
  const peerId = uuidv4();
  await addParticipantId(client, roomId, participantId);
  const numOfParticipants = await numOfParticipantIds(client, roomId);
  const participant: Participant = {
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
export const isHost = async (
  client: RedisClient,
  roomId: string,
  participantId: string,
) => {
  if (!(await isParticipant(client, roomId, participantId))) {
    throw new ModelError(401);
  }
  const [isHost] = await getParticipant(
    client,
    roomId,
    participantId,
    "isHost",
  );
  return isHost;
};
export const isParticipant = async (
  client: RedisClient,
  roomId: string,
  participantId: string,
) => {
  if (!(await hasRoom(client, roomId))) {
    throw new ModelError(404);
  }
  return hasParticipantId(client, roomId, participantId);
};
