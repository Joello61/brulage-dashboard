import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Filter, Calendar, MapPin, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DatePreset {
  label: string;
  value: string;
  dateStart: string;
  dateEnd: string;
  icon: any;
}

interface AnalyticsFiltersProps {
  dateStart?: string;
  dateEnd?: string;
  commune?: string;
  statut?: string;
  type?: string;
  communes: string[];
  hasActiveFilters: boolean;
  onSetFilters: (filters: any) => void;
  onResetFilters: () => void;
  datePresets: DatePreset[];
}

export const AnalyticsFilters: React.FC<AnalyticsFiltersProps> = ({
  dateStart,
  dateEnd,
  commune,
  statut,
  type,
  communes,
  hasActiveFilters,
  onSetFilters,
  onResetFilters,
  datePresets,
}) => {
  const [tempDateStart, setTempDateStart] = useState(dateStart || "");
  const [tempDateEnd, setTempDateEnd] = useState(dateEnd || "");

  const handleApplyDateFilter = () => {
    onSetFilters({
      dateStart: tempDateStart || undefined,
      dateEnd: tempDateEnd || undefined,
    });
  };

  const handlePresetSelect = (preset: DatePreset) => {
    setTempDateStart(preset.dateStart);
    setTempDateEnd(preset.dateEnd);
    onSetFilters({
      dateStart: preset.dateStart,
      dateEnd: preset.dateEnd,
    });
  };

  const handleClearDateFilter = () => {
    setTempDateStart("");
    setTempDateEnd("");
    onSetFilters({
      dateStart: undefined,
      dateEnd: undefined,
    });
  };

  const statuts = [
    { value: "", label: "Tous les statuts" },
    { value: "EN_COURS", label: "En cours" },
    { value: "TERMINE", label: "Terminé" },
    { value: "ANNULE", label: "Annulé" },
  ];

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-blue-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-blue-900 flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtres Analytics
        </h3>
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onResetFilters}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            <X className="h-4 w-4 mr-1" />
            Réinitialiser
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Filtre par dates */}
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-blue-800 mb-2 block">
            Période d'analyse
          </label>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "flex-1 justify-start bg-white border-blue-300",
                    (dateStart || dateEnd) && "border-blue-500 bg-blue-50"
                  )}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  {(dateStart || dateEnd) ? "Période active" : "Sélectionner"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="start">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Période d'analyse</h4>
                    <p className="text-xs text-gray-600">
                      Filtrez les données par période
                    </p>
                  </div>

                  {/* Préréglages rapides */}
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Préréglages</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {datePresets.map((preset) => (
                        <Button
                          key={preset.value}
                          variant="outline"
                          size="sm"
                          onClick={() => handlePresetSelect(preset)}
                          className="justify-start text-xs h-8"
                        >
                          <preset.icon className="h-3 w-3 mr-1" />
                          {preset.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Sélection manuelle */}
                  <div className="space-y-3">
                    <Label className="text-xs font-medium">Dates personnalisées</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label htmlFor="dateStart" className="text-xs text-gray-600">
                          Date début
                        </Label>
                        <Input
                          id="dateStart"
                          type="date"
                          value={tempDateStart}
                          onChange={(e) => setTempDateStart(e.target.value)}
                          className="text-xs h-8"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="dateEnd" className="text-xs text-gray-600">
                          Date fin
                        </Label>
                        <Input
                          id="dateEnd"
                          type="date"
                          value={tempDateEnd}
                          onChange={(e) => setTempDateEnd(e.target.value)}
                          className="text-xs h-8"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t">
                    <Button
                      size="sm"
                      onClick={handleApplyDateFilter}
                      className="flex-1 h-8"
                    >
                      <Filter className="h-3 w-3 mr-1" />
                      Appliquer
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleClearDateFilter}
                      className="h-8"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Filtre par commune */}
        <div>
          <label className="text-sm font-medium text-blue-800 mb-2 block">
            Commune
          </label>
          <Select
            value={commune || ""}
            onValueChange={(value) =>
              onSetFilters({ commune: value === "all" ? undefined : value })
            }
          >
            <SelectTrigger className="bg-white border-blue-300 focus:border-blue-500">
              <SelectValue placeholder="Toutes les communes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Toutes les communes
                </div>
              </SelectItem>
              {communes.map((communeName: string) => (
                <SelectItem key={communeName} value={communeName || "default"}>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {communeName}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Indicateurs de filtres actifs */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-blue-200">
          <span className="text-xs font-medium text-blue-700">
            Filtres actifs :
          </span>
          {dateStart && (
            <Badge
              variant="outline"
              className="text-xs bg-blue-50 text-blue-700 border-blue-300"
            >
              {dateStart} {dateEnd && `- ${dateEnd}`}
            </Badge>
          )}
          {commune && (
            <Badge
              variant="outline"
              className="text-xs bg-blue-50 text-blue-700 border-blue-300"
            >
              {commune}
            </Badge>
          )}
          {statut && (
            <Badge
              variant="outline"
              className="text-xs bg-blue-50 text-blue-700 border-blue-300"
            >
              {statuts.find((s) => s.value === statut)?.label}
            </Badge>
          )}
          {type && (
            <Badge
              variant="outline"
              className="text-xs bg-blue-50 text-blue-700 border-blue-300"
            >
              {type}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};