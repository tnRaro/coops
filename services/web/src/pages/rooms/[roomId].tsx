import {
  Button,
  Heading,
  Input,
  Text,
  Flex,
  useToast,
  UseToastOptions,
  useClipboard,
  Stack,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { HttpError } from "@coops/error";
import * as redis from "@coops/redis";
import { useRouter } from "next/router";
import { useEffect, useState, VoidFunctionComponent, useRef } from "react";
import { consts } from "@coops/core";
import { useAtom } from "jotai";
import { IconName } from "react-icons/fi";

import { isRoomIdQuery } from "../../app/utils/queries";
import { roomIdAtom } from "../../app/atoms/roomIdAtom";
import { authorIdAtom } from "../../app/atoms/authorIdAtom";
import { errorToastOptions } from "../../app/utils/errorToastOptions";
import { ChatSender } from "../../app/components/ChatSender";
import {
  ChatMessage,
  ParticipantMessage,
  useStream,
} from "../../app/hooks/useStream";

const useRoomId = () => {
  const router = useRouter();
  const [_, setRoomId] = useAtom(roomIdAtom);
  useEffect(() => {
    if (!isRoomIdQuery(router.query)) {
      setRoomId(null);
      return;
    }
    const roomId = router.query.roomId;
    setRoomId(roomId);
  }, [router.query, setRoomId]);
};

const useRoomInfo = (roomId: string | null, authorId: string | null) => {
  const [title, setTitle] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [maximumParticipants, setMaximumParticipants] = useState<number | null>(
    null,
  );
  const [participants, setParticipants] = useState<
    redis.participant.types.Participant[]
  >([]);
  const [chats, setChats] = useState<redis.chat.types.Chat[]>([]);
  const [error, setError] = useState(false);
  const toast = useToast();

  useEffect(() => {
    let options: RequestInit | undefined;
    if (roomId == null) {
      return;
    }
    if (authorId != null) {
      options = { headers: { authorization: `X-API-KEY ${authorId}` } };
    }
    fetch(`/api/rooms/${roomId}`, options)
      .then(function (response) {
        return new Promise((resolve, reject) => {
          if (response.status >= 400) {
            reject(new HttpError(response.status as any));
          } else {
            resolve(response.json());
          }
        });
      })
      .then(function (myJson: any) {
        setTitle(myJson.title);
        setDescription(myJson.description);
        setMaximumParticipants(myJson.maximumParticipants);
        setParticipants(myJson.participants);
        setChats(myJson.chats.map((chat: any) => JSON.parse(chat)));
      })
      .catch(function (reason) {
        if (reason instanceof HttpError) {
          if (reason.code === 401) {
            toast({
              ...errorToastOptions,
              description: "요청한 방의 접속 권한이 없습니다",
            });
            setError(true);
          } else if (reason.code === 404) {
            toast({
              ...errorToastOptions,
              description: "요청한 방이 존재하지 않습니다",
            });
            setError(true);
          } else if (reason.code === 400) {
            toast({
              ...errorToastOptions,
              description: "잘못된 접근입니다",
            });
            setError(true);
          } else {
            // unhandled error
            console.error(reason);
            setError(true);
          }
        } else {
          // unhandled error
          console.error(reason);
          setError(true);
        }
      });
  }, [authorId, roomId, toast]);

  return {
    title,
    description,
    maximumParticipants,
    participants,
    chats,
    error,
  };
};

type PageProps = unknown;
const Page: VoidFunctionComponent<PageProps> = (props) => {
  useRoomId();
  const [roomId] = useAtom(roomIdAtom);
  const toast = useToast();
  const { hasCopied, onCopy } = useClipboard(roomId ?? "");
  const [authorId, setAuthorId] = useAtom(authorIdAtom);
  const [nameInput, setNameInput] = useState("");
  const { error, ...roomInfo } = useRoomInfo(roomId, authorId);
  const stream = useStream(roomId, authorId);
  const [chatLogs, setChatLogs] = useState<ChatMessage[]>([]);
  const [participantList, setParticipantList] = useState<any[]>([]);
  const router = useRouter();
  const scrollRef = useRef(null);
  const messageReceived = () => {
    scrollRef.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "end",
    });
  };

  useEffect(() => {
    setChatLogs(roomInfo.chats);
    setParticipantList(roomInfo.participants);
  }, [roomInfo.chats, roomInfo.participants]);

  useEffect(() => {
    const appendChat = (chat: ChatMessage) => {
      setChatLogs((chatLogs) => [...chatLogs, chat]);
      messageReceived();
    };
    const appendParticipant = (data: any) => {
      setParticipantList((participantList: any) => [...participantList, data]);
    };
    stream.on("chat", (data) => appendChat(data));
    stream.on("room", (data) => console.log(data));
    stream.on("participant", (data) => {
      switch (data.type) {
        case "create": {
          appendParticipant(data.body);
          break;
        }
        default: {
          throw new Error("Not Implemented");
        }
      }
    });
  }, [authorId, chatLogs, roomId, stream]);

  if (error) {
    return (
      <Flex
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        height="100%"
      >
        <Flex
          flexDirection="column"
          padding="14"
          layerStyle="card"
          alignItems="center"
        >
          <Text textStyle="heading1" marginBottom="3">
            ERROR!
          </Text>
          <Button
            backgroundColor="primary.10"
            borderRadius="8px"
            width="100%"
            padding="7"
            color="primary.100"
            textStyle="label1Bold"
            _hover={{ backgroundColor: "text.33" }}
            onClick={() => router.replace("/")}
          >
            뒤로가기
          </Button>
        </Flex>
      </Flex>
    );
  }

  if (roomId == null) {
    return null;
  }

  if (authorId == null) {
    return (
      <Flex
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        height="100%"
      >
        <Flex flex="3" />
        <Flex flex="1.7" flexDirection="column" padding="14" layerStyle="card">
          <Flex flex="3">
            <Text textStyle="heading1" marginBottom="7">
              {roomInfo.title}
            </Text>
          </Flex>
          <Flex flexDirection="column" flex="7">
            <Input
              placeholder="사용할 이름을 입력해주세요"
              _placeholder={{ color: "text.33" }}
              variant="unstyled"
              borderRadius="8px"
              backgroundColor="elevation.2"
              textStyle="label1"
              textColor="text.100"
              padding="4"
              paddingLeft="5"
              marginTop="5"
              marginBottom="2.5"
              value={nameInput}
              onChange={(event) => setNameInput(event.target.value)}
            />
            <Button
              backgroundColor="primary.10"
              borderRadius="8px"
              width="100%"
              padding="7"
              color="primary.100"
              textStyle="label1Bold"
              _hover={{ backgroundColor: "text.33" }}
              onClick={() => {
                if (nameInput.length > consts.participant.nickname.length.max) {
                  toast({
                    ...errorToastOptions,
                    description: "사용자 이름은 최대 12자 입니다",
                  });
                } else if (
                  nameInput.length < consts.participant.nickname.length.min
                ) {
                  toast({
                    ...errorToastOptions,
                    description: "사용자 이름은 최소 2자 이상이어야 합니다",
                  });
                } else {
                  fetch(`/api/rooms/${roomId}/participants/${nameInput}`, {
                    method: "POST",
                  })
                    .then(function (response) {
                      return new Promise((resolve, reject) => {
                        if (response.status >= 400) {
                          reject(new HttpError(response.status as any));
                        } else {
                          resolve(response.json());
                        }
                      });
                    })
                    .then(function (myJson: any) {
                      setAuthorId(myJson.participantId);
                    })
                    .catch(function (reason) {
                      if (reason instanceof HttpError) {
                        if (reason.code === 401) {
                          toast({
                            ...errorToastOptions,
                            description: "요청한 방의 접속 권한이 없습니다",
                          });
                        } else if (reason.code === 404) {
                          toast({
                            ...errorToastOptions,
                            description: "요청한 방이 존재하지 않습니다",
                          });
                        } else if (reason.code === 400) {
                          toast({
                            ...errorToastOptions,
                            description: "잘못된 접근입니다",
                          });
                        } else if (reason.code === 409) {
                          toast({
                            ...errorToastOptions,
                            description:
                              "동일한 이름의 사용자가 이미 존재합니다",
                          });
                        } else {
                          // unhandled error
                          console.error(reason);
                        }
                      }
                    });
                }
              }}
            >
              확인
            </Button>
          </Flex>
        </Flex>
        <Flex flex="3" />
      </Flex>
    );
  }
  return (
    <Flex flexDirection="column" height="100%">
      <Flex padding="5" flexDirection="column" height="100%">
        <Text margin="5" paddingLeft="5" color="text.100">
          COOPS LOGO HERE
        </Text>
        <Stack direction={["column", "row"]} height="90%">
          <VStack spacing="2" height="90%">
            <Flex padding="4" layerStyle="card" flexDirection="column">
              <Text>초대 코드</Text>
              <Flex marginTop="5" alignItems="center" flexDirection="row">
                <Input
                  variant="unstyled"
                  borderRadius="8px"
                  backgroundColor="elevation.2"
                  textStyle="label1"
                  textColor="text.100"
                  padding="4"
                  paddingLeft="5"
                  value={roomId}
                  readOnly
                />
                <Button
                  backgroundColor="primary.10"
                  borderRadius="8px"
                  padding="7"
                  marginLeft="5"
                  color="primary.100"
                  textStyle="label1Bold"
                  _hover={{ backgroundColor: "text.33" }}
                  onClick={onCopy}
                >
                  {hasCopied ? "완  료" : "복사하기"}
                </Button>
              </Flex>
            </Flex>
            <Flex
              padding="4"
              marginBottom="5"
              layerStyle="elevation1"
              flexDirection="column"
              width="100%"
            >
              <Text marginBottom="2.5">참여자</Text>
              <Flex flexDirection="column">
                {participantList.map((participant) => (
                  <Flex
                    marginBottom="0.5"
                    key={participant.participantId}
                    flexDirection="row"
                  >
                    <Flex flex="1">
                      <Text>{participant.nickname}</Text>
                    </Flex>
                    <Flex flexDirection="row" justifyContent="right">
                      <HStack spacing="4">
                        <Button
                          width="3px"
                          height="100%"
                          layerStyle="elevation2"
                          fontSize="12"
                          color="text.33"
                        >
                          FiMic
                        </Button>
                        <Button
                          width="3px"
                          height="100%"
                          layerStyle="elevation2"
                          fontSize="12"
                          color="text.33"
                          onClick={() => {
                            if (participant.mutedSpeaker) {
                              participant.mutedSpeaker = false;
                              console.log(participant.mutedSpeaker);
                            } else if (!participant.mutedSpeaker) {
                              participant.mutedSpeaker = true;
                            }
                          }}
                        >
                          S P K
                        </Button>
                      </HStack>
                    </Flex>
                  </Flex>
                ))}
              </Flex>
            </Flex>
            <Flex padding="4" layerStyle="elevation1" width="100%">
              설정
            </Flex>
          </VStack>
          <VStack spacing="2" width="100%" height="90%">
            <Flex
              flex="2"
              padding="4"
              layerStyle="card"
              height="100%"
              width="100%"
            >
              <Text>{roomInfo.title}</Text>
            </Flex>
            <Flex
              flex="8"
              padding="4"
              layerStyle="elevation1"
              flexDirection="column"
              width="100%"
              maxHeight="90%"
            >
              <Flex height="90%" overflowY="auto" flexDirection="column">
                {chatLogs.map((chat, i) => (
                  <HStack key={i} spacing="4">
                    <Text>{chat.nickname}</Text>
                    <Text color="text.66" ref={scrollRef}>
                      {chat.message}
                    </Text>
                  </HStack>
                ))}
              </Flex>
              <ChatSender />
            </Flex>
          </VStack>
        </Stack>
      </Flex>
    </Flex>
  );
};
export default Page;
