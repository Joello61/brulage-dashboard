import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp } from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Line,
} from "recharts";
import { ChartContainer } from "./ChartContainer";
import type { TimeSeriesDataPoint } from "@/types/analytics";

interface HistoricalChartProps {
  data: TimeSeriesDataPoint[];
  yearsForTrends: number;
  onYearsChange: (years: number) => void;
  loading: boolean;
  error: Error | null;
}

export const HistoricalChart: React.FC<HistoricalChartProps> = ({
  data,
  yearsForTrends,
  onYearsChange,
  loading,
  error,
}) => {
  return (
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
            onValueChange={(value) => onYearsChange(Number(value))}
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
          loading={loading}
          error={error}
          title="évolution temporelle"
        >
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                className="text-xs"
              />
              <YAxis axisLine={false} tickLine={false} className="text-xs" />
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
  );
};