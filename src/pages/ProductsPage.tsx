
import React, { useState } from 'react';
import { Filter, Search } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AddToCartButton from '@/components/AddToCartButton';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  isPromoted?: boolean;
}

const ProductsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const allProducts: Product[] = [
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
      price: 15300,
      originalPrice: 18000,
      image: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      category: "Tortas",
      isPromoted: true
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
    },
    {
      id: 5,
      name: "Pack Surtido Familiar",
      description: "Mix de nuestros mejores productos: alfajores, cupcakes y mini donuts",
      price: 8500,
      originalPrice: 10000,
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      category: "Packs",
      isPromoted: true
    },
    {
      id: 6,
      name: "Brownie de Chocolate",
      description: "Intenso brownie con chocolate premium y nueces",
      price: 3200,
      image: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      category: "Dulces"
    },
    {
      id: 7,
      name: "Cheesecake de Frutos Rojos",
      description: "Cremoso cheesecake con salsa de frutos rojos de temporada",
      price: 12000,
      image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      category: "Tortas"
    },
    {
      id: 8,
      name: "Mini Dulces Variados",
      description: "Selección de mini postres perfectos para eventos",
      price: 4500,
      image: "https://images.unsplash.com/photo-1587668178277-295251f900ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      category: "Mini Dulces"
    }
  ];

  const categories = ['Todos', 'Dulces', 'Tortas', 'Cupcakes', 'Donuts', 'Packs', 'Mini Dulces'];

  const filteredProducts = allProducts.filter(product => {
    const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const promotedProducts = allProducts.filter(product => product.isPromoted);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-warm-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-pastel-pink/20 to-pastel-purple/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-playfair text-4xl lg:text-6xl font-bold text-charcoal mb-4">
              Todos nuestros <span className="text-pastel-purple">Productos</span>
            </h1>
            <p className="font-inter text-lg text-charcoal/70 max-w-2xl mx-auto">
              Descubre toda nuestra variedad de productos artesanales, desde dulces tradicionales hasta creaciones únicas.
            </p>
          </div>
        </div>
      </section>

      {/* Promociones */}
      {promotedProducts.length > 0 && (
        <section className="py-12 bg-pastel-pink/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-playfair text-3xl font-bold text-charcoal mb-8 text-center">
              🎉 Promociones Especiales
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {promotedProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden relative">
                  <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold z-10">
                    ¡OFERTA!
                  </div>
                  <img 
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="font-playfair text-xl font-semibold text-charcoal mb-2">
                      {product.name}
                    </h3>
                    <p className="font-inter text-sm text-charcoal/70 mb-4">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-inter text-xl font-bold text-pastel-purple">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && (
                          <span className="font-inter text-sm text-gray-500 line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                      <AddToCartButton product={product} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Filtros y Búsqueda */}
      <section className="py-8 bg-white border-b border-pastel-pink/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Búsqueda */}
            <div className="relative flex-1 lg:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-charcoal/40" size={20} />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-pastel-pink/30 rounded-full focus:outline-none focus:border-pastel-purple font-inter"
              />
            </div>

            {/* Filtros por categoría */}
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-charcoal/60" />
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full font-inter text-sm transition-all duration-300 ${
                      selectedCategory === category
                        ? 'bg-pastel-purple text-white'
                        : 'bg-gray-100 text-charcoal hover:bg-pastel-pink/20'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Todos los Productos */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-playfair text-3xl font-bold text-charcoal">
              {selectedCategory === 'Todos' ? 'Todos los Productos' : selectedCategory}
            </h2>
            <span className="font-inter text-charcoal/60">
              {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <div 
                key={product.id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden animate-scale-in"
                style={{ animationDelay: `${index * 0.05}s` }}
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
                  {product.isPromoted && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      ¡OFERTA!
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="font-playfair text-xl font-semibold text-charcoal mb-2">
                    {product.name}
                  </h3>
                  <p className="font-inter text-sm text-charcoal/70 mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-inter text-xl font-bold text-pastel-purple">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="font-inter text-sm text-gray-500 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                    <AddToCartButton product={product} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="font-inter text-lg text-charcoal/60">
                No se encontraron productos que coincidan con tu búsqueda.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductsPage;
