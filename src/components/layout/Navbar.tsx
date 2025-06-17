import { Flame, Menu, X } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';

export default function Navbar() {
  const { sidebarOpen, toggleSidebar } = useUIStore();

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
        </div>
      </nav>
    </>
  );
}