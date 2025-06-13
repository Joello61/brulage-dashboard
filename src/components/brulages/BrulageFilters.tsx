import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  X, 
  MapPin,
  Activity,
  Grid3X3,
  Map,
  Table
} from 'lucide-react';
import { useFiltersStore } from '@/store/filtersStore';
import { cn } from '@/lib/utils';

interface BrulageFiltersProps {
  resultCount?: number;
  communes?: string[];
  className?: string;
}

export function BrulageFilters({ 
  resultCount = 0, 
  communes = [], 
  className 
}: BrulageFiltersProps) {
  const {
    filters,
    searchQuery,
    quickFilter,
    view,
    filtersVisible,
    setFilters,
    setSearchQuery,
    setQuickFilter,
    setView,
    resetFilters,
    toggleFiltersVisible,
    hasActiveFilters,
    getFilterCount
  } = useFiltersStore();

  const statuts = [
    { value: '', label: 'Tous les statuts' },
    { value: 'En cours', label: 'En cours' },
    { value: 'Réalisé', label: 'Terminé' },
    { value: 'annulé', label: 'Annulé' }
  ];

  const quickFilters = [
    { value: 'all', label: 'Tous', icon: Activity },
    { value: 'Réalisé', label: 'Réalisés', icon: Activity }
  ];

  const views = [
    { value: 'cards', label: 'Cartes', icon: Grid3X3 },
    { value: 'table', label: 'Tableau', icon: Table },
    { value: 'map', label: 'Carte', icon: Map }
  ];

  return (
    <div className={cn('space-y-4', className)}>
      {/* Barre principale avec recherche et actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Recherche */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher brûlage, commune..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-gray-200 focus:border-orange-300 transition-all duration-200"
          />
        </div>

        {/* Actions et vue */}
        <div className="flex items-center gap-3">
          {/* Compteur de résultats */}
          <Badge variant="outline" className="flex items-center gap-1">
            <Activity className="h-3 w-3" />
            {resultCount} résultats
          </Badge>

          {/* Sélecteur de vue */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            {views.map((viewOption) => {
              const Icon = viewOption.icon;
              return (
                <Button
                  key={viewOption.value}
                  size="sm"
                  variant={view === viewOption.value ? "default" : "ghost"}
                  onClick={() => setView(viewOption.value as any)}
                  className={cn(
                    "h-8 px-3",
                    view === viewOption.value && "shadow-sm"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline ml-1">{viewOption.label}</span>
                </Button>
              );
            })}
          </div>

          {/* Bouton filtres (mobile) */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFiltersVisible}
            className="sm:hidden"
          >
            <Filter className="h-4 w-4" />
            {getFilterCount() > 0 && (
              <Badge className="ml-1 h-4 w-4 p-0 text-xs">{getFilterCount()}</Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Filtres rapides */}
      <div className="flex flex-wrap gap-2">
        {quickFilters.map((filter) => {
          const Icon = filter.icon;
          return (
            <Button
              key={filter.value}
              variant={quickFilter === filter.value ? "default" : "outline"}
              size="sm"
              onClick={() => setQuickFilter(filter.value as any)}
              className={cn(
                "h-8",
                quickFilter === filter.value && "bg-orange-500 hover:bg-orange-600"
              )}
            >
              <Icon className="h-3 w-3 mr-1" />
              {filter.label}
            </Button>
          );
        })}
      </div>

      {/* Panneau de filtres détaillés */}
      {filtersVisible && (
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Filter className="h-5 w-5 text-orange-500" />
                Filtres avancés
              </CardTitle>
              {hasActiveFilters() && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetFilters}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <X className="h-4 w-4 mr-1" />
                  Réinitialiser
                </Button>
              )}
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Filtre par statut */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Statut
                </label>
                <Select 
                  value={filters.statut || ''} 
                  onValueChange={(value) => setFilters({ statut: value || undefined })}
                >
                  <SelectTrigger className="bg-gray-50 border-gray-200 focus:bg-white focus:border-orange-300">
                    <SelectValue placeholder="Tous les statuts" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuts.map(statut => (
                      <SelectItem key={statut.value} value={statut.value}>
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4" />
                          {statut.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtre par commune */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Commune
                </label>
                <Select 
                  value={filters.commune || ''} 
                  onValueChange={(value) => setFilters({ commune: value || undefined })}
                >
                  <SelectTrigger className="bg-gray-50 border-gray-200 focus:bg-white focus:border-orange-300">
                    <SelectValue placeholder="Toutes les communes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Toutes les communes
                      </div>
                    </SelectItem>
                    {communes.map(commune => (
                      <SelectItem key={commune} value={commune}>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {commune}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtre par type */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Type
                </label>
                <Select 
                  value={filters.type || ''} 
                  onValueChange={(value) => setFilters({ type: value || undefined })}
                >
                  <SelectTrigger className="bg-gray-50 border-gray-200 focus:bg-white focus:border-orange-300">
                    <SelectValue placeholder="Tous les types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous les types</SelectItem>
                    <SelectItem value="PREVENTIF">Préventif</SelectItem>
                    <SelectItem value="SYLVICOLE">Sylvicole</SelectItem>
                    <SelectItem value="AGRICOLE">Agricole</SelectItem>
                    <SelectItem value="PASTORAL">Pastoral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Filtres actifs */}
            {hasActiveFilters() && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
                {searchQuery && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Search className="h-3 w-3" />
                    Recherche: "{searchQuery}"
                    <button onClick={() => setSearchQuery('')}>
                      <X className="h-3 w-3 ml-1" />
                    </button>
                  </Badge>
                )}
                {filters.statut && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Activity className="h-3 w-3" />
                    Statut: {statuts.find(s => s.value === filters.statut)?.label}
                    <button onClick={() => setFilters({ statut: undefined })}>
                      <X className="h-3 w-3 ml-1" />
                    </button>
                  </Badge>
                )}
                {filters.commune && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    Commune: {filters.commune}
                    <button onClick={() => setFilters({ commune: undefined })}>
                      <X className="h-3 w-3 ml-1" />
                    </button>
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}