import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Users,
  Thermometer,
  Wind,
  Droplets,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Target,
  FileText,
  CloudRain,
  Sun,
  Activity,
  AreaChart,
} from "lucide-react";
import { useBrulage, useBrulageConditions } from "@/hooks/useBrulages";
import {
  getStatutColor,
  getStatutLabel,
  getTypeColor,
  formatSurface,
  formatDate,
  formatDateRelative,
} from "@/types/brulage";
import { cn } from "@/lib/utils";
import { ParcellesSection } from "@/components/brulages/ParcellesSection";

export default function BrulageDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const brulageId = parseInt(id || "0");

  // Hooks pour récupérer les données
  const {
    data: brulage,
    isLoading,
    isError,
    error,
  } = useBrulage(brulageId, !!id);
  const { data: conditionsData, isLoading: isConditionsLoading } =
    useBrulageConditions(brulageId, !!brulage);

  // États de chargement
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-6 w-32" />
                <div className="grid grid-cols-2 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Skeleton className="h-80 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !brulage) {
    return (
      <div className="text-center py-16">
        <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Brûlage introuvable
        </h2>
        <p className="text-gray-600 mb-6">
          {(error as any)?.message ||
            "Ce brûlage n'existe pas ou a été supprimé."}
        </p>
        <Button onClick={() => navigate("/brulages")} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la liste
        </Button>
      </div>
    );
  }

  const getStatusIcon = (statut: string) => {
    switch (statut.toUpperCase()) {
      case "EN_COURS":
        return <Clock className="h-5 w-5" />;
      case "TERMINE":
        return <CheckCircle2 className="h-5 w-5" />;
      case "PLANIFIE":
        return <Calendar className="h-5 w-5" />;
      case "SUSPENDU":
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <Target className="h-5 w-5" />;
    }
  };

  // Extraire les conditions météo (API ou fallback)
  const conditions = conditionsData?.conditions?.[0] || null;

  return (
    <div className="space-y-6">
      {/* Header avec navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/brulages")}
            className="shrink-0"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>

          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Brûlage - {brulage.commune?.nom}
            </h1>
            <p className="text-gray-600">
              {brulage.commune?.region} •{" "}
              {formatDateRelative(brulage.date_realisation)}
            </p>
          </div>
        </div>
      </div>

      {/* Layout principal */}
      <div className="grid grid-cols-1 gap-6">
        {/* Contenu principal */}
        <div className="space-y-6">
          {/* Statut et informations principales */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(brulage.statut)}
                  Informations générales
                </CardTitle>
                <Badge
                  className={cn(
                    "flex items-center gap-2 text-sm font-medium",
                    getStatutColor(brulage.statut)
                  )}
                >
                  {brulage.statut === "EN_COURS" && (
                    <div className="w-2 h-2 bg-current rounded-full animate-pulse" />
                  )}
                  {getStatutLabel(brulage.statut)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Grille d'informations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <MapPin className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        Localisation
                      </div>
                      <div className="text-sm text-gray-600">
                        {brulage.commune?.nom}
                      </div>
                      <div className="text-xs text-gray-500">
                        {brulage.commune?.departement}
                        {brulage.commune?.region &&
                          ` • ${brulage.commune.region}`}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Target className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Surface</div>
                      <div className="text-sm text-gray-600">
                        {formatSurface(brulage.surface_reelle)}
                        {brulage.surface_prevue &&
                          brulage.surface_reelle &&
                          brulage.surface_prevue !== brulage.surface_reelle && (
                            <span className="text-xs text-gray-500 ml-1">
                              (prévu: {formatSurface(brulage.surface_prevue)})
                            </span>
                          )}
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs mt-1",
                          getTypeColor(brulage.type_brulage)
                        )}
                      >
                        {brulage.type_brulage}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Calendar className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        Date de réalisation
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatDate(brulage.date_realisation)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDateRelative(brulage.date_realisation)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Users className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        Demandeur
                      </div>
                      <div className="text-sm text-gray-600">
                        {brulage.demandeur
                          ? `${brulage.demandeur.prenom} ${brulage.demandeur.nom}`
                          : "Non défini"}
                      </div>
                      {brulage.demandeur?.typeDemandeur && (
                        <div className="text-xs text-gray-500">
                          {brulage.demandeur.typeDemandeur}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Numéros de suivi */}
              {(brulage.num_brulage || brulage.num_preconisation) && (
                <>
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {brulage.num_brulage && (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">
                          Numéro de brûlage
                        </div>
                        <div className="font-mono text-sm font-semibold">
                          {brulage.num_brulage}
                        </div>
                      </div>
                    )}
                    {brulage.num_preconisation && (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-500 mb-1">
                          Numéro de préconisation
                        </div>
                        <div className="font-mono text-sm font-semibold">
                          {brulage.num_preconisation}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Coordonnées GPS si disponibles */}
              {brulage.commune?.coordonnees && (
                <>
                  <Separator />
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-gray-900 mb-1">
                          Coordonnées GPS
                        </div>
                        <div className="text-sm text-gray-600 font-mono">
                          Latitude : {brulage.commune.coordonnees.latitude},
                          Longitude : {brulage.commune.coordonnees.longitude}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          
          {/* Détail des parcelles */}
          
          <ParcellesSection brulage={brulage} />

          {/* Surface */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AreaChart className="h-5 w-5" />
                Surface
              </CardTitle>
              <CardDescription>
                Surface brulée
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Target className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Surface</div>
                  <div className="text-sm text-gray-600">
                    {formatSurface(brulage.surface_reelle)} brûlés
                    {brulage.surface_prevue &&
                      brulage.surface_reelle &&
                      brulage.surface_prevue !== brulage.surface_reelle && (
                        <span className="text-xs text-gray-500 ml-1">
                          (prévu: {formatSurface(brulage.surface_prevue)})
                        </span>
                      )}
                  </div>
                  {brulage.commune?.parcelles &&
                    brulage.commune.parcelles.length > 0 && (
                      <div className="text-xs text-gray-500">
                        Sur{" "}
                        {(
                          brulage.commune.parcelles?.reduce(
                            (total, p) => total + parseFloat(p.surface_totale),
                            0
                          ) || 0
                        ).toFixed(2)}{" "}
                        ha de parcelles
                      </div>
                    )}
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs mt-1",
                      getTypeColor(brulage.type_brulage)
                    )}
                  >
                    {brulage.type_brulage}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Conditions et performance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Conditions météorologiques */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sun className="h-5 w-5" />
                  Conditions météo
                </CardTitle>
                <CardDescription>
                  {conditions
                    ? "Conditions enregistrées"
                    : "Conditions non disponibles"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isConditionsLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full rounded-lg" />
                    ))}
                  </div>
                ) : conditions ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Thermometer className="h-4 w-4 text-red-600" />
                        <span className="font-medium text-red-800">
                          Température
                        </span>
                      </div>
                      <span className="font-bold text-red-900">
                        {conditions.temperature_air}°C
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Wind className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-blue-800">Vent</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-blue-900">
                          {conditions.vitesse_vent} km/h
                        </span>
                        {conditions.direction_vent && (
                          <div className="text-xs text-blue-700">
                            {conditions.direction_vent}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-cyan-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Droplets className="h-4 w-4 text-cyan-600" />
                        <span className="font-medium text-cyan-800">
                          Humidité
                        </span>
                      </div>
                      <span className="font-bold text-cyan-900">
                        {conditions.humidite_air}%
                      </span>
                    </div>

                    {conditions.conditions_atmospheriques && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <CloudRain className="h-4 w-4 text-gray-600" />
                          <span className="font-medium text-gray-800">
                            Conditions
                          </span>
                        </div>
                        <span className="font-bold text-gray-900">
                          {conditions.conditions_atmospheriques}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Sun className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <div className="text-sm text-gray-500">
                      Conditions météo non enregistrées
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Performance */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Performance
                </CardTitle>
                <CardDescription>Résultats et efficacité</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {brulage.pourcentage_reussite !== undefined ? (
                  <div className="text-center space-y-2">
                    <div className="text-4xl font-bold text-gray-900">
                      {brulage.pourcentage_reussite}%
                    </div>
                    <div className="text-sm text-gray-600">
                      Taux de réussite
                    </div>
                    <Badge
                      className={cn(
                        "text-xs",
                        brulage.pourcentage_reussite >= 90
                          ? "bg-green-500"
                          : brulage.pourcentage_reussite >= 70
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      )}
                    >
                      {brulage.pourcentage_reussite >= 90
                        ? "Excellent"
                        : brulage.pourcentage_reussite >= 70
                        ? "Bon"
                        : "À améliorer"}
                    </Badge>

                    {brulage.repasse_necessaire && (
                      <div className="mt-3 p-2 bg-amber-50 rounded-lg">
                        <div className="text-xs text-amber-800 font-medium">
                          Repasse nécessaire
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Target className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <div className="text-sm text-gray-500">
                      Performance en cours d'évaluation
                    </div>
                  </div>
                )}

                {/* Campagne */}
                {brulage.campagne && (
                  <div className="pt-4 border-t">
                    <div className="text-xs text-gray-500 mb-1">Campagne</div>
                    <Badge variant="outline" className="text-xs">
                      {brulage.campagne}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          {/* Enjeux et espèces */}
          {((brulage.enjeux?.length ?? 0) > 0 ||
            (brulage.especes?.length ?? 0) > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Enjeux */}
              {(brulage.enjeux?.length ?? 0) > 0 && (
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">Enjeux</CardTitle>
                    <CardDescription>
                      Enjeux environnementaux associés
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {brulage.enjeux?.map((enjeu: any) => (
                        <div
                          key={enjeu.id}
                          className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="font-medium text-green-800">
                              {enjeu.nom_enjeu}
                            </div>
                            <div className="text-xs text-green-600">
                              {enjeu.type_enjeu}
                            </div>
                            {enjeu.priorite && (
                              <div className="text-xs text-green-500 mt-1">
                                Priorité {enjeu.priorite}
                              </div>
                            )}
                          </div>
                          <Badge className="bg-green-500">
                            {enjeu.pourcentage}%
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Espèces */}
              {(brulage.especes?.length ?? 0) > 0 && (
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">Espèces</CardTitle>
                    <CardDescription>
                      Espèces animales présentes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {brulage.especes?.map((espece: any) => (
                        <div
                          key={espece.id}
                          className="p-3 bg-blue-50 rounded-lg"
                        >
                          <div className="font-medium text-blue-800">
                            {espece.nom_espece}
                          </div>
                          <div className="text-xs text-blue-600">
                            {espece.type_animal}
                          </div>
                          {espece.nombre_tetes && (
                            <div className="text-xs text-blue-500 mt-1">
                              {espece.nombre_tetes} têtes
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Observations et commentaires */}
          {brulage.observations && (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Observations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-gray-800 leading-relaxed">
                    {brulage.observations}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
