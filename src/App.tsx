
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from './contexts/AuthContext';

import Index from "./pages/Index";
import ProductsPage from "./pages/ProductsPage";
import AuthPage from "./pages/AuthPage";
import AuthCallback from "./pages/AuthCallback";
import ProfilePage from "./pages/ProfilePage";
import ClubSubscriptionsPage from "./pages/ClubSubscriptionsPage";
import UserFavoritesPage from "./pages/UserFavoritesPage";
import UserOrdersPage from "./pages/UserOrdersPage";
import UserRecipesPage from "./pages/UserRecipesPage";
import UserDiscountsPage from "./pages/UserDiscountsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/productos" element={<ProductsPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/favorites" element={<UserFavoritesPage />} />
            <Route path="/profile/orders" element={<UserOrdersPage />} />
            <Route path="/profile/recipes" element={<UserRecipesPage />} />
            <Route path="/profile/discounts" element={<UserDiscountsPage />} />
            <Route path="/club-subscriptions" element={<ClubSubscriptionsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
