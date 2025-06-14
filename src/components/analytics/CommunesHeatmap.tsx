import React, { useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Eye, EyeOff } from "lucide-react";
import { ChartContainer } from "./ChartContainer";
import { cn } from "@/lib/utils";
import type { AnalyticsTrendsApi } from "@/types/api";

interface CommunesHeatmapProps {
  trendsData: AnalyticsTrendsApi | undefined;
  loading: boolean;
  error: Error | null;
}

interface CommuneData {
  nom: string;
  count: number;
  surface: number;
  intensity: number; // 0-1 pour la couleur
  surfaceAverage: number;
}

export const CommunesHeatmap: React.FC<CommunesHeatmapProps> = ({
  trendsData,
  loading,
  error,
}) => {
  // État pour le nombre de communes à afficher
  const [displayCount, setDisplayCount] = useState<number>(6);
  const [showAllRanks, setShowAllRanks] = useState<boolean>(true);

  const communesData = useMemo(() => {
    if (!trendsData?.recent_trends?.top_communes) return [];

    const communes = trendsData.recent_trends.top_communes;
    const maxCount = Math.max(...communes.map(c => c.count));
    const minCount = Math.min(...communes.filter(c => c.count > 0).map(c => c.count));

    return communes
      .map((commune): CommuneData => ({
        nom: commune.nom_commune || 'Commune inconnue',
        count: commune.count,
        surface: parseFloat(commune.surface?.toString() || '0'),
        intensity: maxCount > minCount ? (commune.count - minCount) / (maxCount - minCount) : 0,
        surfaceAverage: parseFloat(commune.surface?.toString() || '0') / Math.max(commune.count, 1),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, Math.min(displayCount, 25)); // Limiter à 50 max pour les performances
  }, [trendsData, displayCount]);

  const getIntensityColor = (intensity: number): string => {
    if (intensity < 0.2) return 'bg-green-100 border-green-200';
    if (intensity < 0.4) return 'bg-green-200 border-green-300';
    if (intensity < 0.6) return 'bg-green-400 border-green-500';
    if (intensity < 0.8) return 'bg-green-600 border-green-700';
    return 'bg-green-800 border-green-900';
  };

  const getTextColor = (intensity: number): string => {
    return intensity > 0.5 ? 'text-white' : 'text-gray-700';
  };

  const getRankTextColor = (intensity: number): string => {
    // Toujours utiliser du noir sur blanc pour une meilleure lisibilité
    return 'text-gray-800';
  };

  const getPerformanceLevel = (count: number): { label: string; color: string } => {
    if (count >= 100) return { label: 'Très actif', color: 'bg-red-100 text-red-700 border-red-300' };
    if (count >= 50) return { label: 'Actif', color: 'bg-orange-100 text-orange-700 border-orange-300' };
    if (count >= 20) return { label: 'Modéré', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' };
    if (count >= 10) return { label: 'Faible', color: 'bg-blue-100 text-blue-700 border-blue-300' };
    return { label: 'Très faible', color: 'bg-gray-100 text-gray-700 border-gray-300' };
  };

  // Options pour le nombre de communes à afficher
  const displayOptions = [
    { value: 6, label: "Top 6" },
    { value: 12, label: "Top 12" },
    { value: 18, label: "Top 18" },
    { value: 24, label: "Top 24" },
  ];

  // Calculs statistiques
  const stats = useMemo(() => {
    if (communesData.length === 0) return null;

    return {
      totalCommunes: communesData.length,
      totalBrulages: communesData.reduce((sum, c) => sum + c.count, 0),
      totalSurface: communesData.reduce((sum, c) => sum + c.surface, 0),
      averagePerCommune: communesData.reduce((sum, c) => sum + c.count, 0) / communesData.length,
      topCommune: communesData[0],
    };
  }, [communesData]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-600" />
              Carte de Chaleur des Communes
            </CardTitle>
            <CardDescription>
              Activité des brûlages par commune (Top {displayCount})
            </CardDescription>
          </div>

          {/* Contrôles */}
          <div className="flex items-center gap-2">
            {/* Sélecteur du nombre de communes */}
            <Select value={displayCount.toString()} onValueChange={(value) => setDisplayCount(Number(value))}>
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {displayOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value.toString()}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Toggle pour afficher/masquer les rangs */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAllRanks(!showAllRanks)}
              className="gap-1"
            >
              {showAllRanks ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              Rangs
            </Button>
          </div>
        </div>

        {/* Statistiques générales */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{stats.totalCommunes}</div>
              <div className="text-xs text-gray-600">Communes affichées</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{stats.totalBrulages}</div>
              <div className="text-xs text-gray-600">Total brûlages</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">
                {stats.totalSurface.toFixed(1)}
              </div>
              <div className="text-xs text-gray-600">Surface totale (ha)</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600">
                {stats.averagePerCommune.toFixed(1)}
              </div>
              <div className="text-xs text-gray-600">Moyenne/commune</div>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <ChartContainer
          loading={loading}
          error={error}
          title="carte de chaleur des communes"
        >
          <div className="space-y-4">
            {/* Information sur la vue actuelle */}
            <div className="text-sm text-gray-600 flex items-center justify-between">
              <span>Affichage de {communesData.length} commune(s) les plus actives</span>
              {stats?.topCommune && (
                <span className="font-medium">
                  Leader: {stats.topCommune.nom} ({stats.topCommune.count} brûlages)
                </span>
              )}
            </div>

            {/* Grille des communes - Adaptative selon le nombre */}
            <div className={cn(
              "grid gap-3",
              displayCount <= 6 ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" :
              displayCount <= 12 ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" :
              "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
            )}>
              {communesData.map((commune, index) => {
                const performance = getPerformanceLevel(commune.count);
                return (
                  <div
                    key={`${commune.nom}-${index}`}
                    className={cn(
                      "relative p-4 rounded-lg border transition-all hover:scale-105 cursor-pointer",
                      getIntensityColor(commune.intensity),
                      getTextColor(commune.intensity)
                    )}
                  >
                    {/* Rang - Amélioré pour la visibilité */}
                    {showAllRanks && (
                      <div className={cn(
                        "absolute -top-2 -left-2 w-7 h-7 bg-white border-2 rounded-full flex items-center justify-center text-xs font-bold shadow-sm",
                        "border-gray-300",
                        getRankTextColor(commune.intensity)
                      )}>
                        {index + 1}
                      </div>
                    )}

                    {/* Badge de performance - Repositionné si pas de rang */}
                    <div className={cn(
                      "absolute -top-2",
                      showAllRanks ? "-right-2" : "-left-2"
                    )}>
                      <Badge
                        variant="outline"
                        className={cn("text-xs", performance.color)}
                      >
                        {performance.label}
                      </Badge>
                    </div>

                    {/* Contenu principal */}
                    <div className="pt-2 space-y-2">
                      <div className="font-medium text-sm leading-tight pr-8">
                        {commune.nom}
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <div className="font-bold text-base">{commune.count}</div>
                          <div className="opacity-80">brûlages</div>
                        </div>
                        <div>
                          <div className="font-bold text-base">{commune.surface.toFixed(1)}</div>
                          <div className="opacity-80">ha</div>
                        </div>
                      </div>

                      <div className="text-xs opacity-80">
                        Moyenne: {commune.surfaceAverage.toFixed(1)} ha/brûlage
                      </div>
                    </div>

                    {/* Barre d'intensité */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-black bg-opacity-20 rounded-b-lg">
                      <div
                        className="h-full bg-white bg-opacity-60 rounded-bl-lg transition-all duration-300"
                        style={{ width: `${commune.intensity * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Légende */}
            <div className="flex items-center justify-center gap-4 pt-4 border-t text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
                <span>Faible activité</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 border border-green-500 rounded"></div>
                <span>Activité modérée</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-800 border border-green-900 rounded"></div>
                <span>Forte activité</span>
              </div>
            </div>

            {/* Note d'information */}
            <div className="text-xs text-gray-500 text-center">
              Utilisez le sélecteur pour ajuster le nombre de communes affichées
            </div>
          </div>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};