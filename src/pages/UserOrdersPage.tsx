
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';

const UserOrdersPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  React.useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-warm-white">
      <Navbar />
      <div className="pt-20 max-w-4xl mx-auto p-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-4 text-charcoal hover:text-pastel-purple"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al inicio
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="font-playfair text-2xl text-charcoal flex items-center">
              <ShoppingBag className="mr-2 h-6 w-6 text-pastel-purple" />
              Mis Pedidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="font-inter text-charcoal/70">
                Aún no tienes pedidos realizados. ¡Haz tu primer pedido!
              </p>
              <Button 
                onClick={() => navigate('/productos')}
                className="mt-4 bg-pastel-purple hover:bg-pastel-purple/90 text-white"
              >
                Hacer Pedido
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserOrdersPage;
