import * as redis from "@coops/redis";

import { fetchWrapper } from "../utils/fetchWrapper";

export const pushChat = (roomId: string, authorId: string, message: string) => {
  return fetchWrapper<void>({
    url: `/api/rooms/${roomId}/chat`,
    method: "POST",
    body: { message },
    authorId,
  });
};

export const getAllChats = (roomId: string, authorId: string) => {
  return fetchWrapper<redis.chat.types.Chat[]>({
    url: `/api/rooms/${roomId}/chat`,
    authorId,
  });
};
