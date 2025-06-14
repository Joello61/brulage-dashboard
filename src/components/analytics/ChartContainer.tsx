import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle } from "lucide-react";

interface ChartContainerProps {
  children: React.ReactNode;
  loading: boolean;
  error: Error | null;
  title: string;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  children,
  loading,
  error,
  title,
}) => {
  if (loading) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <div className="text-center space-y-2">
          <Skeleton className="h-4 w-32 mx-auto" />
          <Skeleton className="h-4 w-24 mx-auto" />
          <p className="text-sm text-gray-500">Chargement {title}...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <div className="text-center space-y-2">
          <AlertTriangle className="h-8 w-8 text-red-500 mx-auto" />
          <p className="text-sm text-red-600">Erreur de chargement</p>
          <p className="text-xs text-gray-500">
            {error.message || "Erreur inconnue"}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};