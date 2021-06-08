import { useUpdateAtom } from "jotai/utils";
import React from "react";

import { toastsAtom } from "../atoms";

export interface Toast {
  id: number;
  message: string;
  status: "error";
}
let id = 0;
export const useToast = () => {
  const setToasts = useUpdateAtom(toastsAtom);
  const toast = React.useCallback(
    (message: string, duration = 9000) => {
      const toast: Toast = {
        id: id++,
        message,
        status: "error",
      };
      setToasts((toasts) => [...toasts, toast]);
      setTimeout(() => {
        setToasts((toasts) => toasts.filter((to) => to.id !== toast.id));
      }, duration);
    },
    [setToasts],
  );
  return toast;
};
