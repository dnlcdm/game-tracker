import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";
import type { PriceHistoryPoint, ChartLineMeta } from "./pricing.types";

interface Props {
    data: PriceHistoryPoint[];
    lines: ChartLineMeta[];
    ticks?: number[];
    range?: 1 | 3 | 6;
    onRangeChange?: (range: 1 | 3 | 6) => void;
}

import { formatBRL } from "./pricing.utils";

const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;

    const realLabel = payload[0].payload.fullDate;

    return (
        <div className="bg-[#0c1120] border border-white/10 rounded-lg px-4 py-3 shadow-2xl backdrop-blur-sm -translate-y-12 sm:translate-y-0 relative z-50">
            <p className="text-[0.65rem] font-semibold text-slate-400 uppercase tracking-widest mb-2">{realLabel}</p>
            {payload.map((entry: any) => (
                <div key={entry.dataKey} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
                    <span className="text-slate-300 font-medium">{entry.name}:</span>
                    <span className="text-white font-bold ml-auto">{entry.value != null ? formatBRL(entry.value) : '—'}</span>
                </div>
            ))}
        </div>
    );
};

export const PriceHistoryChart = ({ data, lines, ticks, range, onRangeChange }: Props) => {
    if (!data.length || !lines.length) return null;

    return (
        <div
            className="bg-[#0f172a]/80 rounded-xl border border-white/[0.06] p-3 sm:p-6 animate-in fade-in slide-in-from-bottom-2 duration-500 
                       [&_*]:outline-none [&_*]:focus:outline-none focus:outline-none focus-within:outline-none select-none"
            style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'pan-y' }}
        >
            <div className="flex flex-wrap items-center justify-between mb-5 gap-3">
                <div className="flex items-center gap-4">
                    {range && onRangeChange && (
                        <div className="flex items-center gap-0.5 bg-[#0c1120] p-0.5 rounded-md border border-white/5">
                            {[1, 3, 6].map((r) => (
                                <button
                                    key={r}
                                    onClick={() => onRangeChange(r as 1 | 3 | 6)}
                                    type="button"
                                    className={`px-2 py-0.5 text-[0.6rem] font-bold rounded min-w-[32px] transition-colors ${range === r
                                        ? "bg-slate-700 text-white shadow-sm"
                                        : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                                        }`}
                                >
                                    {`${r}M`}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-5">
                    {lines.map((line) => (
                        <div key={line.dataKey} className="flex items-center gap-1.5 text-[0.7rem] font-medium text-slate-400">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: line.color }} />
                            {line.label}
                        </div>
                    ))}
                </div>
            </div>

            <ResponsiveContainer width="100%" height={150}>
                <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -30 }}>
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.04)"
                        horizontal
                        vertical={false}
                    />
                    <XAxis
                        dataKey="timestamp"
                        type="number"
                        domain={ticks && ticks.length ? [ticks[0], 'dataMax'] : ['dataMin', 'dataMax']}
                        ticks={ticks}
                        tickFormatter={(val: number) => {
                            if (!val) return "";
                            if (range === 1) {
                                return new Date(val).toLocaleDateString("pt-BR", { day: '2-digit', month: '2-digit', timeZone: "UTC" });
                            }
                            return new Date(val).toLocaleDateString("pt-BR", { month: "short", timeZone: "UTC" }).replace(".", "");
                        }}
                        tick={{ fill: "#64748b", fontSize: 11, fontWeight: 500 }}
                        axisLine={false}
                        tickLine={false}
                        dy={8}
                        minTickGap={30}
                    />
                    <YAxis
                        tick={{ fill: "#64748b", fontSize: 11, fontWeight: 500 }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v: number) => `${v}`}
                        dx={-4}
                    />
                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ stroke: "rgba(255,255,255,0.06)", strokeWidth: 1 }}
                    />
                    {lines.map((line) => (
                        <Line
                            key={line.dataKey}
                            type="monotone"
                            dataKey={line.dataKey}
                            name={line.label}
                            stroke={line.color}
                            strokeWidth={2}
                            dot={{ r: 4, fill: line.color, stroke: "#0f172a", strokeWidth: 2 }}
                            activeDot={{ r: 6, fill: line.color, stroke: "#fff", strokeWidth: 2 }}
                            connectNulls
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};
