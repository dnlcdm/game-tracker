import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import type { StorePrice } from "./pricing.types";
import psPlusSvg from "../../../../assets/psplus.svg";
import { formatBRL, getPsPlusTier } from "./pricing.utils";

interface Props {
    store: StorePrice;
    index?: number;
}

export const StorePriceCard = ({ store, index = 0 }: Props) => {
    const hasDiscount = store.discountPercentage > 0;
    const psPlusTier = getPsPlusTier(store.upsellText);

    return (
        <div
            className="group flex justify-between items-center bg-[#0f172a]/80 hover:bg-[#0f172a] transition-all
                 rounded-xl p-2 sm:p-5 border border-white/[0.06] hover:border-white/10 cursor-pointer
                 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.4)] animate-in fade-in slide-in-from-bottom-1 duration-300"
            style={{ animationDelay: `${index * 60}ms`, borderLeftColor: 'transparent' }}
            onMouseEnter={(e) => {
                e.currentTarget.style.borderLeftColor = store.accentColor;
                e.currentTarget.style.borderLeftWidth = '3px';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.borderLeftColor = 'transparent';
                e.currentTarget.style.borderLeftWidth = '1px';
            }}
            onClick={() => store.url && window.open(store.url, "_blank")}
        >
            <div className="flex items-center gap-4 min-w-0">
                <div className="w-11 h-11 flex-shrink-0 flex items-center justify-center rounded-xl bg-black/40 shadow-md p-2">
                    {store.icon}
                </div>
                <div className="flex flex-col min-w-0">
                    <span className="font-semibold text-[0.85rem] text-gray-200 tracking-wide truncate">
                        {store.storeName}
                    </span>
                    {psPlusTier && (
                        <span
                            className="flex items-center gap-1 text-[0.45rem] font-bold uppercase tracking-widest mt-0.5 opacity-90"
                            style={{ color: psPlusTier.color }}
                        >
                            <img src={psPlusSvg} alt="PS Plus" className="w-3 h-3 object-contain" />
                            {psPlusTier.label}
                        </span>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0 ml-4">
                {store.isFree ? (
                    <span className="text-md font-semibold text-emerald-400">Grátis</span>
                ) : store.currentPrice !== null ? (
                    <div className="flex items-center gap-2.5">
                        {hasDiscount && (
                            <span className="px-1 py-1 text-[10px] border-1 font-bold rounded text-green-500 leading-none whitespace-nowrap">
                                -{store.discountPercentage}%
                            </span>
                        )}

                        <div className="flex flex-col items-end">
                            {hasDiscount && store.originalPrice !== null && (
                                <span className="text-[0.7rem] text-slate-500 line-through leading-none">
                                    {formatBRL(store.originalPrice)}
                                </span>
                            )}
                            <span className="text-md font-bold tracking-tight text-white leading-none">
                                {formatBRL(store.currentPrice)}
                            </span>
                        </div>
                    </div>
                ) : (
                    <span className="text-lg font-bold text-white/25 tracking-tight">R$ --,--</span>
                )}

                <KeyboardArrowRightIcon className="text-gray-600 group-hover:text-gray-300 transition-colors" fontSize="small" />
            </div>
        </div>
    );
};
