import type { PsnGameData } from "../../hooks/useFetchGamePricing";
import type { StorePrice, PriceHistoryPoint, ChartLineMeta } from "./pricing.types";
import psnSvg from "../../../../assets/playstation.svg";

export const PSN_ACCENT = "#2563EB";

export const formatBRL = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

export const formatShortMonth = (iso: string) => {
    return new Date(iso).toLocaleDateString("pt-BR", { month: "short", timeZone: "UTC" }).replace(".", "");
};

export const formatFullDate = (iso: string) => {
    return new Date(iso).toLocaleDateString("pt-BR", { timeZone: "UTC" });
};

export const getPsPlusTier = (upsellText?: string | null): { label: string; color: string } | null => {
    if (!upsellText) return null;
    const lower = upsellText.toLowerCase();
    if (lower.includes("deluxe")) return { label: "Deluxe", color: "#fcc71d" };
    if (lower.includes("extra")) return { label: "Extra", color: "#fcc71d" };
    return null;
};

export const buildStoreList = (data: PsnGameData): StorePrice[] => {
    const hasProduct = !!data.psn_product_id;
    const targetId = data.psn_product_id || data.psn_concept_id;

    const hasDiscount =
        data.base_price && data.discounted_price && data.base_price > data.discounted_price;

    const discountPct = hasDiscount
        ? Math.round(100 - (data.discounted_price! / data.base_price!) * 100)
        : 0;

    const stores: StorePrice[] = [
        {
            id: "psn",
            storeName: "PlayStation",
            icon: <img src={psnSvg} alt="PSN" className="w-full h-full object-contain" />,
            accentColor: PSN_ACCENT,
            chartColor: PSN_ACCENT,
            currentPrice: data.discounted_price ?? data.base_price,
            originalPrice: hasDiscount ? data.base_price : null,
            discountPercentage: discountPct,
            isFree: data.is_free,
            url: targetId
                ? `https://store.playstation.com/pt-br/${hasProduct ? "product/" : "concept/"}${targetId}`
                : null,
            badge: data.discount_badge,
            upsellText: data.upsell_text,
        },
    ];

    return stores;
};

export const buildChartData = (data: PsnGameData): { points: PriceHistoryPoint[]; lines: ChartLineMeta[] } => {
    const history = data.psn_prices;
    if (!history?.length) return { points: [], lines: [] };

    const sorted = [...history].sort(
        (a, b) => new Date(a.snapshot_timestamp).getTime() - new Date(b.snapshot_timestamp).getTime()
    );

    const firstDate = new Date(sorted[0].snapshot_timestamp);
    firstDate.setUTCMonth(firstDate.getUTCMonth() - 1);
    const earlierDate = firstDate.toISOString();

    let points: PriceHistoryPoint[] = [
        {
            id: "point-initial",
            date: formatShortMonth(earlierDate),
            fullDate: formatFullDate(earlierDate),
            PSN: 0,
        },
        ...sorted.map((h, idx) => ({
            id: `point-${idx}`,
            date: formatShortMonth(h.snapshot_timestamp),
            fullDate: formatFullDate(h.snapshot_timestamp),
            PSN: h.is_free ? 0 : (h.discounted_price ?? h.base_price ?? 0),
        }))
    ];

    const lastTimestamp = new Date(sorted[sorted.length - 1].snapshot_timestamp);
    const currentDate = new Date();
    if (currentDate.getUTCMonth() !== lastTimestamp.getUTCMonth() || currentDate.getUTCFullYear() !== lastTimestamp.getUTCFullYear()) {
        points.push({
            id: 'point-end',
            date: formatShortMonth(currentDate.toISOString()),
            fullDate: formatFullDate(currentDate.toISOString()),
            PSN: points[points.length - 1].PSN,
        });
    }

    const lines: ChartLineMeta[] = [
        { dataKey: "PSN", color: PSN_ACCENT, label: "PSN" },
    ];

    return { points, lines };
};
