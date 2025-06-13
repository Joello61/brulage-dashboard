import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
    isPositive?: boolean;
  };
  color: 'orange' | 'green' | 'blue' | 'purple' | 'red' | 'yellow';
  animated?: boolean;
}

export function StatsCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  color, 
  animated = false 
}: StatsCardProps) {
  const colorClasses = {
    orange: {
      bg: 'from-orange-500 to-red-500',
      icon: 'text-white',
      text: 'text-white'
    },
    green: {
      bg: 'from-green-500 to-emerald-500', 
      icon: 'text-white',
      text: 'text-white'
    },
    blue: {
      bg: 'from-blue-500 to-cyan-500',
      icon: 'text-white', 
      text: 'text-white'
    },
    purple: {
      bg: 'from-purple-500 to-pink-500',
      icon: 'text-white',
      text: 'text-white'
    },
    red: {
      bg: 'from-red-500 to-rose-500',
      icon: 'text-white',
      text: 'text-white'
    },
    yellow: {
      bg: 'from-yellow-500 to-orange-500',
      icon: 'text-white',
      text: 'text-white'
    }
  };

  const colors = colorClasses[color];

  return (
    <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className={cn('absolute inset-0 bg-gradient-to-br', colors.bg)} />
      <CardContent className="relative p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <Icon className={cn('h-6 w-6', colors.icon)} />
          </div>
          {animated && (
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          )}
        </div>
        <div className="space-y-1">
          <div className={cn('text-3xl font-bold', colors.text)}>
            {value}
          </div>
          <div className="text-white/80 font-medium">{title}</div>
          {subtitle && (
            <div className="text-xs text-white/60">{subtitle}</div>
          )}
          {trend && (
            <Badge className="bg-white/20 text-white border-white/30 text-xs mt-2">
              {trend.isPositive !== false ? '↗' : '↘'} {trend.value}% {trend.label}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}