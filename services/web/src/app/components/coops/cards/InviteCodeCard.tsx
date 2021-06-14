import { useAtomValue } from "jotai/utils";
import React, { useRef } from "react";
import { FiCheck, FiCopy, FiShare2 } from "react-icons/fi";

import { roomIdAtom } from "../../../atoms";
import { useClipboard } from "../../../hooks/useClipboard";
import { Button } from "../../primitives/Button";
import { Flex } from "../../primitives/Flex";
import { Heading4 } from "../../primitives/Heading";
import { Input } from "../../primitives/Input";

interface InviteCodeCardProps {}
export const InviteCodeCard: React.VFC<InviteCodeCardProps> = () => {
  const [copied, copy] = useClipboard();
  const roomId = useAtomValue(roomIdAtom);
  const inputRef = useRef<HTMLInputElement>(null);
  if (roomId == null) return null;
  return (
    <>
      <Heading4>
        <Flex align="center" gap="10">
          초대 코드
          <FiShare2 />
        </Flex>
      </Heading4>
      <Flex gap="10">
        <Input
          ref={inputRef}
          css={{ flex: 1 }}
          value={roomId}
          readOnly
          onClick={() => {
            inputRef.current?.select();
          }}
        />
        <Button
          onClick={() => copy(location.origin + location.pathname)}
          disabled={copied}
        >
          <Flex align="center" gap="10">
            {copied ? (
              <>
                <FiCheck />
                복사완료
              </>
            ) : (
              <>
                <FiCopy />
                복사하기
              </>
            )}
          </Flex>
        </Button>
      </Flex>
    </>
  );
};
