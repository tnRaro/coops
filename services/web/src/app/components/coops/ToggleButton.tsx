import { Toggle } from "@radix-ui/react-toggle";
import { useAtomValue } from "jotai/utils";
import React, { useState } from "react";

import { isHostAtom, nicknameAtom } from "../../atoms";
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
interface AudioControlButtonProps {
  isLocalMuted?: boolean;
  isSharingMuted?: boolean;
  isServerMuted?: boolean;
  isDisabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  MutedIcon: React.ElementType;
  ServerMutedIcon: React.ElementType;
  IdleStateIcon: React.ElementType;
}
export const AudioControlButton: React.VFC<AudioControlButtonProps> = (
  props,
) => {
  const isHost = useAtomValue(isHostAtom);
  const isDisabled = React.useMemo(() => {
    if (props.isServerMuted && !isHost) return true;
    return props.isDisabled ?? false;
  }, [isHost, props.isDisabled, props.isServerMuted]);
  const Icon = React.useMemo(() => {
    if (props.isServerMuted) return props.ServerMutedIcon;
    if (props.isLocalMuted) return props.MutedIcon;
    if (props.isSharingMuted) return props.MutedIcon;
    return props.IdleStateIcon;
  }, [
    props.IdleStateIcon,
    props.MutedIcon,
    props.ServerMutedIcon,
    props.isLocalMuted,
    props.isServerMuted,
    props.isSharingMuted,
  ]);
  const color = React.useMemo(() => {
    if (props.isServerMuted) return "var(--colors-dangerous66)";
    if (props.isLocalMuted) return "var(--colors-dangerous66)";
    if (props.isSharingMuted) return "var(--colors-text33)";
    return undefined;
  }, [props.isLocalMuted, props.isServerMuted, props.isSharingMuted]);
  return (
    <Button
      disabled={isDisabled}
      size="square8"
      color="transparent"
      style={{
        color,
      }}
      onClick={props.onClick}
    >
      <Icon />
    </Button>
  );
};
