
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, Star, Gift, Users, ChefHat, Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import Navbar from '@/components/Navbar';

const ClubDeliciasPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useProfile();

  const benefits = [
    {
      icon: <ChefHat className="h-6 w-6 text-pastel-purple" />,
      title: "Recetas Premium Exclusivas",
      description: "Acceso completo a videos, fotos y técnicas profesionales de repostería"
    },
    {
      icon: <Gift className="h-6 w-6 text-pastel-purple" />,
      title: "Descuentos Especiales",
      description: "Descuentos exclusivos en todos nuestros productos para miembros"
    },
    {
      icon: <Star className="h-6 w-6 text-pastel-purple" />,
      title: "Trato Preferencial",
      description: "Atención prioritaria y personalizada en todos tus pedidos"
    },
    {
      icon: <Crown className="h-6 w-6 text-pastel-purple" />,
      title: "Sistema de Puntos",
      description: "Gana puntos con cada compra y canjéalos por productos o meses gratis"
    }
  ];

  const handleSubscribe = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    navigate('/club-subscriptions');
  };

  const handleViewRecipes = () => {
    navigate('/recetas');
  };

  return (
    <div className="min-h-screen bg-warm-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <Crown className="h-8 w-8 text-pastel-purple" />
                <h1 className="font-playfair text-4xl md:text-5xl font-bold text-charcoal">
                  Club Delicias
                </h1>
              </div>
              
              <p className="font-inter text-xl text-charcoal/80 leading-relaxed">
                Únete a nuestra comunidad exclusiva y descubre el mundo secreto de la repostería gourmet
              </p>
              
              <div className="bg-pastel-pink/10 p-6 rounded-lg border border-pastel-pink/20">
                <p className="font-inter text-charcoal/70 italic">
                  "Después de años perfeccionando mis recetas, he decidido compartir mis secretos más preciados 
                  contigo. Cada técnica, cada truco, cada detalle que hace la diferencia entre lo bueno y lo extraordinario."
                </p>
                <p className="font-playfair text-right mt-3 text-pastel-purple font-semibold">
                  — Meme, Fundadora
                </p>
              </div>

              {profile?.is_club_member ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-green-600">
                    <Crown className="h-5 w-5" />
                    <span className="font-semibold">¡Ya eres miembro del Club!</span>
                  </div>
                  <Button 
                    onClick={handleViewRecipes}
                    className="bg-pastel-purple hover:bg-pastel-purple/90 text-white"
                  >
                    Ver Mis Recetas Premium
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={handleSubscribe}
                  size="lg"
                  className="bg-pastel-purple hover:bg-pastel-purple/90 text-white text-lg px-8 py-6"
                >
                  <Crown className="mr-2 h-5 w-5" />
                  Suscribirme al Club
                </Button>
              )}
            </div>

            <div className="relative">
              <div className="aspect-square rounded-full overflow-hidden border-4 border-pastel-pink/30 shadow-xl">
                <img 
                  src="/placeholder.svg" 
                  alt="Meme - Fundadora de Delicias de Meme"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-pastel-purple text-white p-3 rounded-full shadow-lg">
                <Heart className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gradient-to-b from-pastel-pink/5 to-transparent">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-charcoal mb-4">
              Beneficios Exclusivos del Club
            </h2>
            <p className="font-inter text-charcoal/70 text-lg max-w-2xl mx-auto">
              Descubre todo lo que tenemos preparado para hacer de tu experiencia algo verdaderamente especial
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 bg-pastel-purple/10 rounded-full w-fit">
                    {benefit.icon}
                  </div>
                  <CardTitle className="font-playfair text-xl text-charcoal">
                    {benefit.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="font-inter text-charcoal/70">
                    {benefit.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Free Recipes Teaser */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="font-playfair text-2xl md:text-3xl font-bold text-charcoal mb-6">
            ¿Aún no estás seguro?
          </h3>
          <p className="font-inter text-charcoal/70 text-lg mb-8">
            Explora algunas de nuestras recetas gratuitas y descubre la calidad de nuestro contenido
          </p>
          <Button 
            onClick={handleViewRecipes}
            variant="outline"
            size="lg"
            className="border-pastel-purple text-pastel-purple hover:bg-pastel-purple hover:text-white"
          >
            Ver Recetas Gratuitas
          </Button>
        </div>
      </section>

      {/* CTA Section */}
      {!profile?.is_club_member && (
        <section className="py-16 bg-gradient-to-r from-pastel-purple/10 to-pastel-pink/10">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="flex justify-center mb-6">
              <Users className="h-12 w-12 text-pastel-purple" />
            </div>
            <h3 className="font-playfair text-2xl md:text-3xl font-bold text-charcoal mb-4">
              Únete a Nuestra Comunidad
            </h3>
            <p className="font-inter text-charcoal/70 text-lg mb-8 max-w-2xl mx-auto">
              Más de 1,000 personas ya forman parte del Club Delicias y han transformado 
              su forma de hacer repostería. ¡Tú puedes ser el siguiente!
            </p>
            <Button 
              onClick={handleSubscribe}
              size="lg"
              className="bg-pastel-purple hover:bg-pastel-purple/90 text-white text-lg px-8 py-6"
            >
              <Crown className="mr-2 h-5 w-5" />
              Comenzar Mi Membresía
            </Button>
          </div>
        </section>
      )}
    </div>
  );
};

export default ClubDeliciasPage;
