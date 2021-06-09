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

interface ChatListProps {}
export const ChatList: React.VFC<ChatListProps> = () => {
  const chats = useAtomValue(chatsAtom);
  const myNickname = useAtomValue(nicknameAtom);
  const latestChatRef = useRef<HTMLDivElement | null>(null);
  const participants = useAtomValue(participantsAtom);
  const participantMap = useMemo(
    () =>
      new Map(
        participants.map((participant) => [participant.nickname, participant]),
      ),
    [participants],
  );
  useEffect(() => {
    latestChatRef.current?.scrollIntoView({
      block: "end",
    });
  }, [chats.length]);
  return (
    <Scroll direction="vertical" gap="10" y>
      {chats.slice(-100).map((chat) => {
        const isMe = chat.nickname === myNickname;
        const isHost = participantMap.get(chat.nickname)?.isHost;
        return (
          // eslint-disable-next-line @shopify/jsx-no-hardcoded-content
          <Text ref={latestChatRef} key={chat.id}>
            {isHost ? <RiVipCrownFill /> : <RiUserFill />}
            <Text as="span" color={isMe ? "primary100" : "text100"}>
              {chat.nickname}
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
              {chat.message}
            </Text>
          </Text>
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
