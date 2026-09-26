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

export const PriceHistoryChart = ({ data, lines }: Props) => {
    if (!data.length || !lines.length) return null;

    return (
        <div
            className="bg-[#0f172a]/80 rounded-xl border border-white/[0.06] p-4 sm:p-6 animate-in fade-in slide-in-from-bottom-2 duration-500 
                       [&_*]:outline-none [&_*]:focus:outline-none focus:outline-none focus-within:outline-none select-none"
            style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'pan-y' }}
        >
            <div className="flex flex-wrap items-center justify-between mb-5 gap-3">
                <h4 className="text-[0.65rem] font-semibold text-slate-400 uppercase tracking-[0.2em]">
                    Histórico de Preços
                </h4>
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
                <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.04)"
                        horizontal
                        vertical={false}
                    />
                    <XAxis
                        dataKey="id"
                        tickFormatter={(_, index) => data[index]?.date}
                        tick={{ fill: "#64748b", fontSize: 11, fontWeight: 500 }}
                        axisLine={false}
                        tickLine={false}
                        dy={8}
                    />
                    <YAxis
                        tick={{ fill: "#64748b", fontSize: 11, fontWeight: 500 }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v: number) => `R$ ${v}`}
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
