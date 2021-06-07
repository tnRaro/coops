import { Box, Container, Heading, Text } from "@chakra-ui/layout";
import {
  Input,
  Button,
  Flex,
  Spacer,
  Center,
  useToast,
  UseToastOptions,
  toast,
} from "@chakra-ui/react";
import { useState, VoidFunctionComponent } from "react";
import { useRouter } from "next/router";
import { consts } from "@coops/core";

const errorToastOptions: UseToastOptions = {
  duration: 9000,
  isClosable: true,
  status: "error",
};

type PageProps = unknown;
const Page: VoidFunctionComponent<PageProps> = (props) => {
  const [title, setTitle] = useState("");
  const [roomId, setRoomId] = useState("");
  const router = useRouter();
  const toast = useToast();
  return (
    <Flex height="100%" justifyContent="center" alignItems="center">
      <Flex flexDirection="column" padding="14" layerStyle="card">
        <Text color="text.100" textStyle="heading1" marginBottom="14">
          저에게 집결하세요!
        </Text>
        <Input
          placeholder="초대 코드를 입력해주세요"
          _placeholder={{ color: "text.33" }}
          variant="unstyled"
          borderRadius="8px"
          backgroundColor="elevation.2"
          textStyle="label1"
          textColor="text.100"
          padding="4"
          paddingLeft="5"
          marginBottom="2.5"
          value={roomId}
          onChange={(event) => setRoomId(event.target.value)}
        />
        <Button
          backgroundColor="text.10"
          borderRadius="8px"
          width="100%"
          padding="7"
          color="text.66"
          textStyle="label1Bold"
          marginBottom="5"
          _hover={{ backgroundColor: "text.33" }}
          onClick={() => {
            router.push(`/rooms/${roomId}`, undefined, { shallow: true });
          }}
          isDisabled={roomId.length < 6}
        >
          방 참가하기
        </Button>
        <Flex display="flex" alignItems="center">
          <Box flex="1" height="1px" background="text.33" />
          <Box flex="0.5">
            <Center>
              <Text color="text.33" textStyle="label1">
                또는
              </Text>
            </Center>
          </Box>
          <Box flex="1" height="1px" background="text.33" />
        </Flex>
        <Input
          placeholder="방 제목을 입력해주세요"
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
          value={title}
          onChange={(event) => setTitle(event.target.value)}
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
            if (title.length > consts.room.title.length.max) {
              toast({
                ...errorToastOptions,
                description: "방 제목은 최대 10자 입니다",
              });
            } else if (title.length < consts.room.title.length.min) {
              toast({
                ...errorToastOptions,
                description: "방 제목은 최소 2자 이상입니다",
              });
            } else {
              return fetch(`/api/room/title/${title}`, { method: "POST" })
                .then(function (response) {
                  return response.json();
                })
                .then(function (myJson) {
                  const { roomId } = myJson;
                  router.push(`/rooms/${roomId}`, undefined, { shallow: true });
                });
            }
          }}
        >
          방 만들기
        </Button>
      </Flex>
    </Flex>
  );
};
export default Page;
