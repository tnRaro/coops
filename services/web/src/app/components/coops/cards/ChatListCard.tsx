import { useAtom } from "jotai";
import { useAtomValue } from "jotai/utils";
import React, { useEffect, useRef, useState } from "react";
import { FiSend } from "react-icons/fi";

import {
  authorIdAtom,
  chatsAtom,
  nicknameAtom,
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
  useEffect(() => {
    latestChatRef.current?.scrollIntoView({
      block: "end",
    });
  }, [chats.length]);
  return (
    <Scroll direction="vertical" gap="10" y>
      {chats.map((chat) => {
        const isMe = chat.nickname === myNickname;
        return (
          <Flex ref={latestChatRef} key={chat.id} gap="16">
            <Text color={isMe ? "primary100" : "text100"}>{chat.nickname}</Text>
            <Text color={isMe ? "primary66" : "text66"}>{chat.message}</Text>
          </Flex>
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
        onKeyDown={async (event) => {
          if (event.key === "Enter") {
            await send(value);
          }
        }}
      />
      <Button
        color="gray"
        onClick={async () => {
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
