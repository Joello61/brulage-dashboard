import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Providers } from './providers'
import './index.css'

// Pages
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import BrulagesList from './pages/BrulagesList'   
import BrulageDetail from './pages/BrulageDetail' 
import Analytics from './pages/Analytics'
import { StrictMode } from 'react'

// Router Configuration
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'brulages', element: <BrulagesList /> },
      { path: 'brulages/:id', element: <BrulageDetail /> },
      { path: 'analytics', element: <Analytics /> },
    ],
    errorElement: (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-orange-50">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-gray-900">Page introuvable</h2>
          <p className="text-gray-600">La page que vous cherchez n'existe pas.</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:shadow-lg transition-all duration-200"
          >
            Retour au dashboard
          </button>
        </div>
      </div>
    )
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  </StrictMode>,
)