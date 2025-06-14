import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Tooltip } from "recharts";
import { ChartContainer } from "./ChartContainer";
import type { ChartDataPoint } from "@/types/analytics";

interface PerformanceChartProps {
  data: ChartDataPoint[];
  loading: boolean;
  error: Error | null;
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({
  data,
  loading,
  error,
}) => {
  const hasData = data.length > 0 && data.some((item) => item.value > 0);

  return (
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
        <ChartContainer loading={loading} error={error} title="distribution des performances">
          {hasData ? (
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {data.map((entry, index) => (
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
  );
};