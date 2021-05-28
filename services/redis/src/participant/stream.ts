/* eslint-disable react-hooks/rules-of-hooks */
import { RedisClient } from "redis";

import { pub } from "../pubsub";

import { useParticipantIdKey } from "./keys";
import { Participant } from "./types";

type ParticipantWithParticipantId = Partial<Participant> & {
  participantId: Participant["participantId"];
};

export const createParticipant = async (
  client: RedisClient,
  roomId: string,
  participant: ParticipantWithParticipantId,
) => {
  const message = JSON.stringify({ type: "create", body: participant });
  await pub(client, useParticipantIdKey(roomId), message);
};
export const updateParticipant = async (
  client: RedisClient,
  roomId: string,
  participant: ParticipantWithParticipantId,
) => {
  const message = JSON.stringify({ type: "update", body: participant });
  await pub(client, useParticipantIdKey(roomId), message);
};
export const deleteParticipant = async (
  client: RedisClient,
  roomId: string,
  participantId: Participant["participantId"],
) => {
  const message = JSON.stringify({ type: "delete", body: participantId });
  await pub(client, useParticipantIdKey(roomId), message);
};
export const deleteAllParticipant = async (
  client: RedisClient,
  roomId: string,
) => {
  const message = JSON.stringify({ type: "delete_all" });
  await pub(client, useParticipantIdKey(roomId), message);
};
