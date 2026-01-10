import { parseTime, pad2 } from "../utils/time-format";
import { SlotNumber } from "./components/slot-number";

interface SlotTimeProps {
  time?: string;
  isLoading: boolean;
}

export const SlotTime = ({ time, isLoading }: SlotTimeProps) => {
  const parsed = parseTime(time);

  if (!parsed && !isLoading) {
    return <span className="text-white/70">-</span>;
  }

  const hours = parsed?.h ?? 0;
  const mins = parsed?.min ?? 0;

  const hoursStr = pad2(hours);
  const minsStr = pad2(Math.min(Math.max(mins, 0), 59));

  return (
    <div className="inline-flex items-center gap-1 tabular-nums">
      <div className="inline-flex items-baseline gap-[2px]">
        <SlotNumber valueStr={hoursStr} isLoading={isLoading} />
        <span className="opacity-90">h</span>
      </div>

      <div className="inline-flex items-baseline gap-[2px]">
        <SlotNumber valueStr={minsStr} isLoading={isLoading} />
        <span className="opacity-90">m</span>
      </div>
    </div>
  );
};
