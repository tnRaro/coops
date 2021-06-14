import * as Slider from "@radix-ui/react-slider";

import { CSS, styled } from "../../stitches.config";

const defaultStyles = {
  boxSizing: "border-box",
} as CSS;

export const SliderRoot = styled(Slider.Root, {
  ...defaultStyles,
  display: "flex",
  position: "relative",
  alignItems: "center",
  userSelect: "none",
  touchAction: "none",
  width: "100%",
  height: "1em",
});
export const SliderTrack = styled(Slider.Track, {
  ...defaultStyles,
  background:
    "linear-gradient(90deg, hsl($primaryHSL / 0.15) 0%, hsl($primaryHSL / 0) 101.35%), $elevation2",
  position: "relative",
  flexGrow: 1,
  height: 10,
  borderRadius: "$full",
});
export const SliderRange = styled(Slider.Range, {
  ...defaultStyles,
  position: "absolute",
  background: "$primary100",
  borderRadius: "$full",
  height: "100%",
});
export const SliderThumb = styled(Slider.Thumb, {
  ...defaultStyles,
  display: "flex",
  width: 24,
  height: 24,
  background: "$text100",
  borderRadius: "$full",
});
