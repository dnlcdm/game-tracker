import type { ElementType } from "react";
import { motion } from "framer-motion";
import { SlotTime } from "./components/slot-time";

interface TimeRowProps {
  label: string;
  time?: string;
  colorClass: string;
  icon: ElementType;
  isLoading?: boolean;
}

export const TimeRow = ({
  label,
  time,
  colorClass,
  icon: Icon,
  isLoading = false,
}: TimeRowProps) => {
  return (
    <div className="group flex items-center justify-between p-3 bg-white/[0.03] border border-white/5 rounded-lg hover:bg-white/[0.06] transition-colors relative overflow-hidden">
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${colorClass}`} />

      <div className="flex items-center gap-3 pl-2">
        <Icon
          className={`text-[18px] opacity-60 ${colorClass.replace("bg-", "text-")}`}
        />
        <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">
          {label}
        </span>
      </div>

      <motion.span
        className="text-sm font-mono font-bold text-white tracking-tight min-w-[110px] text-right"
        animate={isLoading ? { opacity: 0.85 } : { opacity: 1 }}
        transition={{ duration: 0.25 }}
      >
        <SlotTime time={time} isLoading={isLoading} />
      </motion.span>
    </div>
  );
};
