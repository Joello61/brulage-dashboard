import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Users, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPercentageChange } from "@/types/analytics";

interface ExecutiveSummaryProps {
  summaryData: any;
}

export const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({
  summaryData,
}) => {
  if (!summaryData?.executive_summary) return null;

  return (
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-blue-200">
            <div className="text-3xl font-bold text-blue-900 mb-2">
              {summaryData.executive_summary.kpis.brulages.total.toLocaleString()}
            </div>
            <div className="text-sm text-blue-600 mb-3">Total Brûlages</div>
            <div className="flex items-center gap-2">
              <TrendingUp
                className={cn(
                  "h-4 w-4",
                  summaryData.executive_summary.kpis.brulages.evolution < 0 &&
                    "rotate-180"
                )}
              />
              <span className="text-sm font-medium">
                {formatPercentageChange(
                  summaryData.executive_summary.kpis.brulages.evolution
                )}
              </span>
              <span className="text-xs text-gray-600">vs. période précédente</span>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-blue-200">
            <div className="text-3xl font-bold text-green-900 mb-2">
              {summaryData.executive_summary.kpis.surface.total.toLocaleString()}
            </div>
            <div className="text-sm text-green-600 mb-3">Surface Totale (ha)</div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Moyenne :</span>{" "}
              {summaryData.executive_summary.kpis.surface.moyenne?.toFixed(1)} ha
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-blue-200">
            <div className="text-3xl font-bold text-purple-900 mb-2">
              {summaryData.executive_summary.kpis.reussite.tauxMoyen?.toFixed(1)}%
            </div>
            <div className="text-sm text-purple-600 mb-3">Taux de Réussite</div>
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
      </CardContent>
    </Card>
  );
};