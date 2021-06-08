import React from "react";

import { Flex } from "../primitives/Flex";
import { Heading1 } from "../primitives/Heading";

interface CardProps {
  title: string | null | undefined;
  children: React.ReactNode;
}
export const Card: React.VFC<CardProps> = (props) => {
  return (
    <Flex
      direction="vertical"
      gap="cardPadding"
      css={{
        minWidth: "480px",
        background: "$cardGradient",
        padding: "$cardPadding",
        borderRadius: "$large",
        boxShadow: "$overlay",
      }}
    >
      <Heading1>{props.title}</Heading1>
      <Flex direction="vertical" gap="10">
        {props.children}
      </Flex>
    </Flex>
  );
};
