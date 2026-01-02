import Popover from "@mui/material/Popover";

interface NamePopoverProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  text: string;
  onClose: () => void;
}

export const NamePopover = ({
  open,
  anchorEl,
  text,
  onClose,
}: NamePopoverProps) => (
  <Popover
    open={open}
    anchorEl={anchorEl}
    onClose={onClose}
    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
    transformOrigin={{ vertical: "top", horizontal: "left" }}
    PaperProps={{
      sx: {
        borderRadius: 2,
        bgcolor: "#0B0F1A",
        border: "1px solid rgba(255,255,255,0.10)",
        boxShadow: "0 18px 60px rgba(0,0,0,0.55)",
        px: 1.5,
        py: 1.25,
        maxWidth: 320,
      },
    }}
  >
     <p className="text-white/90 font-black tracking-[0.04em] uppercase italic text-[12px] leading-[1.25]">
      {text}
     </p>
  </Popover>
);
