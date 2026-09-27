import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import StorefrontIcon from "@mui/icons-material/Storefront";
import type { PsnGameData } from "../hooks/useFetchGamePricing";
import { StorePriceCard } from "./pricing/store-price-card";
import { PriceHistoryChart } from "./pricing/price-history-chart";
import { buildStoreList, buildChartData } from "./pricing/pricing.utils";

interface Props {
    data: PsnGameData | null;
    isLoading: boolean;
    searchedId?: string | null;
    igdbUrl?: string | null;
}

export const GameDetailsPrice = ({ data, isLoading, searchedId, igdbUrl }: Props) => {
    const [monthsRange, setMonthsRangeState] = useState<1 | 3 | 6>(() => {
        const saved = localStorage.getItem("marvel-tracker:chart-range");
        if (saved === "1" || saved === "3" || saved === "6") return Number(saved) as 1 | 3 | 6;
        return 6;
    });

    const setMonthsRange = (range: 1 | 3 | 6) => {
        setMonthsRangeState(range);
        localStorage.setItem("marvel-tracker:chart-range", range.toString());
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-24">
                <CircularProgress size={40} className="!text-blue-500" />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-[#0f172a]/60 rounded-2xl border border-white/5 text-center shadow-xl animate-in fade-in duration-300">
                <StorefrontIcon className="text-gray-600 mb-5 opacity-40" sx={{ fontSize: 56 }} />
                <p className="text-gray-300 tracking-wide text-lg font-medium">Preço Indisponível</p>
                <p className="text-slate-500 text-sm mt-3 max-w-sm leading-relaxed">
                    A base de dados interna ainda não sincronizou este jogo ou o mapeamento com a loja não existe.
                </p>
                {searchedId && (
                    <div className="mt-6 px-4 py-1.5 bg-black/40 rounded-lg font-mono text-xs text-gray-600 border border-white/5">
                        Target ID: {searchedId}
                    </div>
                )}
            </div>
        );
    }

    const stores = buildStoreList(data, igdbUrl);
    const { points, lines, ticks } = buildChartData(data, monthsRange);

    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-col gap-3">
                {stores.map((store, idx) => (
                    <StorePriceCard key={store.id} store={store} index={idx} />
                ))}
            </div>

            {points.length > 0 && (
                <PriceHistoryChart
                    data={points}
                    lines={lines}
                    ticks={ticks}
                    range={monthsRange}
                    onRangeChange={setMonthsRange}
                />
            )}
        </div>
    );
};
