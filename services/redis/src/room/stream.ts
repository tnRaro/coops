/* eslint-disable react-hooks/rules-of-hooks */
import { RedisClient } from "redis";

import { pub } from "../pubsub";

import { useRoomKey } from "./keys";
import { Room } from "./types";

export const setRoom = async (
  client: RedisClient,
  roomId: string,
  values: Partial<Room>,
) => {
  const message = JSON.stringify({ type: "update", body: values });
  await pub(client, useRoomKey(roomId), message);
};

export const removeRoom = async (client: RedisClient, roomId: string) => {
  await pub(client, useRoomKey(roomId), `{"type":"delete"}`);
};
