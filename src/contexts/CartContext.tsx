
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  category?: string;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  total: number;
  isOpen: boolean;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  closeCart: () => void;
  checkout: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  // Cargar carrito desde localStorage al inicializar
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (newItem: Omit<CartItem, 'quantity'>) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === newItem.id);
      
      if (existingItem) {
        // Si el item ya existe, incrementar cantidad
        return prevItems.map(item =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Si es nuevo, agregarlo con cantidad 1
        return [...prevItems, { ...newItem, quantity: 1 }];
      }
    });

    toast.success(`${newItem.name} añadido al carrito`);
  };

  const removeItem = (id: string) => {
    setItems(prevItems => {
      const itemToRemove = prevItems.find(item => item.id === id);
      const newItems = prevItems.filter(item => item.id !== id);
      
      if (itemToRemove) {
        toast.success(`${itemToRemove.name} eliminado del carrito`);
      }
      
      return newItems;
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('cart');
    toast.success('Carrito vaciado');
  };

  const toggleCart = () => {
    setIsOpen(!isOpen);
  };

  const closeCart = () => {
    setIsOpen(false);
  };

  const checkout = async () => {
    if (!user) {
      toast.error('Debes iniciar sesión para realizar una compra');
      return;
    }

    if (items.length === 0) {
      toast.error('El carrito está vacío');
      return;
    }

    try {
      // Convertir items a formato JSON compatible con Supabase
      const orderData = {
        user_id: user.id,
        products: JSON.stringify(items) as any, // Cast to any to satisfy the Json type
        total_price: total,
        status: 'pendiente'
      };

      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      if (error) {
        console.error('Error creating order:', error);
        toast.error('Error al procesar el pedido. Inténtalo de nuevo.');
        return;
      }

      console.log('Order created successfully:', data);
      toast.success('¡Pedido creado exitosamente!');
      
      // Limpiar carrito después de la compra exitosa
      clearCart();
      closeCart();

      // Aquí se podría integrar con un proveedor de pagos
      // Por ejemplo: redirectToPayment(data.id);
      
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Error inesperado al procesar el pedido');
    }
  };

  // Calcular valores derivados
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const value: CartContextType = {
    items,
    itemCount,
    total,
    isOpen,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    closeCart,
    checkout
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
