
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface MercadoPagoPayment {
  id: number;
  status: string;
  status_detail: string;
  external_reference: string;
  transaction_amount: number;
  payer: {
    email: string;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  try {
    const accessToken = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN');
    if (!accessToken) {
      throw new Error('MERCADOPAGO_ACCESS_TOKEN not configured');
    }

    // Parse webhook body
    const body = await req.json();
    console.log('Webhook received:', JSON.stringify(body, null, 2));

    // Mercado Pago sends different types of notifications
    if (body.type !== 'payment') {
      console.log('Ignoring non-payment notification:', body.type);
      return new Response('OK', { status: 200, headers: corsHeaders });
    }

    const paymentId = body.data?.id;
    if (!paymentId) {
      console.log('No payment ID in webhook');
      return new Response('OK', { status: 200, headers: corsHeaders });
    }

    // Get payment details from Mercado Pago
    const paymentResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      }
    });

    if (!paymentResponse.ok) {
      console.error('Error fetching payment from Mercado Pago:', paymentResponse.status);
      return new Response('Error', { status: 500, headers: corsHeaders });
    }

    const payment: MercadoPagoPayment = await paymentResponse.json();
    console.log('Payment details:', JSON.stringify(payment, null, 2));

    // Update order in Supabase
    const supabase = createClient(
      'https://zrwuraveabncvruzpapa.supabase.co',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_ANON_KEY') || ''
    );

    // Map Mercado Pago status to our status
    let orderStatus = 'pending';
    switch (payment.status) {
      case 'approved':
        orderStatus = 'completed';
        break;
      case 'pending':
        orderStatus = 'pending';
        break;
      case 'rejected':
      case 'cancelled':
        orderStatus = 'cancelled';
        break;
      default:
        orderStatus = 'pending';
    }

    // Update order by external reference
    const { data: existingOrder, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('external_reference', payment.external_reference)
      .single();

    if (fetchError) {
      console.error('Error fetching order:', fetchError);
      return new Response('Error', { status: 500, headers: corsHeaders });
    }

    if (!existingOrder) {
      console.log('Order not found:', payment.external_reference);
      return new Response('Order not found', { status: 404, headers: corsHeaders });
    }

    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: orderStatus,
        mp_payment_id: payment.id,
        mp_status: payment.status,
        mp_status_detail: payment.status_detail,
        updated_at: new Date().toISOString()
      })
      .eq('external_reference', payment.external_reference);

    if (updateError) {
      console.error('Error updating order:', updateError);
      return new Response('Error', { status: 500, headers: corsHeaders });
    }

    console.log(`Order ${payment.external_reference} updated to status: ${orderStatus}`);

    // If payment is approved, you could send confirmation email here
    if (payment.status === 'approved') {
      console.log(`Payment approved for order ${payment.external_reference}`);
      // TODO: Send confirmation email
    }

    return new Response('OK', { status: 200, headers: corsHeaders });

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response('Error', { status: 500, headers: corsHeaders });
  }
});
