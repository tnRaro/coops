import { Portal } from "@radix-ui/react-portal";
import { useAtom } from "jotai";
import React from "react";

import { toastsAtom } from "../../atoms";
import { Button } from "../primitives/Button";
import { Flex } from "../primitives/Flex";
import { Spacer } from "../primitives/Spacer";
import { Text } from "../primitives/Text";

interface OopsBoundaryProps {
  children: React.ReactElement;
}
export const ToastBoundary: React.VFC<OopsBoundaryProps> = (props) => {
  const [toasts, setToasts] = useAtom(toastsAtom);

  return (
    <>
      {props.children}
      <Flex
        direction="vertical"
        reverse
        gap="10"
        css={{
          position: "fixed",
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
        align="center"
      >
        {toasts.map((toast) => {
          return (
            <Flex
              align="center"
              key={toast.id}
              css={{
                minWidth: "320px",
                padding: "$16",
                zIndex: "$popOut",
                boxShadow: "$popOut",
                background: "$dangerous100",
                borderRadius: "$medium",
              }}
            >
              <Text>{toast.message}</Text>
              <Spacer />
              <Button
                css={{
                  padding: "$10",
                }}
                color="transparent"
                onClick={() => {
                  setToasts((toasts) =>
                    toasts.filter((to) => to.id !== toast.id),
                  );
                }}
              >
                닫기
              </Button>
            </Flex>
          );
        })}
      </Flex>
    </>
  );
};
