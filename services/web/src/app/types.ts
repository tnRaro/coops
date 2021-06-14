import { Participant as RedisParticpant } from "@coops/redis/dist/participant/types";

export interface Participant extends Omit<RedisParticpant, "participantId"> {
  isLocalAudioMuted: boolean;
  stream: MediaStream | null;
}
