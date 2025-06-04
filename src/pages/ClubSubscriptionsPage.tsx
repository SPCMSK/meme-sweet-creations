
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Check, Crown, CreditCard } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useMercadoPago } from '@/hooks/useMercadoPago';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import { Json } from '@/integrations/supabase/types';

interface Subscription {
  id: string;
  name: string;
  description: string;
  price: number;
  tier: string;
  features: Json;
  is_active: boolean;
}

const ClubSubscriptionsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createPayment, redirectToPayment, loading } = useMercadoPago();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [email, setEmail] = useState(user?.email || '');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
      setLoadingData(false);
    }
  };

  const handleSubscriptionPayment = async () => {
    if (!selectedSubscription) return;
    
    if (!email) {
      toast.error('Por favor ingresa tu email');
      return;
    }

    // Convert subscription to cart item format
    const subscriptionItem = {
      id: selectedSubscription.id,
      name: `Suscripción ${selectedSubscription.name}`,
      price: selectedSubscription.price,
      quantity: 1,
      category: 'suscripcion'
    };

    const paymentData = await createPayment([subscriptionItem], email);
    
    if (paymentData) {
      const initPoint = paymentData.sandbox_init_point || paymentData.init_point;
      redirectToPayment(initPoint);
      setIsDialogOpen(false);
      toast.success('Redirigiendo a Mercado Pago...');
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

  const getFeaturesArray = (features: Json): string[] => {
    if (Array.isArray(features)) {
      return features.filter(f => typeof f === 'string');
    }
    return [];
  };

  if (loadingData) {
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
          {subscriptions.map((subscription) => {
            const featuresArray = getFeaturesArray(subscription.features);
            
            return (
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
                      ${subscription.price.toLocaleString('es-CL')}
                    </span>
                    <span className="text-charcoal/60 font-inter">/mes</span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {featuresArray.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="font-inter text-charcoal text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Dialog open={isDialogOpen && selectedSubscription?.id === subscription.id} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        className="w-full bg-pastel-purple hover:bg-pastel-purple/90 text-white"
                        onClick={() => setSelectedSubscription(subscription)}
                      >
                        <CreditCard className="mr-2 h-4 w-4" />
                        Suscribirse Ahora
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Suscribirse a {subscription.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email para la suscripción</Label>
                          <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="tu@email.com"
                            required
                          />
                        </div>
                        
                        <div className="border-t pt-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">Total mensual:</span>
                            <span className="font-bold text-lg">
                              ${subscription.price.toLocaleString('es-CL')} CLP
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mb-4">
                            Serás redirigido a Mercado Pago para completar el pago de forma segura.
                          </p>
                        </div>

                        <Button 
                          onClick={handleSubscriptionPayment}
                          disabled={loading || !email}
                          className="w-full bg-pastel-purple hover:bg-pastel-purple/90"
                          size="lg"
                        >
                          {loading ? 'Procesando...' : 'Continuar con el Pago'}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            );
          })}
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
