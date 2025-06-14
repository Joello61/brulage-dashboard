import { useState, useMemo } from "react";

// Import des composants modulaires
import {
  AnalyticsHeader,
  AnalyticsFilters,
  KPIGrid,
  HistoricalChart,
  PerformanceChart,
  WeatherConditions,
  SeasonalChart,
  RecommendationsPanel,
  ExecutiveSummary,
  AnalyticsFooter,
} from "@/components/analytics";

// Import des hooks personnalisés
import {
  useAnalyticsDashboard,
  useAnalyticsTrends,
  useAnalyticsSummary,
  useAnalyticsConditions,
} from "@/hooks/useAnalytics";

// Import des hooks utilitaires pour la transformation des données
import {
  useDatePresets,
  useAnalyticsData,
} from "@/hooks/useAnalyticsHelpers";

// Import du store pour les filtres
import { useFiltersStore } from "@/store/filtersStore";
import { useCommunes } from "@/hooks/useCommunes";
import type { BrulageFilters } from "@/types/api";

export default function Analytics() {
  // États du store Zustand
  const dateStart = useFiltersStore((state) => state.filters.dateStart);
  const dateEnd = useFiltersStore((state) => state.filters.dateEnd);
  const commune = useFiltersStore((state) => state.filters.commune);
  const statut = useFiltersStore((state) => state.filters.statut);
  const campagne = useFiltersStore((state) => state.filters.campagne);
  const type = useFiltersStore((state) => state.filters.type);
  const setFilters = useFiltersStore((state) => state.setFilters);
  const resetFilters = useFiltersStore((state) => state.resetFilters);
  const hasActiveFilters = useFiltersStore((state) => state.hasActiveFilters);

  // États locaux
  const [selectedPeriod, setSelectedPeriod] = useState<"month" | "quarter" | "year">("year");
  const [yearsForTrends, setYearsForTrends] = useState<number>(10);

  // Hooks pour les données
  const {
    data: dashboardData,
    isLoading: dashboardLoading,
    error: dashboardError,
    refetch: refetchDashboard,
  } = useAnalyticsDashboard();

  const {
    data: conditionsData,
    isLoading: conditionsLoading,
  } = useAnalyticsConditions(selectedPeriod);

  const {
    data: trendsData,
    isLoading: trendsLoading,
    error: trendsError,
  } = useAnalyticsTrends(yearsForTrends);

  const { data: summaryData } = useAnalyticsSummary();

  const { data: communesData } = useCommunes({
    withBrulages: true,
    limit: 100,
  });

  // Hooks utilitaires
  const datePresets = useDatePresets();
  
  // Transformation centralisée des données
  const {
    kpiData,
    seasonalData,
    historicalData,
    conditionsOptimales,
    recommendations,
    performanceDistribution,
  } = useAnalyticsData(
    dashboardData,
    trendsData,
    conditionsData,
    summaryData,
    yearsForTrends
  );

  // Données dérivées
  const communes = useMemo(() => {
    if (communesData?.data) {
      return communesData.data.map((c: any) => c.nom_commune).sort();
    }
    return [];
  }, [communesData]);

  const analyticsFilters = useMemo(
    (): BrulageFilters => ({
      dateStart,
      dateEnd,
      commune,
      statut,
      campagne,
      type,
    }),
    [dateStart, dateEnd, commune, statut, campagne, type]
  );

  const hasDateFilters = !!(dateStart || dateEnd);

  // Handlers
  const handleRefresh = () => {
    refetchDashboard();
    window.location.reload();
  };

  const handleExportPdf = () => {
    console.log("Export PDF des analytics avec filtres:", analyticsFilters);
  };

  const handleClearDateFilter = () => {
    setFilters({
      dateStart: undefined,
      dateEnd: undefined,
    });
  };

  return (
    <div className="space-y-8">
      {/* Header avec contrôles */}
      <AnalyticsHeader
        hasDateFilters={hasDateFilters}
        dateStart={dateStart}
        dateEnd={dateEnd}
        onRefresh={handleRefresh}
        onExportPdf={handleExportPdf}
        onClearDateFilter={handleClearDateFilter}
      />

      {/* Panneau de filtres */}
      <AnalyticsFilters
        dateStart={dateStart}
        dateEnd={dateEnd}
        commune={commune}
        statut={statut}
        type={type}
        communes={communes}
        hasActiveFilters={hasActiveFilters()}
        onSetFilters={setFilters}
        onResetFilters={resetFilters}
        datePresets={datePresets}
      />

      {/* KPIs principaux */}
      <KPIGrid data={kpiData} />

      {/* Graphiques principaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HistoricalChart
          data={historicalData}
          yearsForTrends={yearsForTrends}
          onYearsChange={setYearsForTrends}
          loading={trendsLoading}
          error={trendsError}
        />

        <PerformanceChart
          data={performanceDistribution}
          loading={dashboardLoading}
          error={dashboardError}
        />
      </div>

      {/* Conditions météorologiques et tendances saisonnières */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeatherConditions
          conditions={conditionsOptimales}
          loading={conditionsLoading}
        />

        <SeasonalChart
          data={seasonalData}
          loading={trendsLoading}
          error={trendsError}
        />
      </div>

      {/* Recommandations */}
      <RecommendationsPanel recommendations={recommendations} />

      {/* Résumé exécutif */}
      <ExecutiveSummary summaryData={summaryData} />

      {/* Footer */}
      <AnalyticsFooter metadata={dashboardData?.metadata} />
    </div>
  );
}