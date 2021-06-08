import { styled } from "../../stitches.config";

export const Button = styled("button", {
  appearance: "none",
  boxSizing: "border-box",
  padding: "$input",
  background: "transparent",
  color: "initial",
  fontFamily: "$sans",
  fontWeight: "$boldLabel",
  lineHeight: "$label",
  borderRadius: "$input",
  border: "none",
  whiteSpace: "nowrap",
  pointerEvents: "initial",
  transition: "background 0.1s ease-out",
  fontSize: "1rem",
  $$hoverBackgroundColor: "transparent",
  $$activeBackgroundColor: "transparent",
  "&:hover": {
    background: "$$hoverBackgroundColor",
  },
  "&:active": {
    background: "$$activeBackgroundColor",
  },
  "&:focus-visible": {
    outline: "none",
    boxShadow: "0 0 0 2px $colors$primary100",
  },
  "&:disabled": {
    background: "$text8",
    color: "$text33",
  },
  variants: {
    color: {
      primary: {
        background: "$primary10",
        color: "$primary100",
        $$hoverBackgroundColor: "$colors$primary33",
        $$activeBackgroundColor: "$colors$primary8",
      },
      gray: {
        background: "$text10",
        color: "$text66",
        $$hoverBackgroundColor: "$colors$text33",
        $$activeBackgroundColor: "$colors$text8",
      },
      dangerous: {
        background: "$dangerous10",
        color: "$dangerous100",
        $$hoverBackgroundColor: "$colors$dangerous33",
        $$activeBackgroundColor: "$colors$dangerous8",
      },
      transparent: {
        color: "$text100",
        $$hoverBackgroundColor: "$colors$text33",
        $$activeBackgroundColor: "$colors$text8",
      },
    },
    size: {
      square8: {
        padding: "$8",
      },
      square10: {
        padding: "$10",
      },
      square12: {
        padding: "$12",
      },
    },
  },
  defaultVariants: {
    color: "primary",
  },
});
