import { useMemo } from 'react';
import { Calendar, CalendarDays } from 'lucide-react';
import type { DatePreset, KPIData, Recommendation, WeatherCondition } from '@/components/analytics';
import type { TimeSeriesDataPoint, ChartDataPoint } from '@/types/analytics';

// Hook pour générer les préréglages de dates
export const useDatePresets = (): DatePreset[] => {
  return useMemo(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    const getWeekStart = (date: Date): Date => {
      const d = new Date(date);
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1);
      return new Date(d.setDate(diff));
    };

    const getWeekEnd = (date: Date): Date => {
      const d = getWeekStart(date);
      return new Date(d.setDate(d.getDate() + 6));
    };

    return [
      {
        label: "Cette semaine",
        value: "thisWeek",
        dateStart: getWeekStart(today).toISOString().split("T")[0],
        dateEnd: getWeekEnd(today).toISOString().split("T")[0],
        icon: Calendar,
      },
      {
        label: "Ce mois",
        value: "thisMonth",
        dateStart: new Date(currentYear, currentMonth, 1)
          .toISOString()
          .split("T")[0],
        dateEnd: new Date(currentYear, currentMonth + 1, 0)
          .toISOString()
          .split("T")[0],
        icon: Calendar,
      },
      {
        label: "Cette année",
        value: "thisYear",
        dateStart: `${currentYear}-01-01`,
        dateEnd: `${currentYear}-12-31`,
        icon: CalendarDays,
      },
      {
        label: "Année dernière",
        value: "lastYear",
        dateStart: `${currentYear - 1}-01-01`,
        dateEnd: `${currentYear - 1}-12-31`,
        icon: CalendarDays,
      },
      {
        label: "3 derniers mois",
        value: "last3Months",
        dateStart: new Date(currentYear, currentMonth - 2, 1)
          .toISOString()
          .split("T")[0],
        dateEnd: today.toISOString().split("T")[0],
        icon: Calendar,
      },
      {
        label: "6 derniers mois",
        value: "last6Months",
        dateStart: new Date(currentYear, currentMonth - 5, 1)
          .toISOString()
          .split("T")[0],
        dateEnd: today.toISOString().split("T")[0],
        icon: Calendar,
      },
    ];
  }, []);
};

// Hook pour transformer les données du dashboard en KPIs
export const useKPIData = (dashboardData: any): KPIData => {
  return useMemo(() => {
    if (!dashboardData) {
      return {
        total: 0,
        surface: 0,
        efficacite: 0,
        communes: 0,
        evolution: 0,
      };
    }

    return {
      total: dashboardData.brulages?.total || 0,
      surface: dashboardData.surface?.total || 0,
      efficacite: dashboardData.reussite?.tauxMoyen || 0,
      communes: dashboardData.geographie?.communes || 0,
      evolution: dashboardData.brulages?.evolution || 0,
    };
  }, [dashboardData]);
};

// Hook pour transformer les données saisonnières
export const useSeasonalData = (trendsData: any): TimeSeriesDataPoint[] => {
  return useMemo(() => {
    if (!trendsData?.seasonal_trends) return [];

    const seasons = ["Hiver", "Printemps", "Été", "Automne"];

    return seasons.map((season) => ({
      date: season,
      value: trendsData.seasonal_trends[season]?.totalCount || 0,
      additionalMetrics: {
        surface: trendsData.seasonal_trends[season]?.totalSurface || 0,
        average: trendsData.seasonal_trends[season]?.averageCount || 0,
      },
    }));
  }, [trendsData]);
};

// Hook pour transformer les données historiques
export const useHistoricalData = (trendsData: any, yearsForTrends: number): TimeSeriesDataPoint[] => {
  return useMemo(() => {
    if (!trendsData?.predictive_analysis?.historical) return [];

    const dataToShow = trendsData.predictive_analysis.historical.slice(-yearsForTrends);

    return dataToShow.map((item: { annee: { toString: () => any }; count: any; surface: any }) => ({
      date: item.annee.toString(),
      value: Number(item.count),
      additionalMetrics: {
        surface: Number(item.surface),
        efficiency: 90 + Math.random() * 10, // Simulation car pas dans l'API
      },
    }));
  }, [trendsData, yearsForTrends]);
};

// Hook pour obtenir les conditions optimales
export const useOptimalConditions = (conditionsData: any): WeatherCondition => {
  return useMemo(() => {
    if (!conditionsData?.bestConditions || conditionsData.bestConditions.length === 0) {
      return {
        temperature: "Modéré",
        humidite: "Sec",
        vent: "Faible",
      };
    }

    const bestCondition = conditionsData.bestConditions[0];
    return {
      temperature: bestCondition.temp_category,
      humidite: bestCondition.humidite_category,
      vent: bestCondition.vent_category,
    };
  }, [conditionsData]);
};

// Hook pour obtenir les recommandations
export const useRecommendations = (conditionsData: any, summaryData: any): Recommendation[] => {
  return useMemo(() => {
    const recommendations: Recommendation[] = [];

    // Recommandations météo
    if (conditionsData?.recommendations) {
      conditionsData.recommendations.forEach((rec: { type: any; message: any; priority: any }) => {
        recommendations.push({
          type: rec.type,
          message: rec.message,
          priority: rec.priority,
        });
      });
    }

    // Recommandations du summary
    if (summaryData?.insights?.recommendations) {
      summaryData.insights.recommendations.forEach((rec: { type: any; message: any; priority: any }) => {
        recommendations.push({
          type: rec.type,
          message: rec.message,
          priority: rec.priority,
        });
      });
    }

    return recommendations;
  }, [conditionsData, summaryData]);
};

// Hook pour obtenir la distribution des performances
export const usePerformanceDistribution = (dashboardData: any): ChartDataPoint[] => {
  return useMemo(() => {
    if (!dashboardData?.reussite?.repartition) return [];

    const repartition = dashboardData.reussite.repartition;
    return [
      {
        name: "Excellent",
        value: repartition.excellent.count,
        color: "#10b981",
        metadata: {
          range: `${repartition.excellent.min}-${repartition.excellent.max}%`,
        },
      },
      {
        name: "Bon",
        value: repartition.bon.count,
        color: "#3b82f6",
        metadata: { range: `${repartition.bon.min}-${repartition.bon.max}%` },
      },
      {
        name: "Moyen",
        value: repartition.moyen.count,
        color: "#f59e0b",
        metadata: {
          range: `${repartition.moyen.min}-${repartition.moyen.max}%`,
        },
      },
      {
        name: "Faible",
        value: repartition.faible.count,
        color: "#ef4444",
        metadata: {
          range: `${repartition.faible.min}-${repartition.faible.max}%`,
        },
      },
    ];
  }, [dashboardData]);
};

// Hook central qui combine toutes les transformations de données
export const useAnalyticsData = (
  dashboardData: any,
  trendsData: any,
  conditionsData: any,
  summaryData: any,
  yearsForTrends: number
) => {
  const kpiData = useKPIData(dashboardData);
  const seasonalData = useSeasonalData(trendsData);
  const historicalData = useHistoricalData(trendsData, yearsForTrends);
  const conditionsOptimales = useOptimalConditions(conditionsData);
  const recommendations = useRecommendations(conditionsData, summaryData);
  const performanceDistribution = usePerformanceDistribution(dashboardData);

  return {
    kpiData,
    seasonalData,
    historicalData,
    conditionsOptimales,
    recommendations,
    performanceDistribution,
  };
};

// Utilitaires pour la validation des données
export const validateAnalyticsData = {
  hasValidKPIData: (data: KPIData): boolean => {
    return data.total >= 0 && data.surface >= 0 && data.efficacite >= 0;
  },
  
  hasValidChartData: (data: ChartDataPoint[] | TimeSeriesDataPoint[]): boolean => {
    return Array.isArray(data) && data.length > 0;
  },
  
  hasValidRecommendations: (recommendations: Recommendation[]): boolean => {
    return Array.isArray(recommendations) && 
           recommendations.every(rec => rec.type && rec.message && rec.priority);
  },
};

// Constantes pour les couleurs et styles
export const ANALYTICS_THEME = {
  colors: {
    primary: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    purple: '#8b5cf6',
    orange: '#f97316',
  },
  gradients: {
    blue: 'from-blue-50 to-indigo-50',
    green: 'from-green-50 to-emerald-50',
    purple: 'from-purple-50 to-violet-50',
    orange: 'from-orange-50 to-amber-50',
  },
  chartHeight: 300,
} as const;