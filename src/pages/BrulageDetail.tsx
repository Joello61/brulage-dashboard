import { useParams, Link, useNavigate } from "react-router-dom";
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
  Eye,
  Download,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Target,
  FileText,
  Camera,
  CloudRain,
  Sun,
  Map,
  Activity,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BrulageMap } from "@/components/brulages/BrulageMap";
import { useBrulage, useBrulageConditions } from "@/hooks/useBrulages";
import { useExportPdfCommune } from "@/hooks/useExports";
import {
  getStatutColor,
  getStatutLabel,
  getTypeColor,
  formatSurface,
  formatDate,
  formatDateRelative,
} from "@/types/brulage";
import { cn } from "@/lib/utils";

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

  // Hook d'export
  const exportPdfMutation = useExportPdfCommune();

  const handleExportPdf = () => {
    if (brulage) {
      exportPdfMutation.mutate(brulage.id);
    }
  };

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

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={exportPdfMutation.isPending}
              >
                <Download className="h-4 w-4 mr-2" />
                {exportPdfMutation.isPending ? "Export..." : "Exporter"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExportPdf}>
                <FileText className="h-4 w-4 mr-2" />
                Rapport PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.print()}>
                <FileText className="h-4 w-4 mr-2" />
                Imprimer la page
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Layout principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contenu principal */}
        <div className="lg:col-span-2 space-y-6">
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
          {brulage.commune?.parcelles &&
            brulage.commune.parcelles.length > 0 && (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Map className="h-5 w-5" />
                    Parcelles ({brulage.commune.parcelles.length})
                  </CardTitle>
                  <CardDescription>
                    Détail des {brulage.commune.parcelles.length} parcelle
                    {brulage.commune.parcelles.length > 1 ? "s" : ""} concernée
                    {brulage.commune.parcelles.length > 1 ? "s" : ""} par le
                    brûlage
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Résumé des surfaces */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">
                          {brulage.commune.parcelles.length}
                        </div>
                        <div className="text-sm text-gray-600">Parcelles</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {(
                            brulage.commune.parcelles?.reduce(
                              (total, parcelle) =>
                                total + parseFloat(parcelle.surface_totale),
                              0
                            ) || 0
                          ).toFixed(2)}{" "}
                          ha
                        </div>
                        <div className="text-sm text-gray-600">
                          Surface totale
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {brulage.surface_reelle} ha
                        </div>
                        <div className="text-sm text-gray-600">
                          Surface brûlée
                        </div>
                      </div>
                    </div>

                    {/* Carte de localisation */}
                    {brulage?.commune?.coordonnees && (
                      <BrulageMap
                        brulages={[brulage]}
                        selectedBrulage={brulage.id}
                        height="h-[500px]"
                        showControls={true}
                        title="Localisation"
                        description={`Position du brûlage à ${brulage.commune?.nom}`}
                        className="border-0 shadow-lg"
                      />
                    )}

                    {/* Liste des parcelles */}
                    <div className="space-y-3">
                      <div className="text-sm font-medium text-gray-700 mb-2">
                        Détail par parcelle :
                      </div>

                      {brulage.commune.parcelles
                        ?.sort(
                          (a, b) =>
                            parseFloat(b.surface_totale) -
                            parseFloat(a.surface_totale)
                        )
                        ?.map((parcelle, index) => {
                          const surfaceParcelle = parseFloat(
                            parcelle.surface_totale
                          );
                          const surfaceTotaleParcelles =
                            brulage.commune.parcelles?.reduce(
                              (total, p) =>
                                total + parseFloat(p.surface_totale),
                              0
                            ) || 0;
                          const pourcentageTotal =
                            surfaceTotaleParcelles > 0
                              ? (surfaceParcelle / surfaceTotaleParcelles) * 100
                              : 0;

                          return (
                            <div
                              key={parcelle.id}
                              className="flex items-center justify-between p-3 bg-white border rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                                  {index + 1}
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">
                                    Parcelle #{parcelle.id}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {pourcentageTotal.toFixed(1)}% de la surface
                                    totale
                                  </div>
                                </div>
                              </div>

                              <div className="text-right">
                                <div className="font-semibold text-gray-900">
                                  {surfaceParcelle.toFixed(2)} ha
                                </div>
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${
                                    surfaceParcelle >= 10
                                      ? "border-green-500 text-green-700"
                                      : surfaceParcelle >= 5
                                      ? "border-yellow-500 text-yellow-700"
                                      : "border-gray-500 text-gray-700"
                                  }`}
                                >
                                  {surfaceParcelle >= 10
                                    ? "Grande"
                                    : surfaceParcelle >= 5
                                    ? "Moyenne"
                                    : "Petite"}
                                </Badge>
                              </div>
                            </div>
                          );
                        }) || []}
                    </div>

                    {/* Comparaison surface totale vs surface brûlée */}
                    {(() => {
                      const surfaceTotaleParcelles =
                        brulage.commune.parcelles?.reduce(
                          (total, parcelle) =>
                            total + parseFloat(parcelle.surface_totale),
                          0
                        ) || 0;
                      const pourcentageBrule =
                        (brulage.surface_reelle / surfaceTotaleParcelles) * 100;

                      return (
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-blue-800">
                              Couverture du brûlage
                            </span>
                            <span className="text-lg font-bold text-blue-900">
                              {pourcentageBrule.toFixed(1)}%
                            </span>
                          </div>

                          <div className="w-full bg-blue-200 rounded-full h-3">
                            <div
                              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                              style={{
                                width: `${Math.min(pourcentageBrule, 100)}%`,
                              }}
                            />
                          </div>

                          <div className="flex justify-between text-xs text-blue-700 mt-1">
                            <span>0 ha</span>
                            <span>{surfaceTotaleParcelles.toFixed(2)} ha</span>
                          </div>

                          {pourcentageBrule > 100 && (
                            <div className="mt-2 p-2 bg-amber-100 border border-amber-300 rounded text-xs text-amber-800">
                              La surface brûlée dépasse la surface totale des
                              parcelles
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </CardContent>
              </Card>
            )}
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
                    {brulage.commune.parcelles
                      .reduce(
                        (total, p) => total + parseFloat(p.surface_totale),
                        0
                      )
                      .toFixed(2)}{" "}
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
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Observations */}
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

          {/* Actions rapides */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" variant="outline" asChild>
                <Link to={`/brulages/${brulage?.id}/timeline`}>
                  <Eye className="h-4 w-4 mr-2" />
                  Voir la timeline
                </Link>
              </Button>
              <Button className="w-full" variant="outline" asChild>
                <Link to={`/brulages/${brulage?.id}/media`}>
                  <Camera className="h-4 w-4 mr-2" />
                  Photos et documents
                </Link>
              </Button>
              <Button
                className="w-full"
                variant="outline"
                onClick={handleExportPdf}
                disabled={exportPdfMutation.isPending}
              >
                <Download className="h-4 w-4 mr-2" />
                {exportPdfMutation.isPending
                  ? "Génération..."
                  : "Télécharger le rapport"}
              </Button>
            </CardContent>
          </Card>

          {/* Informations système */}
          <Card className="border-0 shadow-lg bg-gray-50">
            <CardHeader>
              <CardTitle className="text-sm text-gray-700">
                Informations système
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>ID:</span>
                <span className="font-mono">#{brulage?.id}</span>
              </div>
              {brulage?.created_at && (
                <div className="flex justify-between">
                  <span>Créé le:</span>
                  <span>{formatDate(brulage.created_at)}</span>
                </div>
              )}
              {brulage?.updated_at && (
                <div className="flex justify-between">
                  <span>Modifié le:</span>
                  <span>{formatDate(brulage.updated_at)}</span>
                </div>
              )}
              {brulage?.campagne && (
                <div className="flex justify-between">
                  <span>Campagne:</span>
                  <span>{brulage.campagne}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
