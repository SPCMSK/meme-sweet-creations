
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CreditCard } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useMercadoPago } from '@/hooks/useMercadoPago';
import { toast } from 'sonner';

const MercadoPagoButton = () => {
  const { items, total } = useCart();
  const { user } = useAuth();
  const { createPayment, redirectToPayment, loading } = useMercadoPago();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState(user?.email || '');

  const handlePayment = async () => {
    if (!email) {
      toast.error('Por favor ingresa tu email');
      return;
    }

    if (items.length === 0) {
      toast.error('El carrito está vacío');
      return;
    }

    const paymentData = await createPayment(items, email);
    
    if (paymentData) {
      // Use sandbox for test environment, production for live
      const initPoint = paymentData.sandbox_init_point || paymentData.init_point;
      redirectToPayment(initPoint);
      setIsOpen(false);
      toast.success('Redirigiendo a Mercado Pago...');
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          size="lg"
        >
          <CreditCard className="mr-2 h-5 w-5" />
          Pagar con Mercado Pago
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Finalizar Compra</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email para la factura</Label>
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
              <span className="text-sm text-gray-600">Total a pagar:</span>
              <span className="font-bold text-lg">
                ${total.toLocaleString('es-CL')} CLP
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Serás redirigido a Mercado Pago para completar el pago de forma segura.
            </p>
          </div>

          <Button 
            onClick={handlePayment}
            disabled={loading || !email}
            className="w-full bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            {loading ? 'Procesando...' : 'Continuar con el Pago'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MercadoPagoButton;
