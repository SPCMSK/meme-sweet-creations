
import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

const ProductGallery = () => {
  const featuredProducts: Product[] = [
    {
      id: 1,
      name: "Alfajores Artesanales",
      description: "Deliciosos alfajores con dulce de leche casero y coco rallado",
      price: 2500,
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      category: "Dulces"
    },
    {
      id: 2,
      name: "Torta Tres Leches",
      description: "Suave bizcocho bañado en tres leches con canela",
      price: 18000,
      image: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      category: "Tortas"
    },
    {
      id: 3,
      name: "Cupcakes de Vainilla",
      description: "Tiernos cupcakes con buttercream de vainilla y decoración artesanal",
      price: 1800,
      image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      category: "Cupcakes"
    },
    {
      id: 4,
      name: "Donuts Glaseadas",
      description: "Donuts esponjosas con glaseado de colores y topping especial",
      price: 2200,
      image: "https://images.unsplash.com/photo-1498936178812-4b2e558d2937?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      category: "Donuts"
    }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <section id="productos" className="py-20 bg-warm-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-charcoal mb-4">
            Nuestros <span className="text-pastel-purple">Productos</span>
          </h2>
          <p className="font-inter text-lg text-charcoal/70 max-w-2xl mx-auto">
            Cada producto es elaborado con amor, ingredientes frescos y la experiencia 
            de más de dos décadas en repostería artesanal.
          </p>
        </div>

        {/* Grid de productos */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {featuredProducts.map((product, index) => (
            <div 
              key={product.id}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative overflow-hidden">
                <img 
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-pastel-purple/90 text-white px-2 py-1 rounded-full text-xs font-inter font-medium">
                    {product.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="font-playfair text-xl font-semibold text-charcoal mb-2">
                  {product.name}
                </h3>
                <p className="font-inter text-sm text-charcoal/70 mb-4 line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="font-inter text-xl font-bold text-pastel-purple">
                    {formatPrice(product.price)}
                  </span>
                  <Button 
                    size="sm"
                    className="bg-pastel-pink hover:bg-pastel-pink/90 text-charcoal font-medium rounded-full transition-all duration-300 hover:scale-105"
                  >
                    <ShoppingCart size={16} className="mr-2" />
                    Agregar
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA para ver todos los productos */}
        <div className="text-center">
          <Button 
            size="lg"
            className="bg-pastel-purple hover:bg-pastel-purple/90 text-white font-inter font-medium px-8 py-3 rounded-full transition-all duration-300 hover:scale-105"
          >
            Ver todos los productos
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductGallery;
