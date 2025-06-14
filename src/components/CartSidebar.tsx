
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Minus, Plus, Trash2, ShoppingBag, Calendar } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import MercadoPagoButton from '@/components/MercadoPagoButton';

const CartSidebar: React.FC = () => {
  const {
    items,
    total,
    itemCount,
    isOpen,
    removeItem,
    updateQuantity,
    clearCart,
    closeCart
  } = useCart();

  const [deliveryDate, setDeliveryDate] = useState('');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Get minimum date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={closeCart}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="text-pastel-purple" size={24} />
            <h2 className="text-xl font-playfair font-semibold text-charcoal">
              Mi Carrito ({itemCount})
            </h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={closeCart}
            className="text-charcoal hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="flex flex-col h-full">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <ShoppingBag size={64} className="text-gray-300 mb-4" />
              <h3 className="font-playfair text-lg font-semibold text-charcoal mb-2">
                Tu carrito está vacío
              </h3>
              <p className="text-gray-500 font-inter">
                Agrega algunos productos para comenzar
              </p>
            </div>
          ) : (
            <>
              {/* Items */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 bg-gray-50 rounded-lg p-4">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-playfair font-semibold text-charcoal truncate">
                        {item.name}
                      </h4>
                      <p className="text-sm text-gray-500 font-inter">
                        {formatPrice(item.price)} c/u
                      </p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus size={12} />
                        </Button>
                        
                        <span className="font-inter font-medium px-3 py-1 bg-white rounded-full border">
                          {item.quantity}
                        </span>
                        
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus size={12} />
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-2">
                      <p className="font-inter font-semibold text-pastel-purple">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:bg-red-50 rounded-full"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Delivery Date Selection */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <Label htmlFor="deliveryDate" className="flex items-center text-sm font-medium text-charcoal mb-2">
                    <Calendar className="mr-2 h-4 w-4" />
                    Fecha de entrega
                  </Label>
                  <Input
                    id="deliveryDate"
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    min={getMinDate()}
                    className="bg-white"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Selecciona cuándo quieres recibir tu pedido
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 p-6 space-y-4">
                {/* Total */}
                <div className="flex justify-between items-center text-lg font-playfair font-semibold">
                  <span className="text-charcoal">Total:</span>
                  <span className="text-pastel-purple">{formatPrice(total)}</span>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  {/* Mercado Pago Button */}
                  <MercadoPagoButton />
                  
                  <Button
                    onClick={clearCart}
                    variant="outline"
                    className="w-full border-gray-300 text-charcoal hover:bg-gray-50 font-inter rounded-full"
                  >
                    Vaciar Carrito
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;
