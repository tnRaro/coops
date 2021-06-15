import type * as redis from "@coops/redis";
import { useAtom } from "jotai";
import { useAtomValue } from "jotai/utils";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { FiSend } from "react-icons/fi";
import { RiUserFill, RiVipCrownFill } from "react-icons/ri";

import {
  authorIdAtom,
  chatsAtom,
  nicknameAtom,
  participantsAtom,
  roomIdAtom,
} from "../../../atoms";
import { useQuery } from "../../../hooks/useQuery";
import { Button } from "../../primitives/Button";
import { Flex } from "../../primitives/Flex";
import { Input } from "../../primitives/Input";
import { Scroll } from "../../primitives/Scroll";
import { Text } from "../../primitives/Text";

interface ChatItemProps extends redis.chat.types.Chat {
  isHost: boolean;
  isMe: boolean;
}
const ChatItem: React.VFC<ChatItemProps> = (props) => {
  const chatRef = useRef<HTMLDivElement | null>(null);
  const color = props.isMe ? "primary100" : "text100";
  const Icon = props.isHost ? RiVipCrownFill : RiUserFill;
  useEffect(() => {
    chatRef.current?.scrollIntoView({
      block: "end",
    });
  }, []);
  return (
    // eslint-disable-next-line @shopify/jsx-no-hardcoded-content
    <Text ref={chatRef}>
      <Icon />
      <Text
        as="span"
        color={color}
        css={{
          wordBreak: "break-all",
        }}
      >
        {props.nickname}
      </Text>
      {": "}
      <Text
        as="span"
        color="text66"
        css={{
          wordBreak: "break-all",
          "&:hover": {
            color: "$text100",
          },
        }}
      >
        {props.message}
      </Text>
    </Text>
  );
};
const MemoizedChatItem = React.memo(ChatItem);

interface ChatListProps {}
export const ChatList: React.VFC<ChatListProps> = () => {
  const chats = useAtomValue(chatsAtom);
  const participants = useAtomValue(participantsAtom);
  const authorNickname = useAtomValue(nicknameAtom);
  const participantMap = useMemo(
    () =>
      new Map(
        participants.map((participant) => [participant.nickname, participant]),
      ),
    [participants],
  );
  return (
    <Scroll direction="vertical" gap="10" y>
      {chats.slice(-100).map((chat) => {
        if (chat.nickname == null) {
          return <Text color="text66">{chat.message}</Text>;
        }
        const isMe = chat.nickname === authorNickname;
        const isHost = participantMap.get(chat.nickname)?.isHost ?? false;
        return (
          <MemoizedChatItem
            key={chat.id}
            isMe={isMe}
            isHost={isHost}
            id={chat.id}
            createdAt={chat.createdAt}
            message={chat.message}
            nickname={chat.nickname}
          />
        );
      })}
    </Scroll>
  );
};
interface ChatSenderProps {}
export const ChatSender: React.VFC<ChatSenderProps> = () => {
  const [roomId] = useAtom(roomIdAtom);
  const [authorId] = useAtom(authorIdAtom);
  const queries = useQuery();
  const [value, setValue] = useState("");
  if (roomId == null) return null;
  if (authorId == null) return null;
  const send = async (message: string) => {
    if (message.trim() === "") {
      return;
    }
    try {
      await queries.pushChat(roomId, authorId, message);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };
  return (
    <Flex gap="10">
      <Input
        css={{ flex: 1 }}
        placeholder="메시지 보내기"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyPress={async (event) => {
          if (event.key === "Enter") {
            setValue("");
            await send(value);
          }
        }}
      />
      <Button
        color="gray"
        onClick={async () => {
          setValue("");
          await send(value);
        }}
      >
        <FiSend />
      </Button>
    </Flex>
  );
};

interface ChatListCardProps {}
export const ChatListCard: React.VFC<ChatListCardProps> = () => {
  return (
    <>
      <ChatList />
      <ChatSender />
    </>
  );
};
