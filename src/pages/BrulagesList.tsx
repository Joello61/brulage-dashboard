import { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Flame, 
  RefreshCw, 
  Download, 
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  FileText,
  FileSpreadsheet,
  Calendar,
  CalendarDays,
  Filter,
  X
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { BrulageFilters } from '@/components/brulages/BrulageFilters';
import { BrulageCard } from '@/components/brulages/BrulageCard';
import { BrulageTable } from '@/components/brulages/BrulageTable';
import { BrulageMap } from '@/components/brulages/BrulageMap';
import { EmptyState } from '@/components/ui/empty-state';
import { useBrulages } from '@/hooks/useBrulages';
import { useCommunes } from '@/hooks/useCommunes';
import { useExportCsv, useExportJson, useExportPdfReport } from '@/hooks/useExports';
import { useFiltersStore } from '@/store/filtersStore';
import { useUIStore } from '@/store/uiStore';
import { cn } from '@/lib/utils';

// Types pour les préréglages de dates
type DatePreset = {
  label: string;
  value: string;
  dateStart: string;
  dateEnd: string;
  icon?: any;
};

export default function BrulagesList() {
  const {
    filters,
    searchQuery,
    view,
    pageSize,
    setFilters,
    setPageSize
  } = useFiltersStore();
  
  const { 
    selectedBrulageId,
    setSelectedBrulage,
    isMobile,
    isTablet
  } = useUIStore();

  // État local pour la pagination et les dates
  const [currentPage, setCurrentPage] = useState(1);
  const [tempDateStart, setTempDateStart] = useState(filters.dateStart || '');
  const [tempDateEnd, setTempDateEnd] = useState(filters.dateEnd || '');

  // Préréglages de dates
  const datePresets: DatePreset[] = useMemo(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    
    return [
      {
        label: 'Cette semaine',
        value: 'thisWeek',
        dateStart: getWeekStart(today).toISOString().split('T')[0],
        dateEnd: getWeekEnd(today).toISOString().split('T')[0],
        icon: Calendar
      },
      {
        label: 'Ce mois',
        value: 'thisMonth',
        dateStart: new Date(currentYear, currentMonth, 1).toISOString().split('T')[0],
        dateEnd: new Date(currentYear, currentMonth + 1, 0).toISOString().split('T')[0],
        icon: Calendar
      },
      {
        label: 'Cette année',
        value: 'thisYear',
        dateStart: `${currentYear}-01-01`,
        dateEnd: `${currentYear}-12-31`,
        icon: CalendarDays
      },
      {
        label: 'Année dernière',
        value: 'lastYear',
        dateStart: `${currentYear - 1}-01-01`,
        dateEnd: `${currentYear - 1}-12-31`,
        icon: CalendarDays
      },
      {
        label: '3 derniers mois',
        value: 'last3Months',
        dateStart: new Date(currentYear, currentMonth - 2, 1).toISOString().split('T')[0],
        dateEnd: today.toISOString().split('T')[0],
        icon: Calendar
      },
      {
        label: '6 derniers mois',
        value: 'last6Months',
        dateStart: new Date(currentYear, currentMonth - 5, 1).toISOString().split('T')[0],
        dateEnd: today.toISOString().split('T')[0],
        icon: Calendar
      }
    ];
  }, []);

  // Fonctions utilitaires pour les dates
  function getWeekStart(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Lundi comme premier jour
    return new Date(d.setDate(diff));
  }

  function getWeekEnd(date: Date): Date {
    const d = getWeekStart(date);
    return new Date(d.setDate(d.getDate() + 6));
  }

  // Construire les filtres pour l'API
  const apiFilters = useMemo(() => {
    const apiFilters: any = {};
    
    if (filters.commune) apiFilters.commune = filters.commune;
    if (filters.statut) apiFilters.statut = filters.statut;
    if (filters.type) apiFilters.type = filters.type;
    if (filters.campagne) apiFilters.campagne = filters.campagne;
    if (filters.dateStart) apiFilters.dateStart = filters.dateStart;
    if (filters.dateEnd) apiFilters.dateEnd = filters.dateEnd;
    
    return apiFilters;
  }, [filters]);

  // Récupérer les données principales
  const { 
    data, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useBrulages({
    page: currentPage,
    limit: pageSize,
    filters: apiFilters,
    search: searchQuery
  });

  // Récupérer la liste des communes pour les filtres
  const { data: communesData } = useCommunes({ 
    withBrulages: true,
    limit: 100 
  });

  // Hooks d'export
  const exportCsv = useExportCsv();
  const exportJson = useExportJson();
  const exportPdf = useExportPdfReport();

  const brulages = data?.brulages || [];
  const pagination = data?.pagination;

  // Liste des communes pour les filtres
  const communes = useMemo(() => {
    if (communesData?.data) {
      return communesData.data.map((c: any) => c.nom_commune).sort();
    }
    // Fallback sur les communes des brûlages actuels
    const communeSet = new Set(brulages.map(b => b.commune));
    return Array.from(communeSet).sort();
  }, [communesData, brulages]);

  // Gérer l'application des filtres de dates
  const handleApplyDateFilter = () => {
    setFilters({
      ...filters,
      dateStart: tempDateStart || undefined,
      dateEnd: tempDateEnd || undefined
    });
    setCurrentPage(1); // Reset à la première page
  };

  // Gérer la sélection d'un préréglage
  const handlePresetSelect = (preset: DatePreset) => {
    setTempDateStart(preset.dateStart);
    setTempDateEnd(preset.dateEnd);
    setFilters({
      ...filters,
      dateStart: preset.dateStart,
      dateEnd: preset.dateEnd
    });
    setCurrentPage(1);
  };

  // Effacer les filtres de dates
  const handleClearDateFilter = () => {
    setTempDateStart('');
    setTempDateEnd('');
    setFilters({
      ...filters,
      dateStart: undefined,
      dateEnd: undefined
    });
    setCurrentPage(1);
  };

  // Gérer la sélection d'un brûlage sur la carte
  const handleBrulageSelect = (brulage: any) => {
    setSelectedBrulage(brulage.id);
  };

  // Gestion de la pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1); // Reset à la première page
  };

  // Gestion des exports
  const handleExport = (format: 'csv' | 'json' | 'pdf') => {
    const exportFilters = apiFilters;
    
    switch (format) {
      case 'csv':
        exportCsv.mutate(exportFilters);
        break;
      case 'json':
        exportJson.mutate(exportFilters);
        break;
      case 'pdf':
        exportPdf.mutate(exportFilters);
        break;
    }
  };

  const isExporting = exportCsv.isPending || exportJson.isPending || exportPdf.isPending;

  // Calculs pour les statistiques rapides
  const activeBrulages = brulages.filter(b => b.statut === 'EN_COURS');
  const totalSurface = brulages.reduce((sum, b) => sum + (b.surface_reelle || 0), 0);

  // Vérifier si des filtres de dates sont appliqués
  const hasDateFilters = filters.dateStart || filters.dateEnd;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-white via-orange-50/30 to-red-50/40 rounded-2xl border border-orange-100/60 p-6 md:p-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-orange-100/40 to-transparent rounded-full -translate-y-48 translate-x-48" />
        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg">
                <Flame className="h-6 w-6 md:h-8 md:w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-bold text-gray-900">Brûlages dirigés</h1>
                <p className="text-sm md:text-base text-gray-600 font-medium">
                  Gestion et suivi des opérations
                </p>
              </div>
            </div>
            
            {/* Statistiques rapides */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                <span className="text-orange-700 font-medium">
                  {activeBrulages.length} actifs
                </span>
              </div>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600">
                {brulages.length} sur {pagination?.total || 0} total
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600">
                {totalSurface.toFixed(1)} ha
              </span>
              {pagination && (
                <>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600">
                    Page {pagination.page}/{pagination.totalPages}
                  </span>
                </>
              )}
            </div>

            {/* Affichage de la période sélectionnée */}
            {hasDateFilters && (
              <div className="flex items-center gap-2 pt-2">
                <Calendar className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-700">
                  Période : {filters.dateStart} 
                  {filters.dateEnd && filters.dateStart !== filters.dateEnd && ` → ${filters.dateEnd}`}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleClearDateFilter}
                  className="h-6 w-6 p-0 text-orange-600 hover:bg-orange-100"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
          
          <div className="flex gap-3">
            {/* Filtre par dates */}
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className={cn(
                    "bg-white/60 backdrop-blur-sm border-orange-200 hover:bg-orange-50",
                    hasDateFilters && "border-orange-400 bg-orange-50"
                  )}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  {hasDateFilters ? 'Période active' : 'Filtrer par dates'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Sélection de période</h4>
                    <p className="text-xs text-gray-600">
                      Filtrez les brûlages par date de réalisation
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

            <Button 
              variant="outline" 
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading}
              className="bg-white/60 backdrop-blur-sm border-orange-200 hover:bg-orange-50"
            >
              <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
              Actualiser
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  size="sm"
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg"
                  disabled={brulages.length === 0 || isExporting}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {isExporting ? 'Export...' : 'Exporter'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => handleExport('csv')}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Exporter en CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('json')}>
                  <FileText className="h-4 w-4 mr-2" />
                  Exporter en JSON
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <BrulageFilters 
        resultCount={pagination?.total || brulages.length}
        communes={communes}
      />

      {/* Contenu principal */}
      <div className="space-y-6">
        {/* États de chargement et d'erreur */}
        {isLoading && (
          <div className="space-y-4">
            {view === 'cards' ? (
              <div className={cn(
                "grid gap-6",
                "grid-cols-1",
                "sm:grid-cols-2", 
                "lg:grid-cols-3",
                "xl:grid-cols-4"
              )}>
                {Array.from({ length: pageSize }).map((_, i) => (
                  <Card key={i} className="border-0 shadow-lg">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-6 w-16 rounded-full" />
                      </div>
                      <Skeleton className="h-4 w-24" />
                      <div className="grid grid-cols-2 gap-3">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                      <Skeleton className="h-8 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : view === 'table' ? (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center space-x-4">
                        <Skeleton className="h-6 w-16 rounded-full" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-28" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-0">
                  <Skeleton className="h-96 w-full rounded-lg" />
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {isError && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-8">
              <div className="text-center space-y-4">
                <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
                <div>
                  <h3 className="text-lg font-semibold text-red-900 mb-2">
                    Erreur de chargement
                  </h3>
                  <p className="text-red-700 mb-4">
                    {(error as any)?.message || 'Impossible de charger les brûlages'}
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => refetch()}
                    className="border-red-300 text-red-700 hover:bg-red-100"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Réessayer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Affichage des données */}
        {!isLoading && !isError && brulages.length === 0 && (
          <EmptyState
            icon={Flame}
            title="Aucun brûlage trouvé"
            description={
              Object.keys(apiFilters).length > 0 || searchQuery 
                ? "Aucun brûlage ne correspond à vos critères de recherche."
                : "Aucun brûlage n'est disponible pour le moment."
            }
            action={
              Object.keys(apiFilters).length > 0 || searchQuery ? (
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Réinitialiser les filtres
                </Button>
              ) : (
                <Button variant="outline" onClick={() => refetch()}>
                  Actualiser
                </Button>
              )
            }
          />
        )}

        {!isLoading && !isError && brulages.length > 0 && (
          <>
            {/* Vue Cards */}
            {view === 'cards' && (
              <div className={cn(
                "grid gap-6",
                "grid-cols-1",
                isMobile ? "sm:grid-cols-1" : "sm:grid-cols-2",
                isTablet ? "lg:grid-cols-2" : "lg:grid-cols-3",
                "xl:grid-cols-4"
              )}>
                {brulages.map((brulage) => (
                  <BrulageCard 
                    key={brulage.id} 
                    brulage={brulage}
                    compact={isMobile}
                    className="hover:scale-[1.02] transition-transform"
                  />
                ))}
              </div>
            )}

            {/* Vue Table */}
            {view === 'table' && (
              <BrulageTable 
                brulages={brulages}
                compact={isMobile}
              />
            )}

            {/* Vue Map */}
            {view === 'map' && (
              <BrulageMap 
                brulages={brulages}
                selectedBrulage={selectedBrulageId}
                onBrulageSelect={handleBrulageSelect}
                height="h-[600px]"
              />
            )}
          </>
        )}

        {/* Pagination complète */}
        {!isLoading && pagination && pagination.total > 0 && (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Info pagination */}
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>
                    Affichage de {((pagination.page - 1) * pagination.limit) + 1} à{' '}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} sur{' '}
                    {pagination.total} résultats
                  </span>
                  
                  {/* Sélecteur de taille de page */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs">Par page :</span>
                    <select 
                      value={pageSize}
                      onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                      className="text-xs border border-gray-300 rounded px-2 py-1"
                    >
                      <option value={12}>12</option>
                      <option value={24}>24</option>
                      <option value={48}>48</option>
                      <option value={100}>100</option>
                    </select>
                  </div>
                </div>
                
                {/* Contrôles de pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={!pagination.hasPrevious}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Précédent
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      {/* Pages à afficher */}
                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        let pageNum;
                        if (pagination.totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (pagination.page <= 3) {
                          pageNum = i + 1;
                        } else if (pagination.page >= pagination.totalPages - 2) {
                          pageNum = pagination.totalPages - 4 + i;
                        } else {
                          pageNum = pagination.page - 2 + i;
                        }
                        
                        return (
                          <Button
                            key={pageNum}
                            variant={pageNum === pagination.page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
                            className="w-8 h-8 p-0"
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={!pagination.hasNext}
                    >
                      Suivant
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}