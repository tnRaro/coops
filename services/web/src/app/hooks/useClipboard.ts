import { useState } from "react";

import { FrontError } from "../errors";

import { useOops } from "./useOops";

export const useClipboard = () => {
  const [copied, setCopied] = useState(false);
  const setOops = useOops();
  let timerId: NodeJS.Timeout;
  const copy = async (text: string) => {
    clearTimeout(timerId);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      // eslint-disable-next-line require-atomic-updates
      timerId = setTimeout(() => {
        setCopied(false);
      }, 3000);
    } catch (error) {
      setOops(new FrontError(error.message));
    }
  };
  return [copied, copy] as const;
};
