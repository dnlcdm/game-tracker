import React from "react";
import { Alert, Snackbar, Slide, type SlideProps } from "@mui/material";

export type ToastSeverity = "success" | "error" | "info" | "warning";

interface ToastProps {
  open: boolean;
  message: string;
  severity: ToastSeverity;
  onClose: () => void;
}

const SlideLeftTransition = React.forwardRef(function SlideLeftTransition(
  props: SlideProps,
  ref: React.Ref<unknown>,
) {
  return <Slide {...props} ref={ref} direction="left" />;
});

export const Toast = ({ open, message, severity, onClose }: ToastProps) => {
  const colors = {
    success: {
      border: "rgba(34, 197, 94, 0.5)",
      glow: "rgba(34, 197, 94, 0.3)",
      icon: "#4ade80",
    },
    error: {
      border: "rgba(244, 63, 94, 0.5)",
      glow: "rgba(244, 63, 94, 0.3)",
      icon: "#fb7185",
    },
    info: {
      border: "rgba(59, 130, 246, 0.5)",
      glow: "rgba(59, 130, 246, 0.3)",
      icon: "#60a5fa",
    },
    warning: {
      border: "rgba(245, 158, 11, 0.5)",
      glow: "rgba(245, 158, 11, 0.3)",
      icon: "#fbbf24",
    },
  } as const;

  const currentStyle = colors[severity] ?? colors.info;

  return (
    <Snackbar
      key={`${severity}-${message}`}
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      TransitionComponent={SlideLeftTransition}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      sx={{ mt: 2, mr: { xs: 0, sm: 2 } }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="outlined"
        sx={{
          bgcolor: "rgba(11, 15, 26, 0.92)",
          backdropFilter: "blur(12px)",
          color: "#fff",
          borderRadius: "12px",
          borderWidth: "1px",
          borderColor: currentStyle.border,
          fontWeight: 700,
          letterSpacing: "0.05em",
          fontSize: "0.8rem",
          boxShadow: `0 10px 30px -5px ${currentStyle.glow}, inset 0 0 12px ${currentStyle.glow}`,

          "& .MuiAlert-icon": {
            color: currentStyle.icon,
            fontSize: "22px",
          },
          "& .MuiAlert-action": {
            color: "rgba(255,255,255,0.4)",
          },

          minWidth: { xs: "90vw", sm: "340px" },
          alignItems: "center",
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};
