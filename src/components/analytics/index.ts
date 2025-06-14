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

export { CalendarHeatmap } from './CalendarHeatmap';
export { CommunesHeatmap } from './CommunesHeatmap';
export { WeatherRadar } from './WeatherRadar';

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

// Types pour les nouveaux composants
export interface HeatmapCell {
  month: number;
  year: number;
  count: number;
  surface: number;
  intensity: number;
  label: string;
}

export interface CommuneData {
  nom: string;
  count: number;
  surface: number;
  intensity: number;
  surfaceAverage: number;
}

export interface WeatherMetric {
  name: string;
  value: number;
  optimal: number;
  unit: string;
  icon: React.ComponentType<any>;
  color: string;
  normalizedValue: number;
  isOptimal: boolean;
}

// Hooks utilitaires pour les composants
export const useAnalyticsData = () => {
  // Ce hook pourrait centraliser la logique de transformation des données
  // pour éviter la duplication entre composants
};

// Constants utiles - Mises à jour
export const ANALYTICS_CONSTANTS = {
  CHART_HEIGHT: 300,
  DEFAULT_YEARS_FOR_TRENDS: 10,
  MAX_RECOMMENDATIONS_DISPLAYED: 6,
  HEATMAP_MAX_COMMUNES: 20,
  WEATHER_RADAR_RADIUS: 80,
  CALENDAR_YEARS_DISPLAYED: 4,
  KPI_CARDS_GRID_COLS: {
    mobile: 1,
    tablet: 2,
    desktop: 4,
  },
} as const;

// Utilitaires pour les nouveaux graphiques
export const CHART_UTILS = {
  getIntensityColor: (intensity: number): string => {
    if (intensity === 0) return 'bg-gray-100';
    if (intensity < 0.2) return 'bg-blue-100';
    if (intensity < 0.4) return 'bg-blue-200';
    if (intensity < 0.6) return 'bg-blue-400';
    if (intensity < 0.8) return 'bg-blue-600';
    return 'bg-blue-800';
  },
  
  getPerformanceLevel: (count: number): { label: string; color: string } => {
    if (count >= 100) return { label: 'Très actif', color: 'bg-red-100 text-red-700' };
    if (count >= 50) return { label: 'Actif', color: 'bg-orange-100 text-orange-700' };
    if (count >= 20) return { label: 'Modéré', color: 'bg-yellow-100 text-yellow-700' };
    if (count >= 10) return { label: 'Faible', color: 'bg-blue-100 text-blue-700' };
    return { label: 'Très faible', color: 'bg-gray-100 text-gray-700' };
  },
  
  getMonthName: (month: number): string => {
    const months = [
      'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun',
      'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'
    ];
    return months[month - 1] || '';
  },
  
  normalizeForRadar: (value: number, maxValue: number): number => {
    return Math.min(value / maxValue, 1);
  },
} as const;