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

export const buildStoreList = (data: PsnGameData, igdbUrl?: string | null): StorePrice[] => {
    const targetId = data.id;

    let finalUrl = null;
    if (igdbUrl) {
        finalUrl = igdbUrl.replace(/en-[A-Za-z]{2}|en\b/i, "pt-br");
    } else {
        const urlType = data.type === "concept" ? "concept" : "product";
        finalUrl = `https://store.playstation.com/pt-br/${urlType}/${targetId}`;
    }

    const history = data.psn_prices_history || [];
    const latestRecord = history.length > 0
        ? [...history].sort((a, b) => new Date(b.scraped_at).getTime() - new Date(a.scraped_at).getTime())[0]
        : null;

    const basePrice = latestRecord?.base_price_numeric ?? null;
    const discountedPrice = latestRecord?.discounted_price_numeric ?? null;
    const isFree = latestRecord?.is_free ?? false;

    const hasDiscount = basePrice && discountedPrice && basePrice > discountedPrice;

    const discountPct = hasDiscount
        ? Math.round(100 - (discountedPrice! / basePrice!) * 100)
        : 0;

    const stores: StorePrice[] = [
        {
            id: "psn",
            storeName: "PlayStation",
            icon: <img src={psnSvg} alt="PSN" className="w-full h-full object-contain" />,
            accentColor: PSN_ACCENT,
            chartColor: PSN_ACCENT,
            currentPrice: discountedPrice ?? basePrice,
            originalPrice: hasDiscount ? basePrice : null,
            discountPercentage: discountPct,
            isFree: isFree,
            url: finalUrl,
            badge: latestRecord?.discount_text ?? null,
            upsellText: latestRecord?.upsell_text ?? null,
        },
    ];

    return stores;
};

export const buildChartData = (data: PsnGameData, rangeOpt: 1 | 3 | 6 = 6): { points: PriceHistoryPoint[]; lines: ChartLineMeta[]; ticks: number[] } => {
    const history = data.psn_prices_history;
    if (!history?.length) return { points: [], lines: [], ticks: [] };

    const sorted = [...history].sort(
        (a, b) => new Date(a.scraped_at).getTime() - new Date(b.scraped_at).getTime()
    );

    const ticks: number[] = [];

    if (rangeOpt === 1) {
        for (let i = 0; i <= 30; i++) {
            const d = new Date();
            d.setUTCDate(d.getUTCDate() - i);
            d.setUTCHours(12, 0, 0, 0);
            ticks.push(d.getTime());
        }
    } else {
        const intervals = rangeOpt - 1;
        for (let i = 0; i <= intervals; i++) {
            const d = new Date();
            d.setUTCDate(1);
            d.setUTCMonth(d.getUTCMonth() - i);
            d.setUTCHours(12, 0, 0, 0);
            ticks.push(d.getTime());
        }
    }

    ticks.reverse();

    const cutoffDate = new Date(ticks[0]);
    const cutoffTime = cutoffDate.getTime();

    let lastKnownPriceBeforeCutoff: number | null = null;
    let fallbackIsFree = false;

    const filtered = [];
    for (const h of sorted) {
        if (new Date(h.scraped_at).getTime() < cutoffTime) {
            lastKnownPriceBeforeCutoff = h.discounted_price_numeric ?? h.base_price_numeric ?? 0;
            fallbackIsFree = h.is_free;
        } else {
            filtered.push(h);
        }
    }

    let points: PriceHistoryPoint[] = [];

    if (lastKnownPriceBeforeCutoff !== null) {
        points.push({
            id: "point-initial-range",
            date: formatShortMonth(cutoffDate.toISOString()),
            fullDate: formatFullDate(cutoffDate.toISOString()),
            timestamp: cutoffDate.getTime(),
            PSN: fallbackIsFree ? 0 : lastKnownPriceBeforeCutoff,
        });
    } else if (filtered.length > 0) {
        const earliest = new Date(filtered[0].scraped_at);
        earliest.setUTCMonth(earliest.getUTCMonth() - 1);
        if (earliest.getTime() > cutoffTime) {
            points.push({
                id: "point-initial-earlier",
                date: formatShortMonth(earliest.toISOString()),
                fullDate: formatFullDate(earliest.toISOString()),
                timestamp: earliest.getTime(),
                PSN: 0,
            });
        }
    }

    points.push(...filtered.map((h, idx) => ({
        id: `point-${idx}`,
        date: formatShortMonth(h.scraped_at),
        fullDate: formatFullDate(h.scraped_at),
        timestamp: new Date(h.scraped_at).getTime(),
        PSN: h.is_free ? 0 : (h.discounted_price_numeric ?? h.base_price_numeric ?? 0),
    })));

    if (points.length > 0) {
        const lastRec = filtered.length > 0 ? filtered[filtered.length - 1].scraped_at : cutoffDate.toISOString();
        const lastTimestamp = new Date(lastRec);
        const currentDate = new Date();

        if (formatFullDate(currentDate.toISOString()) !== formatFullDate(lastTimestamp.toISOString())) {
            points.push({
                id: 'point-end',
                date: formatShortMonth(currentDate.toISOString()),
                fullDate: formatFullDate(currentDate.toISOString()),
                timestamp: currentDate.getTime(),
                PSN: points[points.length - 1].PSN,
            });
        }
    }

    const lines: ChartLineMeta[] = [
        { dataKey: "PSN", color: PSN_ACCENT, label: "PSN" },
    ];

    return { points, lines, ticks };
};
