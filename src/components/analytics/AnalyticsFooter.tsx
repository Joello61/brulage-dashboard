import React from "react";
import { Calendar, Activity } from "lucide-react";

interface AnalyticsFooterProps {
  metadata?: {
    generated_at?: string;
    query_time?: number;
  };
}

export const AnalyticsFooter: React.FC<AnalyticsFooterProps> = ({ metadata }) => {
  return (
    <div className="text-center py-6 border-t border-gray-200">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>
              Dernière mise à jour:{" "}
              {new Date().toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          {metadata?.generated_at && (
            <div className="flex items-center gap-1">
              <Activity className="h-4 w-4" />
              <span>
                Généré: {new Date(metadata.generated_at).toLocaleDateString("fr-FR")}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {metadata?.query_time && (
            <span>Temps de requête: {metadata.query_time}ms</span>
          )}
          <span>Analytics v2.0</span>
        </div>
      </div>
    </div>
  );
};