import { useAtom } from "jotai";
import { useAtomValue } from "jotai/utils";
import React, { useMemo } from "react";
import {
  RiHeadphoneFill,
  RiMicFill,
  RiMicOffFill,
  RiSettings3Fill,
  RiUserFill,
  RiVipCrownFill,
  RiVolumeMuteFill,
} from "react-icons/ri";

import {
  authorIdAtom,
  isHostAtom,
  muteAudioAtom,
  muteSpeakerAtom,
  nicknameAtom,
  participantsAtom,
  roomIdAtom,
} from "../../../atoms";
import { useQuery } from "../../../hooks/useQuery";
import { Participant } from "../../../types";
import { Button } from "../../primitives/Button";
import { Flex } from "../../primitives/Flex";
import { Heading4 } from "../../primitives/Heading";
import { Text } from "../../primitives/Text";
import { ToggleButton } from "../ToggleButton";

interface ParticipantItemProps extends Participant {}
export const ParticipantItem: React.VFC<ParticipantItemProps> = (props) => {
  const queries = useQuery();
  const roomId = useAtomValue(roomIdAtom);
  const authorId = useAtomValue(authorIdAtom);
  const myNickname = useAtomValue(nicknameAtom);
  const isHost = useAtomValue(isHostAtom);
  const { muteAudio, muteSpeaker, mutedAudio, mutedSpeaker, nickname } = props;
  if (roomId == null) return null;
  if (authorId == null) return null;
  if (nickname == null) return null;
  const isMicMuted = muteAudio || mutedAudio;
  const isSpeakerMuted = muteSpeaker || mutedSpeaker;
  const isControllable = isHost || myNickname === nickname;
  const isHostMode = isHost && myNickname !== nickname;
  return (
    <Flex gap="10" align="center" css={{ color: "$text66" }}>
      {props.isHost ? <RiVipCrownFill /> : <RiUserFill />}
      <Text
        css={{
          flex: "1 0 0",
          textOverflow: "ellipsis",
          width: 0,
          overflowX: "hidden",
        }}
        whiteSpace="nowrap"
      >
        {props.nickname}
      </Text>
      <Flex gap="10">
        <ToggleButton
          On={RiMicFill}
          Off={RiMicOffFill}
          pressed={!isMicMuted}
          isDanger={mutedAudio}
          disabled={!isControllable}
          onPressedChange={async () => {
            try {
              if (isHostMode ? mutedAudio : muteAudio) {
                await queries.unmuteMicrophone(roomId, nickname, authorId);
              } else {
                await queries.muteMicrophone(roomId, nickname, authorId);
              }
            } catch (error) {
              // eslint-disable-next-line no-console
              console.error(error);
            }
          }}
        />
        <ToggleButton
          On={RiHeadphoneFill}
          Off={RiVolumeMuteFill}
          pressed={!isSpeakerMuted}
          isDanger={mutedSpeaker}
          disabled={!isControllable}
          onPressedChange={async () => {
            try {
              if (isHostMode ? mutedSpeaker : muteSpeaker) {
                await queries.unmuteSpeaker(roomId, nickname, authorId);
              } else {
                await queries.muteSpeaker(roomId, nickname, authorId);
              }
            } catch (error) {
              // eslint-disable-next-line no-console
              console.error(error);
            }
          }}
        />
        <Button size="square8" color="transparent" disabled>
          <RiSettings3Fill />
        </Button>
      </Flex>
    </Flex>
  );
};

interface ParticipantControlPanelProps {}
export const ParticipantControlPanel: React.VFC<ParticipantControlPanelProps> = (
  props,
) => {
  const queries = useQuery();
  const roomId = useAtomValue(roomIdAtom);
  const authorId = useAtomValue(authorIdAtom);
  const nickname = useAtomValue(nicknameAtom);
  const isHost = useAtomValue(isHostAtom);
  const muteAudio = useAtomValue(muteAudioAtom);
  const muteSpeaker = useAtomValue(muteSpeakerAtom);
  if (roomId == null) return null;
  if (authorId == null) return null;
  if (nickname == null) return null;
  return (
    <Flex
      gap="10"
      align="center"
      css={{ background: "$elevation0", padding: "$10", borderRadius: "$8" }}
    >
      {isHost ? <RiVipCrownFill /> : <RiUserFill />}
      <Text
        css={{
          flex: "1 0 0",
          textOverflow: "ellipsis",
          width: 0,
          overflowX: "hidden",
        }}
        whiteSpace="nowrap"
      >
        {nickname}
      </Text>
      <Flex gap="10">
        <ToggleButton
          On={RiMicFill}
          Off={RiMicOffFill}
          pressed={!muteAudio}
          onPressedChange={async () => {
            try {
              if (muteAudio) {
                await queries.unmuteMicrophone(roomId, nickname, authorId);
              } else {
                await queries.muteMicrophone(roomId, nickname, authorId);
              }
            } catch (error) {
              // eslint-disable-next-line no-console
              console.error(error);
            }
          }}
        />
        <ToggleButton
          On={RiHeadphoneFill}
          Off={RiVolumeMuteFill}
          pressed={!muteSpeaker}
          onPressedChange={async () => {
            try {
              if (muteSpeaker) {
                await queries.unmuteSpeaker(roomId, nickname, authorId);
              } else {
                await queries.muteSpeaker(roomId, nickname, authorId);
              }
            } catch (error) {
              // eslint-disable-next-line no-console
              console.error(error);
            }
          }}
        />
      </Flex>
    </Flex>
  );
};

interface ParticipantListCardProps {}
export const ParticipantListCard: React.VFC<ParticipantListCardProps> = () => {
  const [participants] = useAtom(participantsAtom);
  const filteredParticipants = useMemo(
    () =>
      participants
        .sort((p0, p1) => {
          if (p0.isHost) return -1;
          if (p1.isHost) return 1;
          if (p0.nickname < p1.nickname) return -1;
          if (p0.nickname > p1.nickname) return 1;
          return 0;
        })
        .filter((participant) => !participant.isDisconnected),
    [participants],
  );
  return (
    <>
      <Heading4>참여자</Heading4>
      <Flex direction="vertical" gap="10">
        {filteredParticipants.map((participant) => (
          <ParticipantItem key={participant.nickname} {...participant} />
        ))}
      </Flex>
      <ParticipantControlPanel />
    </>
  );
};
