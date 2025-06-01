
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Check, Crown } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import Navbar from '@/components/Navbar';

interface Subscription {
  id: string;
  name: string;
  description: string;
  price: number;
  tier: string;
  features: string[];
  is_active: boolean;
}

const ClubSubscriptionsPage = () => {
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const { data, error } = await supabase
        .from('club_subscriptions')
        .select('*')
        .eq('is_active', true)
        .order('price', { ascending: true });

      if (error) {
        console.error('Error fetching subscriptions:', error);
      } else {
        setSubscriptions(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'basic':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'premium':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'vip':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'vip':
        return <Crown className="h-5 w-5" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-white">
        <Navbar />
        <div className="pt-20 flex items-center justify-center">
          <div>Cargando suscripciones...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-white">
      <Navbar />
      <div className="pt-20 max-w-6xl mx-auto p-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 text-charcoal hover:text-pastel-purple"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al inicio
        </Button>

        <div className="text-center mb-8">
          <h1 className="font-playfair text-4xl font-bold text-charcoal mb-4">
            Club Delicias de <span className="text-pastel-purple">Meme</span>
          </h1>
          <p className="font-inter text-lg text-charcoal/70 max-w-2xl mx-auto">
            Únete a nuestro club exclusivo y disfruta de recetas únicas, descuentos especiales 
            y contenido premium que hará que tus creaciones sean aún más deliciosas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {subscriptions.map((subscription) => (
            <Card 
              key={subscription.id} 
              className={`relative ${subscription.tier === 'premium' ? 'ring-2 ring-pastel-purple' : ''}`}
            >
              {subscription.tier === 'premium' && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-pastel-purple text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Más Popular
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  {getTierIcon(subscription.tier)}
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getTierColor(subscription.tier)}`}>
                    {subscription.tier.toUpperCase()}
                  </span>
                </div>
                
                <CardTitle className="font-playfair text-2xl text-charcoal">
                  {subscription.name}
                </CardTitle>
                
                <CardDescription className="font-inter text-charcoal/70">
                  {subscription.description}
                </CardDescription>
                
                <div className="mt-4">
                  <span className="text-4xl font-bold text-charcoal">
                    ${subscription.price}
                  </span>
                  <span className="text-charcoal/60 font-inter">/mes</span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {subscription.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="font-inter text-charcoal text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <Button 
                  className="w-full bg-pastel-purple hover:bg-pastel-purple/90 text-white"
                  onClick={() => {
                    // TODO: Implementar proceso de suscripción
                    console.log('Suscribirse a:', subscription.tier);
                  }}
                >
                  Suscribirse Ahora
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-pastel-pink/20">
            <h3 className="font-playfair text-xl font-semibold text-charcoal mb-2">
              ¿Tienes preguntas?
            </h3>
            <p className="font-inter text-charcoal/70 mb-4">
              Estamos aquí para ayudarte a elegir el plan perfecto para ti.
            </p>
            <Button 
              variant="outline"
              className="border-pastel-pink text-charcoal hover:bg-pastel-pink/10"
            >
              Contactar Soporte
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubSubscriptionsPage;
