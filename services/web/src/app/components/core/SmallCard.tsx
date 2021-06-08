import { InternalCSS } from "@stitches/core";
import React from "react";

import { Flex } from "../primitives/Flex";

interface SmallCardProps {
  children: React.ReactNode;
  css?: any;
}
export const SmallCard: React.VFC<SmallCardProps> = (props) => {
  const { children, css, ...rest } = props;
  return (
    <Flex
      direction="vertical"
      gap="10"
      css={{
        background: "$elevation1",
        padding: "$20",
        borderRadius: "$medium",
        boxShadow: "$overlay",
        ...css,
      }}
      {...rest}
    >
      {children}
    </Flex>
  );
};
