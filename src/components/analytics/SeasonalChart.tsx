import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Leaf, Snowflake, Flower2, Sun } from "lucide-react";
import { ChartContainer } from "./ChartContainer";
import { cn } from "@/lib/utils";
import type { TimeSeriesDataPoint } from "@/types/analytics";

interface SeasonalChartProps {
  data: TimeSeriesDataPoint[];
  loading: boolean;
  error: Error | null;
}

export const SeasonalChart: React.FC<SeasonalChartProps> = ({
  data,
  loading,
  error,
}) => {
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

  const total = data.reduce((sum, s) => sum + s.value, 0);

  return (
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
          loading={loading}
          error={error}
          title="tendances saisonnières"
        >
          <div className="space-y-3">
            {data.map((season, index) => {
              const Icon = icons[index];
              const percentage = total > 0 ? (season.value / total) * 100 : 0;

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
                    <span className="text-sm font-medium">{season.date}</span>
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
  );
};