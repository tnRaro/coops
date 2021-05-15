export const useParticipantIdKey = (roomId: string) =>
  `rooms:${roomId}:participants`;

export const useParticipantKey = (roomId: string, participantId: string) =>
  `rooms:${roomId}:participants:${participantId}`;
