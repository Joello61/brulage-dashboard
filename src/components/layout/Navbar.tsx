import { Search, Flame, Command, Menu, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useUIStore } from '@/store/uiStore';
import { useState } from 'react';

export default function Navbar() {
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-1000 w-full border-b border-white/20 bg-white/80 backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Bouton hamburger mobile + Logo */}
          <div className="flex items-center space-x-4">
            {/* Bouton hamburger - visible seulement sur mobile */}
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {sidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>

            {/* Logo et titre */}
            <div className="flex items-center space-x-3">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-300" />
                <div className="relative p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl">
                  <Flame className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Brûlages Dirigés
                </h1>
                <p className="text-xs text-gray-500 font-medium">
                  Dashboard Analytics
                </p>
              </div>
              {/* Version mobile compacte */}
              <div className="sm:hidden">
                <h1 className="text-lg font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Brûlages
                </h1>
              </div>
            </div>
          </div>

          {/* Barre de recherche centrale - Desktop */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
              <Input
                placeholder="Rechercher brûlage, commune, responsable..."
                className="pl-10 pr-12 bg-gray-50/80 border-gray-200/60 focus:bg-white focus:border-orange-300 transition-all duration-200 rounded-xl"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                  <Command className="h-3 w-3" />
                  K
                </Badge>
              </div>
            </div>
          </div>

          {/* Bouton de recherche mobile */}
          <button 
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            aria-label="Toggle search"
          >
            {mobileSearchOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Search className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Barre de recherche mobile - s'ouvre sous la navbar */}
        {mobileSearchOpen && (
          <div className="md:hidden border-t border-gray-200/60 bg-white/90 backdrop-blur-xl">
            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher brûlage, commune, responsable..."
                  className="pl-10 bg-gray-50/80 border-gray-200/60 focus:bg-white focus:border-orange-300 transition-all duration-200 rounded-xl"
                  autoFocus
                />
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}