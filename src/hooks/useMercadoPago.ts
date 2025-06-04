
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CartItem } from '@/contexts/CartContext';

interface PaymentItem {
  title: string;
  quantity: number;
  unit_price: number;
  currency_id?: string;
}

interface CreatePaymentResponse {
  init_point: string;
  sandbox_init_point: string;
  preference_id: string;
  external_reference: string;
}

export const useMercadoPago = () => {
  const [loading, setLoading] = useState(false);

  const createPayment = async (
    items: CartItem[],
    payerEmail: string
  ): Promise<CreatePaymentResponse | null> => {
    setLoading(true);
    
    try {
      // Transform cart items to payment items
      const paymentItems: PaymentItem[] = items.map(item => ({
        title: item.name,
        quantity: item.quantity,
        unit_price: item.price,
        currency_id: 'CLP'
      }));

      console.log('Creating payment with items:', paymentItems);

      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          items: paymentItems,
          payer_email: payerEmail,
          external_reference: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        }
      });

      if (error) {
        console.error('Error creating payment:', error);
        toast.error('Error al crear el pago. Inténtalo de nuevo.');
        return null;
      }

      console.log('Payment created successfully:', data);
      return data as CreatePaymentResponse;

    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('Error inesperado al crear el pago');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const redirectToPayment = (initPoint: string) => {
    // Open Mercado Pago checkout in a new tab
    window.open(initPoint, '_blank');
  };

  return {
    createPayment,
    redirectToPayment,
    loading
  };
};
