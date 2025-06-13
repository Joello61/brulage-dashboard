import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  CheckCircle, 
  Clock, 
  PauseCircle, 
  XCircle 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'EN_COURS' | 'TERMINE' | 'PLANIFIE' | 'SUSPENDU' | 'ANNULE';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  animated?: boolean;
}

export function StatusBadge({ 
  status, 
  size = 'md', 
  showIcon = true, 
  animated = true 
}: StatusBadgeProps) {
  const configs = {
    EN_COURS: {
      icon: Activity,
      label: 'En cours',
      color: 'bg-orange-100 text-orange-700 border-orange-200',
      dot: 'bg-orange-500'
    },
    TERMINE: {
      icon: CheckCircle,
      label: 'Terminé', 
      color: 'bg-green-100 text-green-700 border-green-200',
      dot: 'bg-green-500'
    },
    PLANIFIE: {
      icon: Clock,
      label: 'Planifié',
      color: 'bg-blue-100 text-blue-700 border-blue-200', 
      dot: 'bg-blue-500'
    },
    SUSPENDU: {
      icon: PauseCircle,
      label: 'Suspendu',
      color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      dot: 'bg-yellow-500'
    },
    ANNULE: {
      icon: XCircle,
      label: 'Annulé',
      color: 'bg-red-100 text-red-700 border-red-200',
      dot: 'bg-red-500'
    }
  };

  const config = configs[status];
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5', 
    lg: 'text-base px-4 py-2'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <Badge className={cn(
      'flex items-center gap-1.5 w-fit font-medium border',
      config.color,
      sizeClasses[size]
    )}>
      <div className={cn(
        'w-2 h-2 rounded-full',
        config.dot,
        animated && status === 'EN_COURS' && 'animate-pulse'
      )} />
      {showIcon && <Icon className={iconSizes[size]} />}
      <span>{config.label}</span>
    </Badge>
  );
}