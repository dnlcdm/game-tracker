import type { ReactNode } from "react";

export interface StorePrice {
  id: string;
  storeName: string;
  icon: ReactNode;
  accentColor: string;       
  chartColor: string;       
  currentPrice: number | null;
  originalPrice: number | null;
  discountPercentage: number;
  isFree: boolean;
  url: string | null;
  badge?: string | null;    
  upsellText?: string | null;
}

export interface PriceHistoryPoint {
  id: string; 
  date: string;
  fullDate: string;
  timestamp: number;
  [storeName: string]: number | string | null;
}

export interface ChartLineMeta {
  dataKey: string;
  color: string;
  label: string;
}
