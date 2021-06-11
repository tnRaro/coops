import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import { CSS, styled } from "../../stitches.config";

export const Root = DropdownMenu.Root;
export const Trigger = DropdownMenu.Trigger;
export const Content = styled(DropdownMenu.Content, {
  boxSizing: "border-box",
  background: "black",
  boxShadow: "$popOut",
  padding: "$8",
  minWidth: "240px",
  borderRadius: "$8",
});
const itemBaseStyle = {
  display: "flex",
  boxSizing: "border-box",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "$item",
  borderRadius: "$8",
  cursor: "default",
} as CSS;
export const Item = styled(DropdownMenu.Item, {
  ...itemBaseStyle,
  "&:focus": {
    outline: "none",
    background: "$primary66",
  },
  variants: {
    color: {
      dangerous: {
        color: "$dangerous100",
        "&:focus": {
          outline: "none",
          color: "$text100",
          background: "$dangerous66",
        },
      },
    },
  },
});
export const CheckboxItem = styled(DropdownMenu.CheckboxItem, {
  ...itemBaseStyle,
});
export const ItemIndicator = styled(DropdownMenu.ItemIndicator, {});
export const Separator = styled(DropdownMenu.Separator, {
  ...itemBaseStyle,
  padding: 0,
  margin: "$item",
  height: "1px",
  background: "$text33",
});
export const Label = styled(DropdownMenu.Label, {
  ...itemBaseStyle,
});
