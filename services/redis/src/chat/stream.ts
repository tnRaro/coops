/* eslint-disable react-hooks/rules-of-hooks */
import { RedisClient } from "redis";

import { pub } from "../pubsub";

import { useChatKey } from "./keys";
import { Chat } from "./types";

export const appendChat = async (
  client: RedisClient,
  roomId: string,
  chat: Chat,
) => {
  const message = JSON.stringify(chat);
  await pub(client, useChatKey(roomId), message);
};
