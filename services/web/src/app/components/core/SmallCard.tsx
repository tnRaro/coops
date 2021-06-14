import React from "react";

import { CSS } from "../../stitches.config";
import { Flex } from "../primitives/Flex";

interface SmallCardProps {
  children: React.ReactNode;
  css?: CSS;
  hasGradient?: boolean;
}
export const SmallCard: React.VFC<SmallCardProps> = (props) => {
  const { children, css, hasGradient, ...rest } = props;
  return (
    <Flex
      direction="vertical"
      gap="10"
      css={
        {
          background: "$elevation1",
          padding: "$20",
          borderRadius: "$medium",
          boxShadow: "$overlay",
          ...css,
        } as CSS
      }
      {...rest}
      style={
        hasGradient
          ? {
              background: "var(--colors-cardGradient)",
            }
          : undefined
      }
    >
      {children}
    </Flex>
  );
};
