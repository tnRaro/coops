import { consts } from "@coops/core";
import { useAtom } from "jotai";
import { useUpdateAtom } from "jotai/utils";
import React from "react";

import {
  authorIdAtom,
  isHostAtom,
  nicknameAtom,
  peerIdAtom,
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

interface LoginPhaseProps {}
export const LoginPhase: React.VFC<LoginPhaseProps> = () => {
  const [roomId] = useAtom(roomIdAtom);
  const [title] = useAtom(roomTitleAtom);
  const setAuthorId = useUpdateAtom(authorIdAtom);
  const setGlobalNickname = useUpdateAtom(nicknameAtom);
  const setPeerId = useUpdateAtom(peerIdAtom);
  const setIsHost = useUpdateAtom(isHostAtom);
  const [nickname, setNickname] = React.useState("");
  const setOops = useOops();
  const queries = useQuery();
  if (roomId == null) return null;
  return (
    <Container>
      <Card title={title}>
        <Flex direction="vertical" gap="10">
          <Input
            placeholder="사용할 이름을 입력해주세요"
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
          />
          <Button
            onClick={async () => {
              if (nickname.length > consts.participant.nickname.length.max) {
                setOops(new FrontError("사용자 이름은 최대 12자 입니다"));
              } else if (
                nickname.length < consts.participant.nickname.length.min
              ) {
                setOops(
                  new FrontError("사용자 이름은 최소 2자 이상이어야 합니다"),
                );
              } else {
                try {
                  const participant = await queries.createParticipant(
                    roomId,
                    nickname,
                  );
                  setAuthorId(participant.participantId);
                  setGlobalNickname(participant.nickname);
                  setPeerId(participant.peerId);
                  setIsHost(participant.isHost);
                } catch (error) {
                  // eslint-disable-next-line no-console
                  console.error(error);
                }
              }
            }}
          >
            확인
          </Button>
        </Flex>
      </Card>
    </Container>
  );
};
