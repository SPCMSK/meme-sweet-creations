
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import Navbar from '@/components/Navbar';

const UserRecipesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useProfile();

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
              <BookOpen className="mr-2 h-6 w-6 text-pastel-purple" />
              Mis Recetas Guardadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              {profile?.is_club_member ? (
                <div>
                  <p className="font-inter text-charcoal/70 mb-4">
                    Aún no has guardado ninguna receta del club. ¡Explora nuestras recetas exclusivas!
                  </p>
                  <Button 
                    onClick={() => navigate('/club-recipes')}
                    className="bg-pastel-purple hover:bg-pastel-purple/90 text-white"
                  >
                    Explorar Recetas del Club
                  </Button>
                </div>
              ) : (
                <div>
                  <p className="font-inter text-charcoal/70 mb-4">
                    Únete al Club Delicias para acceder a recetas exclusivas y guardar tus favoritas.
                  </p>
                  <Button 
                    onClick={() => navigate('/club-subscriptions')}
                    className="bg-pastel-purple hover:bg-pastel-purple/90 text-white"
                  >
                    Únete al Club
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserRecipesPage;
