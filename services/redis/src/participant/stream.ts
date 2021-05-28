/* eslint-disable react-hooks/rules-of-hooks */
import { RedisClient } from "redis";

import { pub } from "../pubsub";

import { useParticipantIdKey } from "./keys";
import { Participant } from "./types";

type ParticipantWithNickname = Partial<Participant> & {
  nickname: Participant["nickname"];
};
type SafeParticipantWithNickname = Omit<
  ParticipantWithNickname,
  "participantId"
>;

export const createParticipant = async (
  client: RedisClient,
  roomId: string,
  participant: SafeParticipantWithNickname,
) => {
  const message = JSON.stringify({
    type: "create",
    body: { ...participant, participantId: undefined },
  });
  await pub(client, useParticipantIdKey(roomId), message);
};
export const updateParticipant = async (
  client: RedisClient,
  roomId: string,
  participant: SafeParticipantWithNickname,
) => {
  const message = JSON.stringify({
    type: "update",
    body: { ...participant, participantId: undefined },
  });
  await pub(client, useParticipantIdKey(roomId), message);
};
export const deleteParticipant = async (
  client: RedisClient,
  roomId: string,
  nickname: Participant["nickname"],
) => {
  const message = JSON.stringify({ type: "delete", body: nickname });
  await pub(client, useParticipantIdKey(roomId), message);
};
export const deleteAllParticipant = async (
  client: RedisClient,
  roomId: string,
) => {
  const message = JSON.stringify({ type: "delete_all" });
  await pub(client, useParticipantIdKey(roomId), message);
};
