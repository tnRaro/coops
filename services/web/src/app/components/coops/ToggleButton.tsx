import { Toggle } from "@radix-ui/react-toggle";
import React from "react";

import { Button } from "../primitives/Button";

interface ToggleButtonProps {
  On: React.ElementType;
  Off: React.ElementType;
  pressed: boolean;
  onPressedChange: (pressed: boolean) => void;
  isDanger?: boolean;
  disabled?: boolean;
}
export const ToggleButton: React.VFC<ToggleButtonProps> = (props) => {
  return (
    <Button
      as={Toggle}
      disabled={props.disabled}
      pressed={props.pressed}
      size="square8"
      color="transparent"
      onPressedChange={(pressed: boolean) => {
        props.onPressedChange(pressed);
      }}
      style={{
        color: props.isDanger ? "var(--colors-dangerous66)" : undefined,
      }}
    >
      {props.pressed ? <props.On /> : <props.Off />}
    </Button>
  );
};
