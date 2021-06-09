import { useAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

import { errorAtom } from "../../atoms";
import { FrontError } from "../../errors";
import { useResetRoom } from "../../hooks/useResetRoom";
import { Card } from "../core/Card";
import { Container } from "../core/Container";
import { Button } from "../primitives/Button";
import { Text } from "../primitives/Text";

interface OopsBoundaryProps {
  children: React.ReactElement;
}
export const OopsBoundary: React.VFC<OopsBoundaryProps> = (props) => {
  const router = useRouter();
  const [error] = useAtom(errorAtom);
  const resetError = useResetAtom(errorAtom);
  const resetRoom = useResetRoom();

  useEffect(() => {
    resetError();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  if (error == null) {
    return props.children;
  }
  if (error instanceof FrontError) {
    if (!error.options.pageError) {
      return props.children;
    }
  }
  return (
    <Container>
      <Card title="Oops!">
        <Text>{error.message}</Text>
        <Button
          onClick={() => {
            router.push("/");
            setTimeout(() => {
              resetRoom();
              resetError();
            }, 100);
          }}
        >
          홈으로 가기
        </Button>
      </Card>
    </Container>
  );
};
