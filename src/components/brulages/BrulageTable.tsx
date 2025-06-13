import { Link } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MoreVertical,
  Eye,
  MapPin,
  Calendar,
  Users,
  Map,
  ExternalLink
} from 'lucide-react';
import { 
  getStatutColor, 
  getStatutLabel, 
  getTypeColor, 
  formatSurface, 
  formatDate,
  type Brulage 
} from '@/types/brulage';
import { cn } from '@/lib/utils';

interface BrulageTableProps {
  brulages: Brulage[];
  onLocateOnMap?: (brulage: Brulage) => void;
  className?: string;
  compact?: boolean;
}

export function BrulageTable({ 
  brulages, 
  onLocateOnMap, 
  className, 
  compact = false 
}: BrulageTableProps) {
  if (brulages.length === 0) {
    return (
      <div className="text-center py-16">
        <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun brûlage trouvé</h3>
        <p className="text-gray-600">Aucun brûlage ne correspond aux critères sélectionnés.</p>
      </div>
    );
  }

  return (
    <div className={cn('rounded-xl border border-gray-200 overflow-hidden bg-white', className)}>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 hover:bg-gray-100">
              <TableHead className="font-semibold text-gray-700 w-[100px]">Statut</TableHead>
              <TableHead className="font-semibold text-gray-700">Commune</TableHead>
              <TableHead className="font-semibold text-gray-700 text-right">Surface</TableHead>
              {!compact && <TableHead className="font-semibold text-gray-700">Date</TableHead>}
              <TableHead className="font-semibold text-gray-700">Responsable</TableHead>
              {!compact && <TableHead className="font-semibold text-gray-700">Type</TableHead>}
              {!compact && brulages.some(b => b.pourcentage_reussite !== undefined) && (
                <TableHead className="font-semibold text-gray-700 text-center">Réussite</TableHead>
              )}
              <TableHead className="font-semibold text-gray-700 w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {brulages.map((brulage) => (
              <TableRow 
                key={brulage.id} 
                className="hover:bg-gradient-to-r hover:from-orange-50/50 hover:to-red-50/50 transition-all duration-200 border-b border-gray-100"
              >
                {/* Statut */}
                <TableCell>
                  <Badge className={cn(
                    'flex items-center gap-1 text-xs font-medium border w-fit',
                    getStatutColor(brulage.statut)
                  )}>
                    {brulage.statut === 'EN_COURS' && (
                      <div className="w-2 h-2 bg-current rounded-full animate-pulse" />
                    )}
                    <span className="hidden sm:inline">
                      {getStatutLabel(brulage.statut)}
                    </span>
                    <span className="sm:hidden">
                      {brulage.statut.split('_')[0]}
                    </span>
                  </Badge>
                </TableCell>

                {/* Commune */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-100 rounded-lg">
                      <MapPin className="h-3.5 w-3.5 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-gray-900 truncate">
                        {brulage.commune.nom}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {brulage.commune.departement}
                      </div>
                    </div>
                  </div>
                </TableCell>

                {/* Surface */}
                <TableCell className="text-right">
                  <div className="font-bold text-gray-900">
                    {formatSurface(brulage.surface_reelle)}
                  </div>
                </TableCell>

                {/* Date (si pas compact) */}
                {!compact && (
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <div className="text-sm font-medium text-gray-700">
                        {formatDate(brulage.date_realisation)}
                      </div>
                    </div>
                  </TableCell>
                )}

                {/* Responsable */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-green-100 rounded-lg">
                      <Users className="h-3.5 w-3.5 text-green-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 truncate max-w-[150px]">
                      {brulage.demandeur.nom}
                    </span>
                  </div>
                </TableCell>

                {/* Type (si pas compact) */}
                {!compact && (
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={cn('text-xs capitalize', getTypeColor(brulage.type_brulage))}
                    >
                      {brulage.type_brulage.toLowerCase()}
                    </Badge>
                  </TableCell>
                )}

                {/* Pourcentage de réussite (si disponible et pas compact) */}
                {!compact && brulages.some(b => b.pourcentage_reussite !== undefined) && (
                  <TableCell className="text-center">
                    {brulage.pourcentage_reussite !== undefined ? (
                      <Badge 
                        className={cn(
                          'font-bold text-xs',
                          brulage.pourcentage_reussite >= 90 ? 'bg-green-500 hover:bg-green-600' : 
                          brulage.pourcentage_reussite >= 70 ? 'bg-yellow-500 hover:bg-yellow-600' : 
                          'bg-red-500 hover:bg-red-600'
                        )}
                      >
                        {brulage.pourcentage_reussite}%
                      </Badge>
                    ) : (
                      <span className="text-gray-400 text-xs">-</span>
                    )}
                  </TableCell>
                )}

                {/* Actions */}
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem asChild>
                        <Link to={`/brulages/${brulage.id}`} className="flex items-center cursor-pointer">
                          <Eye className="h-4 w-4 mr-2" />
                          Voir détails
                        </Link>
                      </DropdownMenuItem>
                      
                      {brulage.commune.coordonnees && onLocateOnMap && (
                        <DropdownMenuItem onClick={() => onLocateOnMap(brulage)}>
                          <Map className="h-4 w-4 mr-2" />
                          Localiser sur carte
                        </DropdownMenuItem>
                      )}
                      
                      <DropdownMenuItem asChild>
                        <Link 
                          to={`/map?brulage=${brulage.id}`} 
                          className="flex items-center cursor-pointer"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Ouvrir dans carte
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Footer avec informations */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            {brulages.length} brûlage{brulages.length > 1 ? 's' : ''} affiché{brulages.length > 1 ? 's' : ''}
          </span>
          <div className="flex items-center gap-4">
            {brulages.filter(b => b.statut === 'EN_COURS').length > 0 && (
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                {brulages.filter(b => b.statut === 'EN_COURS').length} actif{brulages.filter(b => b.statut === 'EN_COURS').length > 1 ? 's' : ''}
              </span>
            )}
            <span>
              Surface totale: {brulages.reduce((sum, b) => sum + b.surface_reelle, 0).toFixed(1)} ha
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}