
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Tag, Copy } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';

interface Discount {
  id: string;
  title: string;
  description: string;
  discount_percentage: number;
  code: string;
  valid_until: string;
  tier_required: string;
}

const UserDiscountsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useProfile();
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (!profile?.is_club_member) {
      navigate('/club-subscriptions');
      return;
    }
    
    fetchDiscounts();
  }, [user, profile, navigate]);

  const fetchDiscounts = async () => {
    try {
      const { data, error } = await supabase
        .from('club_discounts')
        .select('*')
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching discounts:', error);
      } else {
        // Filtrar descuentos basados en el tier del usuario
        const userTier = profile?.subscription_tier || 'basic';
        const availableDiscounts = data?.filter(discount => {
          if (!discount.tier_required) return true;
          
          const tierLevels = { 'basic': 1, 'premium': 2, 'vip': 3 };
          const userLevel = tierLevels[userTier as keyof typeof tierLevels] || 1;
          const requiredLevel = tierLevels[discount.tier_required as keyof typeof tierLevels] || 1;
          
          return userLevel >= requiredLevel;
        }) || [];
        
        setDiscounts(availableDiscounts);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('¡Código copiado al portapapeles!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-white">
        <Navbar />
        <div className="pt-20 flex items-center justify-center">
          <div>Cargando descuentos...</div>
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

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="font-playfair text-2xl text-charcoal flex items-center">
              <Tag className="mr-2 h-6 w-6 text-pastel-purple" />
              Mis Descuentos del Club
            </CardTitle>
          </CardHeader>
          <CardContent>
            {discounts.length === 0 ? (
              <div className="text-center py-8">
                <Tag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="font-inter text-charcoal/70">
                  No hay descuentos disponibles en este momento.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {discounts.map((discount) => (
                  <Card key={discount.id} className="border border-pastel-pink/20">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-charcoal text-lg mb-1">
                            {discount.title}
                          </h3>
                          <p className="text-charcoal/70 text-sm mb-2">
                            {discount.description}
                          </p>
                          <div className="flex items-center space-x-4">
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-semibold">
                              {discount.discount_percentage}% OFF
                            </span>
                            <span className="text-charcoal/60 text-sm">
                              Válido hasta: {new Date(discount.valid_until).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <div className="bg-gray-100 px-3 py-2 rounded border font-mono text-sm">
                            {discount.code}
                          </div>
                          <Button
                            onClick={() => copyToClipboard(discount.code)}
                            size="sm"
                            variant="outline"
                            className="border-pastel-pink text-charcoal hover:bg-pastel-pink/10"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDiscountsPage;
