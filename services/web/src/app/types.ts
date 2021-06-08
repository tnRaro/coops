import { Participant as RedisParticpant } from "@coops/redis/dist/participant/types";

export interface Participant extends Omit<RedisParticpant, "participantId"> {
  stream: MediaStream | null;
}
