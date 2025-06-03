
import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface AddToCartButtonProps {
  product: {
    id: string | number;
    name: string;
    price: number;
    image?: string;
    category?: string;
  };
  variant?: 'default' | 'secondary' | 'outline';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  variant = 'default',
  size = 'sm',
  className = ''
}) => {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category
    });
  };

  return (
    <Button
      onClick={handleAddToCart}
      variant={variant}
      size={size}
      className={`bg-pastel-pink hover:bg-pastel-pink/90 text-charcoal font-medium rounded-full transition-all duration-300 hover:scale-105 ${className}`}
    >
      <ShoppingCart size={16} className="mr-2" />
      Agregar
    </Button>
  );
};

export default AddToCartButton;
