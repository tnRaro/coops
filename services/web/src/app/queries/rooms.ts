import type * as redis from "@coops/redis";

import { fetchWrapper } from "../utils/fetchWrapper";

export const createRoom = (title: string) => {
  return fetchWrapper<{ roomId: string }>({
    url: `/api/room/title/${title}`,
    method: "POST",
  });
};
export const getRoom = (roomId: string, authorId?: string | null) => {
  return fetchWrapper<{
    roomId: string;
    title: string;
    description: string;
    maximumParticipants: number;
    participants: Omit<redis.participant.types.Participant, "participantId">[];
    chats: string[];
  }>({
    url: `/api/rooms/${roomId}`,
    authorId: authorId ?? undefined,
  });
};
export const resetRoom = (roomId: string, authorId: string) => {
  return fetchWrapper<{ roomId: string }>({
    url: `/api/rooms/${roomId}`,
    authorId,
  });
};
export const clearRoom = (roomId: string, authorId: string) => {
  return fetchWrapper<{ roomId: string }>({
    url: `/api/rooms/${roomId}`,
    method: "DELETE",
    authorId,
  });
};
export const updateRoomSettings = (
  roomId: string,
  authorId: string,
  settings: Partial<redis.room.types.Room>,
) => {
  return fetchWrapper<void>({
    url: `/api/rooms/${roomId}/settings`,
    method: "PUT",
    authorId,
    body: settings,
  });
};
