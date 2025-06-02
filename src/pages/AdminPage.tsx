
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Edit, Trash2, Eye, Package, Users, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import Navbar from '@/components/Navbar';

interface Recipe {
  id: string;
  title: string;
  description: string;
  is_free: boolean;
  created_at: string;
}

interface Order {
  id: string;
  user_id: string;
  products: any;
  total_price: number;
  status: string;
  created_at: string;
}

const AdminPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useProfile();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si el usuario es administrador
    if (!user) {
      navigate('/auth');
      return;
    }

    if (profile && profile.role !== 'admin') {
      navigate('/');
      return;
    }

    if (profile?.role === 'admin') {
      fetchData();
    }
  }, [user, profile, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Obtener recetas
      const { data: recipesData, error: recipesError } = await supabase
        .from('recipes')
        .select('id, title, description, is_free, created_at')
        .order('created_at', { ascending: false });

      if (recipesError) {
        console.error('Error fetching recipes:', recipesError);
      } else {
        setRecipes(recipesData || []);
      }

      // Obtener pedidos
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('id, user_id, products, total_price, status, created_at')
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error('Error fetching orders:', ordersError);
      } else {
        setOrders(ordersData || []);
      }

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteRecipe = async (recipeId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta receta?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', recipeId);

      if (error) {
        console.error('Error deleting recipe:', error);
        return;
      }

      setRecipes(recipes.filter(recipe => recipe.id !== recipeId));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) {
        console.error('Error updating order:', error);
        return;
      }

      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'confirmado': return 'bg-blue-100 text-blue-800';
      case 'preparando': return 'bg-purple-100 text-purple-800';
      case 'enviado': return 'bg-indigo-100 text-indigo-800';
      case 'entregado': return 'bg-green-100 text-green-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-white">
        <Navbar />
        <div className="pt-20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pastel-purple mx-auto mb-4"></div>
            <p className="font-inter text-charcoal/70">Cargando panel de administración...</p>
          </div>
        </div>
      </div>
    );
  }

  if (profile?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-warm-white">
        <Navbar />
        <div className="pt-20 flex items-center justify-center">
          <div className="text-center">
            <p className="font-inter text-charcoal/70 text-xl">
              No tienes permisos para acceder a esta página.
            </p>
            <Button 
              onClick={() => navigate('/')}
              className="mt-4 bg-pastel-purple hover:bg-pastel-purple/90 text-white"
            >
              Volver al inicio
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-white">
      <Navbar />
      <div className="pt-20 max-w-7xl mx-auto p-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-4 text-charcoal hover:text-pastel-purple"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al inicio
        </Button>

        <div className="mb-8">
          <h1 className="font-playfair text-3xl md:text-4xl font-bold text-charcoal mb-2">
            Panel de Administración
          </h1>
          <p className="font-inter text-charcoal/70">
            Gestiona las recetas, pedidos y contenido del sitio
          </p>
        </div>

        <Tabs defaultValue="recipes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="recipes" className="flex items-center">
              <Package className="mr-2 h-4 w-4" />
              Recetas
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              Pedidos
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center">
              <MessageSquare className="mr-2 h-4 w-4" />
              Mensajes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recipes" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-playfair text-2xl font-bold text-charcoal">
                Gestión de Recetas
              </h2>
              <Button 
                onClick={() => navigate('/admin/nueva-receta')}
                className="bg-pastel-purple hover:bg-pastel-purple/90 text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Nueva Receta
              </Button>
            </div>

            <div className="grid gap-4">
              {recipes.map((recipe) => (
                <Card key={recipe.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="font-playfair text-xl text-charcoal">
                          {recipe.title}
                        </CardTitle>
                        <CardDescription className="font-inter">
                          {recipe.description}
                        </CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/recetas/${recipe.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/admin/editar-receta/${recipe.id}`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteRecipe(recipe.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4">
                      <Badge className={recipe.is_free ? 'bg-green-100 text-green-800' : 'bg-pastel-purple text-white'}>
                        {recipe.is_free ? 'Gratis' : 'Premium'}
                      </Badge>
                      <span className="text-sm text-charcoal/60">
                        {new Date(recipe.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <h2 className="font-playfair text-2xl font-bold text-charcoal">
              Gestión de Pedidos
            </h2>

            <div className="grid gap-4">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="font-playfair text-lg text-charcoal">
                          Pedido #{order.id.slice(0, 8)}
                        </CardTitle>
                        <CardDescription className="font-inter">
                          Cliente - ${order.total_price}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-charcoal mb-2">Productos:</h4>
                        <div className="text-sm text-charcoal/70">
                          {Array.isArray(order.products) && order.products.map((product: any, index: number) => (
                            <div key={index}>
                              {product.name} x{product.quantity} - ${product.price}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="border border-gray-300 rounded px-3 py-1 text-sm"
                        >
                          <option value="pendiente">Pendiente</option>
                          <option value="confirmado">Confirmado</option>
                          <option value="preparando">Preparando</option>
                          <option value="enviado">Enviado</option>
                          <option value="entregado">Entregado</option>
                          <option value="cancelado">Cancelado</option>
                        </select>
                        <span className="text-sm text-charcoal/60 self-center">
                          {new Date(order.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <h2 className="font-playfair text-2xl font-bold text-charcoal">
              Mensajes y Cotizaciones
            </h2>
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="font-inter text-charcoal/70">
                Próximamente: gestión de mensajes y cotizaciones
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;
