import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useUIStore } from '@/store/uiStore';
import { useEffect } from 'react';

export default function Layout() {
  const { sidebarOpen, setSidebarOpen, setResponsiveState } = useUIStore();

  // Détecter la taille d'écran
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 1024; // lg breakpoint
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
      setResponsiveState(isMobile, isTablet);
    };

    handleResize(); // Appel initial
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setResponsiveState]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/20 to-red-50/20">
      {/* Navigation Top */}
      <Navbar />
      
      <div className="flex">
        {/* Overlay pour mobile quand sidebar est ouverte */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <main className="flex-1 lg:ml-72">
          <div className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}