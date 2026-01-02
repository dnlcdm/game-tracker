import { useState } from "react";
import type { NamePopoverHandler } from "../types/game-stats.types";

export const useNamePopover = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [text, setText] = useState<string>("");
  const [gameId, setGameId] = useState<string | number | null>(null);

  const isOpen = Boolean(anchorEl);

  const toggle: NamePopoverHandler = (event, currentGameId, fullName) => {
    if (isOpen && gameId === currentGameId) {
      setAnchorEl(null);
      setGameId(null);
      setText("");
      return;
    }

    setAnchorEl(event.currentTarget);
    setGameId(currentGameId);
    setText(fullName);
  };

  const close = () => {
    setAnchorEl(null);
    setGameId(null);
    setText("");
  };

  return { isOpen, anchorEl, text, toggle, close };
};
