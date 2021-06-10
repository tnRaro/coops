import { CSS, styled } from "../../stitches.config";

const defaultStyles = {
  appearance: "none",
  boxSizing: "border-box",
  color: "$text100",
  fontFamily: "$sans",
  fontWeight: "$heading",
  lineHeight: "$heading",
  padding: 0,
  margin: 0,
} as CSS;

export const Heading1 = styled("h1", {
  ...defaultStyles,
  fontSize: "$heading1",
});
export const Heading2 = styled("h2", {
  ...defaultStyles,
  fontSize: "$heading2",
});
export const Heading3 = styled("h3", {
  ...defaultStyles,
  fontSize: "$heading3",
});
export const Heading4 = styled("h4", {
  ...defaultStyles,
  fontSize: "$heading4",
});
export const Heading5 = styled("h5", {
  ...defaultStyles,
  fontSize: "$heading5",
});
export const Heading6 = styled("h6", {
  ...defaultStyles,
  fontSize: "$heading6",
});
