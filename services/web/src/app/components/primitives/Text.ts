import { CSS, styled, theme } from "../../stitches.config";

import * as properties from "./properties";

const color = Object.entries(theme.colors).reduce((variants, [key, value]) => {
  return {
    ...variants,
    [key]: {
      color: `$${key}`,
    } as CSS,
  };
}, {}) as { [index in keyof typeof theme.colors]: CSS };
const align = properties.textAlign.reduce((variants, value) => {
  return {
    ...variants,
    [value]: {
      textAlign: value,
    } as CSS,
  };
}, {}) as {
  [index in typeof properties.textAlign[number]]: CSS;
};
const whiteSpace = properties.whiteSpace.reduce((variants, value) => {
  return {
    ...variants,
    [value]: {
      whiteSpace: value,
    } as CSS,
  };
}, {}) as {
  [index in typeof properties.whiteSpace[number]]: CSS;
};

export const Text = styled("p", {
  appearance: "none",
  boxSizing: "border-box",
  color: "inherit",
  fontFamily: "$sans",
  fontWeight: "$paragraph",
  lineHeight: "$paragraph",
  padding: 0,
  margin: 0,
  variants: {
    bold: {
      true: {
        fontWeight: "$bold",
      },
    },
    align,
    whiteSpace,
    color,
  },
});
