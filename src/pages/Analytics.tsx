import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  BarChart3,
  TrendingUp,
  Download,
  RefreshCw,
  Calendar,
  MapPin,
  Target,
  Activity,
  AlertTriangle,
  Zap,
  Filter,
  Thermometer,
  Wind,
  Droplets,
  Users,
  Gauge,
  CheckCircle,
  Cloud,
  Snowflake,
  Flower2,
  Sun,
  Leaf,
  Lightbulb,
  X,
  CalendarDays,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Bar,
  Line,
  Cell,
  ComposedChart,
  PieChart as RechartsPieChart,
  Pie,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Import des hooks avec types corrects
import {
  useAnalyticsDashboard,
  useAnalyticsTrends,
  useAnalyticsSummary,
  useAnalyticsConditions,
} from "@/hooks/useAnalytics";

// Import des types précis
import {
  formatPercentageChange,
  type ChartDataPoint,
  type TimeSeriesDataPoint,
} from "@/types/analytics";

// Import du store pour les filtres
import { useFiltersStore } from "@/store/filtersStore";
import { useCommunes } from "@/hooks/useCommunes";
import { cn } from "@/lib/utils";
import type { BrulageFilters } from "@/types/api";

// Types précis pour les composants
interface ChartContainerProps {
  children: React.ReactNode;
  loading: boolean;
  error: Error | null;
  title: string;
}

interface DatePreset {
  label: string;
  value: string;
  dateStart: string;
  dateEnd: string;
  icon: any;
}

// Composant pour les graphiques avec gestion d'erreur
const ChartContainer: React.FC<ChartContainerProps> = ({
  children,
  loading,
  error,
  title,
}) => {
  if (loading) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <div className="text-center space-y-2">
          <Skeleton className="h-4 w-32 mx-auto" />
          <Skeleton className="h-4 w-24 mx-auto" />
          <p className="text-sm text-gray-500">Chargement {title}...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <div className="text-center space-y-2">
          <AlertTriangle className="h-8 w-8 text-red-500 mx-auto" />
          <p className="text-sm text-red-600">Erreur de chargement</p>
          <p className="text-xs text-gray-500">
            {error.message || "Erreur inconnue"}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default function Analytics() {
  // Accès correct au store Zustand avec types précis
  const dateStart = useFiltersStore((state) => state.filters.dateStart);
  const dateEnd = useFiltersStore((state) => state.filters.dateEnd);
  const commune = useFiltersStore((state) => state.filters.commune);
  const statut = useFiltersStore((state) => state.filters.statut);
  const campagne = useFiltersStore((state) => state.filters.campagne);
  const type = useFiltersStore((state) => state.filters.type);
  const setFilters = useFiltersStore((state) => state.setFilters);
  const resetFilters = useFiltersStore((state) => state.resetFilters);
  const hasActiveFilters = useFiltersStore((state) => state.hasActiveFilters);

  // États pour la gestion des vues
  const [selectedPeriod, setSelectedPeriod] = useState<
    "month" | "quarter" | "year"
  >("year");
  const [yearsForTrends, setYearsForTrends] = useState<number>(3);
  const [tempDateStart, setTempDateStart] = useState(dateStart || "");
  const [tempDateEnd, setTempDateEnd] = useState(dateEnd || "");

  // Mémorisation des filtres avec types précis
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

  // Préréglages de dates
  const datePresets: DatePreset[] = useMemo(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

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

  // Fonctions utilitaires pour les dates
  function getWeekStart(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  function getWeekEnd(date: Date): Date {
    const d = getWeekStart(date);
    return new Date(d.setDate(d.getDate() + 6));
  }

  // Utilisation des hooks React Query avec types précis
  const {
    data: dashboardData,
    isLoading: dashboardLoading,
    error: dashboardError,
    refetch: refetchDashboard,
  } = useAnalyticsDashboard();

  const {
    data: conditionsData,
    isLoading: conditionsLoading,
    error: conditionsError,
  } = useAnalyticsConditions(selectedPeriod);

  const {
    data: trendsData,
    isLoading: trendsLoading,
    error: trendsError,
  } = useAnalyticsTrends(yearsForTrends);

  const {
    data: summaryData,
    isLoading: summaryLoading,
    error: summaryError,
  } = useAnalyticsSummary();

  // Récupérer la liste des communes pour les filtres
  const { data: communesData } = useCommunes({
    withBrulages: true,
    limit: 100,
  });

  // Liste des communes avec types précis
  const communes = useMemo(() => {
    if (communesData?.data) {
      return communesData.data.map((c: any) => c.nom_commune).sort();
    }
    return [];
  }, [communesData]);

  // Gérer l'application des filtres de dates
  const handleApplyDateFilter = () => {
    setFilters({
      dateStart: tempDateStart || undefined,
      dateEnd: tempDateEnd || undefined,
    });
  };

  // Gérer la sélection d'un préréglage
  const handlePresetSelect = (preset: DatePreset) => {
    setTempDateStart(preset.dateStart);
    setTempDateEnd(preset.dateEnd);
    setFilters({
      dateStart: preset.dateStart,
      dateEnd: preset.dateEnd,
    });
  };

  // Effacer les filtres de dates
  const handleClearDateFilter = () => {
    setTempDateStart("");
    setTempDateEnd("");
    setFilters({
      dateStart: undefined,
      dateEnd: undefined,
    });
  };

  // Fonctions utilitaires
  const handleRefresh = () => {
    refetchDashboard();
    window.location.reload();
  };

  const handleExportPdf = () => {
    console.log("Export PDF des analytics avec filtres:", analyticsFilters);
  };

  // Fonctions de transformation avec types précis
  const getKPIData = () => {
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
  };

  const getSeasonalData = (): TimeSeriesDataPoint[] => {
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
  };

  const getHistoricalEvolutionData = (): TimeSeriesDataPoint[] => {
    if (!trendsData?.predictive_analysis?.historical) return [];

    // Utiliser le nombre d'années sélectionné
    const dataToShow = trendsData.predictive_analysis.historical.slice(
      -yearsForTrends
    );

    return dataToShow.map(
      (item: { annee: { toString: () => any }; count: any; surface: any }) => ({
        date: item.annee.toString(),
        value: Number(item.count),
        additionalMetrics: {
          surface: Number(item.surface),
          efficiency: 90 + Math.random() * 10, // Simulation car pas dans l'API
        },
      })
    );
  };

  const getConditionsOptimales = () => {
    if (
      !conditionsData?.bestConditions ||
      conditionsData.bestConditions.length === 0
    ) {
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
  };

  const getRecommendations = () => {
    const recommendations: Array<{
      type: string;
      message: string;
      priority: "critical" | "high" | "medium" | "low";
    }> = [];

    // Recommandations météo
    if (conditionsData?.recommendations) {
      conditionsData.recommendations.forEach(
        (rec: { type: any; message: any; priority: any }) => {
          recommendations.push({
            type: rec.type,
            message: rec.message,
            priority: rec.priority,
          });
        }
      );
    }

    // Recommandations du summary
    if (summaryData?.insights?.recommendations) {
      summaryData.insights.recommendations.forEach(
        (rec: { type: any; message: any; priority: any }) => {
          recommendations.push({
            type: rec.type,
            message: rec.message,
            priority: rec.priority,
          });
        }
      );
    }

    return recommendations;
  };

  const getPerformanceDistribution = (): ChartDataPoint[] => {
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
  };

  // Transformation des données avec types précis
  const kpiData = getKPIData();
  const conditionsOptimales = getConditionsOptimales();
  const recommendations = getRecommendations();
  const performanceDistribution = getPerformanceDistribution();

  // Vérifier si des filtres de dates sont appliqués
  const hasDateFilters = dateStart || dateEnd;

  const statuts = [
    { value: "", label: "Tous les statuts" },
    { value: "EN_COURS", label: "En cours" },
    { value: "TERMINE", label: "Terminé" },
    { value: "ANNULE", label: "Annulé" },
  ];

  return (
    <div className="space-y-8">
      {/* Header avec contrôles et filtres */}
      <div className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/40 rounded-2xl border border-blue-100/60 p-6 md:p-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-100/40 to-transparent rounded-full -translate-y-48 translate-x-48" />
        <div className="relative space-y-6">
          {/* Titre et description */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl shadow-lg">
                  <BarChart3 className="h-6 w-6 md:h-8 md:w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
                    Analytics
                  </h1>
                  <p className="text-sm md:text-base text-gray-600 font-medium">
                    Analyses et tendances des brûlages dirigés
                  </p>
                </div>
              </div>

              {/* Affichage de la période sélectionnée */}
              {hasDateFilters && (
                <div className="flex items-center gap-2 pt-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">
                    Période : {dateStart}
                    {dateEnd && dateStart !== dateEnd && ` → ${dateEnd}`}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleClearDateFilter}
                    className="h-6 w-6 p-0 text-blue-600 hover:bg-blue-100"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>

            <div className="flex flex-col lg:flex-row gap-3">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  className="bg-white/60 backdrop-blur-sm border-blue-200 hover:bg-blue-50"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Actualiser
                </Button>

                <Button
                  size="sm"
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-lg"
                  onClick={handleExportPdf}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>

          {/* Panneau de filtres pour Analytics */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-blue-900 flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtres Analytics
              </h3>
              {hasActiveFilters() && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetFilters}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <X className="h-4 w-4 mr-1" />
                  Réinitialiser
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Filtre par dates */}
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-blue-800 mb-2 block">
                  Période d'analyse
                </label>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "flex-1 justify-start bg-white border-blue-300",
                          hasDateFilters && "border-blue-500 bg-blue-50"
                        )}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        {hasDateFilters ? "Période active" : "Sélectionner"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80" align="start">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">
                            Période d'analyse
                          </h4>
                          <p className="text-xs text-gray-600">
                            Filtrez les données par période
                          </p>
                        </div>

                        {/* Préréglages rapides */}
                        <div className="space-y-2">
                          <Label className="text-xs font-medium">
                            Préréglages
                          </Label>
                          <div className="grid grid-cols-2 gap-2">
                            {datePresets.map((preset) => (
                              <Button
                                key={preset.value}
                                variant="outline"
                                size="sm"
                                onClick={() => handlePresetSelect(preset)}
                                className="justify-start text-xs h-8"
                              >
                                <preset.icon className="h-3 w-3 mr-1" />
                                {preset.label}
                              </Button>
                            ))}
                          </div>
                        </div>

                        {/* Sélection manuelle */}
                        <div className="space-y-3">
                          <Label className="text-xs font-medium">
                            Dates personnalisées
                          </Label>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <Label
                                htmlFor="dateStart"
                                className="text-xs text-gray-600"
                              >
                                Date début
                              </Label>
                              <Input
                                id="dateStart"
                                type="date"
                                value={tempDateStart}
                                onChange={(e) =>
                                  setTempDateStart(e.target.value)
                                }
                                className="text-xs h-8"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label
                                htmlFor="dateEnd"
                                className="text-xs text-gray-600"
                              >
                                Date fin
                              </Label>
                              <Input
                                id="dateEnd"
                                type="date"
                                value={tempDateEnd}
                                onChange={(e) => setTempDateEnd(e.target.value)}
                                className="text-xs h-8"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-2 border-t">
                          <Button
                            size="sm"
                            onClick={handleApplyDateFilter}
                            className="flex-1 h-8"
                          >
                            <Filter className="h-3 w-3 mr-1" />
                            Appliquer
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleClearDateFilter}
                            className="h-8"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Filtre par commune */}
              <div>
                <label className="text-sm font-medium text-blue-800 mb-2 block">
                  Commune
                </label>
                <Select
                  value={commune || ""}
                  onValueChange={(value) =>
                    setFilters({ commune: value === "all" ? undefined : value })
                  }
                >
                  <SelectTrigger className="bg-white border-blue-300 focus:border-blue-500">
                    <SelectValue placeholder="Toutes les communes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Toutes les communes
                      </div>
                    </SelectItem>
                    {communes.map((communeName: string) => (
                      <SelectItem
                        key={communeName}
                        value={communeName || "default"}
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {communeName}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Indicateurs de filtres actifs */}
            {hasActiveFilters() && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-blue-200">
                <span className="text-xs font-medium text-blue-700">
                  Filtres actifs :
                </span>
                {dateStart && (
                  <Badge
                    variant="outline"
                    className="text-xs bg-blue-50 text-blue-700 border-blue-300"
                  >
                    {dateStart} {dateEnd && `- ${dateEnd}`}
                  </Badge>
                )}
                {commune && (
                  <Badge
                    variant="outline"
                    className="text-xs bg-blue-50 text-blue-700 border-blue-300"
                  >
                    {commune}
                  </Badge>
                )}
                {statut && (
                  <Badge
                    variant="outline"
                    className="text-xs bg-blue-50 text-blue-700 border-blue-300"
                  >
                    {statuts.find((s) => s.value === statut)?.label}
                  </Badge>
                )}
                {type && (
                  <Badge
                    variant="outline"
                    className="text-xs bg-blue-50 text-blue-700 border-blue-300"
                  >
                    {type}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* KPIs principaux avec types précis */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100 rounded-full -translate-y-12 translate-x-12 opacity-30" />
          <CardHeader className="relative pb-2">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <div className="text-right">
                <p className="text-xs text-blue-600 font-medium">
                  Total Brûlages
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {kpiData.total.toLocaleString()}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative pt-0">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                  kpiData.evolution >= 0
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                )}
              >
                <TrendingUp
                  className={cn(
                    "h-3 w-3",
                    kpiData.evolution < 0 && "rotate-180"
                  )}
                />
                {formatPercentageChange(kpiData.evolution)}
              </div>
              <span className="text-xs text-gray-600">
                vs période précédente
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-100 rounded-full -translate-y-12 translate-x-12 opacity-30" />
          <CardHeader className="relative pb-2">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-green-500 rounded-lg">
                <Target className="h-5 w-5 text-white" />
              </div>
              <div className="text-right">
                <p className="text-xs text-green-600 font-medium">
                  Surface Totale
                </p>
                <p className="text-2xl font-bold text-green-900">
                  {kpiData.surface.toLocaleString()} ha
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative pt-0">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="text-xs bg-green-100 text-green-700 border-green-300"
              >
                Moyenne:{" "}
                {(kpiData.surface / Math.max(kpiData.total, 1))?.toFixed(1)} ha
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-100 rounded-full -translate-y-12 translate-x-12 opacity-30" />
          <CardHeader className="relative pb-2">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-purple-500 rounded-lg">
                <Gauge className="h-5 w-5 text-white" />
              </div>
              <div className="text-right">
                <p className="text-xs text-purple-600 font-medium">
                  Taux d'Efficacité
                </p>
                <p className="text-2xl font-bold text-purple-900">
                  {kpiData.efficacite?.toFixed(1)}%
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative pt-0">
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-purple-100 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${kpiData.efficacite}%` }}
                />
              </div>
              <span className="text-xs text-purple-700 font-medium">
                {kpiData.efficacite > 80
                  ? "Excellent"
                  : kpiData.efficacite > 60
                  ? "Bon"
                  : "À améliorer"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-100 rounded-full -translate-y-12 translate-x-12 opacity-30" />
          <CardHeader className="relative pb-2">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-orange-500 rounded-lg">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <div className="text-right">
                <p className="text-xs text-orange-600 font-medium">
                  Communes Actives
                </p>
                <p className="text-2xl font-bold text-orange-900">
                  {kpiData.communes}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative pt-0">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="text-xs bg-orange-100 text-orange-700 border-orange-300"
              >
                Couverture géographique
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques principaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Évolution temporelle */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Évolution Historique
                </CardTitle>
                <CardDescription>
                  Tendance des brûlages sur {yearsForTrends} années
                </CardDescription>
              </div>
              <Select
                value={yearsForTrends.toString()}
                onValueChange={(value) => setYearsForTrends(Number(value))}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 an</SelectItem>
                  <SelectItem value="2">2 ans</SelectItem>
                  <SelectItem value="3">3 ans</SelectItem>
                  <SelectItem value="5">5 ans</SelectItem>
                  <SelectItem value="10">10 ans</SelectItem>
                  <SelectItem value="15">15 ans</SelectItem>
                  <SelectItem value="20">20 ans</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer
              loading={trendsLoading}
              error={trendsError}
              title="évolution temporelle"
            >
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={getHistoricalEvolutionData()}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    className="text-xs"
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    className="text-xs"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "none",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                    formatter={(value: any, name: string) => {
                      if (name === "value") return [value, "Brûlages"];
                      if (name === "surface") return [value, "Surface (ha)"];
                      return [value, name];
                    }}
                  />
                  <Bar
                    dataKey="value"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                    fillOpacity={0.8}
                  />
                  <Line
                    type="monotone"
                    dataKey="additionalMetrics.surface"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Distribution par performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Distribution des Performances
            </CardTitle>
            <CardDescription>
              Répartition des brûlages par niveau de réussite
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              loading={dashboardLoading}
              error={dashboardError}
              title="distribution des performances"
            >
              {performanceDistribution.length > 0 &&
              performanceDistribution.some((item) => item.value > 0) ? (
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={performanceDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {performanceDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any, _name: string, props: any) => [
                        value,
                        `${props.payload.name} (${props.payload.metadata?.range})`,
                      ]}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-lg font-medium text-gray-700">
                        Aucune performance à afficher
                      </p>
                      <p className="text-sm text-gray-500 max-w-sm">
                        Aucun brûlage avec des données de performance pour les
                        critères sélectionnés. Essayez d'ajuster vos filtres ou
                        la période.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Conditions météorologiques et tendances saisonnières */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conditions optimales */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-100/50 to-transparent rounded-full -translate-y-16 translate-x-16" />
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5 text-blue-600" />
              Conditions Optimales
            </CardTitle>
            <CardDescription>
              Paramètres météo pour une réussite maximale
            </CardDescription>
          </CardHeader>
          <CardContent className="relative space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-800">
                    Température
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className="bg-orange-100 text-orange-700 border-orange-300"
                >
                  {conditionsOptimales.temperature}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    Humidité
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className="bg-blue-100 text-blue-700 border-blue-300"
                >
                  {conditionsOptimales.humidite}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2">
                  <Wind className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    Vent
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className="bg-green-100 text-green-700 border-green-300"
                >
                  {conditionsOptimales.vent}
                </Badge>
              </div>
            </div>

            {conditionsLoading && (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Données saisonnières */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-green-600" />
              Tendances Saisonnières
            </CardTitle>
            <CardDescription>Répartition par saison</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              loading={trendsLoading}
              error={trendsError}
              title="tendances saisonnières"
            >
              <div className="space-y-3">
                {getSeasonalData().map((season, index) => {
                  const icons = [Snowflake, Flower2, Sun, Leaf];
                  const colors = [
                    "text-blue-600",
                    "text-green-600",
                    "text-yellow-600",
                    "text-orange-600",
                  ];
                  const bgColors = [
                    "bg-blue-50",
                    "bg-green-50",
                    "bg-yellow-50",
                    "bg-orange-50",
                  ];
                  const borderColors = [
                    "border-blue-200",
                    "border-green-200",
                    "border-yellow-200",
                    "border-orange-200",
                  ];

                  const Icon = icons[index];
                  const total = getSeasonalData().reduce(
                    (sum, s) => sum + s.value,
                    0
                  );
                  const percentage =
                    total > 0 ? (season.value / total) * 100 : 0;

                  return (
                    <div
                      key={season.date}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg border",
                        bgColors[index],
                        borderColors[index]
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className={cn("h-4 w-4", colors[index])} />
                        <span className="text-sm font-medium">
                          {season.date}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{season.value}</div>
                        <div className="text-xs text-gray-600">
                          {percentage?.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recommandations - Pleine largeur */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-600" />
            Recommandations
          </CardTitle>
          <CardDescription>Optimisations suggérées</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.length > 0 ? (
              recommendations.slice(0, 6).map((rec, index) => (
                <div
                  key={index}
                  className={cn(
                    "p-4 rounded-lg border-l-4",
                    rec.priority === "critical"
                      ? "bg-red-50 border-red-500"
                      : rec.priority === "high"
                      ? "bg-orange-50 border-orange-500"
                      : rec.priority === "medium"
                      ? "bg-yellow-50 border-yellow-500"
                      : "bg-blue-50 border-blue-500"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "p-2 rounded-full mt-1",
                        rec.priority === "critical"
                          ? "bg-red-100"
                          : rec.priority === "high"
                          ? "bg-orange-100"
                          : rec.priority === "medium"
                          ? "bg-yellow-100"
                          : "bg-blue-100"
                      )}
                    >
                      <Zap
                        className={cn(
                          "h-4 w-4",
                          rec.priority === "critical"
                            ? "text-red-600"
                            : rec.priority === "high"
                            ? "text-orange-600"
                            : rec.priority === "medium"
                            ? "text-yellow-600"
                            : "text-blue-600"
                        )}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs",
                            rec.priority === "critical"
                              ? "bg-red-100 text-red-700 border-red-300"
                              : rec.priority === "high"
                              ? "bg-orange-100 text-orange-700 border-orange-300"
                              : rec.priority === "medium"
                              ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                              : "bg-blue-100 text-blue-700 border-blue-300"
                          )}
                        >
                          {rec.type}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs",
                            rec.priority === "critical"
                              ? "bg-red-100 text-red-700 border-red-300"
                              : rec.priority === "high"
                              ? "bg-orange-100 text-orange-700 border-orange-300"
                              : rec.priority === "medium"
                              ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                              : "bg-blue-100 text-blue-700 border-blue-300"
                          )}
                        >
                          {rec.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {rec.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500">
                <Lightbulb className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium">
                  Aucune recommandation disponible
                </p>
                <p className="text-sm mt-2">
                  Les recommandations apparaîtront ici en fonction de vos
                  données
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Résumé exécutif */}
      {summaryData && (
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50/50 to-indigo-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Résumé Exécutif
            </CardTitle>
            <CardDescription>
              Vue d'ensemble stratégique des performances
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* KPIs du résumé */}
            {summaryData.executive_summary && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-blue-200">
                  <div className="text-3xl font-bold text-blue-900 mb-2">
                    {summaryData.executive_summary.kpis.brulages.total.toLocaleString()}
                  </div>
                  <div className="text-sm text-blue-600 mb-3">
                    Total Brûlages
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp
                      className={cn(
                        "h-4 w-4",
                        summaryData.executive_summary.kpis.brulages.evolution <
                          0 && "rotate-180"
                      )}
                    />
                    <span className="text-sm font-medium">
                      {formatPercentageChange(
                        summaryData.executive_summary.kpis.brulages.evolution
                      )}
                    </span>
                    <span className="text-xs text-gray-600">
                      vs. période précédente
                    </span>
                  </div>
                </div>

                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-blue-200">
                  <div className="text-3xl font-bold text-green-900 mb-2">
                    {summaryData.executive_summary.kpis.surface.total.toLocaleString()}
                  </div>
                  <div className="text-sm text-green-600 mb-3">
                    Surface Totale (ha)
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Moyenne :</span>{" "}
                    {summaryData.executive_summary.kpis.surface.moyenne?.toFixed(
                      1
                    )}{" "}
                    ha
                  </div>
                </div>

                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-blue-200">
                  <div className="text-3xl font-bold text-purple-900 mb-2">
                    {summaryData.executive_summary.kpis.reussite.tauxMoyen?.toFixed(
                      1
                    )}
                    %
                  </div>
                  <div className="text-sm text-purple-600 mb-3">
                    Taux de Réussite
                  </div>
                  <div className="w-full bg-purple-200 rounded-full h-3">
                    <div
                      className="bg-purple-500 h-3 rounded-full transition-all duration-300"
                      style={{
                        width: `${summaryData.executive_summary.kpis.reussite.tauxMoyen}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Footer avec métadonnées */}
      <div className="text-center py-6 border-t border-gray-200">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>
                Dernière mise à jour:{" "}
                {new Date().toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            {dashboardData?.metadata?.generated_at && (
              <div className="flex items-center gap-1">
                <Activity className="h-4 w-4" />
                <span>
                  Généré:{" "}
                  {new Date(
                    dashboardData.metadata.generated_at
                  ).toLocaleDateString("fr-FR")}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {dashboardData?.metadata?.query_time && (
              <span>
                Temps de requête: {dashboardData.metadata.query_time}ms
              </span>
            )}
            <span>Analytics v2.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
