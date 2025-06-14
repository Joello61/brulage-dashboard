export { AnalyticsHeader } from './AnalyticsHeader';
export { AnalyticsFilters } from './AnalyticsFilters';
export { KPIGrid } from './KPIGrid';
export { ChartContainer } from './ChartContainer';
export { HistoricalChart } from './HistoricalChart';
export { PerformanceChart } from './PerformanceChart';
export { WeatherConditions } from './WeatherConditions';
export { SeasonalChart } from './SeasonalChart';
export { RecommendationsPanel } from './RecommendationsPanel';
export { ExecutiveSummary } from './ExecutiveSummary';
export { AnalyticsFooter } from './AnalyticsFooter';

// Types pour les composants analytics
export interface KPIData {
  total: number;
  surface: number;
  efficacite: number;
  communes: number;
  evolution: number;
}

export interface DatePreset {
  label: string;
  value: string;
  dateStart: string;
  dateEnd: string;
  icon: React.ComponentType<any>;
}

export interface Recommendation {
  type: string;
  message: string;
  priority: "critical" | "high" | "medium" | "low";
}

export interface WeatherCondition {
  temperature: string;
  humidite: string;
  vent: string;
}

// Constants utiles
export const ANALYTICS_CONSTANTS = {
  CHART_HEIGHT: 300,
  DEFAULT_YEARS_FOR_TRENDS: 10,
  MAX_RECOMMENDATIONS_DISPLAYED: 6,
  KPI_CARDS_GRID_COLS: {
    mobile: 1,
    tablet: 2,
    desktop: 4,
  },
} as const;