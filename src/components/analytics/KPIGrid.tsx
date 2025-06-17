import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Target, Gauge, MapPin, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPercentageChange } from "@/types/analytics";

interface KPIData {
  total: number;
  surface: number;
  efficacite: number;
  communes: number;
  evolution: number;
}

interface KPIGridProps {
  data: KPIData;
}

export const KPIGrid: React.FC<KPIGridProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100 rounded-full -translate-y-12 translate-x-12 opacity-30" />
        <CardHeader className="relative pb-2">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <div className="text-right">
              <p className="text-xs text-blue-600 font-medium">Total Brûlages</p>
              <p className="text-2xl font-bold text-blue-900">
                {data.total.toLocaleString()}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative pt-0">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                data.evolution >= 0
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              )}
            >
              <TrendingUp
                className={cn("h-3 w-3", data.evolution < 0 && "rotate-180")}
              />
              {formatPercentageChange(data.evolution)}
            </div>
            <span className="text-xs text-gray-600">vs période précédente</span>
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
              <p className="text-xs text-green-600 font-medium">Surface Totale</p>
              <p className="text-2xl font-bold text-green-900">
                {data.surface.toLocaleString()} ha
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
              Moyenne: {(data.surface / Math.max(data.total, 1))?.toFixed(1)} ha
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
                {data.efficacite?.toFixed(1)}%
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative pt-0">
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-purple-100 rounded-full h-2">
              <div
                className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${data.efficacite}%` }}
              />
            </div>
            <span className="text-xs text-purple-700 font-medium">
              {data.efficacite > 80
                ? "Excellent"
                : data.efficacite > 60
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
              <p className="text-2xl font-bold text-orange-900">{data.communes}</p>
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
  );
};