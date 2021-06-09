import { consts } from "@coops/core";
import { useRouter } from "next/router";
import React, {
  useEffect,
  useMemo,
  useState,
  VoidFunctionComponent,
} from "react";

import { Card } from "../app/components/core/Card";
import { Container } from "../app/components/core/Container";
import { Button } from "../app/components/primitives/Button";
import { Flex } from "../app/components/primitives/Flex";
import { Input } from "../app/components/primitives/Input";
import { Text } from "../app/components/primitives/Text";
import { FrontError } from "../app/errors";
import { useOops } from "../app/hooks/useOops";
import { useQuery } from "../app/hooks/useQuery";
import { useResetRoom } from "../app/hooks/useResetRoom";

type PageProps = unknown;
const Page: VoidFunctionComponent<PageProps> = (props) => {
  const [title, setTitle] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const router = useRouter();
  const setOops = useOops();
  const queries = useQuery();
  const resetRoom = useResetRoom();
  const linkReg = useMemo(
    () => new RegExp(`^${location.origin}/rooms/(.{6})$`),
    [],
  );
  useEffect(() => {
    resetRoom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const enterRoomHandler = () => {
    let code = "";
    const matchedLink = inviteCode.trim().match(linkReg);
    if (matchedLink == null) {
      code = inviteCode.trim().toUpperCase();
    } else {
      code = matchedLink[1];
    }
    router.push(`/rooms/${code}`, undefined, { shallow: true });
  };
  const createRoomHandler = async () => {
    if (title.length > consts.room.title.length.max) {
      setOops(
        new FrontError(
          `방 제목은 최대 ${consts.room.title.length.max}자입니다`,
        ),
      );
    } else if (title.length < consts.room.title.length.min) {
      setOops(
        new FrontError(
          `방 제목은 최소 ${consts.room.title.length.min}자 이상입니다`,
        ),
      );
    } else {
      try {
        const { roomId } = await queries.createRoom(title);
        router.push(`/rooms/${roomId}`, undefined, { shallow: true });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    }
  };
  return (
    <Container>
      <Card title="저에게 집결하세요!">
        <Input
          placeholder="초대 코드를 입력해주세요"
          minLength={6}
          value={inviteCode}
          onChange={(event) => setInviteCode(event.target.value)}
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              enterRoomHandler();
            }
          }}
        />
        <Button
          color="gray"
          onClick={enterRoomHandler}
          disabled={inviteCode.length < 6}
        >
          방 참가하기
        </Button>
        <Flex align="center" gap="10" css={{ padding: "$10" }}>
          <Flex
            css={{ flex: "1", height: "1px", backgroundColor: "$text33" }}
          />
          <Text color="text33" align="center" whiteSpace="nowrap">
            또는
          </Text>
          <Flex
            css={{ flex: "1", height: "1px", backgroundColor: "$text33" }}
          />
        </Flex>
        <Input
          placeholder="방 제목을 입력해주세요"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              createRoomHandler();
            }
          }}
        />
        <Button onClick={createRoomHandler}>방 만들기</Button>
      </Card>
    </Container>
  );
};
export default Page;
