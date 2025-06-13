import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  Flame,
  BarChart3,
  Activity,
  TrendingUp,
  MapPin,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useBrulagesStats } from "@/hooks/useBrulages";
import { useUIStore } from "@/store/uiStore";

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: Home,
    description: "Vue d'ensemble",
    badge: null,
  },
  {
    name: "Brûlages",
    href: "/brulages",
    icon: Flame,
    description: "Gestion active",
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    description: "Analyses détaillées",
    badge: null,
  },
];

export default function Sidebar() {
  const location = useLocation();
  const { data: statsData, isLoading, error } = useBrulagesStats();
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  // Calculer les stats à partir des données API
  const quickStats = [
    {
      label: "Actifs aujourd'hui",
      value: isLoading
        ? "..."
        : error
        ? "0"
        : Math.max(0, statsData?.brulages?.evolution || 0).toString(),
      icon: Activity,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
    },
    {
      label: "Total ce mois",
      value: isLoading
        ? "..."
        : error
        ? "0"
        : Math.max(0, statsData?.brulages?.anneeEnCours || 0).toString(),
      icon: Calendar,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      label: "Communes",
      value: isLoading
        ? "..."
        : error
        ? "0"
        : Math.max(0, statsData?.geographie?.communes || 0).toString(),
      icon: MapPin,
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      label: "Taux succès",
      value: isLoading
        ? "..."
        : error
        ? "0%"
        : `${Math.max(0, Math.round(statsData?.reussite?.tauxMoyen || 0))}%`,
      icon: TrendingUp,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-40 w-72 bg-white/95 backdrop-blur-xl border-r border-gray-200/60 transform transition-transform duration-300 ease-in-out lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      <div className="flex flex-col h-full max-h-screen">
        {/* Navigation principale - avec scroll invisible */}
        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <nav className="px-6 py-8 space-y-6">
            {/* Menu principal */}
            <div>
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Navigation
              </h2>
              <ul className="space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === "/"
                      ? location.pathname === "/"
                      : location.pathname.startsWith(item.href);

                  return (
                    <li key={item.name}>
                      <NavLink
                        to={item.href}
                        className={cn(
                          "group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 relative",
                          isActive
                            ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25"
                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                        )}
                      >
                        <Icon
                          className={cn(
                            "mr-3 h-5 w-5 transition-transform group-hover:scale-110",
                            isActive
                              ? "text-white"
                              : "text-gray-400 group-hover:text-gray-600"
                          )}
                        />
                        <div className="flex-1">
                          <div className="font-semibold">{item.name}</div>
                          <div
                            className={cn(
                              "text-xs mt-0.5",
                              isActive ? "text-white/80" : "text-gray-500"
                            )}
                          >
                            {item.description}
                          </div>
                        </div>
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Stats rapides */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100/80 rounded-2xl p-5 border border-gray-200/60">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Stats Rapides
              </h3>
              <div className="space-y-3">
                {quickStats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={stat.label}
                      className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={cn("p-2 rounded-lg", stat.bgColor)}>
                          <Icon className={cn("h-4 w-4", stat.color)} />
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {stat.label}
                        </span>
                      </div>
                      <span
                        className={cn(
                          "text-lg font-bold",
                          isLoading
                            ? "text-gray-400"
                            : error
                            ? "text-red-500"
                            : "text-gray-900"
                        )}
                      >
                        {stat.value}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Indicateur d'erreur si nécessaire */}
              {error && (
                <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-xs text-red-600">
                    Erreur de chargement des stats
                  </p>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-4 border-t border-gray-200/60 bg-white/80 backdrop-blur-sm">
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-2 border border-orange-100">
            <div className="text-xs text-gray-500">
              Dashboard v2.0 • Master ICE-LD
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
