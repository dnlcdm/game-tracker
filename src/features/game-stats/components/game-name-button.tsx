import type { MouseEvent } from "react";
import Tooltip from "@mui/material/Tooltip";

interface GameNameButtonProps {
  name: string;
  gameId: string | number;
  onClick: (
    event: MouseEvent<HTMLElement>,
    gameId: string | number,
    fullName: string,
  ) => void;
  className: string;
}

export const GameNameButton = ({
  name,
  gameId,
  onClick,
  className,
}: GameNameButtonProps) => (
  <Tooltip title={name} arrow enterDelay={350} disableInteractive>
    <button
      type="button"
      onClick={(event) => onClick(event, gameId, name)}
      className={className}
    >
      {name}
    </button>
  </Tooltip>
);
