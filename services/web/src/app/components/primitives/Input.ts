import { styled } from "../../stitches.config";

export const Input = styled("input", {
  appearance: "none",
  boxSizing: "border-box",
  padding: "$input",
  background: "$elevation2",
  color: "$text100",
  fontFamily: "$sans",
  fontWeight: "$label",
  lineHeight: "$label",
  fontSize: "1rem",
  borderRadius: "$input",
  border: "none",
  "&::placeholder": {
    color: "$text33",
  },
  "&:active,&:focus": {
    outline: "none",
    boxShadow: "0 0 0 2px $colors$primary100",
  },
});
