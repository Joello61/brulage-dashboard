import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Calendar, 
  Users, 
  Eye, 
  Thermometer,
  Wind,
  Droplets
} from 'lucide-react';
import { 
  getStatutColor, 
  getStatutLabel, 
  getTypeColor, 
  formatSurface, 
  formatDate, 
  formatDateRelative,
  type Brulage 
} from '@/types/brulage';
import { cn } from '@/lib/utils';

interface BrulageCardProps {
  brulage: Brulage;
  className?: string;
  compact?: boolean;
}

export function BrulageCard({ brulage, className, compact = false }: BrulageCardProps) {
  return (
    <Card className={cn(
      'group hover:shadow-lg transition-all duration-300 border-0 shadow-md overflow-hidden',
      'hover:scale-[1.02] hover:-translate-y-1',
      className
    )}>
      {/* Header avec statut et commune */}
      <CardHeader className={cn('pb-3', compact && 'pb-2')}>
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1 min-w-0">
            <h3 className={cn(
              'font-semibold text-gray-900 group-hover:text-orange-600 transition-colors truncate',
              compact ? 'text-base' : 'text-lg'
            )}>
              {brulage.commune.nom}
            </h3>
            <p className={cn(
              'text-gray-500 truncate',
              compact ? 'text-xs' : 'text-sm'
            )}>
              {brulage.commune.region}
            </p>
          </div>
          
          {/* Badge de statut */}
          <Badge className={cn(
            'flex items-center gap-1 text-xs font-medium border shrink-0',
            getStatutColor(brulage.statut)
          )}>
            {brulage.statut === 'EN_COURS' && (
              <div className="w-2 h-2 bg-current rounded-full animate-pulse" />
            )}
            {getStatutLabel(brulage.statut)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className={cn('space-y-4', compact && 'space-y-3')}>
        {/* Informations principales en grid */}
        <div className={cn(
          'grid gap-3 text-sm',
          compact ? 'grid-cols-1' : 'grid-cols-2'
        )}>
          {/* Surface et type */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 rounded-lg">
              <MapPin className="h-3.5 w-3.5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900">
                {formatSurface(brulage.surface_reelle)}
              </div>
              <div className={cn(
                'text-gray-500 capitalize truncate',
                compact ? 'text-xs' : 'text-xs'
              )}>
                {brulage.type_brulage.toLowerCase()}
              </div>
            </div>
          </div>

          {/* Date */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-purple-100 rounded-lg">
              <Calendar className="h-3.5 w-3.5 text-purple-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 text-xs">
                {formatDate(brulage.date_realisation)}
              </div>
              <div className="text-xs text-gray-500">
                {formatDateRelative(brulage.date_realisation)}
              </div>
            </div>
          </div>

          {/* Responsable */}
          <div className={cn('flex items-center gap-2', !compact && 'col-span-2')}>
            <div className="p-1.5 bg-green-100 rounded-lg">
              <Users className="h-3.5 w-3.5 text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-700 truncate">
              {brulage.demandeur.nom}
            </span>
          </div>
        </div>

        {/* Informations supplémentaires si pas compact */}
        {!compact && (
          <>
            {/* Conditions météo simulées */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-1 text-xs">
                <Thermometer className="h-3 w-3 text-red-500" />
                <span className="font-medium">24°C</span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <Wind className="h-3 w-3 text-blue-500" />
                <span className="font-medium">12 km/h</span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <Droplets className="h-3 w-3 text-cyan-500" />
                <span className="font-medium">45%</span>
              </div>
              
              {/* Badge de type */}
              <div className="ml-auto">
                <Badge 
                  variant="outline" 
                  className={cn('text-xs capitalize', getTypeColor(brulage.type_brulage))}
                >
                  {brulage.type_brulage.toLowerCase()}
                </Badge>
              </div>
            </div>

            {/* Observations si présentes */}
            {brulage.observations && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-800 line-clamp-2">
                  {brulage.observations}
                </p>
              </div>
            )}

            {/* Pourcentage de réussite si disponible */}
            {brulage.pourcentage_reussite!== undefined && (
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-green-800">
                  Taux de réussite
                </span>
                <Badge 
                  className={cn(
                    'font-bold',
                    brulage.pourcentage_reussite >= 90 ? 'bg-green-500' : 
                    brulage.pourcentage_reussite >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                  )}
                >
                  {brulage.pourcentage_reussite}%
                </Badge>
              </div>
            )}
          </>
        )}

        {/* Actions */}
        <div className={cn(
          'flex gap-2 pt-2',
          compact ? 'border-t border-gray-100' : 'border-t border-gray-100'
        )}>
          <Button 
            asChild 
            size="sm" 
            variant="outline" 
            className="flex-1 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600 transition-colors"
          >
            <Link to={`/brulages/${brulage.id}`}>
              <Eye className="h-3 w-3 mr-2" />
              {compact ? 'Voir' : 'Voir détails'}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}