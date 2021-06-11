import { consts } from "@coops/core";
import { useAtom } from "jotai";
import { useAtomValue, useUpdateAtom } from "jotai/utils";
import React from "react";

import {
  authorIdAtom,
  isHostAtom,
  nicknameAtom,
  peerIdAtom,
  roomDescriptionAtom,
  roomIdAtom,
  roomTitleAtom,
} from "../../atoms";
import { FrontError } from "../../errors";
import { useOops } from "../../hooks/useOops";
import { useQuery } from "../../hooks/useQuery";
import { Card } from "../core/Card";
import { Container } from "../core/Container";
import { Button } from "../primitives/Button";
import { Flex } from "../primitives/Flex";
import { Input } from "../primitives/Input";
import { Text } from "../primitives/Text";

interface LoginPhaseProps {}
export const LoginPhase: React.VFC<LoginPhaseProps> = () => {
  const [roomId] = useAtom(roomIdAtom);
  const [title] = useAtom(roomTitleAtom);
  const description = useAtomValue(roomDescriptionAtom);
  const setAuthorId = useUpdateAtom(authorIdAtom);
  const setGlobalNickname = useUpdateAtom(nicknameAtom);
  const setPeerId = useUpdateAtom(peerIdAtom);
  const setIsHost = useUpdateAtom(isHostAtom);
  const [nickname, setNickname] = React.useState("");
  const setOops = useOops();
  const queries = useQuery();
  if (roomId == null) return null;
  const setNicknameHandler = async () => {
    if (nickname.length > consts.participant.nickname.length.max) {
      setOops(
        new FrontError(
          `참여자 이름은 최대 ${consts.participant.nickname.length.max}자입니다`,
        ),
      );
    } else if (nickname.length < consts.participant.nickname.length.min) {
      setOops(
        new FrontError(
          `참여자 이름은 최소 ${consts.participant.nickname.length.min}자 이상이어야 합니다`,
        ),
      );
    } else {
      try {
        const participant = await queries.createParticipant(roomId, nickname);
        setAuthorId(participant.participantId);
        setGlobalNickname(participant.nickname);
        setPeerId(participant.peerId);
        setIsHost(participant.isHost);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    }
  };
  return (
    <Container>
      <Card title={title}>
        <Text>{description}</Text>
        <Flex direction="vertical" gap="10">
          <Input
            placeholder="사용할 이름을 입력해주세요"
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                setNicknameHandler();
              }
            }}
          />
          <Button onClick={setNicknameHandler}>확인</Button>
        </Flex>
      </Card>
    </Container>
  );
};
