import React, { useMemo } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cloud, Thermometer, Droplets, Wind, Target } from "lucide-react";
import { ChartContainer } from "./ChartContainer";
import { cn } from "@/lib/utils";
import type { AnalyticsTrendsApi } from "@/types/api";

interface WeatherRadarProps {
  trendsData: AnalyticsTrendsApi | undefined;
  loading: boolean;
  error: Error | null;
}

interface WeatherMetric {
  name: string;
  value: number;
  optimal: number;
  unit: string;
  icon: React.ComponentType<any>;
  color: string;
  normalizedValue: number; // 0-1 pour le radar
  isOptimal: boolean;
}

export const WeatherRadar: React.FC<WeatherRadarProps> = ({
  trendsData,
  loading,
  error,
}) => {
  const weatherMetrics = useMemo((): WeatherMetric[] => {
    if (!trendsData?.success_factors?.meteo) {
      return [
        {
          name: "Température",
          value: 0,
          optimal: 15,
          unit: "°C",
          icon: Thermometer,
          color: "text-orange-600",
          normalizedValue: 0,
          isOptimal: false,
        },
        {
          name: "Humidité",
          value: 0,
          optimal: 60,
          unit: "%",
          icon: Droplets,
          color: "text-blue-600",
          normalizedValue: 0,
          isOptimal: false,
        },
        {
          name: "Vent",
          value: 0,
          optimal: 10,
          unit: "km/h",
          icon: Wind,
          color: "text-green-600",
          normalizedValue: 0,
          isOptimal: false,
        },
      ];
    }

    const meteo = trendsData.success_factors.meteo;
    
    return [
      {
        name: "Température",
        value: parseFloat(meteo.temperature_optimale?.toString() || '0'),
        optimal: parseFloat(meteo.temperature_optimale?.toString() || '0'),
        unit: "°C",
        icon: Thermometer,
        color: "text-orange-600",
        normalizedValue: Math.min(parseFloat(meteo.temperature_optimale?.toString() || '0') / 40, 1),
        isOptimal: true,
      },
      {
        name: "Humidité",
        value: parseFloat(meteo.humidite_optimale?.toString() || '0'),
        optimal: parseFloat(meteo.humidite_optimale?.toString() || '0'),
        unit: "%",
        icon: Droplets,
        color: "text-blue-600",
        normalizedValue: parseFloat(meteo.humidite_optimale?.toString() || '0') / 100,
        isOptimal: true,
      },
      {
        name: "Vent",
        value: parseFloat(meteo.vent_optimal?.toString() || '0'),
        optimal: parseFloat(meteo.vent_optimal?.toString() || '0'),
        unit: "km/h",
        icon: Wind,
        color: "text-green-600",
        normalizedValue: Math.min(parseFloat(meteo.vent_optimal?.toString() || '0') / 30, 1),
        isOptimal: true,
      },
    ];
  }, [trendsData]);

  // Coordonnées pour le radar (polygone)
  const radarPoints = useMemo(() => {
    const centerX = 120;
    const centerY = 120;
    const radius = 80;
    const angleStep = (2 * Math.PI) / weatherMetrics.length;

    return weatherMetrics.map((metric, index) => {
      const angle = index * angleStep - Math.PI / 2; // Commencer en haut
      const x = centerX + radius * metric.normalizedValue * Math.cos(angle);
      const y = centerY + radius * metric.normalizedValue * Math.sin(angle);
      return { x, y, metric };
    });
  }, [weatherMetrics]);

  // Points de la grille du radar
  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];
  const gridPoints = useMemo(() => {
    const centerX = 120;
    const centerY = 120;
    const radius = 80;
    const angleStep = (2 * Math.PI) / weatherMetrics.length;

    return gridLevels.map(level => {
      const points = weatherMetrics.map((_, index) => {
        const angle = index * angleStep - Math.PI / 2;
        const x = centerX + radius * level * Math.cos(angle);
        const y = centerY + radius * level * Math.sin(angle);
        return `${x},${y}`;
      }).join(' ');
      return { level, points };
    });
  }, [weatherMetrics]);

  // Axes du radar
  const axisLines = useMemo(() => {
    const centerX = 120;
    const centerY = 120;
    const radius = 80;
    const angleStep = (2 * Math.PI) / weatherMetrics.length;

    return weatherMetrics.map((metric, index) => {
      const angle = index * angleStep - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      return { x1: centerX, y1: centerY, x2: x, y2: y, metric };
    });
  }, [weatherMetrics]);

  const polygonPath = radarPoints.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cloud className="h-5 w-5 text-blue-600" />
          Radar des Conditions Météo
        </CardTitle>
        <CardDescription>
          Conditions optimales pour les brûlages dirigés
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          loading={loading}
          error={error}
          title="radar météorologique"
        >
          <div className="space-y-6">
            {/* Graphique radar SVG */}
            <div className="flex justify-center">
              <svg width="240" height="240" viewBox="0 0 240 240" className="drop-shadow-sm">
                {/* Grilles circulaires */}
                {gridPoints.map(({ level, points }) => (
                  <polygon
                    key={level}
                    points={points}
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="1"
                    opacity={0.5}
                  />
                ))}

                {/* Axes */}
                {axisLines.map((line, index) => (
                  <line
                    key={index}
                    x1={line.x1}
                    y1={line.y1}
                    x2={line.x2}
                    y2={line.y2}
                    stroke="#d1d5db"
                    strokeWidth="1"
                    opacity={0.7}
                  />
                ))}

                {/* Polygone des valeurs */}
                <polygon
                  points={polygonPath}
                  fill="rgba(59, 130, 246, 0.2)"
                  stroke="#3b82f6"
                  strokeWidth="2"
                />

                {/* Points de données */}
                {radarPoints.map((point, index) => (
                  <circle
                    key={index}
                    cx={point.x}
                    cy={point.y}
                    r="4"
                    fill="#3b82f6"
                    stroke="white"
                    strokeWidth="2"
                  />
                ))}

                {/* Labels des métriques */}
                {axisLines.map((line, index) => {
                  const metric = weatherMetrics[index];
                  const Icon = metric.icon;
                  const offset = 15;
                  const labelX = line.x2 + (line.x2 > 120 ? offset : -offset);
                  const labelY = line.y2 + (line.y2 > 120 ? offset : -offset);

                  return (
                    <g key={index}>
                      <text
                        x={labelX}
                        y={labelY}
                        textAnchor={line.x2 > 120 ? "start" : "end"}
                        className="text-xs font-medium fill-gray-700"
                      >
                        {metric.name}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Détails des métriques */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {weatherMetrics.map((metric, _index) => {
                const Icon = metric.icon;
                return (
                  <div
                    key={metric.name}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className={cn("p-2 rounded-lg bg-white", metric.color)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{metric.name}</div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">
                          {metric.value.toFixed(1)}{metric.unit}
                        </span>
                        {metric.isOptimal && (
                          <Badge
                            variant="outline"
                            className="text-xs bg-green-100 text-green-700 border-green-300"
                          >
                            <Target className="h-3 w-3 mr-1" />
                            Optimal
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Direction du vent préférée */}
            {trendsData?.success_factors?.meteo?.direction_preferee && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 text-blue-800">
                  <Wind className="h-4 w-4" />
                  <span className="font-medium">Direction optimale du vent :</span>
                  <Badge
                    variant="outline"
                    className="bg-blue-100 text-blue-700 border-blue-300"
                  >
                    {trendsData.success_factors.meteo.direction_preferee}
                  </Badge>
                </div>
              </div>
            )}

            {/* Zone d'informations */}
            <div className="text-center text-sm text-gray-600 space-y-1">
              <p>Plus la zone bleue est grande, plus les conditions sont proches de l'optimal</p>
              <p className="text-xs">Basé sur l'analyse des brûlages les plus réussis</p>
            </div>
          </div>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};