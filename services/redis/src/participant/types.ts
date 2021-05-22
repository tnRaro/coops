export interface Participant {
  participantId: string;
  nickname: string;
  peerId: string;
  isHost: boolean;
  isDisconnected: boolean;
  muteAudio: boolean;
  muteSpeaker: boolean;
  mutedAudio: boolean;
  mutedSpeaker: boolean;
}
