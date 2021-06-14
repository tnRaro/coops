import { HttpError } from "@coops/error";
import { useAtom } from "jotai";
import { useUpdateAtom } from "jotai/utils";
import React, { useCallback, useState, VoidFunctionComponent } from "react";

import { authorIdAtom, errorAtom, roomIdAtom } from "../../atoms";
import { FrontError } from "../../errors";
import { pushChat } from "../../queries/chats";
import { Flex } from "../primitives/Flex";
import { Input } from "../primitives/Input";

const useChatSender = () => {
  const [roomId] = useAtom(roomIdAtom);
  const [authorId] = useAtom(authorIdAtom);
  const setError = useUpdateAtom(errorAtom);
  const chatSender = useCallback(
    async (message: string) => {
      if (roomId == null) {
        return;
      }
      if (authorId == null) {
        return;
      }
      try {
        await pushChat(roomId, authorId, message);
      } catch (error) {
        if (error instanceof HttpError) {
          if (error.code === 401) {
            setError(
              new FrontError("접속 권한이 없습니다", { withToast: true }),
            );
          } else if (error.code === 404) {
            setError(
              new FrontError("방이 존재하지 않습니다", { withToast: true }),
            );
          } else if (error.code === 400) {
            setError(new FrontError("잘못된 접근입니다", { withToast: true }));
          } else {
            setError(error);
          }
        } else {
          setError(error);
        }
      }
    },
    [authorId, roomId, setError],
  );

  return chatSender;
};

export const ChatSender: VoidFunctionComponent = () => {
  const sendChat = useChatSender();
  const [chat, setChat] = useState("");

  return (
    <Flex>
      <Input
        placeholder="메시지 보내기"
        value={chat}
        onChange={(event) => {
          setChat(event.target.value);
        }}
        onKeyPress={async (event) => {
          if (event.key === "Enter") {
            setChat("");
            await sendChat(chat);
          }
        }}
      />
    </Flex>
  );
};
