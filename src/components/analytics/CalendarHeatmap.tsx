import React, { useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Filter, Calendar as CalendarIcon } from "lucide-react";
import { ChartContainer } from "./ChartContainer";
import { cn } from "@/lib/utils";
import { useFiltersStore } from "@/store/filtersStore";
import type { AnalyticsTrendsApi } from "@/types/api";

interface CalendarHeatmapProps {
  trendsData: AnalyticsTrendsApi | undefined;
  loading: boolean;
  error: Error | null;
}

interface HeatmapCell {
  month: number;
  year: number;
  count: number;
  surface: number;
  intensity: number; // 0-1 pour la couleur
  label: string;
}

export const CalendarHeatmap: React.FC<CalendarHeatmapProps> = ({
  trendsData,
  loading,
  error,
}) => {
  // État local pour le nombre d'années à afficher (uniquement quand pas de filtre de date)
  const [selectedYears, setSelectedYears] = useState<number>(3);

  // Récupérer les filtres de date du store
  const dateStart = useFiltersStore((state) => state.filters.dateStart);
  const dateEnd = useFiltersStore((state) => state.filters.dateEnd);

  // Vérifier si des filtres de date sont actifs
  const hasDateFilters = Boolean(dateStart || dateEnd);

  const getMonthName = (month: number): string => {
    const months = [
      'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun',
      'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'
    ];
    return months[month - 1] || '';
  };

  // Calculer la plage d'années à afficher
  const yearRange = useMemo(() => {
    if (hasDateFilters) {
      // Utiliser les filtres de date
      const startYear = dateStart ? new Date(dateStart).getFullYear() : new Date().getFullYear() - 3;
      const endYear = dateEnd ? new Date(dateEnd).getFullYear() : new Date().getFullYear();
      return { start: startYear, end: endYear };
    } else {
      // Utiliser la sélection manuelle
      const currentYear = new Date().getFullYear();
      return { start: currentYear - selectedYears + 1, end: currentYear };
    }
  }, [hasDateFilters, dateStart, dateEnd, selectedYears]);

  const heatmapData = useMemo(() => {
    if (!trendsData?.seasonal_trends) return [];

    const data: HeatmapCell[] = [];
    const allValues: number[] = [];

    // Extraire toutes les données des saisons
    Object.values(trendsData.seasonal_trends).forEach(season => {
      season.details?.forEach(detail => {
        // Filtrer par plage d'années
        if (detail.year >= yearRange.start && detail.year <= yearRange.end) {
          allValues.push(detail.count);
          data.push({
            month: detail.month,
            year: detail.year,
            count: detail.count,
            surface: detail.surface,
            intensity: 0, // Sera calculé après
            label: `${getMonthName(detail.month)} ${detail.year}`,
          });
        }
      });
    });

    // Calculer l'intensité relative (0-1)
    const maxValue = Math.max(...allValues);
    const minValue = Math.min(...allValues.filter(v => v > 0));

    return data.map(cell => ({
      ...cell,
      intensity: cell.count === 0 ? 0 : (cell.count - minValue) / (maxValue - minValue || 1),
    }));
  }, [trendsData, yearRange, getMonthName]);

  const getIntensityColor = (intensity: number): string => {
    if (intensity === 0) return 'bg-gray-100';
    if (intensity < 0.2) return 'bg-blue-100';
    if (intensity < 0.4) return 'bg-blue-200';
    if (intensity < 0.6) return 'bg-blue-400';
    if (intensity < 0.8) return 'bg-blue-600';
    return 'bg-blue-800';
  };

  const getTextColor = (intensity: number): string => {
    return intensity > 0.5 ? 'text-white' : 'text-gray-700';
  };

  // Organiser les données par année et mois
  const yearlyData = useMemo(() => {
    const grouped: Record<number, HeatmapCell[]> = {};
    heatmapData.forEach(cell => {
      if (!grouped[cell.year]) grouped[cell.year] = [];
      grouped[cell.year].push(cell);
    });

    // Créer la liste complète des années dans la plage
    const years = [];
    for (let year = yearRange.start; year <= yearRange.end; year++) {
      years.push(year);
    }

    return years
      .sort((a, b) => b - a) // Plus récent en premier
      .map(year => ({
        year,
        months: Array.from({ length: 12 }, (_, i) => {
          const month = i + 1;
          const existing = grouped[year]?.find(c => c.month === month);
          return existing || {
            month,
            year,
            count: 0,
            surface: 0,
            intensity: 0,
            label: `${getMonthName(month)} ${year}`,
          };
        }),
      }));
  }, [heatmapData, yearRange, getMonthName]);

  // Options pour le sélecteur d'années
  const yearOptions = [
    { value: 2, label: "2 années" },
    { value: 3, label: "3 années" },
    { value: 4, label: "4 années" },
    { value: 5, label: "5 années" },
    { value: 7, label: "7 années" },
    { value: 10, label: "10 années" },
  ];

  // Statistiques pour la période sélectionnée
  const periodStats = useMemo(() => {
    if (heatmapData.length === 0) return null;

    const totalBrulages = heatmapData.reduce((sum, cell) => sum + cell.count, 0);
    const totalSurface = heatmapData.reduce((sum, cell) => sum + cell.surface, 0);
    const maxMensuel = Math.max(...heatmapData.map(cell => cell.count));
    const moisActif = heatmapData.filter(cell => cell.count > 0).length;

    return {
      totalBrulages,
      totalSurface,
      maxMensuel,
      moisActif,
      moyenneMensuelle: totalBrulages / Math.max(moisActif, 1),
    };
  }, [heatmapData]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Heatmap Calendaire
              {hasDateFilters && (
                <Badge variant="outline" className="ml-2">
                  <Filter className="h-3 w-3 mr-1" />
                  Filtré
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Intensité des brûlages par mois et année 
              {hasDateFilters 
                ? ` (${yearRange.start}-${yearRange.end})`
                : ` (${selectedYears} dernières années)`
              }
            </CardDescription>
          </div>

          {/* Sélecteur d'années - uniquement si pas de filtre de date */}
          {!hasDateFilters && (
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-gray-500" />
              <Select value={selectedYears.toString()} onValueChange={(value) => setSelectedYears(Number(value))}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Statistiques de la période */}
        {periodStats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{periodStats.totalBrulages}</div>
              <div className="text-xs text-gray-600">Total brûlages</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{periodStats.totalSurface.toFixed(1)}</div>
              <div className="text-xs text-gray-600">Surface totale (ha)</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">{periodStats.maxMensuel}</div>
              <div className="text-xs text-gray-600">Max mensuel</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600">{periodStats.moisActif}</div>
              <div className="text-xs text-gray-600">Mois actifs</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-teal-600">{periodStats.moyenneMensuelle.toFixed(1)}</div>
              <div className="text-xs text-gray-600">Moyenne/mois</div>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <ChartContainer
          loading={loading}
          error={error}
          title="heatmap calendaire"
        >
          <div className="space-y-4">
            {/* Légende */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Moins</span>
              <div className="flex items-center gap-1">
                {[0, 0.2, 0.4, 0.6, 0.8, 1].map((intensity) => (
                  <div
                    key={intensity}
                    className={cn(
                      "w-3 h-3 rounded-sm",
                      getIntensityColor(intensity)
                    )}
                  />
                ))}
              </div>
              <span className="text-gray-600">Plus</span>
            </div>

            {/* Information sur la période affichée */}
            {hasDateFilters && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Filter className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-800">
                  Affichage basé sur les filtres de date actifs ({yearRange.start} - {yearRange.end})
                </span>
              </div>
            )}

            {/* Grille calendaire */}
            <div className="space-y-3">
              {yearlyData.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Aucune donnée disponible pour la période sélectionnée
                </div>
              ) : (
                yearlyData.map(({ year, months }) => (
                  <div key={year} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium text-gray-700">{year}</div>
                      <div className="text-xs text-gray-500">
                        ({months.reduce((sum, m) => sum + m.count, 0)} brûlages)
                      </div>
                    </div>
                    <div className="grid grid-cols-12 gap-1">
                      {months.map((cell) => (
                        <div
                          key={`${cell.year}-${cell.month}`}
                          className={cn(
                            "relative w-full h-8 rounded text-xs flex items-center justify-center cursor-pointer transition-all hover:scale-105",
                            getIntensityColor(cell.intensity),
                            getTextColor(cell.intensity)
                          )}
                          title={`${cell.label}: ${cell.count} brûlages, ${cell.surface.toFixed(1)} ha`}
                        >
                          <span className="font-medium">
                            {getMonthName(cell.month)}
                          </span>
                          {cell.count > 0 && (
                            <div className="absolute -top-1 -right-1 bg-white text-gray-700 text-xs rounded-full w-4 h-4 flex items-center justify-center border">
                              {cell.count}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Note explicative */}
            <div className="text-xs text-gray-500 text-center pt-2 border-t">
              {hasDateFilters 
                ? "Supprimez les filtres de date pour utiliser le sélecteur d'années"
                : "Vous pouvez ajuster le nombre d'années affichées avec le sélecteur ci-dessus"
              }
            </div>
          </div>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};