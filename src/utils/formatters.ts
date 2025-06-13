export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatDateShort = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit'
  });
};

export const formatSurface = (surface: number): string => {
  return `${surface.toFixed(1)} ha`;
};

export const formatPercentage = (value: number): string => {
  return `${Math.round(value)}%`;
};