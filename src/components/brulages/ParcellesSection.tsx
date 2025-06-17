import React, { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  Map, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  SortAsc, 
  SortDesc, 
  Grid3X3,
  List,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BrulageMap } from "./BrulageMap";

interface ParcellesProps {
  brulage: any; // Type selon votre interface Brulage
}

type SortField = 'surface' | 'id' | 'percentage';
type SortOrder = 'asc' | 'desc';
type ViewMode = 'grid' | 'list';

export const ParcellesSection: React.FC<ParcellesProps> = ({ brulage }) => {
  // États pour la pagination et le tri
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('surface');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  // Calculs pour les parcelles
  const parcellesData = useMemo(() => {
    if (!brulage.commune?.parcelles) return [];

    const surfaceTotaleParcelles = brulage.commune.parcelles.reduce(
      (total: number, parcelle: any) => total + parseFloat(parcelle.surface_totale),
      0
    );

    return brulage.commune.parcelles.map((parcelle: any, index: number) => {
      const surfaceParcelle = parseFloat(parcelle.surface_totale);
      const pourcentageTotal = surfaceTotaleParcelles > 0 
        ? (surfaceParcelle / surfaceTotaleParcelles) * 100 
        : 0;

      return {
        ...parcelle,
        surface_numeric: surfaceParcelle,
        percentage: pourcentageTotal,
        originalIndex: index + 1,
      };
    });
  }, [brulage.commune?.parcelles]);

  // Filtrage et tri
  const filteredAndSortedParcelles = useMemo(() => {
    let filtered = parcellesData;

    // Filtrage par recherche
    if (searchTerm) {
      filtered = filtered.filter((parcelle: any) => 
        parcelle.id.toString().includes(searchTerm.toLowerCase()) ||
        parcelle.surface_totale.toString().includes(searchTerm)
      );
    }

    // Tri
    filtered.sort((a: any, b: any) => {
      let aValue, bValue;
      
      switch (sortField) {
        case 'surface':
          aValue = a.surface_numeric;
          bValue = b.surface_numeric;
          break;
        case 'id':
          aValue = a.id;
          bValue = b.id;
          break;
        case 'percentage':
          aValue = a.percentage;
          bValue = b.percentage;
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });

    return filtered;
  }, [parcellesData, searchTerm, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedParcelles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentParcelles = filteredAndSortedParcelles.slice(startIndex, endIndex);

  // Statistiques globales
  const stats = useMemo(() => {
    const surfaceTotaleParcelles = parcellesData.reduce(
      (total: number, parcelle: any) => total + parcelle.surface_numeric,
      0
    );
    const pourcentageBrule = (brulage.surface_reelle / surfaceTotaleParcelles) * 100;

    return {
      totalParcelles: parcellesData.length,
      surfaceTotale: surfaceTotaleParcelles,
      surfaceBrulee: brulage.surface_reelle,
      pourcentageBrule,
      parcelleMoyenne: surfaceTotaleParcelles / parcellesData.length,
      plusGrandeParcelle: Math.max(...parcellesData.map((p: any) => p.surface_numeric)),
      plusPetiteParcelle: Math.min(...parcellesData.map((p: any) => p.surface_numeric)),
    };
  }, [parcellesData, brulage.surface_reelle]);

  const getSizeCategory = (surface: number) => {
    if (surface >= 10) return { label: 'Grande', color: 'border-green-500 text-green-700 bg-green-50' };
    if (surface >= 5) return { label: 'Moyenne', color: 'border-yellow-500 text-yellow-700 bg-yellow-50' };
    return { label: 'Petite', color: 'border-gray-500 text-gray-700 bg-gray-50' };
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  if (!brulage.commune?.parcelles || brulage.commune.parcelles.length === 0) {
    return null;
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Map className="h-5 w-5" />
              Parcelles ({stats.totalParcelles})
            </CardTitle>
            <CardDescription>
              Détail des {stats.totalParcelles} parcelle{stats.totalParcelles > 1 ? "s" : ""} concernée{stats.totalParcelles > 1 ? "s" : ""} par le brûlage
            </CardDescription>
          </div>

          {/* Contrôles de vue */}
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border">
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-r-none px-2"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-l-none px-2"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Statistiques générales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.totalParcelles}</div>
            <div className="text-sm text-gray-600">Parcelles</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.surfaceTotale.toFixed(2)} ha</div>
            <div className="text-sm text-gray-600">Surface totale</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.surfaceBrulee} ha</div>
            <div className="text-sm text-gray-600">Surface brûlée</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.parcelleMoyenne.toFixed(1)} ha</div>
            <div className="text-sm text-gray-600">Moyenne/parcelle</div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Carte de localisation */}
          {brulage?.commune?.coordonnees && (
            <BrulageMap
              brulages={[brulage]}
              selectedBrulage={brulage.id}
              height="h-[400px]"
              showControls={true}
              title="Localisation"
              description={`Position du brûlage à ${brulage.commune?.nom}`}
              className="border-0 shadow-lg"
            />
          )}

          {/* Contrôles de filtrage et tri */}
          <div className="flex flex-col md:flex-row gap-4 p-4 bg-gray-50 rounded-lg">
            {/* Recherche */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher par ID ou surface..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Tri */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Trier par:</span>
              <Button
                variant={sortField === 'surface' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleSort('surface')}
                className="gap-1"
              >
                Surface
                {sortField === 'surface' && (
                  sortOrder === 'desc' ? <SortDesc className="h-3 w-3" /> : <SortAsc className="h-3 w-3" />
                )}
              </Button>
              <Button
                variant={sortField === 'id' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleSort('id')}
                className="gap-1"
              >
                ID
                {sortField === 'id' && (
                  sortOrder === 'desc' ? <SortDesc className="h-3 w-3" /> : <SortAsc className="h-3 w-3" />
                )}
              </Button>
            </div>

            {/* Éléments par page */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Afficher:</span>
              <Select value={itemsPerPage.toString()} onValueChange={(value) => {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Barre de progression de couverture */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-800">
                Couverture du brûlage
              </span>
              <span className="text-lg font-bold text-blue-900">
                {stats.pourcentageBrule.toFixed(1)}%
              </span>
            </div>

            <div className="w-full bg-blue-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(stats.pourcentageBrule, 100)}%`,
                }}
              />
            </div>

            <div className="flex justify-between text-xs text-blue-700 mt-1">
              <span>0 ha</span>
              <span>{stats.surfaceTotale.toFixed(2)} ha</span>
            </div>

            {stats.pourcentageBrule > 100 && (
              <div className="mt-2 p-2 bg-amber-100 border border-amber-300 rounded text-xs text-amber-800">
                ⚠️ La surface brûlée dépasse la surface totale des parcelles
              </div>
            )}
          </div>

          {/* Liste/Grille des parcelles */}
          {currentParcelles.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucune parcelle trouvée pour les critères de recherche
            </div>
          ) : (
            <div className={cn(
              "space-y-3",
              viewMode === 'grid' && "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 space-y-0"
            )}>
              {currentParcelles.map((parcelle: any, index: number) => {
                const sizeCategory = getSizeCategory(parcelle.surface_numeric);
                const globalIndex = startIndex + index + 1;

                return (
                  <div
                    key={parcelle.id}
                    className={cn(
                      "bg-white border rounded-lg hover:bg-gray-50 transition-colors",
                      viewMode === 'list' 
                        ? "flex items-center justify-between p-3"
                        : "p-4"
                    )}
                  >
                    {viewMode === 'list' ? (
                      <>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                            {globalIndex}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              Parcelle #{parcelle.id}
                            </div>
                            <div className="text-sm text-gray-500">
                              {parcelle.percentage.toFixed(1)}% de la surface totale
                            </div>
                          </div>
                        </div>

                        <div className="text-right flex items-center gap-3">
                          <div>
                            <div className="font-semibold text-gray-900">
                              {parcelle.surface_numeric.toFixed(2)} ha
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className={cn("text-xs", sizeCategory.color)}
                          >
                            {sizeCategory.label}
                          </Badge>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                              {globalIndex}
                            </div>
                            <span className="font-medium text-gray-900">
                              Parcelle #{parcelle.id}
                            </span>
                          </div>
                          <Badge
                            variant="outline"
                            className={cn("text-xs", sizeCategory.color)}
                          >
                            {sizeCategory.label}
                          </Badge>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-xl font-bold text-blue-600">
                            {parcelle.surface_numeric.toFixed(2)} ha
                          </div>
                          <div className="text-sm text-gray-500">
                            {parcelle.percentage.toFixed(1)}% du total
                          </div>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${Math.min(parcelle.percentage, 100)}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-sm text-gray-600">
                Affichage de {startIndex + 1} à {Math.min(endIndex, filteredAndSortedParcelles.length)} sur {filteredAndSortedParcelles.length} parcelles
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Précédent
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i;
                    } else {
                      pageNumber = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNumber}
                        variant={currentPage === pageNumber ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNumber)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNumber}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="gap-1"
                >
                  Suivant
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Résumé de la sélection actuelle */}
          {searchTerm && (
            <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
              🔍 Résultats de recherche: {filteredAndSortedParcelles.length} parcelle(s) trouvée(s) pour "{searchTerm}"
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};