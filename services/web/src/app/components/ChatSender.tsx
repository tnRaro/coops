import { useToast, Flex, Input } from "@chakra-ui/react";
import { HttpError } from "@coops/error";
import { chat } from "@coops/redis";
import { useAtom } from "jotai";
import { VoidFunctionComponent, useState, useCallback } from "react";

import { authorIdAtom } from "../atoms/authorIdAtom";
import { roomIdAtom } from "../atoms/roomIdAtom";
import { errorToastOptions } from "../utils/errorToastOptions";

const useChatSender = (roomId: string | null, authorId: string | null) => {
  const toast = useToast();
  const chatSender = useCallback(
    (message: string) => {
      if (roomId == null) {
        return;
      }
      if (authorId == null) {
        return;
      }
      return fetch(`/api/rooms/${roomId}/chat`, {
        method: "POST",
        headers: { authorization: `X-API-KEY ${authorId}` },
        body: JSON.stringify({ message }),
      })
        .then(function (response) {
          return new Promise<void>((resolve, reject) => {
            if (response.status >= 400) {
              reject(new HttpError(response.status as any));
            } else {
              resolve();
            }
          });
        })
        .catch(function (reason) {
          if (reason instanceof HttpError) {
            if (reason.code === 401) {
              toast({
                ...errorToastOptions,
                description: "접속 권한이 없습니다",
              });
            } else if (reason.code === 404) {
              toast({
                ...errorToastOptions,
                description: "방이 존재하지 않습니다",
              });
            } else if (reason.code === 400) {
              toast({
                ...errorToastOptions,
                description: "잘못된 접근입니다",
              });
            } else {
              // unhandled error
              console.error(reason);
            }
          }
        });
    },
    [authorId, roomId, toast],
  );

  return chatSender;
};

export const ChatSender: VoidFunctionComponent = () => {
  const [roomId] = useAtom(roomIdAtom);
  const [authorId] = useAtom(authorIdAtom);
  const [chat, setChat] = useState("");
  const chatSender = useChatSender(roomId, authorId);

  return (
    <Flex>
      <Input
        placeholder="메시지 보내기"
        _placeholder={{ color: "text.33" }}
        variant="unstyled"
        borderRadius="8px"
        backgroundColor="elevation.2"
        textStyle="label1"
        textColor="text.100"
        padding="4"
        paddingLeft="5"
        marginBottom="2.5"
        value={chat}
        onChange={(event) => {
          setChat(event.target.value);
        }}
        onKeyPress={(event) => {
          if (event.key === "Enter") {
            chatSender(chat)
              ?.then(() => {
                setChat("");
              })
              .catch(() => {});
          }
        }}
      />
    </Flex>
  );
};
