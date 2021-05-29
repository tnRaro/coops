import * as redis from "@coops/redis";

import { fetchWrapper } from "../utils/fetchWrapper";

export const createParticipant = (roomId: string, nickname: string) => {
  return fetchWrapper<redis.participant.types.Participant>({
    url: `/api/rooms/${roomId}/participants/${nickname}`,
    method: "POST",
  });
};
export const kickParticipant = (
  roomId: string,
  nickname: string,
  authorId: string,
) => {
  return fetchWrapper<void>({
    url: `/api/rooms/${roomId}/participants/${nickname}`,
    method: "DELETE",
    authorId,
  });
};
export const entrustHost = (
  roomId: string,
  nickname: string,
  authorId: string,
) => {
  return fetchWrapper<void>({
    url: `/api/rooms/${roomId}/host/${nickname}`,
    method: "PUT",
    authorId,
  });
};
export const unmuteMicrophone = (
  roomId: string,
  nickname: string,
  authorId: string,
) => {
  return fetchWrapper<void>({
    url: `/api/rooms/${roomId}/participants/${nickname}/microphone`,
    method: "PUT",
    authorId,
  });
};
export const muteMicrophone = (
  roomId: string,
  nickname: string,
  authorId: string,
) => {
  return fetchWrapper<void>({
    url: `/api/rooms/${roomId}/participants/${nickname}/microphone`,
    method: "DELETE",
    authorId,
  });
};
export const unmuteSpeaker = (
  roomId: string,
  nickname: string,
  authorId: string,
) => {
  return fetchWrapper<void>({
    url: `/api/rooms/${roomId}/participants/${nickname}/speaker`,
    method: "PUT",
    authorId,
  });
};
export const muteSpeaker = (
  roomId: string,
  nickname: string,
  authorId: string,
) => {
  return fetchWrapper<void>({
    url: `/api/rooms/${roomId}/participants/${nickname}/speaker`,
    method: "DELETE",
    authorId,
  });
};
