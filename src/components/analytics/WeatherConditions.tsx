import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Cloud, Thermometer, Droplets, Wind } from "lucide-react";

interface WeatherConditionsProps {
  conditions: {
    temperature: string;
    humidite: string;
    vent: string;
  };
  loading: boolean;
}

export const WeatherConditions: React.FC<WeatherConditionsProps> = ({
  conditions,
  loading,
}) => {
  return (
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
              {conditions.temperature}
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
              {conditions.humidite}
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
              {conditions.vent}
            </Badge>
          </div>
        </div>

        {loading && (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};