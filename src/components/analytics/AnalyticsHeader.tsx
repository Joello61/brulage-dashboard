import React from "react";
import { Button } from "@/components/ui/button";
import { BarChart3, RefreshCw, Calendar, X } from "lucide-react";

interface AnalyticsHeaderProps {
  hasDateFilters: boolean;
  dateStart?: string;
  dateEnd?: string;
  onRefresh: () => void;
  onExportPdf: () => void;
  onClearDateFilter: () => void;
}

export const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({
  hasDateFilters,
  dateStart,
  dateEnd,
  onRefresh,
  onClearDateFilter,
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/40 rounded-2xl border border-blue-100/60 p-6 md:p-8">
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-100/40 to-transparent rounded-full -translate-y-48 translate-x-48" />
      <div className="relative space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl shadow-lg">
                <BarChart3 className="h-6 w-6 md:h-8 md:w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
                  Analytics
                </h1>
                <p className="text-sm md:text-base text-gray-600 font-medium">
                  Analyses et tendances des brûlages dirigés
                </p>
              </div>
            </div>

            {hasDateFilters && (
              <div className="flex items-center gap-2 pt-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">
                  Période : {dateStart}
                  {dateEnd && dateStart !== dateEnd && ` → ${dateEnd}`}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onClearDateFilter}
                  className="h-6 w-6 p-0 text-blue-600 hover:bg-blue-100"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>

          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                className="bg-white/60 backdrop-blur-sm border-blue-200 hover:bg-blue-50"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualiser
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};