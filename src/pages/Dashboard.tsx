import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Flame, 
  Eye, 
  Wind,
  Thermometer,
  AlertTriangle,
} from 'lucide-react';

import { StatsCards } from '@/components/dashboard/StatsCards';
import { useBrulages, useBrulagesStats } from '@/hooks/useBrulages';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  // Hooks pour les données principales - utiliser les hooks existants
  const { data: brulagesStats, isLoading: isStatsLoading } = useBrulagesStats();
  const { data: brulagesData, isLoading: isBrulagesLoading } = useBrulages({ 
    page: 1, 
    limit: 20, 
    filters: { statut: 'EN_COURS' } 
  });

  const brulagesActifs = brulagesData?.brulages || [];

  // États de chargement
  const isLoading = isStatsLoading || isBrulagesLoading;

  return (
    <div className="space-y-8">
      {/* Header élégant */}
      <div className="relative overflow-hidden bg-gradient-to-br from-white via-orange-50/30 to-red-50/40 rounded-2xl border border-orange-100/60 p-6 md:p-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-orange-100/40 to-transparent rounded-full -translate-y-48 translate-x-48" />
        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg">
                <Flame className="h-6 w-6 md:h-8 md:w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-bold text-gray-900">Tableau de bord</h1>
                <p className="text-sm md:text-base text-gray-600 font-medium">Gestion des brûlages dirigés - Pyrénées</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs md:text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-700 font-medium">Système opérationnel</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600">
                {brulagesStats?.metadata?.generated_at 
                  ? `Mise à jour ${new Date(brulagesStats.metadata.generated_at).toLocaleString()}`
                  : `Mise à jour ${new Date().toLocaleTimeString()}`
                }
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Alerte si des brûlages actifs nécessitent attention */}
      {brulagesActifs.length > 0 && (
        <Card className="border-orange-200 bg-orange-50/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-orange-800">
                  {brulagesActifs.length} brûlage{brulagesActifs.length > 1 ? 's' : ''} en cours de surveillance
                </p>
                <p className="text-xs text-orange-600">
                  Vérifiez les conditions météorologiques régulièrement
                </p>
              </div>
              <Button variant="outline" size="sm" asChild className="border-orange-300 text-orange-700 hover:bg-orange-100">
                <Link to="/brulages?statut=EN_COURS">
                  Voir tous
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* KPIs Cards */}
      <StatsCards />
      
      {/* Brûlages actifs si il y en a */}
      {brulagesActifs.length > 0 && (
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl font-bold text-gray-900">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                  Brûlages en cours
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Surveillance temps réel des brûlages actifs
                </CardDescription>
              </div>
              <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-xs">
                {brulagesActifs.length} ACTIFS
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {isBrulagesLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
              </div>
            ) : (
              brulagesActifs.slice(0, 5).map((brulage) => (
                <div key={brulage.id} className="group p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-100 hover:shadow-md transition-all duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
                        <div className="absolute inset-0 w-3 h-3 bg-orange-400 rounded-full animate-ping" />
                      </div>
                      <div className="space-y-1">
                        <div className="font-semibold text-gray-900">{brulage.commune.nom}</div>
                        <div className="text-sm text-gray-600">
                          {brulage.surface_reelle} ha • {brulage.demandeur.nom}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-red-600">
                        <Thermometer className="h-4 w-4" />
                        <span className="font-medium">
                          {brulage.conditions?.temperature_air || '24'}°C
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-blue-600">
                        <Wind className="h-4 w-4" />
                        <span className="font-medium">
                          {brulage.conditions?.vitesse_vent || '12'} km/h
                        </span>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        asChild
                      >
                        <Link to={`/brulages/${brulage.id}`}>
                          <Eye className="h-3 w-3 mr-1" />
                          Voir
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}