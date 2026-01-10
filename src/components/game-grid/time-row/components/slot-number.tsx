import { useMemo } from "react";
import { SlotDigit } from "./slot-digit";

interface SlotNumberProps {
  valueStr: string;
  isLoading: boolean;
  stopStaggerMs?: number;
}

export const SlotNumber = ({
  valueStr,
  isLoading,
  stopStaggerMs = 110,
}: SlotNumberProps) => {
  const digits = useMemo(
    () => valueStr.split("").map((d) => Number(d)),
    [valueStr],
  );

  return (
    <div className="inline-flex items-center tabular-nums">
      {digits.map((d, i) => (
        <SlotDigit
          key={`${valueStr}-${i}`}
          digit={Number.isFinite(d) ? d : 0}
          isLoading={isLoading}
          stopDelayMs={isLoading ? 0 : i * stopStaggerMs}
        />
      ))}
    </div>
  );
};
