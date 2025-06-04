
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Package, BookOpen, ShoppingCart, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import Navbar from '@/components/Navbar';
import ProductManager from '@/components/admin/ProductManager';
import RecipeManager from '@/components/admin/RecipeManager';
import OrderManager from '@/components/admin/OrderManager';

const AdminPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const [activeTab, setActiveTab] = useState('products');

  React.useEffect(() => {
    console.log('AdminPage - User:', user);
    console.log('AdminPage - Profile:', profile);
    console.log('AdminPage - Profile loading:', profileLoading);

    if (!user && !profileLoading) {
      console.log('No user, redirecting to auth');
      navigate('/auth');
      return;
    }

    if (profile && profile.role !== 'admin') {
      console.log('User is not admin, redirecting to home');
      navigate('/');
      return;
    }
  }, [user, profile, navigate, profileLoading]);

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-warm-white">
        <Navbar />
        <div className="pt-20 flex items-center justify-center">
          <div>Cargando perfil...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-warm-white">
        <Navbar />
        <div className="pt-20 flex items-center justify-center">
          <div>Redirigiendo a autenticación...</div>
        </div>
      </div>
    );
  }

  if (!profile || profile.role !== 'admin') {
    return (
      <div className="min-h-screen bg-warm-white">
        <Navbar />
        <div className="pt-20 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-2">Acceso Denegado</h2>
            <p className="text-gray-600 mb-4">No tienes permisos de administrador.</p>
            <Button onClick={() => navigate('/')}>Volver al inicio</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-white">
      <Navbar />
      <div className="pt-20 max-w-7xl mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-charcoal hover:text-pastel-purple"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al inicio
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="font-playfair text-4xl font-bold text-charcoal mb-4">
            Panel de <span className="text-pastel-purple">Administración</span>
          </h1>
          <p className="font-inter text-lg text-charcoal/70">
            Gestiona productos, recetas, pedidos y usuarios desde aquí.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="products" className="flex items-center space-x-2">
              <Package className="h-4 w-4" />
              <span>Productos</span>
            </TabsTrigger>
            <TabsTrigger value="recipes" className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span>Recetas</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center space-x-2">
              <ShoppingCart className="h-4 w-4" />
              <span>Pedidos</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Usuarios</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <ProductManager />
          </TabsContent>

          <TabsContent value="recipes">
            <RecipeManager />
          </TabsContent>

          <TabsContent value="orders">
            <OrderManager />
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-6 w-6" />
                  Gestión de Usuarios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    La gestión de usuarios estará disponible próximamente.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;
