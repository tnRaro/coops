import { RedisClient } from "redis";

import { ModelError } from "../../app/errors/ModelError";
import { genInviteCode } from "../utils/inviteCodeGenerator";

// eslint-disable-next-line import/no-cycle
import { clearParticipantsFromRoom } from "./participants";

interface Room {
  roomId: string;
  title: string;
  description?: string;
  maximumParticipants?: string;
}
const useRoomKey = (roomId: string) => `rooms:${roomId}`;
export const addRoom = (client: RedisClient, roomId: string, values: Room) => {
  return new Promise<void>((resolve, reject) => {
    client.hmset(useRoomKey(roomId), values as any, (error) => {
      if (error) {
        return reject(error);
      }
      resolve();
    });
  });
};
export const hasRoom = (client: RedisClient, roomId: string) => {
  return new Promise<boolean>((resolve, reject) => {
    client.hexists(useRoomKey(roomId), "title", (error, reply) => {
      if (error) {
        return reject(error);
      }
      resolve(reply === 1);
    });
  });
};
export const getRoom = <TFields extends (keyof Room)[]>(
  client: RedisClient,
  roomId: string,
  ...fields: TFields
) => {
  type TResults = { [index in keyof TFields]: string };
  return new Promise<TResults>((resolve, reject) => {
    client.hmget(useRoomKey(roomId), fields, (error, reply) => {
      if (error) {
        return reject(error);
      }
      resolve(reply as TResults);
    });
  });
};
export const removeRoom = (client: RedisClient, roomId: string) => {
  return new Promise((resolve, reject) => {
    client.hdel(
      useRoomKey(roomId),
      ["title", "description", "maximumParticipants"],
      (error, reply) => {
        if (error) {
          return reject(error);
        }
        resolve(reply);
      },
    );
  });
};

// high-level API

export const createRoom = async (client: RedisClient, title: string) => {
  const roomId = genInviteCode();
  if (await hasRoom(client, roomId)) {
    throw new ModelError(409);
  }
  await addRoom(client, roomId, {
    roomId,
    title,
  });
  return roomId;
};

export const resetRoom = async (client: RedisClient, beforeRoomId: string) => {
  const [title] = await getRoom(client, beforeRoomId, "title");
  await clearParticipantsFromRoom(client, beforeRoomId);
  await removeRoom(client, beforeRoomId);
  const roomId = await createRoom(client, title);
  return roomId;
};
