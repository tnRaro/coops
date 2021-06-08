import { consts } from "@coops/core";
import { useRouter } from "next/router";
import React, { useEffect, useState, VoidFunctionComponent } from "react";

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
  const [roomId, setRoomId] = useState("");
  const router = useRouter();
  const setOops = useOops();
  const queryies = useQuery();
  const resetRoom = useResetRoom();
  useEffect(() => {
    resetRoom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Container>
      <Card title="저에게 집결하세요!">
        <Input
          placeholder="초대 코드를 입력해주세요"
          value={roomId}
          onChange={(event) => setRoomId(event.target.value)}
        />
        <Button
          color="gray"
          onClick={() => {
            router.push(`/rooms/${roomId}`, undefined, { shallow: true });
          }}
          disabled={roomId.length < 6}
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
        />
        <Button
          onClick={async () => {
            if (title.length > consts.room.title.length.max) {
              setOops(new FrontError("방 제목은 최대 10자 입니다"));
            } else if (title.length < consts.room.title.length.min) {
              setOops(new FrontError("방 제목은 최소 2자 이상입니다"));
            } else {
              try {
                const { roomId } = await queryies.createRoom(title);
                router.push(`/rooms/${roomId}`, undefined, { shallow: true });
              } catch (error) {
                // eslint-disable-next-line no-console
                console.error(error);
              }
            }
          }}
        >
          방 만들기
        </Button>
      </Card>
    </Container>
  );
};
export default Page;
