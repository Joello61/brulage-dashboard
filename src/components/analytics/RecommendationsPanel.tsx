import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface Recommendation {
  type: string;
  message: string;
  priority: "critical" | "high" | "medium" | "low";
}

interface RecommendationsPanelProps {
  recommendations: Recommendation[];
}

export const RecommendationsPanel: React.FC<RecommendationsPanelProps> = ({
  recommendations,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-600" />
          Recommandations
        </CardTitle>
        <CardDescription>Optimisations suggérées</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
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
                Les recommandations apparaîtront ici en fonction de vos données
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};