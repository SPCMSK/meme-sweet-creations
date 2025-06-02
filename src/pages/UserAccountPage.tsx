
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Crown, Star, Package, Heart, Gift } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useUserPoints } from '@/hooks/useUserPoints';
import Navbar from '@/components/Navbar';

const UserAccountPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useProfile();
  const { userPoints, transactions, loading } = useUserPoints();

  React.useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-warm-white">
        <Navbar />
        <div className="pt-20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pastel-purple mx-auto mb-4"></div>
            <p className="font-inter text-charcoal/70">Cargando cuenta...</p>
          </div>
        </div>
      </div>
    );
  }

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

        <div className="mb-8">
          <h1 className="font-playfair text-3xl md:text-4xl font-bold text-charcoal mb-2">
            Mi Cuenta
          </h1>
          <p className="font-inter text-charcoal/70">
            Gestiona tu perfil, suscripción y recompensas
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Profile Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="font-playfair text-xl text-charcoal flex items-center">
                <Crown className="mr-2 h-5 w-5 text-pastel-purple" />
                Estado del Club
              </CardTitle>
            </CardHeader>
            <CardContent>
              {profile.is_club_member ? (
                <div className="space-y-3">
                  <Badge className="bg-pastel-purple text-white">
                    Miembro Activo
                  </Badge>
                  {profile.subscription_tier && (
                    <Badge variant="outline" className="block w-fit">
                      {profile.subscription_tier.toUpperCase()}
                    </Badge>
                  )}
                  <Button 
                    onClick={() => navigate('/recetas')}
                    className="w-full bg-pastel-purple hover:bg-pastel-purple/90 text-white"
                  >
                    Ver Recetas Premium
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Badge variant="outline">No eres miembro</Badge>
                  <p className="text-sm text-charcoal/70">
                    Únete al club para acceder a contenido exclusivo
                  </p>
                  <Button 
                    onClick={() => navigate('/club-subscriptions')}
                    className="w-full bg-pastel-purple hover:bg-pastel-purple/90 text-white"
                  >
                    Suscribirme
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Points Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="font-playfair text-xl text-charcoal flex items-center">
                <Star className="mr-2 h-5 w-5 text-pastel-purple" />
                Mis Puntos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-3xl font-bold text-pastel-purple">
                    {userPoints?.points || 0}
                  </div>
                  <p className="text-sm text-charcoal/70">
                    Puntos disponibles
                  </p>
                  <div className="text-xs text-charcoal/60">
                    <div>Total ganados: {userPoints?.total_earned || 0}</div>
                    <div>Total canjeados: {userPoints?.total_redeemed || 0}</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="font-playfair text-xl text-charcoal">
                Acciones Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                onClick={() => navigate('/profile')}
                variant="outline" 
                className="w-full border-pastel-purple text-pastel-purple hover:bg-pastel-purple hover:text-white"
              >
                Editar Perfil
              </Button>
              <Button 
                onClick={() => navigate('/profile/favorites')}
                variant="outline" 
                className="w-full border-pastel-purple text-pastel-purple hover:bg-pastel-purple hover:text-white"
              >
                <Heart className="mr-2 h-4 w-4" />
                Favoritos
              </Button>
              <Button 
                onClick={() => navigate('/profile/orders')}
                variant="outline" 
                className="w-full border-pastel-purple text-pastel-purple hover:bg-pastel-purple hover:text-white"
              >
                <Package className="mr-2 h-4 w-4" />
                Mis Pedidos
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="font-playfair text-xl text-charcoal flex items-center">
              <Gift className="mr-2 h-5 w-5 text-pastel-purple" />
              Actividad de Puntos Reciente
            </CardTitle>
            <CardDescription>
              Historial de tus últimas transacciones de puntos
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse flex items-center space-x-4">
                    <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : transactions.length > 0 ? (
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        transaction.points > 0 ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {transaction.points > 0 ? (
                          <Star className="h-4 w-4 text-green-600" />
                        ) : (
                          <Gift className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-charcoal">
                          {transaction.description}
                        </p>
                        <p className="text-sm text-charcoal/60">
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className={`font-bold ${
                      transaction.points > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.points > 0 ? '+' : ''}{transaction.points}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Gift className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="font-inter text-charcoal/70">
                  Aún no tienes transacciones de puntos. ¡Haz tu primera compra para empezar a ganar puntos!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserAccountPage;
