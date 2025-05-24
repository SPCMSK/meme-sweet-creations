import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// 1. IMPORTA TU AuthProvider
import { AuthProvider } from './contexts/AuthContext'; // Ajusta la ruta si es diferente (ej. ./src/contexts/AuthContext)

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
// Si tienes rutas protegidas o páginas que usan el estado de auth, podrías importarlas aquí también.
// import DashboardPage from './pages/DashboardPage';
// import ProtectedRoute from './components/ProtectedRoute'; // Si creaste este componente

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      {/* 2. ENVUELVE TU APLICACIÓN (ESPECIALMENTE EL ROUTER) CON AuthProvider */}
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* Aquí puedes añadir tus rutas protegidas como te mostré en el punto 5 de la primera respuesta */}
            {/* Ejemplo de ruta protegida (asegúrate de crear ProtectedRoute.tsx y DashboardPage.tsx):
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
            </Route>
            */}
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
