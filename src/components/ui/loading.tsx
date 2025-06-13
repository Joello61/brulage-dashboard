import { Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export function Loading({ size = 'md', text = 'Chargement...', className }: LoadingProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8', 
    lg: 'h-12 w-12'
  };

  return (
    <div className={cn('flex flex-col items-center justify-center space-y-3', className)}>
      <div className="relative">
        <Flame className={cn(
          'text-orange-500 animate-bounce',
          sizeClasses[size]
        )} />
        <div className="absolute inset-0">
          <Flame className={cn(
            'text-red-500 animate-pulse',
            sizeClasses[size]
          )} />
        </div>
      </div>
      {text && (
        <p className="text-sm text-gray-600 font-medium animate-pulse">{text}</p>
      )}
    </div>
  );
}