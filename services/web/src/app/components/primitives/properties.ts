export const globals = ["inherit", "initial", "revert", "unset"] as const;
export const contentDistribution = [
  "space-around",
  "space-between",
  "space-evenly",
  "stretch",
] as const;
export const contentPosition = [
  "center",
  "end",
  "flex-end",
  "flex-start",
  "start",
] as const;
export const selfPosition = [
  "center",
  "end",
  "flex-end",
  "flex-start",
  "self-end",
  "self-start",
  "start",
] as const;
export const justifyContent = [
  ...globals,
  ...contentDistribution,
  ...contentPosition,
  "left",
  "normal",
  "right",
] as const;
export const alignItems = [
  ...globals,
  ...selfPosition,
  "baseline",
  "normal",
  "stretch",
] as const;
export const textAlign = [
  ...globals,
  "center",
  "end",
  "justify",
  "left",
  "match-parent",
  "right",
  "start",
] as const;
export const whiteSpace = [
  ...globals,
  "break-spaces",
  "normal",
  "nowrap",
  "pre",
  "pre-line",
  "pre-wrap",
] as const;
