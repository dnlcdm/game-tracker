import { useState, useCallback } from "react";
import type { ToastSeverity } from "../toast";

export const useToast = () => {
  const [state, setState] = useState<{
    open: boolean;
    message: string;
    severity: ToastSeverity;
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const showToast = useCallback(
    (message: string, severity: ToastSeverity = "success") => {
      setState({ open: true, message, severity });
    },
    [],
  );

  const hideToast = useCallback(() => {
    setState((prev) => ({ ...prev, open: false }));
  }, []);

  return { ...state, showToast, hideToast };
};
