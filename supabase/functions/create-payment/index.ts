
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface PaymentItem {
  title: string;
  quantity: number;
  unit_price: number;
  currency_id?: string;
}

interface PaymentRequest {
  items: PaymentItem[];
  payer_email: string;
  external_reference?: string;
}

interface MercadoPagoPreference {
  items: PaymentItem[];
  payer: {
    email: string;
  };
  back_urls: {
    success: string;
    pending: string;
    failure: string;
  };
  auto_return: string;
  external_reference?: string;
  notification_url: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }

  try {
    const accessToken = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN');
    if (!accessToken) {
      throw new Error('MERCADOPAGO_ACCESS_TOKEN not configured');
    }

    // Parse request body
    const body: PaymentRequest = await req.json();
    
    // Validate required fields
    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Items array is required and cannot be empty' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    if (!body.payer_email || !body.payer_email.includes('@')) {
      return new Response(
        JSON.stringify({ error: 'Valid payer email is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate items
    for (const item of body.items) {
      if (!item.title || !item.quantity || !item.unit_price) {
        return new Response(
          JSON.stringify({ error: 'Each item must have title, quantity, and unit_price' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      if (item.quantity <= 0 || item.unit_price <= 0) {
        return new Response(
          JSON.stringify({ error: 'Quantity and unit_price must be positive numbers' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
    }

    // Generate external reference if not provided
    const externalReference = body.external_reference || `order_${Date.now()}`;

    // Base URL for your application
    const baseUrl = req.headers.get('origin') || 'https://zrwuraveabncvruzpapa.supabase.co';
    
    // Create Mercado Pago preference
    const preference: MercadoPagoPreference = {
      items: body.items.map(item => ({
        title: item.title,
        quantity: item.quantity,
        unit_price: item.unit_price,
        currency_id: item.currency_id || 'CLP'
      })),
      payer: {
        email: body.payer_email
      },
      back_urls: {
        success: `${baseUrl}/?payment=success`,
        pending: `${baseUrl}/?payment=pending`,
        failure: `${baseUrl}/?payment=failure`
      },
      auto_return: 'approved',
      external_reference: externalReference,
      notification_url: `https://zrwuraveabncvruzpapa.supabase.co/functions/v1/payment-webhook`
    };

    console.log('Creating preference with data:', JSON.stringify(preference, null, 2));

    // Call Mercado Pago API
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preference)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Mercado Pago API error:', response.status, errorText);
      throw new Error(`Mercado Pago API error: ${response.status} - ${errorText}`);
    }

    const mpResponse = await response.json();
    console.log('Mercado Pago response:', JSON.stringify(mpResponse, null, 2));

    // Save pending order to Supabase
    try {
      const supabase = createClient(
        'https://zrwuraveabncvruzpapa.supabase.co',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_ANON_KEY') || ''
      );

      const orderData = {
        external_reference: externalReference,
        payer_email: body.payer_email,
        products: JSON.stringify(body.items),
        total_price: body.items.reduce((total, item) => total + (item.unit_price * item.quantity), 0),
        status: 'pending',
        mp_preference_id: mpResponse.id
      };

      const { error: dbError } = await supabase
        .from('orders')
        .insert([orderData]);

      if (dbError) {
        console.error('Error saving order to database:', dbError);
        // Don't fail the payment creation, just log the error
      } else {
        console.log('Order saved successfully:', externalReference);
      }
    } catch (dbError) {
      console.error('Database error:', dbError);
      // Don't fail the payment creation, just log the error
    }

    return new Response(
      JSON.stringify({
        init_point: mpResponse.init_point,
        sandbox_init_point: mpResponse.sandbox_init_point,
        preference_id: mpResponse.id,
        external_reference: externalReference
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error creating payment preference:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
