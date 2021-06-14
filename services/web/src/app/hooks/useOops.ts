import { useUpdateAtom } from "jotai/utils";
import React from "react";

import { errorAtom } from "../atoms";
import { FrontError } from "../errors";

import { useToast } from "./useToast";

export const useOops = () => {
  const toast = useToast();
  const setError = useUpdateAtom(errorAtom);
  const setOops = React.useCallback(
    (error: Error) => {
      if (error instanceof FrontError) {
        if (error.options.withToast) {
          toast(error.message);
          if (!error.options.pageError) {
            return;
          }
        }
      }
      setError(error);
    },
    [setError, toast],
  );
  return setOops;
};
