import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown,
  Minus,
  MapPin, 
  BarChart3,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { useBrulagesStats } from '@/hooks/useBrulages';
import { cn } from '@/lib/utils';

// Types pour les cartes de statistiques
interface StatCard {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ComponentType<any>;
  gradient: string;
  badge?: {
    text: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
  };
  trend?: {
    value: number;
    label: string;
    direction: 'up' | 'down' | 'stable';
  };
  status?: 'success' | 'warning' | 'error' | 'neutral';
}

// Composant pour une carte de statistique individuelle
function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  gradient, 
  badge, 
  trend,
  status = 'neutral'
}: StatCard) {
  const getTrendIcon = (direction: 'up' | 'down' | 'stable') => {
    switch (direction) {
      case 'up': return TrendingUp;
      case 'down': return TrendingDown;
      case 'stable': return Minus;
    }
  };

  const getTrendColor = (direction: 'up' | 'down' | 'stable') => {
    switch (direction) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      case 'stable': return 'text-blue-600';
    }
  };

  const getStatusIndicator = () => {
    switch (status) {
      case 'success': return <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />;
      case 'warning': return <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />;
      case 'error': return <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />;
      default: return <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />;
    }
  };

  const TrendIcon = trend ? getTrendIcon(trend.direction) : null;

  return (
    <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className={cn("absolute inset-0", gradient)} />
      <CardContent className="relative p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <Icon className="h-6 w-6" />
          </div>
          {getStatusIndicator()}
        </div>
        
        <div className="space-y-1">
          <div className="text-3xl font-bold">{value}</div>
          <div className="text-white/90 font-medium">{title}</div>
          <div className="text-xs text-white/70">{subtitle}</div>
          
          {/* Badge et tendance */}
          <div className="flex items-center justify-between mt-3">
            {badge && (
              <Badge 
                variant={badge.variant}
                className="bg-white/20 text-white border-white/30 text-xs"
              >
                {badge.text}
              </Badge>
            )}
            
            {trend && TrendIcon && (
              <div className={cn(
                "flex items-center gap-1 text-xs",
                getTrendColor(trend.direction)
              )}>
                <TrendIcon className="h-3 w-3" />
                <span className="font-medium">
                  {trend.value > 0 ? '+' : ''}{trend.value}%
                </span>
                <span className="text-white/70">{trend.label}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Composant squelette pour le chargement
function StatCardSkeleton() {
  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-2 w-2 rounded-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-20" />
          <div className="flex items-center justify-between mt-3">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Composant principal des cartes de statistiques
export function StatsCards() {
  const { data, isLoading, isError } = useBrulagesStats();

  // Gestion des états de chargement et d'erreur
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <StatCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="border-red-200 bg-red-50">
            <CardContent className="p-6 flex items-center justify-center">
              <div className="text-center space-y-2">
                <AlertTriangle className="h-8 w-8 text-red-500 mx-auto" />
                <p className="text-sm text-red-600">Erreur de chargement</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Extraire les données de l'API selon votre interface DashboardStatsApi
  const stats = data || {};
  
  const totalBrulages = stats.brulages?.total || 0;
  const brulagesActifs = stats.brulages?.anneeEnCours || 0;
  const evolution = stats.brulages?.evolution || 0;
  const surfaceTotale = stats.surface?.total || 0;
  const tauxReussite = stats.reussite?.tauxMoyen || 0;
  const communesActives = stats.geographie?.communes || 0;

  // Déterminer le statut des brûlages actifs
  const getActiveBrulagesStatus = (count: number): StatCard['status'] => {
    if (count === 0) return 'neutral';
    if (count <= 2) return 'success';
    if (count <= 5) return 'warning';
    return 'error';
  };

  // Déterminer le statut du taux de réussite
  const getSuccessRateStatus = (rate: number): StatCard['status'] => {
    if (rate >= 90) return 'success';
    if (rate >= 75) return 'warning';
    return 'error';
  };

  // Configuration des cartes
  const cards: StatCard[] = [
    {
      title: 'Brûlages actifs',
      value: brulagesActifs,
      subtitle: 'En cours actuellement',
      icon: Activity,
      gradient: 'bg-gradient-to-br from-orange-500 to-red-500',
      badge: {
        text: 'TEMPS RÉEL',
        variant: 'outline'
      },
      status: getActiveBrulagesStatus(brulagesActifs)
    },
    {
      title: 'Total 2024',
      value: totalBrulages,
      subtitle: 'Brûlages cette année',
      icon: TrendingUp,
      gradient: 'bg-gradient-to-br from-green-500 to-emerald-500',
      trend: evolution !== 0 ? {
        value: Math.round(evolution),
        label: 'vs 2023',
        direction: evolution > 0 ? 'up' : evolution < 0 ? 'down' : 'stable'
      } : undefined
    },
    {
      title: `${(surfaceTotale || 0).toFixed(0)} ha`,
      value: Math.round(surfaceTotale || 0),
      subtitle: 'Surface totale traitée',
      icon: MapPin,
      gradient: 'bg-gradient-to-br from-blue-500 to-cyan-500',
      badge: {
        text: `${communesActives} COMMUNES`,
        variant: 'outline'
      }
    },
    {
      title: 'Taux de réussite',
      value: `${Math.round(tauxReussite || 0)}%`,
      subtitle: 'Performance globale',
      icon: BarChart3,
      gradient: 'bg-gradient-to-br from-purple-500 to-pink-500',
      badge: {
        text: tauxReussite >= 90 ? 'EXCELLENT' : tauxReussite >= 75 ? 'BON' : 'À AMÉLIORER',
        variant: tauxReussite >= 90 ? 'default' : tauxReussite >= 75 ? 'secondary' : 'destructive'
      },
      status: getSuccessRateStatus(tauxReussite)
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <StatCard key={index} {...card} />
      ))}
    </div>
  );
}

// Composant pour les alertes et notifications
export function StatusAlerts() {
  const { data } = useBrulagesStats();
  
  const stats = data || {};
  
  const alerts = [];
  
  // Vérifier le taux de réussite
  const tauxReussite = stats.reussite?.tauxMoyen || 0;
  if (tauxReussite < 70) {
    alerts.push({
      type: 'error' as const,
      title: 'Taux de réussite faible',
      message: `Le taux de réussite moyen (${tauxReussite.toFixed(1)}%) est en dessous des objectifs`,
      icon: AlertTriangle
    });
  } else if (tauxReussite > 95) {
    alerts.push({
      type: 'success' as const,
      title: 'Performance excellente',
      message: `Taux de réussite exceptionnel de ${tauxReussite.toFixed(1)}%`,
      icon: CheckCircle2
    });
  }

  // Vérifier l'activité
  const brulagesActifs = stats.brulages?.anneeEnCours || 0;
  if (brulagesActifs > 10) {
    alerts.push({
      type: 'warning' as const,
      title: 'Activité élevée',
      message: `${brulagesActifs} brûlages actifs - surveiller la capacité opérationnelle`,
      icon: Activity
    });
  }

  if (alerts.length === 0) {
    alerts.push({
      type: 'success' as const,
      title: 'Système opérationnel',
      message: 'Toutes les métriques sont dans les objectifs',
      icon: CheckCircle2
    });
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert, index) => (
        <div 
          key={index}
          className={cn(
            "flex items-center gap-3 p-3 rounded-lg border",
            alert.type === 'success' && "bg-green-50 border-green-200 text-green-800",
            alert.type === 'warning' && "bg-yellow-50 border-yellow-200 text-yellow-800",
            alert.type === 'error' && "bg-red-50 border-red-200 text-red-800"
          )}
        >
          <alert.icon className="h-5 w-5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-sm">{alert.title}</p>
            <p className="text-xs opacity-90">{alert.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatsCards;