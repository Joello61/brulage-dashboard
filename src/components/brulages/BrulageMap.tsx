import { useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Layers, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import type { Brulage } from "@/types/brulage";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    L: any;
  }
}

interface BrulageMapProps {
  brulages: Brulage[];
  selectedBrulage?: number | null;
  onBrulageSelect?: (brulage: Brulage) => void;
  showControls?: boolean;
  height?: string;
  className?: string;
  title?: string;
  description?: string;
}

export function BrulageMap({
  brulages,
  selectedBrulage,
  onBrulageSelect,
  showControls = true,
  height = "h-100",
  className,
  title = "Carte des brûlages",
  description,
}: BrulageMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const polygonsRef = useRef<any[]>([]);
  const markersRef = useRef<any[]>([]);

  // Configuration de la carte centrée sur les Pyrénées-Orientales
  const defaultCenter = [42.6, 2.4];
  const defaultZoom = 10;

  // Couleurs des polygones selon le statut
  const getStatusColor = (statut: string): string => {
    switch (statut) {
      case "EN_COURS":
        return "#f97316"; // orange
      case "TERMINE":
      case "Réalisé":
        return "#22c55e"; // vert
      case "PLANIFIE":
        return "#3b82f6"; // bleu
      case "SUSPENDU":
        return "#eab308"; // jaune
      case "ANNULE":
        return "#ef4444"; // rouge
      default:
        return "#6b7280"; // gris
    }
  };

  // Parser les coordonnées MULTIPOLYGON depuis PostGIS
  const parseMultiPolygon = (multiPolygonString: string) => {
    if (!multiPolygonString) return null;

    try {
      // Nettoyer la chaîne et extraire seulement les coordonnées numériques
      let cleanString = multiPolygonString;

      // Supprimer le SRID si présent
      cleanString = cleanString.replace(/^SRID=\d+;/, "");

      // Supprimer MULTIPOLYGON et toutes les parenthèses
      cleanString = cleanString.replace(/MULTIPOLYGON/g, "");
      cleanString = cleanString.replace(/[\(\)]/g, "");

      // Nettoyer les espaces multiples
      cleanString = cleanString.trim();

      if (!cleanString) return null;

      // Séparer les paires de coordonnées
      const pairs = cleanString.split(",");

      const coordinates = [];

      for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i].trim();

        // Ignorer les chaînes vides
        if (!pair) continue;

        // Séparer longitude et latitude
        const coords = pair.split(/\s+/);

        if (coords.length >= 2) {
          const lng = parseFloat(coords[0]);
          const lat = parseFloat(coords[1]);

          // Validation des coordonnées
          if (
            !isNaN(lng) &&
            !isNaN(lat) &&
            lat >= -90 &&
            lat <= 90 &&
            lng >= -180 &&
            lng <= 180
          ) {
            coordinates.push([lat, lng]); // Leaflet utilise [lat, lng]
          } else {
            console.warn(
              "Coordonnées hors limites:",
              pair,
              "-> lng:",
              lng,
              "lat:",
              lat
            );
          }
        } else {
          console.warn("Format de coordonnées invalide:", pair);
        }
      }

      // Vérifier qu'on a au moins 3 points pour former un polygone
      if (coordinates.length < 3) {
        console.warn(
          "Pas assez de coordonnées valides pour former un polygone:",
          coordinates.length
        );
        return null;
      }

      console.log(`Polygone parsé avec succès: ${coordinates.length} points`);
      return [coordinates]; // Retourner un tableau de coordonnées pour Leaflet
    } catch (error) {
      console.warn(
        "Erreur parsing MULTIPOLYGON:",
        error,
        multiPolygonString.substring(0, 100) + "..."
      );
      return null;
    }
  };

  // Grouper les brûlages par commune pour les marqueurs de backup
  const groupBrulagesByCommune = (brulages: Brulage[]) => {
    const grouped = brulages.reduce((acc, brulage) => {
      // Vérifier les coordonnées transformées de la commune
      if (!brulage.commune?.coordonnees) return acc;

      const key = `${brulage.commune.id}`;
      if (!acc[key]) {
        acc[key] = {
          commune: brulage.commune,
          brulages: [],
          coordonnees: brulage.commune.coordonnees,
        };
      }
      acc[key].brulages.push(brulage);
      return acc;
    }, {} as Record<string, { commune: any; brulages: Brulage[]; coordonnees: { latitude: number; longitude: number } }>);

    return Object.values(grouped);
  };

  // Initialiser la carte Leaflet
  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;

    if (typeof window.L === "undefined") {
      console.error(
        "Leaflet n'est pas chargé. Ajoutez le script Leaflet à votre index.html"
      );
      return;
    }

    const map = window.L.map(mapRef.current, {
      center: defaultCenter,
      zoom: defaultZoom,
      zoomControl: false,
    });

    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 18,
    }).addTo(map);

    leafletMapRef.current = map;

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  // Mettre à jour les polygones et marqueurs
  useEffect(() => {
    if (!leafletMapRef.current) return;

    const map = leafletMapRef.current;

    // Supprimer les anciens polygones et marqueurs
    [...polygonsRef.current, ...markersRef.current].forEach((layer) =>
      map.removeLayer(layer)
    );
    polygonsRef.current = [];
    markersRef.current = [];

    // Séparer les brûlages selon leurs données disponibles
    const brulagesWithParcelles: Brulage[] = [];
    const brulagesForMarkers: Brulage[] = [];

    brulages.forEach((brulage) => {
      const hasParcelles =
        brulage.commune?.parcelles && brulage.commune.parcelles.length > 0;
      const hasCoordinates = brulage.commune?.coordonnees;

      // Si on a des parcelles, on affiche les polygones
      if (hasParcelles) {
        brulagesWithParcelles.push(brulage);
      }

      // Si on a des coordonnées de commune, on affiche aussi un marqueur
      if (hasCoordinates) {
        brulagesForMarkers.push(brulage);
      }
    });


    let totalParcellesProcessed = 0;
    let totalPolygonsCreated = 0;

    const allBounds = [];

    // 1. Afficher les polygones pour les brûlages avec parcelles
    brulagesWithParcelles.forEach((brulage) => {
      const color = getStatusColor(brulage.statut);

      if (
        brulage.commune?.parcelles &&
        Array.isArray(brulage.commune.parcelles)
      ) {
        brulage.commune.parcelles.forEach(
          (parcelle: {
            coordonnees: string;
            surface_totale: string;
            id?: number;
          }) => {
            totalParcellesProcessed++;
            const coordinates = parseMultiPolygon(parcelle.coordonnees);

            // Validation stricte des coordonnées
            if (
              coordinates &&
              coordinates.length > 0 &&
              coordinates[0] &&
              coordinates[0].length >= 3
            ) {
              // Vérifier que toutes les coordonnées sont valides
              const validCoords = coordinates[0].every(
                (coord) =>
                  Array.isArray(coord) &&
                  coord.length === 2 &&
                  !isNaN(coord[0]) &&
                  !isNaN(coord[1]) &&
                  coord[0] >= -90 &&
                  coord[0] <= 90 && // latitude
                  coord[1] >= -180 &&
                  coord[1] <= 180 // longitude
              );

              if (validCoords) {
                totalPolygonsCreated++;
                const polygon = window.L.polygon(coordinates, {
                  color: color,
                  fillColor: color,
                  fillOpacity: brulage.id === selectedBrulage ? 0.6 : 0.3,
                  weight: brulage.id === selectedBrulage ? 3 : 2,
                  opacity: brulage.id === selectedBrulage ? 1 : 0.8,
                }).addTo(map);

                // Popup avec informations détaillées
                const popupContent = `
                <div style="min-width: 250px; max-width: 300px;">
                  <h3 style="margin: 0 0 8px 0; color: #1f2937; font-weight: bold;">
                    Brûlage #${brulage.id}
                  </h3>
                  
                  <div style="margin-bottom: 8px;">
                    <span style="
                      background-color: ${color}20;
                      color: ${color};
                      padding: 2px 8px;
                      border-radius: 12px;
                      font-size: 12px;
                      font-weight: 500;
                    ">${brulage.statut}</span>
                  </div>
                  
                  <div style="font-size: 14px; line-height: 1.4;">
                    <p style="margin: 4px 0;"><strong>Commune:</strong> ${
                      brulage.commune?.nom || "Non définie"
                    }</p>
                    <p style="margin: 4px 0;"><strong>Région:</strong> ${
                      brulage.commune?.region || "Non définie"
                    }</p>
                    <p style="margin: 4px 0;"><strong>Date:</strong> ${new Date(
                      brulage.date_realisation
                    ).toLocaleDateString("fr-FR")}</p>
                    <p style="margin: 4px 0;"><strong>Surface réelle:</strong> ${(
                      brulage.surface_reelle || 0
                    ).toFixed(2)} ha</p>
                    <p style="margin: 4px 0;"><strong>Surface parcelle:</strong> ${parseFloat(
                      parcelle.surface_totale || "0"
                    ).toFixed(2)} ha</p>
                    <p style="margin: 4px 0;"><strong>Type:</strong> ${
                      brulage.type_brulage || "Non défini"
                    }</p>
                    ${
                      brulage.pourcentage_reussite
                        ? `<p style="margin: 4px 0;"><strong>Réussite:</strong> ${brulage.pourcentage_reussite}%</p>`
                        : ""
                    }
                    ${
                      brulage.demandeur?.nom
                        ? `<p style="margin: 4px 0;"><strong>Demandeur:</strong> ${brulage.demandeur.nom}</p>`
                        : ""
                    }
                  </div>
                  
                  ${
                    brulage.observations
                      ? `
                    <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e5e7eb;">
                      <p style="margin: 0; font-size: 13px; color: #6b7280;"><strong>Observations:</strong></p>
                      <p style="margin: 4px 0 0 0; font-size: 13px; color: #374151;">${brulage.observations}</p>
                    </div>
                  `
                      : ""
                  }
                </div>
              `;

                polygon.bindPopup(popupContent, {
                  maxWidth: 320,
                  className: "custom-popup",
                });

                // Événement de clic
                polygon.on("click", () => {
                  onBrulageSelect?.(brulage);
                });

                // Effet de survol
                polygon.on("mouseover", () => {
                  polygon.setStyle({
                    weight: 3,
                    fillOpacity: 0.5,
                  });
                });

                polygon.on("mouseout", () => {
                  polygon.setStyle({
                    weight: brulage.id === selectedBrulage ? 3 : 2,
                    fillOpacity: brulage.id === selectedBrulage ? 0.6 : 0.3,
                  });
                });

                polygonsRef.current.push(polygon);
                allBounds.push(polygon.getBounds());
              } else {
                console.warn(
                  `Coordonnées invalides pour la parcelle du brûlage #${brulage.id}:`,
                  coordinates
                );
              }
            } else {
              console.warn(
                `Impossible de parser les coordonnées pour la parcelle du brûlage #${brulage.id}:`,
                parcelle.coordonnees
              );
            }
          }
        );
      }
    });

    // 2. Afficher des marqueurs pour tous les brûlages avec coordonnées de commune
    if (brulagesForMarkers.length > 0) {
      const groupedBrulages = groupBrulagesByCommune(brulagesForMarkers);

      groupedBrulages.forEach((group) => {
        const { latitude, longitude } = group.coordonnees;
        if (!latitude || !longitude) return;

        const count = group.brulages.length;

        // Déterminer le type de marqueur selon la présence de parcelles
        const brulagesWithParcellesInGroup = group.brulages.filter(
          (b) => b.commune?.parcelles && b.commune.parcelles.length > 0
        );
        const brulagesWithoutParcellesInGroup = group.brulages.filter(
          (b) => !b.commune?.parcelles || b.commune.parcelles.length === 0
        );

        const statusCounts = group.brulages.reduce((acc, b) => {
          acc[b.statut] = (acc[b.statut] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const majorityStatus = Object.entries(statusCounts).sort(
          ([, a], [, b]) => b - a
        )[0][0];

        const color = getStatusColor(majorityStatus);

        // Taille du marqueur basée sur le nombre de brûlages
        const markerSize = Math.min(Math.max(15 + count * 2, 20), 40);

        // Style différent selon si on a des parcelles ou pas
        const hasParcellesData = brulagesWithParcellesInGroup.length > 0;
        const borderStyle = hasParcellesData ? "dashed" : "solid";
        const opacity = hasParcellesData ? "0.8" : "1";

        const markerIcon = window.L.divIcon({
          html: `
            <div style="
              background-color: ${color};
              color: white;
              border-radius: 50%;
              width: ${markerSize}px;
              height: ${markerSize}px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              font-size: ${count > 9 ? "11px" : "13px"};
              border: 3px ${borderStyle} white;
              opacity: ${opacity};
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            ">
              ${count}
            </div>
          `,
          className: "",
          iconSize: [markerSize, markerSize],
          iconAnchor: [markerSize / 2, markerSize / 2],
        });

        const marker = window.L.marker([latitude, longitude], {
          icon: markerIcon,
        });

        const popupContent = `
          <div style="max-width: 300px; max-height: 400px; overflow-y: auto;">
            <h3 style="font-weight: bold; font-size: 16px; margin-bottom: 8px; color: #1f2937;">
              ${group.commune?.nom || "Commune inconnue"}
            </h3>
            <div style="margin-bottom: 12px; font-size: 13px;">
              <span style="color: #6b7280;">
                ${count} brûlage${count > 1 ? "s" : ""} total
              </span>
              ${
                hasParcellesData
                  ? `
                <br/><span style="color: #059669;">
                  • ${brulagesWithParcellesInGroup.length} avec parcelles définies
                </span>
              `
                  : ""
              }
              ${
                brulagesWithoutParcellesInGroup.length > 0
                  ? `
                <br/><span style="color: #dc2626;">
                  • ${brulagesWithoutParcellesInGroup.length} sans parcelles
                </span>
              `
                  : ""
              }
            </div>
            
            <div style="space-y: 8px;">
              ${group.brulages
                .map((brulage, index) => {
                  const hasParcelleData =
                    brulage.commune?.parcelles &&
                    brulage.commune.parcelles.length > 0;
                  return `
                <div style="
                  border-bottom: ${
                    index < group.brulages.length - 1
                      ? "1px solid #e5e7eb"
                      : "none"
                  };
                  padding-bottom: ${
                    index < group.brulages.length - 1 ? "8px" : "0"
                  };
                  margin-bottom: ${
                    index < group.brulages.length - 1 ? "8px" : "0"
                  };
                ">
                  <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 4px;">
                    <strong style="color: #374151;">
                      ${hasParcelleData ? "🔳" : "-"} Brûlage #${brulage.id}
                    </strong>
                    <span style="
                      background-color: ${getStatusColor(brulage.statut)}20;
                      color: ${getStatusColor(brulage.statut)};
                      padding: 2px 8px;
                      border-radius: 12px;
                      font-size: 11px;
                      font-weight: 500;
                    ">${brulage.statut}</span>
                  </div>
                  
                  <div style="font-size: 12px; color: #4b5563; line-height: 1.4;">
                    <div><strong>Date:</strong> ${new Date(
                      brulage.date_realisation
                    ).toLocaleDateString("fr-FR")}</div>
                    <div><strong>Surface:</strong> ${(
                      brulage.surface_reelle || 0
                    ).toFixed(2)} ha</div>
                    <div><strong>Type:</strong> ${
                      brulage.type_brulage || "Non défini"
                    }</div>
                    ${
                      hasParcelleData
                        ? `
                      <div style="color: #059669; font-size: 11px; margin-top: 2px;">
                        ✓ Parcelles définies (${brulage.commune.parcelles?.length})
                      </div>
                    `
                        : `
                      <div style="color: #dc2626; font-size: 11px; margin-top: 2px;">
                        ⚠ Position approximative
                      </div>
                    `
                    }
                  </div>
                </div>
              `;
                })
                .join("")}
            </div>
          </div>
        `;

        marker.bindPopup(popupContent, {
          maxWidth: 320,
          className: "custom-popup",
        });

        marker.on("click", () => {
          onBrulageSelect?.(group.brulages[0]);
        });

        marker.addTo(map);
        markersRef.current.push(marker);
      });
    }

    // Ajuster la vue pour inclure tous les polygones/marqueurs
    if (allBounds.length > 0) {
      const group = new window.L.featureGroup([
        ...polygonsRef.current,
        ...markersRef.current,
      ]);
      map.fitBounds(group.getBounds(), {
        padding: [20, 20],
        maxZoom: 12,
      });
    } else if (markersRef.current.length > 0) {
      const group = new window.L.featureGroup(markersRef.current);
      map.fitBounds(group.getBounds(), {
        padding: [20, 20],
        maxZoom: 12,
      });
    }
  }, [brulages, selectedBrulage, onBrulageSelect]);

  // Contrôles de zoom
  const zoomIn = () => leafletMapRef.current?.zoomIn();
  const zoomOut = () => leafletMapRef.current?.zoomOut();
  const resetView = () =>
    leafletMapRef.current?.setView(defaultCenter, defaultZoom);

  // Statistiques
  const statusCounts = brulages.reduce((acc, brulage) => {
    acc[brulage.statut] = (acc[brulage.statut] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Compter le nombre total de parcelles (pas le nombre de brûlages avec parcelles)
  const totalParcelles = brulages.reduce((total, brulage) => {
    return total + (brulage.commune?.parcelles?.length || 0);
  }, 0);

  const brulagesWithCoords = brulages.filter(
    (b) => b.commune?.coordonnees
  ).length;

  return (
    <Card className={cn("border-0 shadow-lg", className)}>
      {showControls && (
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-green-500" />
                {title}
              </CardTitle>
              {description && <CardDescription>{description}</CardDescription>}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{brulages.length} brûlages</Badge>
              <Badge variant="secondary">{totalParcelles} parcelles</Badge>
              <Button variant="outline" size="sm">
                <Layers className="h-4 w-4 mr-1" />
                Couches
              </Button>
            </div>
          </div>
        </CardHeader>
      )}

      <CardContent className="p-0 relative">
        <div
          ref={mapRef}
          className={cn("w-full rounded-lg overflow-hidden relative", height)}
          style={{ zIndex: 1 }}
        />

        {/* Contrôles de zoom */}
        {showControls && (
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-[1000]">
            <Button
              size="sm"
              variant="outline"
              className="bg-white/90 backdrop-blur-sm h-8 w-8 p-0 shadow-md"
              onClick={zoomIn}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-white/90 backdrop-blur-sm h-8 w-8 p-0 shadow-md"
              onClick={zoomOut}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-white/90 backdrop-blur-sm h-8 w-8 p-0 shadow-md"
              onClick={resetView}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Légende */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-md space-y-2 z-[500]">
          <div className="text-xs font-semibold text-gray-700 mb-2">
            Légende
          </div>
          {Object.entries(statusCounts).map(([status, count]) => (
            <div key={status} className="flex items-center gap-2 text-xs">
              <div
                className="w-3 h-3 rounded border border-white shadow-sm"
                style={{ backgroundColor: getStatusColor(status) }}
              />
              <span className="text-gray-700">
                {status.replace("_", " ")} ({count})
              </span>
            </div>
          ))}
          <div className="pt-2 border-t border-gray-200 text-xs text-gray-500">
            {/* Parcelle déformée comme une flaque ou un virus */}
            <div className="flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 100 100">
                <path
                  d="M30,20 
               Q10,10 20,40 
               Q5,60 30,65 
               Q20,80 50,90 
               Q70,95 75,75 
               Q95,60 80,50 
               Q95,30 70,25 
               Q60,5 40,15 
               Q35,10 30,20 Z"
                  fill="#4ade80"
                />
              </svg>
              <span>Polygones = parcelles définies</span>
            </div>

            {/* Marqueur : cercle vert bordure pointillée blanche épaisse */}
            <div className="flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="#4ade80"
                  stroke="white"
                  strokeWidth="20"
                  strokeDasharray="10 6"
                />
              </svg>
              <span>
                Marqueurs = communes (solide = position seule, pointillé = avec
                parcelles)
              </span>
            </div>
          </div>
        </div>

        {/* Attribution et info */}
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 text-xs text-gray-600 z-[1000]">
          {totalParcelles} parcelles • {brulagesWithCoords} marqueurs
        </div>

        {/* Message si pas de données */}
        {brulages.length > 0 && brulagesWithCoords === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-[1000]">
            <div className="text-center space-y-2">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto" />
              <p className="text-gray-600">Aucune localisation disponible</p>
              <p className="text-sm text-gray-500">
                Les brûlages n'ont pas de coordonnées
              </p>
            </div>
          </div>
        )}
      </CardContent>

      {/* Message d'erreur Leaflet */}
      {typeof window !== "undefined" && typeof window.L === "undefined" && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 rounded-lg">
          <div className="text-center space-y-2 p-4">
            <div className="text-red-600">⚠️ Leaflet non chargé</div>
            <p className="text-sm text-red-700">
              Ajoutez Leaflet à votre index.html
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}
