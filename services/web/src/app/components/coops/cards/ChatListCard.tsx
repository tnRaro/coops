import { useAtom } from "jotai";
import { useAtomValue } from "jotai/utils";
import React, { useEffect, useRef, useState } from "react";
import { FiSend } from "react-icons/fi";

import { authorIdAtom, chatsAtom, roomIdAtom } from "../../../atoms";
import { useQuery } from "../../../hooks/useQuery";
import { Button } from "../../primitives/Button";
import { Flex } from "../../primitives/Flex";
import { Input } from "../../primitives/Input";
import { Text } from "../../primitives/Text";

interface ChatListProps {}
export const ChatList: React.VFC<ChatListProps> = () => {
  const chats = useAtomValue(chatsAtom);
  const latestChatRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    latestChatRef.current?.scrollIntoView({
      block: "end",
    });
  }, [chats.length]);
  return (
    <Flex
      direction="vertical"
      gap="10"
      css={{
        flex: "1 1 0",
        overflowY: "auto",
        $$scrollbarColor: "hsl(0deg 0% 0% / 20%)",
        $$scrollbarThumb: "$colors$text33",
        scrollbarWidth: "thin",
        scrollbarColor: "$$scrollbarThumb $$scrollbarColor",
        "&::-webkit-scrollbar": {
          background: "$$scrollbarColor",
          width: "8px",
          borderRadius: "$full",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "$$scrollbarThumb",
          borderRadius: "$full",
        },
      }}
    >
      {chats.map((chat) => (
        <Flex ref={latestChatRef} key={chat.id} gap="16">
          <Text>{chat.nickname}</Text>
          <Text color="text66">{chat.message}</Text>
        </Flex>
      ))}
    </Flex>
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
