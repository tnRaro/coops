import React from "react";

import { Flex } from "../primitives/Flex";

interface ContainerProps {
  children: React.ReactNode;
}
export const Container: React.VFC<ContainerProps> = (props) => {
  return (
    <Flex
      direction="vertical"
      justify={{ "@bpr": "center", "@bp": "stretch" }}
      align={{ "@initial": "center", "@bp": "stretch" }}
      css={{ flex: "1" }}
    >
      {props.children}
    </Flex>
  );
};
