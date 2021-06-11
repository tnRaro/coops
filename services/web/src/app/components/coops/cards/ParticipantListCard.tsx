import { Portal } from "@radix-ui/react-portal";
import { useAtomValue, useUpdateAtom } from "jotai/utils";
import React from "react";
import {
  RiCheckboxBlankLine,
  RiCheckboxFill,
  RiHeadphoneFill,
  RiIndeterminateCircleFill,
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
  participantUpdaterAtom,
  roomIdAtom,
} from "../../../atoms";
import { useQuery } from "../../../hooks/useQuery";
import { Participant } from "../../../types";
import { Button } from "../../primitives/Button";
import { Flex } from "../../primitives/Flex";
import { Heading4 } from "../../primitives/Heading";
import { Text } from "../../primitives/Text";
import * as DropdownMenu from "../DropdownMenu";
import { AudioControlButton, ToggleButton } from "../ToggleButton";

interface AudioProps {
  stream: MediaStream;
}
export const Audio: React.VFC<AudioProps> = (props) => {
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  React.useEffect(() => {
    if (audioRef.current == null) return;
    audioRef.current.srcObject = props.stream;
  }, [props.stream]);
  return (
    <audio ref={audioRef} autoPlay controls>
      <track kind="captions" />
    </audio>
  );
};

interface CheckboxItemProps {
  isChecked: boolean;
  onChange: (isChecked: boolean) => void | Promise<void>;
  value: string;
  color?: string;
}
const CheckboxItem: React.VFC<CheckboxItemProps> = (props) => {
  return (
    <DropdownMenu.Item
      color={props.color as any}
      onSelect={async () => {
        try {
          await props.onChange(props.isChecked);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error);
        }
      }}
    >
      <Text>{props.value}</Text>
      {props.isChecked ? <RiCheckboxFill /> : <RiCheckboxBlankLine />}
    </DropdownMenu.Item>
  );
};
const MemoizedCheckboxItem = React.memo(CheckboxItem);

interface ParticipantItemProps extends Participant {
  roomId: string;
  authorId: string;
  authorNickname: string;
  authorIsHost: boolean;
}
export const ParticipantItem: React.VFC<ParticipantItemProps> = (props) => {
  const queries = useQuery();
  const updateParticipant = useUpdateAtom(participantUpdaterAtom);
  const {
    roomId,
    authorId,
    authorNickname,
    authorIsHost,
    muteAudio,
    muteSpeaker,
    mutedAudio,
    mutedSpeaker,
    isLocalAudioMuted,
    nickname,
    stream,
  } = props;
  const isAuthor = authorNickname === nickname;
  const toggleAudio = React.useCallback(async () => {
    try {
      if (roomId == null) return;
      if (authorId == null) return;
      if (nickname == null) return;
      if (isAuthor) {
        if (muteAudio) {
          await queries.unmuteMicrophone(roomId, nickname, authorId);
        } else {
          await queries.muteMicrophone(roomId, nickname, authorId);
        }
      } else if (props.isLocalAudioMuted) {
        updateParticipant({
          nickname: props.nickname,
          isLocalAudioMuted: false,
        });
      } else {
        updateParticipant({
          nickname: props.nickname,
          isLocalAudioMuted: true,
        });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }, [
    roomId,
    authorId,
    nickname,
    isAuthor,
    props.isLocalAudioMuted,
    props.nickname,
    muteAudio,
    queries,
    updateParticipant,
  ]);
  const toggleSpeaker = React.useCallback(async () => {
    try {
      if (roomId == null) return;
      if (authorId == null) return;
      if (nickname == null) return;
      if (isAuthor) {
        if (muteSpeaker) {
          await queries.unmuteSpeaker(roomId, nickname, authorId);
        } else {
          await queries.muteSpeaker(roomId, nickname, authorId);
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }, [roomId, authorId, nickname, isAuthor, muteSpeaker, queries]);
  const toggleServerAudio = React.useCallback(async () => {
    try {
      if (mutedAudio) {
        await queries.unmuteMicrophone(roomId, nickname, authorId);
      } else {
        await queries.muteMicrophone(roomId, nickname, authorId);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }, [authorId, mutedAudio, nickname, queries, roomId]);
  const toggleServerSpeaker = React.useCallback(async () => {
    try {
      if (mutedSpeaker) {
        await queries.unmuteSpeaker(roomId, nickname, authorId);
      } else {
        await queries.muteSpeaker(roomId, nickname, authorId);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }, [authorId, mutedSpeaker, nickname, queries, roomId]);
  if (roomId == null) return null;
  if (authorId == null) return null;
  if (nickname == null) return null;
  return (
    <Flex
      gap="10"
      align="center"
      css={{
        color: "$text66",
        background: "var(---color)",
        boxShadow: "0 0 0 8px var(---color)",
        borderRadius: "1px",
      }}
      style={
        isAuthor
          ? ({
              "---color": "var(--colors-elevation2)",
            } as any)
          : undefined
      }
    >
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
        <AudioControlButton
          IdleStateIcon={RiMicFill}
          MutedIcon={RiMicOffFill}
          ServerMutedIcon={RiIndeterminateCircleFill}
          isServerMuted={mutedAudio}
          isSharingMuted={muteAudio}
          isLocalMuted={isLocalAudioMuted}
          onClick={toggleAudio}
        />
        <AudioControlButton
          IdleStateIcon={RiHeadphoneFill}
          MutedIcon={RiVolumeMuteFill}
          ServerMutedIcon={RiIndeterminateCircleFill}
          isServerMuted={mutedSpeaker}
          isSharingMuted={muteSpeaker}
          onClick={toggleSpeaker}
          isDisabled={!isAuthor}
        />
        <DropdownMenu.Root>
          <DropdownMenu.Trigger as={Button} size="square8" color="transparent">
            <RiSettings3Fill />
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Label>사용자 음량</DropdownMenu.Label>
            <DropdownMenu.Label>음량 조절 바</DropdownMenu.Label>
            <MemoizedCheckboxItem
              isChecked={false}
              value="마이크 음소거"
              onChange={toggleAudio}
            />
            {authorIsHost && !isAuthor && (
              <>
                <DropdownMenu.Separator />
                <MemoizedCheckboxItem
                  color="dangerous"
                  isChecked={mutedAudio}
                  value="서버 마이크 음소거"
                  onChange={toggleServerAudio}
                />
                <MemoizedCheckboxItem
                  color="dangerous"
                  isChecked={mutedSpeaker}
                  value="서버 헤드셋 음소거"
                  onChange={toggleServerSpeaker}
                />
                <DropdownMenu.Separator />
                <DropdownMenu.Item
                  color="dangerous"
                  onSelect={async () => {
                    try {
                      await queries.kickParticipant(roomId, nickname, authorId);
                    } catch (error) {
                      // eslint-disable-next-line no-console
                      console.error(error);
                    }
                  }}
                >
                  강제 퇴장
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  color="dangerous"
                  onSelect={async () => {
                    try {
                      await queries.entrustHost(roomId, nickname, authorId);
                    } catch (error) {
                      // eslint-disable-next-line no-console
                      console.error(error);
                    }
                  }}
                >
                  방 관리자 위임
                </DropdownMenu.Item>
              </>
            )}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Flex>
      {!isAuthor && stream != null ? <Audio stream={stream} /> : undefined}
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
      css={{
        background: "$elevation1",
        padding: "$10",
        borderRadius: "$8 $8 0 0",
      }}
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
  const participants = useAtomValue(participantsAtom);
  const roomId = useAtomValue(roomIdAtom);
  const authorId = useAtomValue(authorIdAtom);
  const authorNickname = useAtomValue(nicknameAtom);
  const authorIsHost = useAtomValue(isHostAtom);
  const filteredParticipants = React.useMemo(
    () =>
      participants
        .filter((participant) => !participant.isDisconnected)
        .sort((p0, p1) => {
          if (p0.isHost) return -1;
          if (p1.isHost) return 1;
          if (p0.nickname < p1.nickname) return -1;
          if (p0.nickname > p1.nickname) return 1;
          return 0;
        }),
    [participants],
  );
  if (roomId == null) return null;
  if (authorId == null) return null;
  if (authorNickname == null) return null;
  return (
    <>
      <Heading4>참여자</Heading4>
      <Flex direction="vertical" gap="10">
        {filteredParticipants.map((participant) => (
          <ParticipantItem
            key={participant.nickname}
            roomId={roomId}
            authorId={authorId}
            authorNickname={authorNickname}
            authorIsHost={authorIsHost}
            {...participant}
          />
        ))}
      </Flex>
      {/* <ParticipantControlPanel /> */}
    </>
  );
};
