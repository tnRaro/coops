import redis from "@coops/redis";
import { useCallback, useEffect, useRef, useState } from "react";

interface ChatMessage {
  message: string;
  authorId: string;
  createdAt: Date;
}

type RoomMessage =
  | { type: "update"; body: Partial<redis.room.types.Room> }
  | { type: "delete" };

type Nickname = redis.participant.types.Participant["nickname"];
type ParticipantWithNickname = Partial<redis.participant.types.Participant> & {
  nickname: Nickname;
};

type ParticipantMessage =
  | { type: "create"; body: ParticipantWithNickname }
  | { type: "update"; body: ParticipantWithNickname }
  | { type: "delete"; body: Nickname }
  | { type: "delete_all" };

export const useStream = (roomId: string | null, authorId: string | null) => {
  const [tries, setTries] = useState(0);
  type ChatMessageHandler = (message: ChatMessage) => void;
  type RoomMessageHandler = (message: RoomMessage) => void;
  type ParticipantMessageHandler = (message: ParticipantMessage) => void;
  const chatMessageHandlerRef = useRef<ChatMessageHandler | null>(null);
  const roomMessageHandlerRef = useRef<RoomMessageHandler | null>(null);
  const participantMessageHandlerRef = useRef<ParticipantMessageHandler | null>(
    null,
  );

  interface Result {
    on(type: "chat", handler: ChatMessageHandler): void;
    on(type: "room", handler: RoomMessageHandler): void;
    on(type: "participant", handler: ParticipantMessageHandler): void;
  }
  const on = useCallback<Result["on"]>((type: any, handler: any) => {
    switch (type) {
      case "chat": {
        chatMessageHandlerRef.current = handler;
        break;
      }
      case "room": {
        roomMessageHandlerRef.current = handler;
        break;
      }
      case "participant": {
        participantMessageHandlerRef.current = handler;
        break;
      }
    }
  }, []);
  const result = useRef<Result>({ on });

  useEffect(() => {
    if (!roomId || !authorId) {
      return;
    }
    const url = `/sse/rooms/${roomId}/stream?key=${authorId}`;
    const eventSource = new EventSource(url, { withCredentials: true });
    const chatHandler = (event: Event) => {
      if (chatMessageHandlerRef.current == null) {
        return;
      }
      if (event instanceof MessageEvent) {
        const data = JSON.parse(event.data);
        chatMessageHandlerRef.current(data);
      }
    };
    const roomHandler = (event: Event) => {
      if (roomMessageHandlerRef.current == null) {
        return;
      }
      if (event instanceof MessageEvent) {
        const data = JSON.parse(event.data);
        roomMessageHandlerRef.current(data);
      }
    };
    const participantHandler = (event: Event) => {
      if (participantMessageHandlerRef.current == null) {
        return;
      }
      if (event instanceof MessageEvent) {
        const data = JSON.parse(event.data);
        participantMessageHandlerRef.current(data);
      }
    };
    const errorHandler = (error: Event) => {
      // eslint-disable-next-line no-console
      console.error(error);
      eventSource.close();
      setTries((tries) => tries + 1);
    };
    eventSource.addEventListener("chat", chatHandler);
    eventSource.addEventListener("room", roomHandler);
    eventSource.addEventListener("participant", participantHandler);
    eventSource.addEventListener("error", errorHandler);
    return () => {
      eventSource.removeEventListener("chat", chatHandler);
      eventSource.removeEventListener("room", roomHandler);
      eventSource.removeEventListener("participant", participantHandler);
      eventSource.removeEventListener("error", errorHandler);
    };
  }, [authorId, roomId, tries]);

  return result.current;
};
