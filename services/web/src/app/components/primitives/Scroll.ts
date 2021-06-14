import { styled } from "../../stitches.config";

import { Flex } from "./Flex";

export const Scroll = styled(Flex, {
  flex: "1 0 0",
  $$scrollbarColor: "hsl(0deg 0% 0% / 20%)",
  $$scrollbarThumb: "$colors$text33",
  scrollbarWidth: "thin",
  scrollbarColor: "$$scrollbarThumb $$scrollbarColor",
  "&::-webkit-scrollbar": {
    background: "$$scrollbarColor",
    width: "8px",
    height: "8px",
    borderRadius: "$full",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "$$scrollbarThumb",
    borderRadius: "$full",
  },
  variants: {
    x: {
      true: {
        overflowX: "auto",
      },
    },
    y: {
      true: {
        overflowY: "auto",
      },
    },
  },
});
